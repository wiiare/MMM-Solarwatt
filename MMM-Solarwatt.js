Module.register("MMM-Solarwatt", {
  defaults: {
    ip: "192.168.178.142",
    password: "",
    batteryIp: "batteryflex-0c432c.local",
    updateInterval: 15 * 1000
  },

  start: function () {
    this.dataLoaded = false;
    this.solar = null;
    this.battery = null;

    this.getData();
    setInterval(() => this.getData(), this.config.updateInterval);
  },

  getStyles() {
    return ["Solarwatt.css"];
  },

  getData: function () {
    this.sendSocketNotification("GET_SOLARWATT_DATA", {
      ip: this.config.ip,
      password: this.config.password,
      batteryIp: this.config.batteryIp,
      updateInterval: this.config.updateInterval
    });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "SOLARWATT_DATA") {
      if (!payload) return;

      this.solar = payload.solar;
      this.battery = payload.battery;
      this.dataLoaded = true;
      this.updateDom();
    }
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "solarwatt-wrapper";

    if (!this.dataLoaded) {
      wrapper.innerHTML = "Lade Daten...";
      return wrapper;
    }

    if (!this.solar && !this.battery) {
      wrapper.innerHTML = "Keine Daten verfügbar";
      return wrapper;
    }

    // ------------------------
    // SOLAR BLOCK
    // ------------------------
    let solarHTML = "<div class='solar-box'>";
    if (this.solar) {
      const s = this.solar;
      solarHTML += `
        <h3 class='solar-title'>☀️ Solar</h3>
        <div class="data-row">Erzeugung: <b>${s.production ?? 0} W</b></div>
        <div class="data-row">Verbrauch: <b>${s.householdConsumption ?? 0} W</b></div>
        <div class="data-row">Einspeisung: <b>${s.feedIn ?? 0} W</b></div>
        <div class="data-row">Netzbezug: <b>${s.feedOut ?? 0} W</b></div>
      `;
    } else {
      solarHTML += "<div>Keine Solardaten</div>";
    }
    solarHTML += "</div>";

    // ------------------------
    // BATTERIE BLOCK
    // ------------------------
    let batteryHTML = "<div class='battery-box'>";
    if (this.battery) {
      const b = this.battery;
      const soc = b.SoC ?? 0;
      const pbat = b.PBat ?? 0;

      batteryHTML += `
        <h3 class='battery-title'>🔋 Batterie</h3>
        <div class="battery-icon">
          <div class="battery-fill" style="width:${soc}%"></div>
        </div>
        <div class="data-row">Ladezustand: <b>${soc}%</b></div>
        <div class="data-row">
          ${pbat < -5 ? "Ladeleistung" : "Batterieleistung"}:
          <b>${Math.abs(pbat)} W</b>
        </div>
      `;
    } else {
      batteryHTML += "<div>Keine Batteriedaten</div>";
    }
    batteryHTML += "</div>";

    // ------------------------
    // TAGESWERTE BLOCK
    // ------------------------
    let dailyHTML = "<div class='daily-box'>";
    if (this.solar) {
      const d = this.solar; // Tageswerte werden im Node Helper angefügt
      dailyHTML += `
        <h3 class='daily-title'>📊 Tageswerte</h3>
        <div class="data-row">Erzeugung: <b>${(d.productionToday ?? 0).toFixed(2)} kWh</b></div>
        <div class="data-row">Verbrauch: <b>${(d.householdConsumptionToday ?? 0).toFixed(2)} kWh</b></div>
        <div class="data-row">Einspeisung: <b>${(d.feedInToday ?? 0).toFixed(2)} kWh</b></div>
        <div class="data-row">Netzbezug: <b>${(d.feedOutToday ?? 0).toFixed(2)} kWh</b></div>
      `;
    } else {
      dailyHTML += "<div>Keine Tageswerte</div>";
    }
    dailyHTML += "</div>";

    wrapper.innerHTML = solarHTML + batteryHTML + dailyHTML;
    return wrapper;
  }
});
