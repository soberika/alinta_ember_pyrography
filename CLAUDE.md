# CLAUDE.md — Kontext & Konventionen

Technischer Leitfaden für Code-Anpassungen an diesem Projekt. (Endnutzer-/
Pflege-Doku steht in `README.md`, Tina-Cloud-Setup in `TINACMS.md`.)

## Projekt in einem Satz

Statische **Astro 6**-Website (Pyrografie-Künstlerin Alinta Ember), Inhalte über
**TinaCMS** (Tina Cloud + GitHub) pflegbar, Hosting auf **Vercel**,
Production-Branch `main`. Ursprünglich eine statische HTML-Seite (liegt als
Archiv in `_legacy/`), migriert nach Astro.

## Stack & wichtige Versionen

- `astro` ^6 — statische Ausgabe (`output` default static), `build.format: 'directory'`
- `tinacms` ^3, `@tinacms/cli` ^2.5 (Dev-Abhängigkeit)
- Styling: **Tailwind Play-CDN-Script, self-hosted** unter `public/assets/tailwind.js`
  (byte-identische Kopie des ehemals von `cdn.tailwindcss.com` geladenen Scripts —
  kein Wechsel auf die Astro-Tailwind-Integration, kein Build-Step) + `public/assets/tw-config.js`
  (muss **nach** `tailwind.js` laden, setzt `window.tailwind.config`) + handgeschriebenes
  `public/assets/site.css`. Bewusst so, um das Original-Design 1:1 zu erhalten.
- Fonts (Plus Jakarta Sans, Bricolage Grotesque) **self-hosted** unter
  `public/assets/fonts/*.woff2` (`@font-face` in `site.css`) statt Google Fonts CDN —
  beides Variable Fonts, `latin`-Subset genügt (Projekt ist rein DE/EN, deckt
  deutsche Umlaute/ß ab). Kein externer Request mehr beim Seitenaufruf.
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
  konfiguriert; im Page-Frontmatter via `localizedSingleton(await getCollection('home'), lang).data`
  (jede Singleton-Collection hat zwei Dokumente: `home.json` = DE, `home-en.json` = EN).

## Statische Rechtsseiten (Impressum / Datenschutz)

`src/pages/impressum.astro` und `src/pages/datenschutz.astro` sind **bewusst
keine Content-Collection** — Rechtstexte werden **nicht** ins CMS aufgenommen,
damit sie nicht versehentlich im Admin verändert werden können. Abweichend vom
sonstigen Muster:

- Text steht **direkt im Markup** (server-seitig gerendert, wie `ueber`/`kontakt`),
  nicht in `src/content/**`. Kein Eintrag in `tina/config.ts` oder
  `src/content.config.ts` — und soll auch keiner werden.
- Beide Seiten geben `noindex` an `Base` weiter (`<Base ... noindex>` →
  `<meta name="robots" content="noindex">`); die optionale `noindex`-Prop auf
  `Base.astro` ist rein additiv und für alle anderen Seiten `undefined`.
- EN-Wrapper existieren (`src/pages/en/imprint.astro`, `src/pages/en/privacy.astro`,
  Slugs `/en/imprint` + `/en/privacy` in `PATHS`/`altPath`), der **Rechtstext
  bleibt aber deutsch** — nur Meta-Title/-Description und hreflang sind EN-korrekt.
- Footer (`Footer.astro`) verlinkt beide Seiten über `t.footer.impressum`/
  `t.footer.datenschutz` (Labels im `UI`-Wörterbuch); die Datenschutz-Checkbox
  im Kontaktformular (`kontakt.astro`) verlinkt ebenfalls auf `P.datenschutz`.
- Ändert sich der Rechtstext künftig, direkt im jeweiligen `.astro`-Markup
  editieren — **kein** `tina-lock.json`-Rebuild nötig, da kein Schema betroffen.

## Zweisprachigkeit (DE / EN)

DE ist Standard unter `/`, EN liegt unter `/en/` (englische Slugs: `/en/gallery`,
`/en/about`, `/en/contact`). Zentrale Logik in **`src/lib/i18n.ts`**:

- **Sprach-Erkennung:** Jede Seite ruft `langFromUrl(Astro.url)` auf. Die
  EN-Routen unter `src/pages/en/` sind dünne Wrapper, die die DE-Seite als
  Komponente rendern (`import Page from '../galerie.astro'; <Page />`) — die
  Seite erkennt EN dann selbst an der URL. `en/blog/[slug].astro` definiert
  eine eigene `getStaticPaths` und reicht `{...Astro.props}` durch.
