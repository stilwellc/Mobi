import { Section } from './types';

export const sections: Section[] = [
  {
    id: 'physical', label: 'Physical', accent: '#D4B896',
    tagline: 'Spaces & Installations',
    description: 'Exploring the intersection of design and physical space — transforming environments through thoughtful craft.',
    items: [
      { name: 'Project 1122', tag: 'Installation', description: 'A Stilwell residence reimagined from blueprint to lived experience.', href: '/physical/1122' },
      { name: 'Curation Archive', tag: 'Collection', description: 'Exceptional design objects, furniture, and material studies.' },
      { name: 'Restoration Projects', tag: 'Craft', description: 'Forgotten pieces brought back through meticulous reimagination.' },
    ],
  },
  {
    id: 'digital', label: 'Digital', accent: '#96B8D4',
    tagline: 'Products & Platforms',
    description: 'Where innovation meets imagination — crafting digital experiences that feel intuitive, alive, and deeply human.',
    items: [
      { name: '3D Prints', tag: 'Fabrication', description: 'Digital-to-physical explorations through additive manufacturing.', href: '/digital/3d-prints' },
      { name: 'Soirée', tag: 'Art', description: 'Curated art discovery — filtered, refined, always surprising.' },
      { name: 'Pricing Simulator', tag: 'WIP', description: 'Demystifying the vintage and design market.', wip: true },
      { name: 'Ray', tag: 'Market Intel', description: 'Auction intelligence — automated tracking across major houses.', href: '/digital/ray' },
    ],
  },
  {
    id: 'shop', label: 'Shop', accent: '#B8D496',
    tagline: 'Curated Objects',
    description: 'A selection of design pieces, furniture, and artifacts — available now.',
    items: [
      { name: 'For Sale', tag: 'Store', description: 'Curated pieces available — furniture, objects, artifacts.', href: '/shop' },
    ],
  },
  {
    id: 'social', label: 'Social', accent: '#D496B8',
    tagline: 'Communities & Culture',
    description: 'Connect with us across our digital communities.',
    items: [
      { name: 'TikTok', tag: '10K', description: 'Vintage finds and design inspiration.', handle: '@mobi', url: 'https://tiktok.com/@mobi' },
      { name: 'Instagram', tag: '25K', description: 'Visual stories of exceptional pieces.', handle: '@mobi', url: 'https://instagram.com/mobi' },
      { name: 'X', tag: '15K', description: 'Updates and vintage market insights.', handle: '@mobi', url: 'https://x.com/mobi' },
    ],
  },
];
