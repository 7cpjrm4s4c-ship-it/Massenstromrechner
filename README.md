# Massenstrom Rechner

HVAC Massenstrom-Rechner als Progressive Web App (PWA) für Heizung & Kühlung.

## Features

- **Leistung → Massenstrom** (kg/h und m³/h)
- **Massenstrom → Leistung** (W)
- **Massenstrom → Spreizung** (K)
- 7 Wärmeträgermedien (Wasser, Ethylen-/Propylenglykol)
- Offline-fähig als PWA
- Installierbar auf Smartphone, Tablet und PC

## Deployment auf GitHub Pages

### Schritt 1: Repository erstellen

1. Neues Repository auf GitHub erstellen: `massenstrom-rechner`
2. Diesen Ordner als Repository initialisieren:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/massenstrom-rechner.git
git push -u origin main
```

### Schritt 2: GitHub Pages aktivieren

1. Im Repository → **Settings** → **Pages**
2. Unter **Source**: **GitHub Actions** auswählen
3. Der erste Push löst automatisch das Deployment aus

### Schritt 3: Warten & Testen

Nach 1–2 Minuten ist die App live unter:
```
https://DEIN-USERNAME.github.io/massenstrom-rechner/
```

### Schritt 4: Auf dem Smartphone installieren

**iPhone (Safari):**
1. URL öffnen
2. Teilen-Button (□↑) → "Zum Home-Bildschirm"

**Android (Chrome):**
1. URL öffnen
2. Menü (⋮) → "App installieren" oder Banner unten

**Desktop (Chrome/Edge):**
1. URL öffnen
2. In der Adressleiste auf das Installieren-Symbol klicken

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Öffnet http://localhost:5173

## Anpassungen

### Repo-Name ändern

Falls dein Repository anders heißt als `massenstrom-rechner`:

1. In `vite.config.js` → `base: '/DEIN-REPO-NAME/'` anpassen
2. In `index.html` → die Icon-Pfade anpassen

### Eigene Domain

Falls du eine eigene Domain nutzt:

1. In `vite.config.js` → `base: '/'` setzen
2. CNAME-Datei in `public/` anlegen mit deiner Domain
