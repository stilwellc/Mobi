import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import Horizon from '../components/Horizon';
import { sections } from '../components/sections';
import type { SectionItem } from '../components/types';

export const metadata: Metadata = {
  title: 'Physical — co.stil',
  description:
    'Physical design from the studio of Collin Stilwell — the Project 1122 residence and 3D-printed lighting and furniture.',
};

const physical = sections.find((s) => s.id === 'physical')!;
const accent = physical.accent;

const rowCss = `
.ph-row {
  text-decoration: none;
  display: block;
  border-bottom: 1px solid var(--color-border);
  transition: border-color var(--duration-fast) var(--ease-signature);
}
.ph-row:first-of-type { border-top: 1px solid var(--color-border); }
.ph-row:hover { border-bottom-color: ${accent}66; }
.ph-row .ph-arrow {
  transition: transform var(--duration-fast) var(--ease-signature);
}
.ph-row:hover .ph-arrow { transform: translateX(2px); }
@media (max-width: 768px) {
  .ph-thumb { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ph-row, .ph-row .ph-arrow { transition: none; }
}
`;

function metaLine(item: SectionItem): string {
  if (!item.meta) return '';
  return [item.meta.year, item.meta.material, item.meta.status].filter(Boolean).join(' · ');
}

function Row({ item, index }: { item: SectionItem; index: number }) {
  const inner = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: item.image ? 'auto 1fr auto auto' : 'auto 1fr auto',
        gap: 'var(--space-3)',
        alignItems: 'baseline',
        padding: 'var(--space-3) 0',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 12,
          color: 'var(--color-text-faint)',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div>
        <h2
          style={{
            margin: 0,
            marginBottom: 'var(--space-1)',
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            lineHeight: 1.1,
            color: 'var(--color-fg)',
            fontFamily: 'var(--font-sans), sans-serif',
            ...(item.logoStyle as CSSProperties),
          }}
        >
          {item.name}
        </h2>
        <p
          style={{
            margin: 0,
            marginBottom: 'var(--space-1)',
            fontSize: 15,
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
          }}
        >
          {item.description}
        </p>
        {item.meta && (
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            {metaLine(item)}
          </span>
        )}
      </div>

      {item.image && (
        <div
          className="ph-thumb"
          style={{
            width: 200,
            aspectRatio: '16 / 10',
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            alignSelf: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt=""
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <span
        className="ph-arrow"
        aria-hidden="true"
        style={{ fontSize: 16, color: 'var(--color-text-muted)', alignSelf: 'center' }}
      >
        {item.url ? '↗' : '→'}
      </span>
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="ph-row">
        {inner}
      </Link>
    );
  }
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="ph-row">
      {inner}
    </a>
  );
}

export default function PhysicalPage() {
  return (
    <div
      style={{
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
        padding: 'var(--space-7) var(--space-3)',
      }}
    >
      <style>{rowCss}</style>

      <h1
        style={{
          margin: 0,
          marginBottom: 'var(--space-2)',
          fontFamily: 'var(--font-serif), serif',
          fontWeight: 300,
          fontSize: 'var(--text-display)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: 'var(--color-fg)',
        }}
      >
        Physical
      </h1>
      <p
        style={{
          margin: 0,
          marginBottom: 'var(--space-4)',
          fontSize: 'var(--text-body)',
          lineHeight: 1.65,
          color: 'var(--color-text-secondary)',
          maxWidth: 'var(--prose-max)',
        }}
      >
        Design that leaves the screen — a residence rebuilt from the studs, and objects
        printed into the world.
      </p>

      <Horizon variant="gold" style={{ marginBottom: 'var(--space-4)' }} />

      <div>
        {physical.items.map((item, i) => (
          <Row key={item.name} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
