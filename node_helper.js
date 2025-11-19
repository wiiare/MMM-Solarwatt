const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = NodeHelper.create({

  start: function () {
    console.log("[MMM-Solarwatt] Node Helper gestartet");

    this.dailyFile = path.join(__dirname, "dailyData.json");
    console.log("[MMM-Solarwatt] dailyData Pfad:", this.dailyFile);

    this.dailyData = this.loadDailyData();
    this.lastTimestamp = Date.now();
    this.firstRun = true;  // Flag für erste Messung
  },

  loadDailyData: function () {
    try {
      if (fs.existsSync(this.dailyFile)) {
        const raw = fs.readFileSync(this.dailyFile);
        const json = JSON.parse(raw);
        if (!json.lastReset) json.lastReset = new Date().toISOString().split("T")[0];
        return json;
      }
    } catch (err) {
      console.error("[MMM-Solarwatt] Fehler beim Lesen dailyData.json:", err);
    }

    // fallback
    return {
      productionToday: 0,
      householdConsumptionToday: 0,
      feedInToday: 0,
      feedOutToday: 0,
      lastReset: new Date().toISOString().split("T")[0]
    };
  },

  saveDailyData: function () {
    try {
      fs.writeFileSync(this.dailyFile, JSON.stringify(this.dailyData, null, 2));
    } catch (err) {
      console.error("[MMM-Solarwatt] Fehler beim Speichern dailyData.json:", err);
    }
  },

  async socketNotificationReceived(notification, payload) {
    if (notification !== "GET_SOLARWATT_DATA") return;

    const { ip, password, batteryIp } = payload;

    try {
      // ---------------- LOGIN ----------------
      const loginUrl = `http://${ip}/auth/login`;
      const loginRes = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: "installer", password }),
        redirect: "manual"
      });

      const cookie = loginRes.headers.get("set-cookie");
      if (!cookie) console.error("[MMM-Solarwatt] Kein Cookie!");

      // ---------------- SOLAR ----------------
      let solarData = null;
      if (cookie) {
        const solarUrl = `http://${ip}/rest/hems-configurator/energy-overview`;
        const solarRes = await fetch(solarUrl, { headers: { Cookie: cookie }, timeout: 5000 });

        if (solarRes.ok) {
          solarData = await solarRes.json();
          console.log("[MMM-Solarwatt] solarData received:", JSON.stringify(solarData, null, 2));
        } else {
          console.error("[MMM-Solarwatt] Solar Fehler:", solarRes.status);
        }
      }

      // ---------------- BATTERIE ----------------
      let batteryData = null;
      try {
        const batRes = await fetch(`http://${batteryIp}/stat`, { timeout: 5000 });
        if (batRes.ok) batteryData = await batRes.json();
      } catch (err) {
        console.error("[MMM-Solarwatt] Batterie Fehler:", err.message);
      }

      // ---------------- TAGESWERTE ----------------
      if (solarData) {

        const today = new Date().toISOString().split("T")[0];
        if (this.dailyData.lastReset !== today) {
          this.dailyData = {
            productionToday: 0,
            householdConsumptionToday: 0,
            feedInToday: 0,
            feedOutToday: 0,
            lastReset: today
          };
        }

        // Zeit seit letzter Messung
        const now = Date.now();
        const deltaHours = (now - this.lastTimestamp) / 3600000;
        console.log("[MMM-Solarwatt] deltaHours:", deltaHours);

        if (!this.firstRun) {
          // Werte aus Solarwatt
          const Pprod = solarData.production ?? 0;
          const Pcons = solarData.householdConsumption ?? 0;
          const Pin = solarData.feedIn ?? 0;
          const Pout = solarData.feedOut ?? 0;

          // kumulieren ohne Rundung
          this.dailyData.productionToday += Pprod * deltaHours / 1000;
          this.dailyData.householdConsumptionToday += Pcons * deltaHours / 1000;
          this.dailyData.feedInToday += Pin * deltaHours / 1000;
          this.dailyData.feedOutToday += Pout * deltaHours / 1000;

        } else {
          // erste Messung ignorieren
          this.firstRun = false;
          console.log("[MMM-Solarwatt] Erste Messung, Tageswerte noch nicht kumuliert");
        }

        this.lastTimestamp = now;

        // Werte zum Senden runden
        solarData.productionToday = Number(this.dailyData.productionToday.toFixed(2));
        solarData.householdConsumptionToday = Number(this.dailyData.householdConsumptionToday.toFixed(2));
        solarData.feedInToday = Number(this.dailyData.feedInToday.toFixed(2));
        solarData.feedOutToday = Number(this.dailyData.feedOutToday.toFixed(2));

        this.saveDailyData();

        console.log("[MMM-Solarwatt] DAILY:", this.dailyData);
      }

      // ---------------- SENDEN ----------------
      this.sendSocketNotification("SOLARWATT_DATA", {
        solar: solarData,
        battery: batteryData
      });

    } catch (err) {
      console.error("[MMM-Solarwatt] Fehler:", err.message);
      this.sendSocketNotification("SOLARWATT_DATA", null);
    }
  }

});
