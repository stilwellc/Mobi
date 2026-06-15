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

export const categoryLabels: Record<string, string> = {
  original: 'Unique Work',
  print: 'Edition',
  photograph: 'Photograph',
  sculpture: 'Sculpture',
  design: 'Design Object',
  unknown: 'Unknown',
};

export const categoryColors: Record<string, string> = {
  original: '#D4B896',
  print: '#96B8D4',
  photograph: '#B8D496',
  sculpture: '#D496B8',
  design: '#B896D4',
  unknown: '#888',
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
    'PRODID:-//Mobi Ray//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:ray-${lot.id}@mobi`,
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
