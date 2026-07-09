import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { WORK_CATEGORY_VALUES } from './lib/categories';

/**
 * Astro Content Collections (Content Layer API, Astro 6).
 *
 * Die Loader lesen exakt dieselben JSON-Dateien, die TinaCMS schreibt
 * (siehe tina/config.ts). Die Entry-`id` entspricht dem Dateinamen ohne
 * Endung, z. B. src/content/works/phoenix.json → id "phoenix".
 */

// Galerie-Werke → src/content/works/*.json
const works = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(WORK_CATEGORY_VALUES),
    image: z.string(),
    eyebrow: z.string().optional(),
    description: z.string().optional(),
    // Englische Fassungen (leer = deutscher Fallback, siehe src/lib/i18n.ts)
    title_en: z.string().optional(),
    eyebrow_en: z.string().optional(),
    description_en: z.string().optional(),
    // Entstehungs-/Veröffentlichungsdatum — Basis für die chronologische Sortierung
    date: z.coerce.date().optional(),
    available: z.boolean().optional(),
    type: z.string().optional(),
    order: z.number().optional(),
    // Link zum passenden Etsy-Listing (Verkauf läuft über Etsy)
    etsyUrl: z.string().optional(),
    // Sichtbarkeit: 'public' (gelistet) oder 'unlisted' (ausgeblendet / Entwurf)
    status: z.enum(['public', 'unlisted']).optional().default('public'),
    // Strukturierte Maße (besser filter-/auswertbar als nur im meta-Array)
    dimensions: z
      .object({
        width: z.number().optional(),
        height: z.number().optional(),
        diameter: z.number().optional(),
        unit: z.string().optional(), // z. B. "cm"
      })
      .optional()
      .default({}),
    // Schlagworte für Filterung / Suche
    tags: z.array(z.string()).optional().default([]),
    // Work-in-Progress-Galerie: zusätzliche Bilder neben dem Hauptbild
    gallery: z
      .array(z.object({ image: z.string(), caption: z.string().optional() }))
      .optional()
      .default([]),
    // Detail-Tabelle im Modal (Material, Größe, Jahr, Auflage …)
    meta: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .optional()
      .default([]),
  }),
});

// Shop-Produkte → src/content/products/*.json
const products = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    price: z.number(),
    stock: z.string().optional(),
    tag: z.string().optional(),
    // Englische Fassungen (leer = deutscher Fallback)
    title_en: z.string().optional(),
    stock_en: z.string().optional(),
    tag_en: z.string().optional(),
    date: z.string().optional(),
    category: z.string().optional(),
    available: z.boolean().optional(),
    type: z.string().optional(),
    order: z.number().optional(),
    // Link zum passenden Etsy-Listing (Verkauf läuft über Etsy)
    etsyUrl: z.string().optional(),
    // Ausführliche Produktbeschreibung (+ EN-Fassung)
    description: z.string().optional(),
    description_en: z.string().optional(),
    // Strukturierte Maße (gleiches Objekt wie bei Works)
    dimensions: z
      .object({
        width: z.number().optional(),
        height: z.number().optional(),
        diameter: z.number().optional(),
        unit: z.string().optional(), // z. B. "cm"
      })
      .optional()
      .default({}),
    // Gewicht in Gramm (für Versandinfos)
    weight: z.number().optional(),
    // Auflage: Gesamtanzahl und laufende Nummer (z. B. 3 von 5)
    editionSize: z.number().optional(),
    editionNumber: z.number().optional(),
  }),
});

