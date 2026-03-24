# Massenstrom Rechner

HVAC Massenstrom-Rechner als Progressive Web App (PWA).

## Ordnerstruktur (WICHTIG!)

```
Massenstromrechner/
├── .github/workflows/deploy.yml   ← Auto-Deploy
├── public/
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── App.jsx                    ← Die App
│   └── main.jsx                   ← Entry Point
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Deployment

1. Alle Dateien in dein GitHub-Repo `Massenstromrechner` hochladen
   - **WICHTIG**: Ordnerstruktur beibehalten! `src/` und `public/` sind Ordner!
2. Settings → Pages → Source: **GitHub Actions**
3. Warten bis der Build durchläuft (Actions Tab)
4. Live unter: `https://DEIN-USERNAME.github.io/Massenstromrechner/`

## Auf Smartphone installieren

**iPhone**: Safari → Teilen (□↑) → "Zum Home-Bildschirm"
**Android**: Chrome → Menü (⋮) → "App installieren"
