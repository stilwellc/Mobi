export const houseColors: Record<string, string> = {
  'Phillips': '#96B8D4',
  "Sotheby's": '#D4B896',
  "Christie's": '#D496B8',
  'Rago': '#B8D496',
  'Wright': '#B896D4',
  'Heritage': '#D4D496',
  'Bonhams': '#C4A265',
  'Hindman': '#6BA368',
};

export function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}
