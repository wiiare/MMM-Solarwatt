# MMM-Solarwatt

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]  
[![Stars](https://img.shields.io/github/stars/DEIN-BENUTZERNAME/MMM-Solarwatt?style=social)](https://github.com/DEIN-BENUTZERNAME/MMM-Solarwatt/stargazers)

MagicMirror² Modul für **Solarwatt PV-Anlagen**, das **Live-Daten**, Batteriestatus und kumulierte Tageswerte anzeigt.

---

## 📷 Screenshots

![Solar Block](./screenshots/solar_block.png)  
*Live-Daten Solar: Erzeugung, Verbrauch, Einspeisung, Netzbezug*

![Batterie Block](./screenshots/battery_block.png)  
*Batteriestatus: Ladezustand, Lade-/Entladeleistung*

![Tageswerte Block](./screenshots/daily_block.png)  
*Kumulierte Tageswerte in kWh*

---

## ⚡ Features

- Anzeige der aktuellen **Solarproduktion** und Haushaltsverbrauch  
- Anzeige der **Einspeisung ins Netz** und Netzbezug  
- Anzeige von **Batterie Ladezustand** und Leistung  
- **Tageswerte** persistent in `dailyData.json` gespeichert  
- Reset der Tageswerte automatisch um Mitternacht  
- **Intervallgesteuerte Updates**, konfigurierbar  
- Responsive Design, passt sich der MagicMirror² Oberfläche an  

---

## 📦 Installation

1. Ins `modules` Verzeichnis von MagicMirror wechseln:

```bash
cd ~/MagicMirror/modules
