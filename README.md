# MMM-Solarwatt

MagicMirror² Modul für **Solarwatt PV-Anlagen**, das **Live-Daten**,
Batteriestatus und kumulierte Tageswerte anzeigt.

------------------------------------------------------------------------

## 📷 Screenshot (Platzhalter)

![Solarwatt Modul](./screenshots/Bild.png)\
*Screenshot der Solarwatt-Anzeige: Solar, Batterie und Tageswerte*

------------------------------------------------------------------------

## ⚡ Features

-   Anzeige von **Live-Daten** der Solarwatt PV-Anlage\
-   Batteriestatus inkl. Ladezustand und Lade-/Entladeleistung\
-   **Tageswerte** persistent in `dailyData.json` gespeichert\
-   Reset der Tageswerte automatisch um Mitternacht\
-   Intervallgesteuerte Updates, konfigurierbar\
-   Responsive Darstellung passend zu MagicMirror²

------------------------------------------------------------------------

## 📦 Installation

Wechsle ins `modules` Verzeichnis von MagicMirror:

``` bash
cd ~/MagicMirror/modules
```

Repository klonen:

``` bash
git clone https://github.com/wiiare/MMM-Solarwatt.git
```

Abhängigkeiten installieren:

``` bash
cd MMM-Solarwatt
npm install
```

(Optional) Leere dailyData.json erstellen (wird automatisch angelegt):

``` bash
touch dailyData.json
```

------------------------------------------------------------------------

## ⚙️ Konfiguration

Füge das Modul in `config/config.js` ein:

``` js
{
  module: "MMM-Solarwatt",
  position: "top_right",
  config: {
    ip: "Deine_IP",
    password: "",
    batteryIp: "Deine_IP",
    updateInterval: 30000
  }
}
```

------------------------------------------------------------------------

## 📊 Anzeige

### 🔆 Solar Block

-   Erzeugung (W)
-   Verbrauch (W)
-   Einspeisung (W)
-   Netzbezug (W)

### 🔋 Batterie Block

-   Ladezustand (%)
-   Lade-/Entladeleistung (W)
-   Visualisierung als Balken

### 📅 Tageswerte Block

Kumulierte kWh für: - Produktion - Verbrauch - Einspeisung - Netzbezug

------------------------------------------------------------------------

## ⚡ Hinweise

-   Tageswerte starten nach MagicMirror-Neustart bei 0 kWh\
-   Werte werden automatisch kumuliert basierend auf dem
    Updateintervall\
-   `dailyData.json` wird automatisch im Modulordner angelegt und
    persistent gespeichert

------------------------------------------------------------------------

## 👨‍💻 Mitwirken / Issues

-   Pull Requests und Issues sind willkommen\
-   Bitte prüfe, ob ein Issue bereits existiert, bevor du eines öffnest

------------------------------------------------------------------------

## 📝 Lizenz

MIT License © 2025 wiiare

------------------------------------------------------------------------

## 📦 Release-Hinweis

-   Verwende das mitgelieferte `RELEASE_TEMPLATE.md`
-   Versionierung z. B. `v1.0.0`, `v1.1.0`
-   Screenshots als Release Assets hochladen

Installation einer bestimmten Version:

``` bash
cd ~/MagicMirror/modules
git clone --branch v1.0.0 https://github.com/wiiare/MMM-Solarwatt.git
```

------------------------------------------------------------------------

## 📁 Ordnerstruktur

``` text
MMM-Solarwatt/
├── MMM-Solarwatt.js
├── node_helper.js
├── Solarwatt.css
├── dailyData.json
├── package.json
├── README.md
├── RELEASE_TEMPLATE.md
├── LICENSE
└── screenshots/
    ├── solar_block.png
   
```
