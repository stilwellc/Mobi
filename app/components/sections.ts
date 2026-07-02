import { Section } from './types';
import { ARTISTS } from '../software/ray/constants';

export const sections: Section[] = [
  {
    id: 'software', label: 'Software', accent: '#96B8D4',
    tagline: 'Design-First Products',
    description: 'Products I build like objects — considered, deliberate, nothing accidental.',
    items: [
      {
        name: 'Ray', tag: 'Market Intel',
        description: `Auction intelligence for the art market — ${ARTISTS.length} artists tracked across 5 major houses, automatically.`,
        href: '/software/ray',
        image: '/images/work/ray.jpg',
        imageAlt: 'Ray — market performance chart, two decades of realized auction prices',
        logoStyle: { fontFamily: 'var(--font-sans), sans-serif', fontWeight: 600, letterSpacing: '-0.04em' },
        meta: { year: '2025', stack: 'Next.js · TypeScript · automated crawl', status: 'Live' },
      },
      {
        name: 'Soirée', tag: 'Web App',
        description: 'Event aggregator for NYC — five sources scraped into one calendar, sorted by real dates.',
        url: 'https://soiree.today',
        image: '/images/work/soiree.jpg',
        imageAlt: "Soirée — today's curated events for New York City",
        logoStyle: { fontFamily: 'var(--font-serif), serif', fontStyle: 'italic', fontWeight: 400, letterSpacing: '0.02em' },
        meta: { year: '2025', stack: 'Node.js · PostgreSQL' },
      },
    ],
  },
  {
    id: 'physical', label: 'Physical', accent: '#D4B896',
    tagline: 'Spaces, Objects & Fabrication',
    description: 'Design leaving the screen — a residence rebuilt from the studs, and objects printed into the world.',
    items: [
      {
        name: 'Project 1122', tag: 'Residence',
        description: 'A residence taken back to the studs — redesigned room by room, documented as found and as intended.',
        href: '/physical/1122',
        image: '/images/1122/before/Livingroom1.webp',
        imageAlt: 'Project 1122 as found — living room, original maple floors',
        logoStyle: { fontFamily: 'var(--font-sans), sans-serif', fontWeight: 700, letterSpacing: '-0.04em' },
        meta: { year: '2024 —', material: 'Full residence', status: 'In progress' },
      },
      {
        name: '3D Prints', tag: 'Fabrication',
        description: 'Lighting, furniture parts, and design studies — modeled in CAD, printed in PLA.',
        href: '/physical/prints',
        image: '/images/work/prints.jpg',
        imageAlt: 'Wall sconce — printed in PLA, studio render',
        logoStyle: { fontFamily: 'var(--font-mono), monospace', fontWeight: 400, letterSpacing: '-0.03em' },
        meta: { material: 'PLA · FDM', status: 'Ongoing' },
      },
    ],
  },
];

// The professional record — separate from the studio practice.
// Rendered only on /professional; the studio Index never shows this.
export const professional = {
  career: [
    { label: 'Now', role: 'Senior Product Security Engineer', org: 'Thirty Madison', period: '2024 —' },
    { label: 'Before', role: 'Application Security Engineer', org: 'Podium', period: '2021 — 2024' },
    { label: 'Study', role: 'M.S. Cyber Security, Cyber Fellowship', org: 'NYU', period: '2021' },
  ],
  work: [
    {
      name: 'SecMCPHub', tag: 'Security',
      description: 'Security review dashboard that assembles itself — vulnerability, GRC, and incident data pulled over MCP into one self-contained report.',
      url: 'https://github.com/stilwellc/SecMCPHub',
      logoStyle: { fontFamily: 'var(--font-mono), monospace', fontWeight: 700, letterSpacing: '-0.02em' } as Record<string, string | number>,
      meta: { year: '2026', stack: 'MCP · automated reporting' },
    },
    {
      name: 'Elixir Security', tag: 'Open Source',
      description: 'Semgrep rules for Ash Framework auth and contributions to Elixir secure coding training.',
      url: 'https://github.com/stilwellc/ash-semgrep-rules',
      logoStyle: { fontFamily: 'var(--font-mono), monospace', fontWeight: 400, letterSpacing: '-0.03em' } as Record<string, string | number>,
      meta: { year: '2025', stack: 'Semgrep · Ash Framework' },
    },
  ],
  writing: [
    {
      title: 'Building an Application Security Program That Actually Works',
      description: 'A four-legged framework for shifting security from a blocking function into an enabler of engineering speed.',
      date: 'May 2026',
      url: 'https://collinsthoughts.substack.com/p/building-an-application-security',
    },
  ],
};
