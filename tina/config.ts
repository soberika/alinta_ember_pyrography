import { defineConfig } from 'tinacms';

/**
 * TinaCMS Konfiguration für alinta-ember-pyrography.
 *
 * ──────────────────────────────────────────────────────────────────────────
 *  Lokal bearbeiten (ohne Tina Cloud):
 *      npm run dev      →  Seite:  http://localhost:4321
 *                          Admin:  http://localhost:4321/admin
 *  Änderungen landen direkt in den JSON-Dateien unter src/content/ und
 *  werden mit deinem nächsten git commit gespeichert.
 *
 *  Produktiv auf Vercel + GitHub (Commits direkt aus dem /admin):
 *      1. Account auf https://app.tina.io anlegen und dieses GitHub-Repo
 *         (soberika/alinta_ember_pyrography) verbinden.
 *      2. In Tina Cloud die "Client ID" sowie ein "Read Only Token" /
 *         "Content Token" erzeugen.
 *      3. Diese als Umgebungsvariablen setzen (lokal in .env, auf Vercel in
 *         den Project Settings → Environment Variables):
 *             TINA_PUBLIC_CLIENT_ID = <deine Client ID>
 *             TINA_TOKEN            = <dein Token>
 *      4. `npm run build` ausführen — Tina baut das Admin gegen Tina Cloud,
 *         und Speichern im /admin committet automatisch auf den Branch unten.
 * ──────────────────────────────────────────────────────────────────────────
 */

// Branch, auf den Tina Cloud committet. Auf Vercel wird der aktuelle
// Deploy-Branch automatisch erkannt, sonst Fallback auf "main" (Production).
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,

  // ↓↓↓ Platzhalter — nach dem Verbinden mit Tina Cloud per ENV-Variablen füllen.
  // Leer lassen ist für die lokale Bearbeitung (npm run dev) völlig ausreichend.
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || '', // Tina Cloud → Project → Overview
  token: process.env.TINA_TOKEN || '', // Tina Cloud → Project → Tokens

  build: {
    // Admin-Oberfläche wird nach public/admin gebaut → erreichbar unter /admin
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      // Bild-Uploads landen in public/images und werden als /images/... referenziert
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      // ── Galerie-Werke ────────────────────────────────────────────────
      {
        name: 'works',
        label: 'Werke (Galerie)',
        path: 'src/content/works',
        format: 'json',
        ui: {
          // Dateiname aus dem Titel ableiten (z. B. "Phönix II" → phoenix-ii)
          filename: {
            slugify: (values) =>
              (values?.title || 'werk')
                .toString()
                .toLowerCase()
                .replace(/[äÄ]/g, 'a')
                .replace(/[öÖ]/g, 'o')
                .replace(/[üÜ]/g, 'u')
                .replace(/ß/g, 'ss')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, ''),
          },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Titel', isTitle: true, required: true },
          {
            type: 'string',
            name: 'category',
            label: 'Kategorie',
            required: true,
            options: [
              { value: 'tiere', label: 'Tiere & Mythos' },
              { value: 'natur', label: 'Natur' },
              { value: 'steampunk', label: 'Steampunk' },
              { value: 'portrait', label: 'Portrait' },
            ],
          },
          { type: 'image', name: 'image', label: 'Bild', required: true },
          {
            type: 'string',
            name: 'eyebrow',
            label: 'Eyebrow (z. B. „Holzscheibe · Ø 28 cm“)',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Beschreibung',
            ui: { component: 'textarea' },
          },
          { type: 'number', name: 'year', label: 'Jahr' },
          { type: 'boolean', name: 'available', label: 'Verfügbar' },
          { type: 'string', name: 'type', label: 'Typ (Unikat / Edition)' },
          {
            type: 'number',
            name: 'order',
            label: 'Reihenfolge (kleiner = weiter vorne)',
          },
          {
            type: 'object',
            name: 'meta',
            label: 'Details (Material, Größe, Jahr, Auflage …)',
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.label || 'Detail' }),
            },
            fields: [
              { type: 'string', name: 'label', label: 'Bezeichnung' },
              { type: 'string', name: 'value', label: 'Wert' },
            ],
          },
        ],
      },

      // ── Shop-Produkte ────────────────────────────────────────────────
      {
        name: 'products',
        label: 'Produkte (Shop)',
        path: 'src/content/products',
        format: 'json',
        ui: {
          filename: {
            slugify: (values) =>
              (values?.title || 'produkt')
                .toString()
                .toLowerCase()
                .replace(/[äÄ]/g, 'a')
                .replace(/[öÖ]/g, 'o')
                .replace(/[üÜ]/g, 'u')
                .replace(/ß/g, 'ss')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, ''),
          },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Titel', isTitle: true, required: true },
          { type: 'image', name: 'image', label: 'Bild', required: true },
          { type: 'number', name: 'price', label: 'Preis (€)', required: true },
          {
            type: 'string',
            name: 'stock',
            label: 'Verfügbarkeit (z. B. „verfügbar“ / „3 von 5“)',
          },
          {
            type: 'string',
            name: 'tag',
            label: 'Tag (z. B. „Original“ / „Edition · 3/5“)',
          },
          { type: 'string', name: 'date', label: 'Datum (YYYY-MM, für Sortierung)' },
          { type: 'string', name: 'category', label: 'Kategorie' },
          { type: 'boolean', name: 'available', label: 'Verfügbar' },
          { type: 'string', name: 'type', label: 'Typ (Original / Edition)' },
          {
            type: 'number',
            name: 'order',
            label: 'Reihenfolge (kleiner = weiter vorne)',
          },
        ],
      },

      // ── Blog-Beiträge ────────────────────────────────────────────────
      {
        name: 'posts',
        label: 'Blog (Beiträge)',
        path: 'src/content/posts',
        format: 'json',
        ui: {
          filename: {
            slugify: (values) =>
              (values?.title || 'beitrag')
                .toString()
                .toLowerCase()
                .replace(/[äÄ]/g, 'a')
                .replace(/[öÖ]/g, 'o')
                .replace(/[üÜ]/g, 'u')
                .replace(/ß/g, 'ss')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, ''),
          },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Titel', isTitle: true, required: true },
          {
            type: 'string',
            name: 'category',
            label: 'Kategorie',
            required: true,
            options: [
              { value: 'prozess', label: 'Prozess' },
              { value: 'technik', label: 'Technik' },
              { value: 'news', label: 'News' },
              { value: 'werkstatt', label: 'Werkstatt' },
            ],
          },
          { type: 'string', name: 'date', label: 'Datum (Anzeigetext, z. B. „10. Mai 2026“)' },
          { type: 'string', name: 'readTime', label: 'Lesezeit (z. B. „4 Min“)' },
          {
            type: 'string',
            name: 'excerpt',
            label: 'Teaser (Kurzbeschreibung in der Liste)',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'thumbnail',
            label: 'Vorschaubild',
            description:
              'Eingebautes Motiv: illus:funke, illus:spitzen, illus:edition, illus:studio, illus:skizze, illus:holz, illus:klang, illus:zahn — oder ein Bildpfad wie /images/foto.jpg',
          },
          {
            type: 'string',
            name: 'body',
            label: 'Absätze',
            list: true,
            ui: { component: 'textarea' },
          },
          {
            type: 'number',
            name: 'order',
            label: 'Reihenfolge (kleiner = weiter oben / neuer)',
          },
        ],
      },
    ],
  },
});
