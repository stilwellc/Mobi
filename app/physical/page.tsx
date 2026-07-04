import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Horizon from '../components/Horizon';
import IndexSpread from '../components/IndexSpread';
import RevealLines from '../components/RevealLines';
import SectionMark from '../components/SectionMark';
import { sections } from '../components/sections';
import type { SectionItem } from '../components/types';

export const metadata: Metadata = {
  title: 'Physical — co.stil',
  description:
    'Physical design from the studio of Collin Stilwell — the Project 1122 residence and 3D-printed lighting and furniture.',
};

const physical = sections.find((s) => s.id === 'physical')!;

function metaLine(item: SectionItem): string {
  if (!item.meta) return '';
  return [item.meta.year, item.meta.material, item.meta.status].filter(Boolean).join(' · ');
}

export default function PhysicalPage() {
  return (
    <div className="rail" style={{ paddingBlock: 'var(--space-6) var(--space-5)' }}>
      {/* Ritual header — route numeral 02 lives behind the h1 (sitewide sequence) */}
      <header
        style={{
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 'var(--space-4)',
        }}
      >
        <SectionMark
          n="02"
          align="right"
          style={{ fontSize: 'clamp(180px, 22vw, 320px)' }}
        />
        <div style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ margin: '0 0 var(--space-2)' }}>
            Spaces, Objects &amp; Fabrication
          </p>
          <RevealLines
            as="h1"
            trigger="mount"
            lines={['Physical']}
            style={{
              margin: 0,
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-serif), serif',
              fontWeight: 300,
              fontSize: 'var(--text-display)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--color-fg)',
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 'var(--text-body)',
              lineHeight: 1.65,
              color: 'var(--color-text-secondary)',
              maxWidth: 'var(--prose-max)',
            }}
          >
            Design that leaves the screen — a residence rebuilt from the studs, and objects
            printed into the world.
          </p>
        </div>
      </header>

      <Horizon variant="gold" />

      <div>
        {physical.items.map((item, i) => (
          <IndexSpread
            key={item.name}
            index={String(i + 1).padStart(2, '0')}
            title={item.name}
            titleStyle={item.logoStyle as CSSProperties}
            description={item.description}
            meta={metaLine(item)}
            href={item.href!}
            accent="gold"
            reverse={i % 2 === 1}
            image={{ src: item.image!, alt: item.imageAlt ?? '' }}
          />
        ))}
      </div>
    </div>
  );
}
