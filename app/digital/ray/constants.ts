export const ARTISTS = [
  { slug: 'george-condo', label: 'George Condo' },
  { slug: 'futura-2000', label: 'Futura 2000' },
  { slug: 'kaws', label: 'KAWS' },
  { slug: 'george-nakashima', label: 'George Nakashima' },
  { slug: 'charles-eames', label: 'Charles & Ray Eames' },
  { slug: 'andy-warhol', label: 'Andy Warhol' },
  { slug: 'tom-sachs', label: 'Tom Sachs' },
  { slug: 'barry-mcgee', label: 'Barry McGee' },
  { slug: 'keith-haring', label: 'Keith Haring' },
  { slug: 'peter-saul', label: 'Peter Saul' },
  { slug: 'ed-ruscha', label: 'Ed Ruscha' },
] as const;

export type ArtistSlug = (typeof ARTISTS)[number]['slug'];

export const ARTIST_LABEL: Record<string, string> = Object.fromEntries(
  ARTISTS.map(a => [a.slug, a.label])
);
