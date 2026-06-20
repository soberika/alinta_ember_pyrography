// scripts/migrate-posts-rich-text.mjs
// Wandelt body: string[] in Tina Rich-Text AST um und ergänzt publishDate.
// Aufruf: node scripts/migrate-posts-rich-text.mjs

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, '../src/content/posts');

const MONTH_MAP = {
  jan: '01', feb: '02', 'mär': '03', mar: '03', apr: '04',
  mai: '05', jun: '06', jul: '07', aug: '08', sep: '09',
  okt: '10', nov: '11', dez: '12',
};

function parseDateString(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{1,2})\.\s*(\w{3,4})\s+(\d{4})/i);
  if (!match) return null;
  const day = match[1].padStart(2, '0');
  const month = MONTH_MAP[match[2].toLowerCase().slice(0, 3)];
  const year = match[3];
  if (!month) return null;
  return `${year}-${month}-${day}T12:00:00.000Z`;
}

function stringsToRichText(paragraphs) {
  if (!paragraphs || !Array.isArray(paragraphs) || paragraphs.length === 0) {
    return {
      type: 'root',
      children: [{ type: 'p', children: [{ type: 'text', text: '' }] }],
    };
  }
  return {
    type: 'root',
    children: paragraphs.map((text) => ({
      type: 'p',
      children: [{ type: 'text', text: String(text) }],
    })),
  };
}

const files = readdirSync(postsDir).filter((f) => f.endsWith('.json'));
let migrated = 0;

for (const file of files) {
  const filePath = join(postsDir, file);
  const raw = JSON.parse(readFileSync(filePath, 'utf-8'));

  if (!Array.isArray(raw.body)) {
    console.log(`⏭  ${file} — body ist bereits Rich-Text, übersprungen`);
    continue;
  }

  const updated = { ...raw };
  updated.body = stringsToRichText(raw.body);

  if (!updated.publishDate && updated.date) {
    const iso = parseDateString(updated.date);
    if (iso) {
      updated.publishDate = iso;
      console.log(`   📅 publishDate gesetzt: ${iso}`);
    } else {
      console.log(`   ⚠️  Datum konnte nicht geparst werden: "${updated.date}"`);
    }
  }

  writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n', 'utf-8');
  console.log(`✅ ${file} migriert`);
  migrated++;
}

console.log(`\n${migrated} von ${files.length} Posts migriert.`);