// Blog-Beiträge → src/content/posts/*.json
const posts = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    // Englische Fassungen (leer = deutscher Fallback; body_en leer = deutscher
    // Beitragstext mit Hinweis auf der EN-Seite)
    title_en: z.string().optional(),
    excerpt_en: z.string().optional(),
    seoDescription_en: z.string().optional(),
    body_en: z.any().optional(),
    featuredHeading_en: z.string().optional(),
    featuredExcerpt_en: z.string().optional(),
    highlights_en: z.array(z.string()).optional().default([]),
    category: z.enum(['prozess', 'technik', 'news', 'werkstatt']),
    // Neues ISO-Datum für Sortierung und Darstellung
    publishDate: z.coerce.date().optional(),
    // Altes String-Datum bleibt für Rückwärtskompatibilität
    date: z.string().optional(),
    readTime: z.string().optional(),
    excerpt: z.string().optional(),
    // Foto-Titelbild (hat Vorrang vor thumbnail)
    coverImage: z.string().optional(),
    // "illus:funke" … (eingebautes SVG-Motiv) oder ein Bildpfad wie /images/foto.jpg
    thumbnail: z.string().optional(),
    // Rich-Text body: TinaCMS speichert als JSON-AST (Plate.js-Format)
    body: z.any().optional(),
    tags: z.array(z.string()).optional().default([]),
    seoDescription: z.string().optional(),
    order: z.number().optional(),
    // Sichtbarkeit: 'public' (gelistet) oder 'unlisted' (ausgeblendet / Entwurf)
    status: z.enum(['public', 'unlisted']).optional().default('public'),
    // Hervorgehobener Beitrag (großer Hero oben auf der Blog-Seite)
    featured: z.boolean().optional(),
    featuredHeading: z.string().optional(),
    featuredExcerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    highlights: z.array(z.string()).optional().default([]),
  }),
});

// ── Seiten-Inhalte (Singletons) ────────────────────────────────────────

// Startseite → src/content/home/home.json
const home = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/home' }),
  schema: z.object({
    heroSubtitle: z.string(),
    heroCta1: z.string().optional(),
    heroCta2: z.string().optional(),
    featuredEyebrow: z.string().optional(),
    featuredHeading: z.string().optional(),
    featuredIntro: z.string().optional(),
    aboutEyebrow: z.string().optional(),
    aboutHeading: z.string().optional(),
    aboutText: z.string().optional(),
    shopEyebrow: z.string().optional(),
    shopHeading: z.string().optional(),
    shopIntro: z.string().optional(),
    shopCards: z
      .array(z.object({ title: z.string(), text: z.string() }))
      .optional()
      .default([]),
    contactEyebrow: z.string().optional(),
    contactHeading: z.string().optional(),
    contactText: z.string().optional(),
  }),
});

// Über-mich-Seite → src/content/about/about.json
const about = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/about' }),
  schema: z.object({
    heroEyebrow: z.string().optional(),
    heroTitle: z.string(),
    heroIntro: z.string().optional(),
    storyHeading: z.string().optional(),
    storyParagraphs: z.array(z.string()).optional().default([]),
    processEyebrow: z.string().optional(),
    processHeading: z.string().optional(),
    processIntro: z.string().optional(),
    processSteps: z
      .array(z.object({ title: z.string(), text: z.string() }))
      .optional()
      .default([]),
    materialEyebrow: z.string().optional(),
    materialHeading: z.string().optional(),
    materialText: z.string().optional(),
    toolsEyebrow: z.string().optional(),
    toolsHeading: z.string().optional(),
    toolsText: z.string().optional(),
    timelineHeading: z.string().optional(),
    timeline: z
      .array(z.object({ year: z.string(), title: z.string(), subtitle: z.string() }))
      .optional()
      .default([]),
    ctaHeading: z.string().optional(),
    ctaText: z.string().optional(),
  }),
});

// Kontaktseite → src/content/contact/contact.json
const contact = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/contact' }),
  schema: z.object({
    heroEyebrow: z.string().optional(),
    heroTitle: z.string(),
    heroIntro: z.string().optional(),
    email: z.string().optional(),
    addressLines: z.array(z.string()).optional().default([]),
    addressNote: z.string().optional(),
    socials: z
      .array(z.object({ label: z.string(), url: z.string() }))
      .optional()
      .default([]),
    responseTime: z.string().optional(),
    responseNote: z.string().optional(),
    formHeading: z.string().optional(),
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional()
      .default([]),
  }),
});

export const collections = { works, products, posts, home, about, contact };
