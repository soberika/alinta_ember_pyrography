# CLAUDE.md — Kontext & Konventionen

Technischer Leitfaden für Code-Anpassungen an diesem Projekt. (Endnutzer-/
Pflege-Doku steht in `README.md`, Tina-Cloud-Setup in `TINACMS.md`.)

## Projekt in einem Satz

Statische **Astro 6**-Website (Pyrografie-Künstlerin Alita Ember), Inhalte über
**TinaCMS** (Tina Cloud + GitHub) pflegbar, Hosting auf **Vercel**,
Production-Branch `main`. Ursprünglich eine statische HTML-Seite (liegt als
Archiv in `_legacy/`), migriert nach Astro.

## Stack & wichtige Versionen

- `astro` ^6 — statische Ausgabe (`output` default static), `build.format: 'directory'`
- `tinacms` ^3, `@tinacms/cli` ^2.5 (Dev-Abhängigkeit)
- Styling: **Tailwind via CDN** (`https://cdn.tailwindcss.com`) + `public/assets/tw-config.js`
  + handgeschriebenes `public/assets/site.css`. **Kein** Tailwind-Build, keine
  Astro-Tailwind-Integration. Bewusst so, um das Original-Design 1:1 zu erhalten.
- Node ≥ 20.

## Architektur — zwei getrennte Ebenen

1. **Inhalt** = JSON in `src/content/**` + Schema in `src/content.config.ts`
   (Astro) **und** `tina/config.ts` (Tina). Diese beiden Schemata müssen
   **synchron** bleiben — sie beschreiben dieselben Dateien.
2. **Darstellung** = Markup + Klassen in den `.astro`-Dateien, plus
   `public/assets/site.css` / `tw-config.js`. Designänderungen passieren hier
   und berühren die Inhalts-Ebene nicht.

## Content Collections (6 Stück)

| Collection | Pfad | Typ | Wird gerendert in |
|---|---|---|---|
| `works` | `src/content/works/*.json` | Liste (1 Datei = 1 Werk) | `pages/galerie.astro`, Startseite-Featured |
| `products` | `src/content/products/*.json` | Liste | `pages/shop.astro` |
| `posts` | `src/content/posts/*.json` | Liste | `pages/blog.astro` |
| `home` | `src/content/home/home.json` | Singleton | `pages/index.astro` |
| `about` | `src/content/about/about.json` | Singleton | `pages/ueber.astro` |
| `contact` | `src/content/contact/contact.json` | Singleton | `pages/kontakt.astro` |

- Astro liest mit dem **glob loader** (`glob({ pattern, base })`); Entry-`id` =
  Dateiname ohne Endung.
- Singletons sind in Tina mit `ui: { allowedActions: { create:false, delete:false } }`
  konfiguriert; im Page-Frontmatter via `(await getCollection('home'))[0].data`.

## Rendering-Muster

- **Server-seitig** (bevorzugt): Felder direkt im Astro-Markup ausgeben
  (`{about.heroTitle}`, `.map(...)` für Listen). So bei `ueber`, `kontakt`,
  Blog-Hero, allen statischen Texten.
- **Client-seitig** über `define:vars`: Wo es interaktive Logik gibt
  (Filter, Sortierung, Modals), wird die Collection im Frontmatter gemappt und
  per `<script define:vars={{ ITEMS }}>` an Vanilla-JS übergeben. So bei
  `galerie` (ITEMS), `shop` (PRODUCTS), `blog` (POSTS) und `index` (WORKS).
  `define:vars` impliziert `is:inline` — Astro bündelt das Skript nicht.
- `site.js` (Burger-Menü, Embers, Dark-/Language-Toggle, Jahr) wird als
  `is:inline`-Script aus `public/assets` geladen — nicht anfassen, läuft global.

## ⚠️ Wichtigste Konvention: `tina/tina-lock.json`

Tina Cloud indexiert einen Branch nur, wenn **`tina/tina-lock.json`** im Repo
liegt und das **aktuelle Schema** widerspiegelt.

- Diese Datei wird **committet**; `tina/__generated__/` ist **git-ignoriert**.
- **Bekanntes Problem:** Das gepinnte `@tinacms/cli@2.5.0` erzeugt die
  `tina-lock.json` **nicht** (auch nicht bei `tinacms build`). Sie wird nur von
  **`tinacms dev` der neueren CLI** geschrieben.
