import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
    category: z.enum(['tiere', 'natur', 'steampunk', 'portrait']),
    image: z.string(),
    eyebrow: z.string().optional(),
    description: z.string().optional(),
    year: z.number().optional(),
    available: z.boolean().optional(),
    type: z.string().optional(),
    order: z.number().optional(),
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
    date: z.string().optional(),
    category: z.string().optional(),
    available: z.boolean().optional(),
    type: z.string().optional(),
    order: z.number().optional(),
  }),
});

// Blog-Beiträge → src/content/posts/*.json
const posts = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['prozess', 'technik', 'news', 'werkstatt']),
    date: z.string(),
    readTime: z.string().optional(),
    excerpt: z.string().optional(),
    // "illus:funke" … (eingebautes SVG-Motiv) oder ein Bildpfad wie /images/foto.jpg
    thumbnail: z.string().optional(),
    body: z.array(z.string()).optional().default([]),
    order: z.number().optional(),
    // Hervorgehobener Beitrag (großer Hero oben auf der Blog-Seite)
    featured: z.boolean().optional(),
    featuredHeading: z.string().optional(),
    featuredExcerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    highlights: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { works, products, posts };
