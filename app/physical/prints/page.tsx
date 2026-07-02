import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Horizon from '../../components/Horizon';
import { prints } from './data';

export const metadata: Metadata = {
  title: 'Prints — co.stil',
  description: 'Three 3D prints — a wall sconce, a Tolomeo study, and a USM Haller replacement foot — each with an inspectable model.',
};

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono), monospace',
  fontSize: 12,
  letterSpacing: '0.08em',
  color: 'var(--color-text-muted)',
};

export default function PrintsPage() {
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-fg)' }}>
      <style>{`
        .print-card {
          display: block;
          text-decoration: none;
          color: inherit;
          padding: var(--space-3) var(--space-4);
        }
        .print-card .print-arrow {
          display: inline-block;
          transition: transform var(--duration-fast) var(--ease-signature);
        }
        .print-card:hover .print-arrow {
          transform: translateX(2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .print-card, .print-card .print-arrow { transition: none; }
        }
      `}</style>

      <section
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: 'var(--space-5) var(--space-4) var(--space-4)',
        }}
      >
        <Link
          href="/physical"
          style={{
            ...mono,
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            display: 'inline-block',
            marginBottom: 'var(--space-4)',
          }}
        >
          &#8592; Physical
        </Link>

        <p
          style={{
            fontSize: 'var(--text-label)',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-text-faint)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Physical &mdash; Additive
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 'var(--text-display)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-3)',
          }}
        >
          Prints
        </h1>

        <p
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
            margin: 0,
          }}
        >
          Objects I&rsquo;ve designed, repaired, or studied through the printer. Some are original,
          some are replacement parts, one is homework on a design I admire.
        </p>
      </section>

      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 var(--space-4)' }}>
        <Horizon variant="gold" />
      </div>

      <section
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: 'var(--space-4) var(--space-4) var(--space-6)',
          display: 'grid',
          gap: 'var(--space-2)',
        }}
      >
        {prints.map((print, i) => {
          const meta = [print.details.material, print.details.dimensions, print.details.status]
            .filter(Boolean)
            .join(' · ');
          return (
            <Link key={print.id} href={`/physical/prints/${print.id}`} className="print-card glass">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 'var(--space-3)',
                  flexWrap: 'wrap',
                }}
              >
                <span style={mono}>{String(i + 1).padStart(2, '0')}</span>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif), serif',
                    fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                    fontWeight: 300,
                    letterSpacing: '-0.01em',
                    margin: 0,
                    flex: '1 1 auto',
                  }}
                >
                  {print.name}
                </h2>
                <span className="print-arrow" style={{ ...mono, color: 'var(--color-accent-gold)' }}>
                  &#8594;
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.65,
                  color: 'var(--color-text-secondary)',
                  maxWidth: 'var(--prose-max)',
                  margin: 'var(--space-1) 0',
                }}
              >
                {print.description}
              </p>
              <p style={{ ...mono, margin: 0 }}>{meta}</p>
            </Link>
          );
        })}

        <a
          href="https://github.com/stilwellc/parametric-3d-printing"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...mono,
            textDecoration: 'none',
            marginTop: 'var(--space-3)',
            lineHeight: 1.65,
          }}
        >
          The tooling behind some of these &mdash; an open-source toolkit for parametric,
          print-ready models with CadQuery. GitHub &#8594;
        </a>
      </section>
    </div>
  );
}