- **Nach jeder Schema-Änderung** (Feld/Collection hinzu/umbenannt) die Lock-Datei
  neu erzeugen und committen:

  ```bash
  TINA_PUBLIC_CLIENT_ID=dummy TINA_TOKEN=dummy \
    npx -y @tinacms/cli@latest dev -c "sleep 30"
  # warten bis tina/tina-lock.json die neuen Felder/Collections enthält, dann Prozess beenden
  ```
  Dummy-Werte sind ok — die Lock-Datei enthält **nur das Schema**, keine
  Credentials (vor dem Commit kurz prüfen: keine clientId/Token enthalten).
- Schema-Änderung → in Tina Cloud ggf. **Reindex** auf `main` auslösen, damit das
  Live-Admin die neuen Felder zeigt.

## Build & Deploy

- `npm run build` → `scripts/build.mjs`:
  - Mit `TINA_PUBLIC_CLIENT_ID` **und** `TINA_TOKEN` → `tinacms build --skip-cloud-checks`
    + `astro build`. `--skip-cloud-checks` verhindert Deploy-Abbruch
    (`ERR_CLOUD_CHECK_FAILED`), falls der Branch noch nicht indexiert ist; das
    Admin wird trotzdem nach `public/admin` gebaut.
  - Ohne diese Variablen → nur `astro build` (Deploy bleibt grün).
- `npm run build:site` → nur `astro build` (schneller Check ohne Tina).
- Vercel: Production-Branch `main`, Build-Command `npm run build`, ENV-Variablen
  in den Project Settings.

## Häufige Aufgaben

### Neues Feld zu einer Collection hinzufügen
1. Feld in `tina/config.ts` (passende Collection) ergänzen.
2. Gleiches Feld in `src/content.config.ts` (Zod-Schema) ergänzen — neue Felder
   **optional** halten, damit bestehende Dateien valide bleiben.
3. Feld im zugehörigen `.astro` rendern.
4. **`tina-lock.json` neu erzeugen** (siehe oben) + committen.

### Neue Collection hinzufügen
1. Ordner + JSON unter `src/content/<name>/` anlegen.
2. Collection in `src/content.config.ts` (`defineCollection` + glob loader) und
   in `tina/config.ts` definieren; in `export const collections` aufnehmen.
3. In der/den `.astro`-Seite(n) via `getCollection` lesen.
4. `tina-lock.json` neu erzeugen + committen.

### Design ändern
Nur `public/assets/site.css`, `public/assets/tw-config.js` (Theme-Tokens:
`wood`, `ember`, `char`, Fonts, Shadows) und Tailwind-Klassen/Markup in den
`.astro`-Dateien. **Die `{...}`-Inhalts-Platzhalter dabei erhalten.** Kein
Schema-Update, kein Reindex nötig.

### Neue Seite hinzufügen
`src/pages/<name>.astro` mit `Base` + `Header`/`Footer`. Route = Dateiname.
Header-Links sind in `src/components/Header.astro` gepflegt (statisch).

## Konventionen & Gotchas

- **Astro 6 Content Layer:** Config heißt `src/content.config.ts` (nicht
  `src/content/config.ts`); Collections brauchen einen `loader`.
- **Bilder:** Werk-/Produkt-/Upload-Bilder unter `public/images` (Tina media
  root), als `/images/...` referenziert. Dekorative Assets (Logo, Charakter,
  `site.*`) unter `public/assets`, als `/assets/...`.
- **Tina-Schema braucht pro Collection ein `isTitle: true, required: true`**
  String-Feld.
- `_legacy/` und `_git_snapshot/` sind Archive — nicht Teil des Builds, von
  `tsconfig` exkludiert.
- Statisch (nicht im CMS): Navigation/Footer-Links, Routen, Marken-Name,
  Kontakt-Formular-Struktur.

## Git-Workflow

- Entwicklung auf Feature-Branch, dann PR → **`main`** (Vercel Production).
- Nur die Schema-Dateien (`tina-lock.json`) committen, **nicht** `tina/__generated__/`,
  `dist/`, `.astro/`, `public/admin/`, `.env` (siehe `.gitignore`).

## Befehle (Kurzreferenz)

```bash
npm run dev          # Tina + Astro lokal (Admin /admin)
npm run build        # wie Vercel (Tina + Astro, Tina nur wenn ENV gesetzt)
npm run build:site   # nur Astro
npm run preview      # gebaute Seite ansehen
```
