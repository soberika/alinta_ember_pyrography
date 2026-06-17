// Schlauer Build: läuft IMMER sauber durch.
//
//  • Sind die Tina-Cloud-Variablen (TINA_PUBLIC_CLIENT_ID + TINA_TOKEN)
//    gesetzt  → "tinacms build" (Admin gegen Tina Cloud) + "astro build".
//  • Sind sie NICHT gesetzt → "tinacms build" wird übersprungen und nur die
//    Astro-Seite gebaut. So funktioniert der Vercel-Deploy sofort, ohne dass
//    vorher irgendetwas konfiguriert werden muss.
//
// Lokales Bearbeiten via "npm run dev" funktioniert unabhängig davon ganz
// ohne Tina Cloud.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const binDir = path.join(process.cwd(), 'node_modules', '.bin');
const bin = (name) => {
  const local = path.join(binDir, name);
  return existsSync(local) ? JSON.stringify(local) : name;
};
const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

const hasTinaCloud =
  !!process.env.TINA_PUBLIC_CLIENT_ID && !!process.env.TINA_TOKEN;

if (hasTinaCloud) {
  console.log('[build] Tina Cloud erkannt → tinacms build + astro build');
  run(`${bin('tinacms')} build`);
} else {
  console.warn(
    [
      '[build] Keine Tina-Cloud-Variablen (TINA_PUBLIC_CLIENT_ID / TINA_TOKEN) gefunden.',
      '[build] → "tinacms build" wird übersprungen, es wird nur die Astro-Seite gebaut.',
      '[build]   (Lokales Bearbeiten via "npm run dev" funktioniert weiterhin ohne Tina Cloud.)',
    ].join('\n'),
  );
}

run(`${bin('astro')} build`);
