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
  integrations: [sitemap()],
  build: {
    // erzeugt /galerie/index.html, /shop/index.html … (saubere URLs ohne .html)
    format: 'directory',
  },
});
