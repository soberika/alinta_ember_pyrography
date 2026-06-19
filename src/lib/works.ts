export interface WorkDimensions {
  width?: number;
  height?: number;
  diameter?: number;
  unit?: string;
}

/**
 * Strukturierte Maße zu lesbarem Text formen.
 * z. B. { diameter: 28, unit: 'cm' } → "Ø 28 cm", { width: 30, height: 40 } → "30 × 40 cm".
 * Wird in Galerie- und Startseiten-Modal genutzt.
 */
export function formatDimensions(d?: WorkDimensions): string {
  if (!d) return '';
  const u = d.unit ? ` ${d.unit}` : '';
  if (d.diameter != null) return `Ø ${d.diameter}${u}`;
  if (d.width != null && d.height != null) return `${d.width} × ${d.height}${u}`;
  if (d.width != null) return `${d.width}${u}`;
  if (d.height != null) return `${d.height}${u}`;
  return '';
}
