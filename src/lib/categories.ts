/**
 * Werk-Kategorien = Produkt-Typen (nicht thematisch, sondern was das Stück ist).
 *
 * Einzige Quelle der Wahrheit für:
 *   - das Zod-Enum in src/content.config.ts (Validierung)
 *   - die Filter-Chips in src/pages/galerie.astro (UI + Labels)
 *
 * ⚠️ Die Tina-Dropdown-Optionen in tina/config.ts (Collection "works",
 * Feld "category") müssen mit dieser Liste synchron gehalten werden — das
 * Tina-Schema ist bewusst getrennt (siehe CLAUDE.md).
 */
export const WORK_CATEGORIES = [
  { value: 'untersetzer', label: 'Untersetzer' },
  { value: 'miniaturen', label: 'Miniaturen' },
  { value: 'schneidebretter', label: 'Schneidebretter' },
  { value: 'deko', label: 'Deko' },
  { value: 'wandbild', label: 'Wandbild' },
  { value: 'aufbewahrung', label: 'Aufbewahrung' },
  { value: 'funktionale-dekoration', label: 'Funktionale Dekoration' },
] as const;

// Reine Werteliste für z.enum (Reihenfolge wie oben).
export const WORK_CATEGORY_VALUES: [string, ...string[]] = [
  'untersetzer',
  'miniaturen',
  'schneidebretter',
  'deko',
  'wandbild',
  'aufbewahrung',
  'funktionale-dekoration',
];
