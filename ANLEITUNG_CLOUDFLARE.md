# Cloudflare Worker — Einrichtungsanleitung
## Massenstromrechner Analytics

---

## Übersicht

Der Worker läuft kostenlos auf Cloudflare und zählt:
- **Unique Visitors** pro Tag (anonyme UUID, kein Personenbezug)
- **Gesamtbesucher** kumuliert
- **Seitenaufrufe** pro Tag

---

## Schritt 1 — Cloudflare Account

1. Gehe zu **https://dash.cloudflare.com**
2. Falls noch kein Account: kostenlos registrieren
3. Im Dashboard links auf **«Workers & Pages»** klicken

---

## Schritt 2 — KV Namespace anlegen (Datenspeicher)

1. Im linken Menü: **Workers & Pages → KV**
2. Klick auf **«Create a Namespace»**
3. Name eingeben: `massenstrom-visits`
4. Auf **«Add»** klicken
5. Die angezeigte **Namespace-ID kopieren** (langer Hex-String)
   → Wird später gebraucht!

---

## Schritt 3 — Worker erstellen

### Option A: Über das Dashboard (empfohlen, kein Terminal nötig)

1. **Workers & Pages → Create Application → Create Worker**
2. Worker-Name eingeben: `massenstrom-analytics`
3. Klick auf **«Deploy»** (leerer Beispiel-Worker wird erstellt)
4. Klick auf **«Edit code»**
5. Den kompletten Inhalt der Datei **`worker.js`** in den Editor kopieren
6. Klick auf **«Save and Deploy»**

### Option B: Über Wrangler CLI (für Entwickler)

```bash
npm install -g wrangler
wrangler login

# In den Projektordner wechseln (wo worker.js + wrangler.toml liegen)
wrangler deploy
```

---

## Schritt 4 — KV Namespace mit Worker verbinden

1. Im Worker-Dashboard: **«Settings» → «Variables»**
2. Unter **«KV Namespace Bindings»** klick auf **«Add binding»**
3. Eintragen:
   - **Variable name:** `VISITS`
   - **KV Namespace:** `massenstrom-visits` (aus Schritt 2)
4. Klick auf **«Save»**

---

## Schritt 5 — Worker-URL notieren

Nach dem Deploy erscheint die URL:
```
https://massenstrom-analytics.DEIN-SUBDOMAIN.workers.dev
```

Diese URL in der Datei **`index.html`** eintragen:

```javascript
// Zeile suchen:
const WORKER_URL = 'https://DEIN-WORKER.massenstrom.workers.dev';

// Ersetzen durch eigene URL, z.B.:
const WORKER_URL = 'https://massenstrom-analytics.stefan.workers.dev';
```

---

## Schritt 6 — index.html auf GitHub Pages aktualisieren

1. `index.html` (mit eingetragener Worker-URL) auf GitHub hochladen
2. GitHub Pages baut automatisch neu
3. Nach ca. 1 Minute ist die neue Version live

---

## Schritt 7 — Testen

Browser-Konsole öffnen (F12 → Console):
```
[Analytics] Unique Visitors heute: 1
```

Oder direkt die Worker-URL aufrufen:
```
https://massenstrom-analytics.DEIN-SUBDOMAIN.workers.dev?uid=test&page=/
```

Antwort:
```json
{
  "date": "2026-04-11",
  "unique_visits_today": 1,
  "total_visits_all": 1,
  "page_views_today": 1,
  "page": "/",
  "counted": true
}
```

---

## Daten einsehen (KV Storage)

1. **Workers & Pages → KV → massenstrom-visits**
2. Klick auf **«View»**
3. Gespeicherte Schlüssel sichtbar, z.B.:
   - `count:2026-04-11` → Unique Visitors heute
   - `total:all` → Gesamtbesucher
   - `page:2026-04-11:/` → Seitenaufrufe heute

---

## Kosten

Der **Cloudflare Free Plan** enthält:
- **100.000 Worker-Requests/Tag** kostenlos
- **1 GB KV Storage** kostenlos
- **10 Millionen KV-Operationen/Monat** kostenlos

Für eine normale HLS-Planungs-App völlig ausreichend.

---

## Datenschutz / DSGVO

- Gespeichert wird nur eine **zufällige UUID** (kein Name, keine IP, keine E-Mail)
- Die UUID liegt nur im **localStorage des Browsers** des Nutzers
- Kein Cookie, kein Session-Tracking
- Nach 90 Tagen automatische Löschung der täglichen Einträge

---

## Dateien im ZIP

| Datei | Zweck |
|---|---|
| `index.html` | App mit Tracking-Script (WORKER_URL anpassen!) |
| `worker.js` | Cloudflare Worker Code → in Dashboard einfügen |
| `wrangler.toml` | Konfiguration für Wrangler CLI (optional) |
| `sw.js` | Service Worker (Offline-Support) |
