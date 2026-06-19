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
          defaultItem: { status: 'public' },
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
            type: 'string',
            name: 'status',
            label: 'Sichtbarkeit',
            description:
              'Öffentlich = in der Galerie sichtbar. Nicht gelistet = ausgeblendet (Entwurf / vorerst rausgenommen).',
            options: [
              { value: 'public', label: 'Öffentlich (sichtbar)' },
              { value: 'unlisted', label: 'Nicht gelistet / Entwurf (ausgeblendet)' },
            ],
          },
          {
            type: 'object',
            name: 'dimensions',
            label: 'Maße (strukturiert)',
            description:
              'Strukturierte Maße — besser filter-/auswertbar als das Detail-Array. Bei runden Werken Durchmesser, sonst Breite × Höhe.',
            fields: [
              { type: 'number', name: 'width', label: 'Breite' },
              { type: 'number', name: 'height', label: 'Höhe' },
              { type: 'number', name: 'diameter', label: 'Durchmesser (Ø)' },
              { type: 'string', name: 'unit', label: 'Einheit (z. B. cm)' },
            ],
          },
          { type: 'string', name: 'woodType', label: 'Holzart (z. B. Birke, Eiche)' },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags (für Filterung / Suche)',
            list: true,
          },
          {
            type: 'object',
            name: 'gallery',
            label: 'Work-in-Progress-Galerie (Thumbnails neben dem Hauptbild)',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.caption || 'Bild' }) },
            fields: [
              { type: 'image', name: 'image', label: 'Bild' },
              { type: 'string', name: 'caption', label: 'Bildunterschrift (optional)' },
            ],
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
          {
            type: 'string',
            name: 'description',
            label: 'Beschreibung',
            ui: { component: 'textarea' },
          },
          {
            type: 'object',
            name: 'dimensions',
            label: 'Maße (strukturiert)',
            description:
              'Strukturierte Maße — besser filter-/auswertbar als ein Freitext. Bei runden Werken Durchmesser, sonst Breite × Höhe.',
            fields: [
              { type: 'number', name: 'width', label: 'Breite' },
              { type: 'number', name: 'height', label: 'Höhe' },
              { type: 'number', name: 'diameter', label: 'Durchmesser (Ø)' },
              { type: 'string', name: 'unit', label: 'Einheit (z. B. cm)' },
            ],
          },
          { type: 'number', name: 'weight', label: 'Gewicht (g, für Versandinfos)' },
          {
            type: 'number',
            name: 'editionSize',
            label: 'Auflage gesamt (z. B. 5 bei „3 von 5“)',
          },
          {
            type: 'number',
            name: 'editionNumber',
            label: 'Auflage Nr. (z. B. 3 bei „3 von 5“)',
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
          defaultItem: { status: 'public' },
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
          {
            type: 'string',
            name: 'status',
            label: 'Sichtbarkeit',
            description:
              'Öffentlich = im Blog sichtbar. Nicht gelistet = ausgeblendet (Entwurf / vorerst rausgenommen).',
            options: [
              { value: 'public', label: 'Öffentlich (sichtbar)' },
              { value: 'unlisted', label: 'Nicht gelistet / Entwurf (ausgeblendet)' },
            ],
          },
          {
            type: 'boolean',
            name: 'featured',
            label: 'Hervorgehoben? (großer Hero oben auf der Blog-Seite)',
            description: 'Nur ein Beitrag sollte „featured" sein. Die folgenden Felder gelten nur für den Hero.',
          },
          {
            type: 'string',
            name: 'featuredHeading',
            label: 'Hero-Überschrift (optional, sonst der Titel)',
          },
          {
            type: 'string',
            name: 'featuredExcerpt',
            label: 'Hero-Text (optional, sonst der Teaser)',
            ui: { component: 'textarea' },
          },
          {
            type: 'image',
            name: 'featuredImage',
            label: 'Hero-Hintergrundbild (optional)',
          },
          {
            type: 'string',
            name: 'highlights',
            label: 'Hero-Stichpunkte „Im Beitrag" (optional)',
            list: true,
          },
        ],
      },

      // ── Startseite (Singleton) ───────────────────────────────────────
      {
        name: 'home',
        label: 'Startseite',
        path: 'src/content/home',
        format: 'json',
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'heroSubtitle', label: 'Hero-Untertitel', isTitle: true, required: true },
          { type: 'string', name: 'heroCta1', label: 'Hero-Button 1 (Text)' },
          { type: 'string', name: 'heroCta2', label: 'Hero-Button 2 (Text)' },
          { type: 'string', name: 'featuredEyebrow', label: 'Galerie-Abschnitt: Eyebrow' },
          { type: 'string', name: 'featuredHeading', label: 'Galerie-Abschnitt: Überschrift' },
          { type: 'string', name: 'featuredIntro', label: 'Galerie-Abschnitt: Text', ui: { component: 'textarea' } },
          { type: 'string', name: 'aboutEyebrow', label: 'Über-Abschnitt: Eyebrow' },
          { type: 'string', name: 'aboutHeading', label: 'Über-Abschnitt: Überschrift' },
          { type: 'string', name: 'aboutText', label: 'Über-Abschnitt: Text', ui: { component: 'textarea' } },
          { type: 'string', name: 'shopEyebrow', label: 'Shop-Abschnitt: Eyebrow' },
          { type: 'string', name: 'shopHeading', label: 'Shop-Abschnitt: Überschrift' },
          { type: 'string', name: 'shopIntro', label: 'Shop-Abschnitt: Text', ui: { component: 'textarea' } },
          {
            type: 'object',
            name: 'shopCards',
            label: 'Shop-Abschnitt: Karten',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || 'Karte' }) },
            fields: [
              { type: 'string', name: 'title', label: 'Titel' },
              { type: 'string', name: 'text', label: 'Text' },
            ],
          },
          { type: 'string', name: 'contactEyebrow', label: 'Kontakt-Abschnitt: Eyebrow' },
          { type: 'string', name: 'contactHeading', label: 'Kontakt-Abschnitt: Überschrift' },
          { type: 'string', name: 'contactText', label: 'Kontakt-Abschnitt: Text', ui: { component: 'textarea' } },
        ],
      },

      // ── Über-mich-Seite (Singleton) ──────────────────────────────────
      {
        name: 'about',
        label: 'Über-mich-Seite',
        path: 'src/content/about',
        format: 'json',
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'heroEyebrow', label: 'Hero: Eyebrow' },
          { type: 'string', name: 'heroTitle', label: 'Hero: Titel', isTitle: true, required: true },
          { type: 'string', name: 'heroIntro', label: 'Hero: Einleitung', ui: { component: 'textarea' } },
          { type: 'string', name: 'storyHeading', label: 'Geschichte: Überschrift' },
          { type: 'string', name: 'storyParagraphs', label: 'Geschichte: Absätze', list: true, ui: { component: 'textarea' } },
          { type: 'string', name: 'processEyebrow', label: 'Prozess: Eyebrow' },
          { type: 'string', name: 'processHeading', label: 'Prozess: Überschrift' },
          { type: 'string', name: 'processIntro', label: 'Prozess: Text', ui: { component: 'textarea' } },
          {
            type: 'object',
            name: 'processSteps',
            label: 'Prozess: Schritte',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || 'Schritt' }) },
            fields: [
              { type: 'string', name: 'title', label: 'Titel' },
              { type: 'string', name: 'text', label: 'Text', ui: { component: 'textarea' } },
            ],
          },
          { type: 'string', name: 'materialEyebrow', label: 'Material: Eyebrow' },
          { type: 'string', name: 'materialHeading', label: 'Material: Überschrift' },
          { type: 'string', name: 'materialText', label: 'Material: Text', ui: { component: 'textarea' } },
          { type: 'string', name: 'toolsEyebrow', label: 'Werkzeug: Eyebrow' },
          { type: 'string', name: 'toolsHeading', label: 'Werkzeug: Überschrift' },
          { type: 'string', name: 'toolsText', label: 'Werkzeug: Text', ui: { component: 'textarea' } },
          { type: 'string', name: 'timelineHeading', label: 'Stationen: Überschrift' },
          {
            type: 'object',
            name: 'timeline',
            label: 'Stationen',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.year || 'Station' }) },
            fields: [
              { type: 'string', name: 'year', label: 'Jahr' },
              { type: 'string', name: 'title', label: 'Titel' },
              { type: 'string', name: 'subtitle', label: 'Untertitel' },
            ],
          },
          { type: 'string', name: 'ctaHeading', label: 'Abschluss: Überschrift' },
          { type: 'string', name: 'ctaText', label: 'Abschluss: Text', ui: { component: 'textarea' } },
        ],
      },

      // ── Kontaktseite (Singleton) ─────────────────────────────────────
      {
        name: 'contact',
        label: 'Kontaktseite',
        path: 'src/content/contact',
        format: 'json',
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'heroEyebrow', label: 'Hero: Eyebrow' },
          { type: 'string', name: 'heroTitle', label: 'Hero: Titel', isTitle: true, required: true },
          { type: 'string', name: 'heroIntro', label: 'Hero: Einleitung', ui: { component: 'textarea' } },
          { type: 'string', name: 'email', label: 'E-Mail-Adresse' },
          { type: 'string', name: 'addressLines', label: 'Werkstatt-Adresse (je Zeile ein Eintrag)', list: true },
          { type: 'string', name: 'addressNote', label: 'Adress-Hinweis' },
          {
            type: 'object',
            name: 'socials',
            label: 'Social-Links',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || 'Link' }) },
            fields: [
              { type: 'string', name: 'label', label: 'Name (z. B. Instagram)' },
              { type: 'string', name: 'url', label: 'URL' },
            ],
          },
          { type: 'string', name: 'responseTime', label: 'Antwortzeit' },
          { type: 'string', name: 'responseNote', label: 'Antwortzeit-Hinweis' },
          { type: 'string', name: 'formHeading', label: 'Formular: Überschrift' },
          {
            type: 'object',
            name: 'faq',
            label: 'FAQ',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.question || 'Frage' }) },
            fields: [
              { type: 'string', name: 'question', label: 'Frage' },
              { type: 'string', name: 'answer', label: 'Antwort', ui: { component: 'textarea' } },
            ],
          },
        ],
      },
    ],
  },
});