- **UI-Texte** (Buttons, Labels, Formulare, Meta-Titles/-Descriptions) stehen im
  `UI`-Wörterbuch in `i18n.ts` (`en` ist per `typeof de` deckungsgleich
  erzwungen). In `define:vars`-Skripte werden benötigte Strings als `L`-Objekt
  übergeben, lokalisierte Routen aus `PATHS[lang]`.
- **Inhalte:**
  - *Singletons* (home/about/contact): zweite Datei `<name>-en.json` in
    derselben Collection; Auswahl via `localizedSingleton(entries, lang)`.
    Kein Schema-Unterschied — im Tina-Admin erscheinen beide Dokumente.
  - *works/products/posts*: optionale `_en`-Felder (`title_en`,
    `description_en`, `excerpt_en`, `body_en` als Rich-Text …) mit
    DE-Fallback über `pick(lang, de, en)`. Blogposts werden im selben
    Tina-Formular übersetzt; fehlt `body_en`, zeigt die EN-Post-Seite den
    deutschen Text mit Hinweis.
- **hreflang/canonical:** `Base.astro` rendert `de`/`en`/`x-default`-Alternates
  über `altPath()` (liefert immer die Trailing-Slash-Form). Der Sprachumschalter
  im Header ist ein server-gerenderter Link auf `altPath(Astro.url.pathname)` —
  der alte DOM-Text-Ersetzungs-Umschalter in `site.js` wurde entfernt und darf
  nicht wieder eingeführt werden.
- **Neue Seite hinzufügen:** DE-Seite mit `langFromUrl`/`UI`/`PATHS` bauen,
  EN-Wrapper unter `src/pages/en/` ergänzen und das Routen-Paar in `PATHS` +
  den Maps in `altPath()` eintragen.

## Rendering-Muster

- **Server-seitig** (bevorzugt): Felder direkt im Astro-Markup ausgeben
  (`{about.heroTitle}`, `.map(...)` für Listen). So bei `ueber`, `kontakt`,
  Blog-Hero, allen statischen Texten.
- **Client-seitig** über `define:vars`: Wo es interaktive Logik gibt
  (Filter, Sortierung, Modals), wird die Collection im Frontmatter gemappt und
  per `<script define:vars={{ ITEMS }}>` an Vanilla-JS übergeben. So bei
  `galerie` (ITEMS), `shop` (PRODUCTS), `blog` (POSTS) und `index` (WORKS).
  `define:vars` impliziert `is:inline` — Astro bündelt das Skript nicht.
- `site.js` (Burger-Menü, Embers, Dark-Toggle, Jahr) wird als
  `is:inline`-Script aus `public/assets` geladen — läuft global. Der frühere
  Language-Toggle-Block wurde entfernt (siehe „Zweisprachigkeit“).

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
Soll die Seite nicht in Suchmaschinen ranken (z. B. Rechtsseiten), `noindex`
als Prop an `Base` übergeben. Für eine rein statische Seite ohne CMS-Anbindung
siehe `impressum.astro`/`datenschutz.astro` als Vorlage (Abschnitt „Statische
Rechtsseiten" oben).

## Konventionen & Gotchas

- **Astro 6 Content Layer:** Config heißt `src/content.config.ts` (nicht
  `src/content/config.ts`); Collections brauchen einen `loader`.
- **Bilder:** Werk-/Produkt-/Upload-Bilder unter `public/images` (Tina media
  root), als `/images/...` referenziert. Dekorative Assets (Logo, Charakter,
  `site.*`) unter `public/assets`, als `/assets/...`.
- **`public/assets/`** enthält außerdem `tailwind.js` (self-hosted Play-CDN-Script)
  und `fonts/*.woff2` (self-hosted Google Fonts) — beide sind Binär-/generierte
  Artefakte, **nicht** von Hand editieren, sondern bei Bedarf neu herunterladen
  (siehe Stack-Abschnitt oben für Details/Hintergrund).
- **Tina-Schema braucht pro Collection ein `isTitle: true, required: true`**
  String-Feld.
- `_legacy/` und `_git_snapshot/` sind Archive — nicht Teil des Builds, von
  `tsconfig` exkludiert.
- Statisch (nicht im CMS): Navigation/Footer-Links, Routen, Marken-Name,
  Kontakt-Formular-Struktur, Rechtstexte Impressum/Datenschutz (siehe oben).

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
