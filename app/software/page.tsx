import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import Horizon from '../components/Horizon';
import { sections } from '../components/sections';
import type { SectionItem } from '../components/types';
import { ARTISTS } from './ray/constants';

export const metadata: Metadata = {
  title: 'Software — co.stil',
  description:
    'Design-first software from the studio of Collin Stilwell — Ray auction intelligence, Soirée, SecMCPHub, and Elixir security tooling.',
};

const software = sections.find((s) => s.id === 'software')!;
const accent = software.accent;

const rowCss = `
.sw-row {
  text-decoration: none;
  display: block;
  border-bottom: 1px solid var(--color-border);
  transition: border-color var(--duration-fast) var(--ease-signature);
}
.sw-row:first-of-type { border-top: 1px solid var(--color-border); }
.sw-row:hover { border-bottom-color: ${accent}66; }
.sw-row .sw-arrow {
  transition: transform var(--duration-fast) var(--ease-signature), color var(--duration-fast) var(--ease-signature);
}
.sw-row:hover .sw-arrow { transform: translateX(2px); color: ${accent}; }
@media (prefers-reduced-motion: reduce) {
  .sw-row, .sw-row .sw-arrow { transition: none; }
}
`;

function metaLine(item: SectionItem): string {
  if (!item.meta) return '';
  return [item.meta.year, item.meta.stack, item.meta.status].filter(Boolean).join(' · ');
}

function Row({
  item,
  index,
  flagship = false,
  children,
}: {
  item: SectionItem;
  index: number;
  flagship?: boolean;
  children?: React.ReactNode;
}) {
  const inner = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 'var(--space-3)',
        alignItems: 'baseline',
        padding: flagship ? 'var(--space-4) 0' : 'var(--space-3) 0',
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
            fontSize: flagship ? 'clamp(2rem, 4vw, 3rem)' : 'clamp(1.5rem, 2.5vw, 2rem)',
            lineHeight: 1.1,
            color: 'var(--color-fg)',
            fontFamily: 'var(--font-sans), sans-serif',
            ...(item.logoStyle as CSSProperties),
          }}
        >
          {item.name}
        </h2>
        {children ?? (
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
        )}
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

      <span
        className="sw-arrow"
        aria-hidden="true"
        style={{ fontSize: 16, color: 'var(--color-text-muted)' }}
      >
        {item.url ? '↗' : '→'}
      </span>
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="sw-row">
        {inner}
      </Link>
    );
  }
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="sw-row">
      {inner}
    </a>
  );
}

export default function SoftwarePage() {
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
        Software
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
        I build software the way I build objects — considered, deliberate, nothing accidental.
      </p>

      <Horizon variant="ocean" style={{ marginBottom: 'var(--space-4)' }} />

      <div>
        {software.items.map((item, i) =>
          item.name === 'Ray' ? (
            <Row key={item.name} item={item} index={i} flagship>
              <p
                style={{
                  margin: 0,
                  marginBottom: 'var(--space-1)',
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: 'var(--color-text-secondary)',
                  maxWidth: 'var(--prose-max)',
                }}
              >
                Auction intelligence for the art market — the flagship. Tracks {ARTISTS.length} artists
                across 5 auction houses, automatically.
              </p>
            </Row>
          ) : (
            <Row key={item.name} item={item} index={i} />
          )
        )}
      </div>
    </div>
  );
}
