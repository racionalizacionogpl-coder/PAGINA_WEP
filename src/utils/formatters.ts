export function parsePercentage(value: string, fallback: number = 50): number {
  if (!value) return fallback;
  const cleaned = value.replace('%', '').replace(',', '.').trim();
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return fallback;
  return Math.min(100, Math.max(0, parsed));
}
