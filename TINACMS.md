# TinaCMS — Inhalte pflegen

Die Inhalte der Seite liegen als JSON-Dateien im Repository und werden über
**TinaCMS** in einer Admin-Oberfläche bearbeitet. Änderungen werden als
**Git-Commits** gespeichert.

| Inhalt   | Collection | Dateien                     |
|----------|------------|-----------------------------|
| Galerie  | `works`    | `src/content/works/*.json`  |
| Shop     | `products` | `src/content/products/*.json` |
| Bilder   | Media      | `public/images/`            |

Die Astro-Seiten (`src/pages/galerie.astro`, `src/pages/shop.astro`) lesen
genau diese Dateien über Astro Content Collections (`src/content.config.ts`).

---

## 1. Lokal bearbeiten (ohne Tina Cloud)

```bash
npm install
npm run dev
```

- Seite:  <http://localhost:4321>
- Admin:  <http://localhost:4321/admin>

Im Admin bearbeitete Werke/Produkte werden direkt in die JSON-Dateien unter
`src/content/` geschrieben. Mit dem nächsten `git commit` / `git push` sind sie
gespeichert. Für die reine lokale Bearbeitung sind **keine** Tina-Cloud-Zugänge
nötig.

> Nur die Astro-Seite bauen (ohne Tina Cloud): `npm run build:site`

---

## 2. Tina Cloud mit GitHub verbinden (Commits aus dem Live-Admin)

Damit das Admin **auf der Live-Seite** (Vercel) funktioniert und Änderungen
automatisch auf GitHub committet, einmalig Tina Cloud verbinden:

1. Auf <https://app.tina.io> mit GitHub anmelden.
2. **"Create Project"** → dieses Repository
   `soberika/alinta_ember_pyrography` autorisieren und auswählen.
3. Als Production-Branch **`main`** wählen (Vercel Production-Branch).
4. Tina Cloud zeigt danach eine **Client ID** und erlaubt das Erstellen eines
   **Tokens** (Projekt → Tokens).
5. Diese als Umgebungsvariablen hinterlegen:

   **Lokal** — `.env.example` nach `.env` kopieren und ausfüllen:
   ```env
   TINA_PUBLIC_CLIENT_ID=<deine Client ID>
   TINA_TOKEN=<dein Token>
   ```

   **Auf Vercel** — Project → Settings → Environment Variables:
   ```
   TINA_PUBLIC_CLIENT_ID = <deine Client ID>
   TINA_TOKEN            = <dein Token>
   ```

6. Sobald die Variablen gesetzt sind, läuft der vollständige Build
   `npm run build` (= `tinacms build && astro build`) durch und das Admin unter
   `https://<deine-domain>/admin` committet Änderungen automatisch auf `main`.

> **Vercel Build Command:** einfach `npm run build` lassen. Das Script
> (`scripts/build.mjs`) erkennt automatisch, ob `TINA_PUBLIC_CLIENT_ID` und
> `TINA_TOKEN` gesetzt sind:
> - **nicht gesetzt** → nur Astro-Build (Deploy klappt sofort, ohne Tina Cloud)
> - **gesetzt** → voller `tinacms build` + Astro-Build
>
> Du musst bei Vercel also **nichts** umstellen. Sobald du die beiden Variablen
> einträgst, läuft beim nächsten Deploy automatisch der volle Tina-Build mit.
> (`npm run build:full` erzwingt den vollen Build, `npm run build:site` nur Astro.)

---

## Felder

**Werke (`works`)** — Titel, Kategorie (tiere / natur / steampunk / portrait),
Bild, Eyebrow, Beschreibung, Jahr, Verfügbar, Typ, Reihenfolge sowie eine
beliebig lange Detail-Liste (Material, Größe, Jahr, Auflage …).

**Produkte (`products`)** — Titel, Bild, Preis, Verfügbarkeit, Tag, Datum
(YYYY-MM, für Sortierung), Kategorie, Verfügbar, Typ, Reihenfolge.

Die **Reihenfolge** (`order`) steuert die Position auf der Seite — kleinere
Werte erscheinen weiter vorne.
