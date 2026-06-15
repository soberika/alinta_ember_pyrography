// @ts-check
import { defineConfig } from 'astro/config';

// Statische Ausgabe — wird von Vercel direkt aus `dist/` ausgeliefert.
// Das Tailwind-Setup der Seite läuft weiterhin über das CDN + /public/assets,
// daher ist hier keine zusätzliche Integration nötig.
export default defineConfig({
  // Bei eigener Domain hier eintragen, z. B. 'https://www.alitaember.de'
  // site: 'https://alinta-ember-pyrography.vercel.app',
  build: {
    // erzeugt /galerie/index.html, /shop/index.html … (saubere URLs ohne .html)
    format: 'directory',
  },
});
