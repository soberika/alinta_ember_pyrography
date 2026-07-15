// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Statische Ausgabe — wird von Vercel direkt aus `dist/` ausgeliefert.
// Das Tailwind-Setup der Seite läuft weiterhin über das CDN + /public/assets,
// daher ist hier keine zusätzliche Integration nötig.
export default defineConfig({
  // Kanonische Domain — Basis für Canonical-Links, absolute og:image-URLs,
  // die Share-Buttons (Astro.url) und die generierte Sitemap.
  site: 'https://www.alinta-ember.com',
  integrations: [
    sitemap({
      // Interner Launch-Tracker: nicht öffentlich, gehört nicht in die Sitemap.
      filter: (page) => !page.includes('/intern-status-x7k2m'),
    }),
  ],
  build: {
    // erzeugt /galerie/index.html, /shop/index.html … (saubere URLs ohne .html)
    format: 'directory',
  },
});
