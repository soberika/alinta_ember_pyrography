import { defineCollection, z } from 'astro:content';

const works = defineCollection({
  type: 'data',
  schema: z.object({
    id:      z.string(),
    title:   z.string(),
    eyebrow: z.string(),
    img:     z.string(),
    desc:    z.string(),
    category: z.enum(['tiere', 'natur', 'steampunk', 'portrait']),
    meta: z.array(z.tuple([z.string(), z.string()])),
    shopSlug: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const products = defineCollection({
  type: 'data',
  schema: z.object({
    id:          z.string(),
    title:       z.string(),
    price:       z.number(),
    img:         z.string(),
    desc:        z.string(),
    available:   z.boolean().default(true),
    edition:     z.string().optional(),
    size:        z.string().optional(),
    material:    z.string().optional(),
  }),
});

const blogPosts = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    date:        z.date(),
    category:    z.enum(['technik', 'news', 'werkstatt', 'prozess']),
    excerpt:     z.string(),
    readTime:    z.number(),
    featured:    z.boolean().default(false),
    img:         z.string().optional(),
  }),
});

export const collections = { works, products, blogPosts };
