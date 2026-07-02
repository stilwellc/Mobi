// Golden-hour palette: every house sits inside the ocean/gold family.
// Theme-aware var() references (defined in globals.css) so 12px labels stay
// readable in both themes. Use with color-mix() when alpha is needed.
export const houseColors: Record<string, string> = {
  'Phillips': 'var(--ray-house-phillips)',
  "Sotheby's": 'var(--ray-house-sothebys)',
  "Christie's": 'var(--ray-house-christies)',
  'Rago': 'var(--ray-house-rago)',
  'Wright': 'var(--ray-house-wright)',
  'Heritage': 'var(--ray-house-heritage)',
  'Bonhams': 'var(--ray-house-bonhams)',
  'Hindman': 'var(--ray-house-hindman)',
};

// Concrete hexes per theme — ONLY for recharts/SVG fills, where var() is not
// reliable in presentation attributes. Swap via useTheme() at the call site.
export const houseColorsHex: Record<'dark' | 'light', Record<string, string>> = {
  dark: {
    'Phillips': '#96B8D4',
    "Sotheby's": '#D4B896',
    "Christie's": '#C9BEAC',
    'Rago': '#B89A6E',
    'Wright': '#7A9CB8',
    'Heritage': '#AEC4D4',
    'Bonhams': '#C4A265',
    'Hindman': '#9A8F7D',
  },
  light: {
    'Phillips': '#3E6488',
    "Sotheby's": '#7D6140',
    "Christie's": '#6B6150',
    'Rago': '#75603A',
    'Wright': '#3D607F',
    'Heritage': '#48657A',
    'Bonhams': '#7A6236',
    'Hindman': '#665C4C',
  },
};

export function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export const categoryLabels: Record<string, string> = {
  original: 'Unique Work',
  print: 'Edition',
  photograph: 'Photograph',
  sculpture: 'Sculpture',
  design: 'Design Object',
  unknown: 'Unknown',
};

export const categoryColors: Record<string, string> = {
  original: 'var(--ray-cat-original)',
  print: 'var(--ray-cat-print)',
  photograph: 'var(--ray-cat-photograph)',
  sculpture: 'var(--ray-cat-sculpture)',
  design: 'var(--ray-cat-design)',
  unknown: 'var(--ray-cat-unknown)',
};

// Concrete hexes per theme — ONLY for recharts/SVG fills. See houseColorsHex.
export const categoryColorsHex: Record<'dark' | 'light', Record<string, string>> = {
  dark: {
    original: '#D4B896',
    print: '#96B8D4',
    photograph: '#7A9CB8',
    sculpture: '#C4A265',
    design: '#C9BEAC',
    unknown: '#9A8F7D',
  },
  light: {
    original: '#7D6140',
    print: '#3E6488',
    photograph: '#3D607F',
    sculpture: '#7A6236',
    design: '#6B6150',
    unknown: '#665C4C',
  },
};

export function makeAuctionIcs(lot: {
  id: string;
  title: string;
  auctionHouse: string;
  saleDate: string;
  estimateLow: number | null;
  estimateHigh: number | null;
  currency: string;
  url: string;
  artist: string;
}): string {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
  const fmtDate = (iso: string) => iso.replace(/-/g, '').slice(0, 8);
  const d = new Date(lot.saleDate + 'T12:00:00');
  const nextDay = new Date(d.getTime() + 86_400_000);

  const fmtPrice = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;

  const estLine = lot.estimateLow && lot.estimateHigh
    ? `Est. ${fmtPrice(lot.estimateLow)}–${fmtPrice(lot.estimateHigh)} ${lot.currency}\\n`
    : '';

  const desc = esc(`${estLine}${lot.url}`);
  const summary = esc(`${lot.title} · ${lot.auctionHouse}`);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//co.stil Ray//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:ray-${lot.id}@costil`,
    `DTSTART;VALUE=DATE:${fmtDate(lot.saleDate)}`,
    `DTEND;VALUE=DATE:${fmtDate(nextDay.toISOString())}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc}`,
    `URL:${lot.url}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Auction today',
    'TRIGGER:-PT8H',
    'END:VALARM',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Auction tomorrow',
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function getUpcomingCounts(lots: Array<{ status: string; saleDate: string | null; artist: string }>): Record<string, number> {
  const today = new Date().toISOString().split('T')[0];
  const counts: Record<string, number> = {};
  for (const lot of lots) {
    if (lot.status === 'upcoming' && lot.saleDate && lot.saleDate >= today) {
      counts[lot.artist] = (counts[lot.artist] || 0) + 1;
    }
  }
  return counts;
}
