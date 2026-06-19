# Alinta Ember — Pyrography

Website der Pyrografie-Künstlerin **Alinta Ember** — gebaut mit **Astro** und
redaktionell pflegbar über **TinaCMS**. Gehostet auf **Vercel**, alle Inhalte
liegen versioniert im GitHub-Repo.

- **Live:** https://alinta-ember-pyrography.vercel.app
- **Admin (Inhalte bearbeiten):** https://alinta-ember-pyrography.vercel.app/admin

---

## Inhaltsverzeichnis
1. [Was ist das?](#was-ist-das)
2. [Inhalte bearbeiten](#inhalte-bearbeiten) ← das Wichtigste für den Alltag
3. [Was sich im CMS ändern lässt (und was nicht)](#was-sich-im-cms-ändern-lässt-und-was-nicht)
4. [Bilder hochladen](#bilder-hochladen)
5. [Lokale Entwicklung](#lokale-entwicklung)
6. [Build & Deployment](#build--deployment)
7. [Tina Cloud](#tina-cloud)
8. [Projektstruktur](#projektstruktur)

---

## Was ist das?

- **Astro** erzeugt eine statische Website (reines HTML/CSS/JS — schnell, sicher).
- **TinaCMS** liefert eine Admin-Oberfläche unter `/admin`, in der Inhalte über
  Formulare bearbeitet werden. Jede Änderung wird als **Git-Commit** gespeichert.
- **Vercel** baut die Seite bei jedem Commit auf `main` automatisch neu und
  veröffentlicht sie.
- Das Design läuft über **Tailwind (CDN)** + `public/assets/site.css` — es gibt
  keinen separaten CSS-Build.

Der Ablauf einer Änderung:

```
/admin bearbeiten  →  Speichern  →  Git-Commit auf main  →  Vercel baut neu  →  live (~1 Min)
```

---

## Inhalte bearbeiten

### Variante A — im Browser (empfohlen)

1. **https://alinta-ember-pyrography.vercel.app/admin** öffnen.
2. Mit **GitHub** einloggen (einmalig autorisieren).
3. Links eine Collection wählen, Eintrag bearbeiten oder neu anlegen.
4. **Save** klicken → die Änderung wird committet und ist nach ~1 Minute live.

### Variante B — lokal (für Entwickler:innen)

```bash
npm install
npm run dev
```
Seite: `http://localhost:4321` · Admin: `http://localhost:4321/admin`
(funktioniert auch ohne Tina-Cloud-Zugang; schreibt direkt in die JSON-Dateien).

### Die Collections im Überblick

| Im Admin | Datei(en) | Felder |
|---|---|---|
| **Werke (Galerie)** | `src/content/works/*.json` | Titel, Kategorie, Bild, Eyebrow, Beschreibung, Jahr, Verfügbar, Typ, Reihenfolge, Detail-Liste |
| **Produkte (Shop)** | `src/content/products/*.json` | Titel, Bild, Preis, Verfügbarkeit, Tag, Datum, Kategorie, Reihenfolge |
| **Blog (Beiträge)** | `src/content/posts/*.json` | Titel, Kategorie, Datum, Lesezeit, Teaser, Vorschaubild, Absätze, Reihenfolge + Featured-Hero-Felder |
| **Startseite** | `src/content/home/home.json` | Hero-Untertitel, Abschnitts-Texte (Galerie/Über/Shop/Kontakt), Shop-Karten |
| **Über-mich-Seite** | `src/content/about/about.json` | Hero, Geschichte-Absätze, Prozess-Schritte, Material/Werkzeug, Stationen, Abschluss |
| **Kontaktseite** | `src/content/contact/contact.json` | Hero, E-Mail/Adresse/Socials/Antwortzeit, FAQ |

**Reihenfolge:** Das Feld *Reihenfolge* steuert die Position (kleinere Zahl =
weiter vorne/oben). Gilt für Werke, Produkte und Blog-Beiträge.

**Featured-Beitrag (Blog):** Genau **einen** Beitrag auf „Hervorgehoben?" stellen
— er erscheint als großer Hero oben auf der Blog-Seite. Optional eigene
Hero-Überschrift, -Text, -Bild und „Im Beitrag"-Stichpunkte.

**Startseite-Galerie:** Die vier hervorgehobenen Werke auf der Startseite sind
automatisch die ersten vier Werke aus *Werke (Galerie)* (nach Reihenfolge) —
separat pflegen ist nicht nötig.

---

## Was sich im CMS ändern lässt (und was nicht)

**Editierbar im `/admin`:** alle Texte, Bilder, Preise, Listen (Werke, Produkte,
Blog, Startseiten-/Über-/Kontakt-Inhalte).

**Bewusst im Code (Struktur, kein Inhalt):**
- Navigation & Footer-Links, URLs/Routen
- Marken-Name „Alinta Ember" im Hero
- Formular-Struktur der Kontaktseite (Felder, Anliegen, Budget-Optionen)
- Design (Farben, Schriften, Layout) und dekorative Bilder (Logo, Charakter)

> Eine **Designänderung macht die CMS-Pflege nicht hinfällig** — Inhalt und
> Darstellung sind getrennt. Solche Änderungen passieren im Code (CSS/Markup).

---

## Bilder hochladen

Im Bild-Feld einer Collection direkt im Admin hochladen. Bilder landen in
`public/images/` und werden als `/images/dateiname.png` referenziert.
Empfohlene Größe für Werk-Bilder: ca. 1200 × 1600 px.

---

## Lokale Entwicklung

Voraussetzung: Node.js ≥ 20.

```bash
npm install
npm run dev          # Tina + Astro Dev-Server (Admin unter /admin)
npm run build        # Produktions-Build (Tina + Astro), wie auf Vercel
npm run build:site   # nur Astro (ohne Tina Cloud) — schneller Check
npm run preview      # gebaute Seite lokal ansehen
```

---

## Build & Deployment

- **Hosting:** Vercel, Production-Branch `main`. Jeder Commit auf `main` löst
  ein Deployment aus.
- **Build-Command:** `npm run build` → `scripts/build.mjs`:
  - Sind die Tina-Cloud-Variablen gesetzt → `tinacms build --skip-cloud-checks`
    + `astro build`.
  - Sind sie nicht gesetzt → nur `astro build` (Deploy klappt trotzdem).
- **Umgebungsvariablen** (Vercel → Settings → Environment Variables):
  `TINA_PUBLIC_CLIENT_ID`, `TINA_TOKEN` (siehe `.env.example`).

---

## Tina Cloud

Die Verbindung zu GitHub (damit das Live-Admin committen kann) läuft über
**Tina Cloud**. Einrichtung und Troubleshooting: siehe **[`TINACMS.md`](./TINACMS.md)**.

Kurzform: Projekt auf https://app.tina.io mit dem Repo + Branch `main`
verbinden, `TINA_PUBLIC_CLIENT_ID` und `TINA_TOKEN` bei Vercel hinterlegen.

---

## Projektstruktur

```
├── astro.config.mjs        # Astro-Konfiguration (statische Ausgabe)
├── scripts/build.mjs       # robuster Build-Wrapper (Tina optional)
├── tina/
│   ├── config.ts           # TinaCMS-Schema (Collections + Felder)
│   └── tina-lock.json      # generiertes Schema (für Tina Cloud; committet)
├── src/
│   ├── content.config.ts   # Astro Content Collections (Schema/Zod)
│   ├── content/            # ← die Inhalte (JSON), via /admin bearbeitet
│   │   ├── works/  products/  posts/
│   │   └── home/  about/  contact/
│   ├── layouts/Base.astro  # HTML-Grundgerüst (Head, Fonts, Tailwind-CDN)
│   ├── components/         # Header.astro, Footer.astro
│   └── pages/              # index, galerie, shop, blog, ueber, kontakt
├── public/
│   ├── assets/             # site.css, site.js, tw-config.js, Logo etc.
│   └── images/             # via CMS hochgeladene Bilder
└── _legacy/                # ursprüngliche statische HTML-Seite (Archiv)
```

> Technische Details & Konventionen für Code-Anpassungen: siehe **`CLAUDE.md`**.
