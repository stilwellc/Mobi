import type { MetadataRoute } from 'next';
import { prints } from './physical/prints/data';

const BASE = 'https://mobi-lovat.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '', priority: 1.0 },
    { path: '/software', priority: 0.9 },
    { path: '/software/ray', priority: 0.9 },
    { path: '/software/ray/analytics', priority: 0.6 },
    { path: '/physical', priority: 0.9 },
    { path: '/physical/1122', priority: 0.8 },
    { path: '/physical/prints', priority: 0.8 },
    { path: '/professional', priority: 0.8 },
    { path: '/about', priority: 0.7 },
  ];
  const printPages = prints.map((p) => ({
    path: `/physical/prints/${p.id}`,
    priority: 0.5,
  }));
  return [...routes, ...printPages].map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'weekly' as const,
    priority,
  }));
}
