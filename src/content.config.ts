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

export const collections = { works, products };
