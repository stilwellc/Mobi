import { Section } from './types';

export const sections: Section[] = [
  {
    id: 'digital', label: 'Software', accent: '#96B8D4',
    tagline: 'Design-First Products',
    description: 'Software built like objects — considered, deliberate, nothing accidental. Products and security tooling from the space between code and art.',
    items: [
      {
        name: 'Ray', tag: 'Market Intel',
        description: 'Artist auction intelligence — 17 artists tracked across 5 major houses, automatically.',
        href: '/digital/ray',
        logoStyle: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, letterSpacing: '-0.04em' },
      },
      {
        name: 'Soirée', tag: 'Web App',
        description: 'Curated event aggregator for NYC — scrapes five sources, sorts by real dates.',
        url: 'https://soiree.today/',
        logoStyle: { fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400, letterSpacing: '0.02em' },
      },
      {
        name: 'SecMCPHub', tag: 'Security',
        description: 'Automated security MBR dashboard — vulnerability, GRC, and incident data via MCP in one self-contained report.',
        url: 'https://github.com/stilwellc/SecMCPHub',
        logoStyle: { fontFamily: "'Space Mono', monospace", fontWeight: 700, letterSpacing: '-0.02em' },
      },
      {
        name: 'Elixir Security', tag: 'Open Source',
        description: 'Semgrep rules for Ash Framework auth and contributions to Elixir secure coding training.',
        url: 'https://github.com/stilwellc/ash-semgrep-rules',
        logoStyle: { fontFamily: "'Space Mono', monospace", fontWeight: 400, letterSpacing: '-0.03em' },
      },
      {
        name: 'Pricing Simulator', tag: 'WIP',
        description: 'Demystifying the vintage and design market.', wip: true,
        logoStyle: { fontFamily: "'Space Mono', monospace", fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' },
      },
    ],
  },
  {
    id: 'physical', label: 'Physical', accent: '#D4B896',
    tagline: 'Spaces, Objects & Fabrication',
    description: 'Design leaving the screen — spaces, restorations, and printed objects, transformed through thoughtful craft.',
    items: [
      {
        name: 'Project 1122', tag: 'Installation',
        description: 'A Stilwell residence reimagined from blueprint to lived experience.',
        href: '/physical/1122',
        logoStyle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '-0.06em', textTransform: 'uppercase' },
      },
      {
        name: '3D Prints', tag: 'Fabrication',
        description: 'Digital-to-physical explorations through additive manufacturing.',
        href: '/digital/3d-prints',
        logoStyle: { fontFamily: "'Space Mono', monospace", fontWeight: 400, letterSpacing: '-0.03em' },
      },
      {
        name: 'Curation Archive', tag: 'Collection',
        description: 'Exceptional design objects, furniture, and material studies.',
        logoStyle: { fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 400, letterSpacing: '0.08em' },
      },
      {
        name: 'Restoration Projects', tag: 'Craft',
        description: 'Forgotten pieces brought back through meticulous reimagination.',
        logoStyle: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontVariant: 'small-caps', letterSpacing: '0.06em' },
      },
    ],
  },
  {
    id: 'shop', label: 'Shop', accent: '#B8D496',
    tagline: 'Curated Objects',
    description: 'A selection of design pieces, furniture, and artifacts — available now.',
    items: [
      {
        name: 'For Sale', tag: 'Store',
        description: 'Curated pieces available — furniture, objects, artifacts.',
        href: '/shop',
        logoStyle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '-0.04em' },
      },
    ],
  },
  {
    id: 'social', label: 'Connect', accent: '#D496B8',
    tagline: 'Writing & Elsewhere',
    description: 'Thoughts on security, design engineering, and the craft in between — plus where to find the work.',
    items: [
      {
        name: 'Substack', tag: 'Writing',
        description: 'Building an application security program that actually works — and other essays.',
        handle: 'collinsthoughts', url: 'https://collinsthoughts.substack.com',
        logoStyle: { fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 },
      },
      {
        name: 'GitHub', tag: 'Code',
        description: 'Open source work — security tooling, design experiments, this site.',
        handle: '@stilwellc', url: 'https://github.com/stilwellc',
        logoStyle: { fontFamily: "'Space Mono', monospace", fontWeight: 400, letterSpacing: '-0.02em' },
      },
      {
        name: 'LinkedIn', tag: 'Work',
        description: 'Senior Product Security Engineer at Thirty Madison. NYU Cyber Fellowship.',
        handle: 'collin-stilwell', url: 'https://www.linkedin.com/in/collin-stilwell/',
        logoStyle: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, letterSpacing: '-0.03em' },
      },
    ],
  },
];
