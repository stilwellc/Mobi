import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Horizon from '../../components/Horizon';
import IndexRow from '../../components/IndexRow';
import RevealLines from '../../components/RevealLines';
import { prints } from './data';

export const metadata: Metadata = {
  title: 'Prints — co.stil',
  description: 'An AI text-to-print pipeline and the library it produces — lighting, furniture parts, and design studies, each with an inspectable model.',
};

export default function PrintsPage() {
  return (
    <div className="rail" style={{ paddingBlock: 'var(--space-5) var(--space-6)' }}>
      {/* Ritual header */}
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <p className="eyebrow" style={{ margin: '0 0 var(--space-2)' }}>
          <Link href="/physical" className="link-draw" style={{ color: 'inherit' }}>
            Physical
          </Link>
          {' — Additive'}
        </p>
        <RevealLines
          as="h1"
          trigger="mount"
          lines={['Prints']}
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 'var(--text-display)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-3)',
          }}
        />
        <p
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
            margin: 0,
          }}
        >
          Describe an object in plain language; an AI pipeline turns it into a parametric,
          print-ready model. This is the library it&rsquo;s building &mdash; lighting, furniture
          parts, and design studies, printed and in use.
        </p>
      </header>

      <Horizon variant="gold" />

      {/* The objects — one list grammar, each row shows the thing itself */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        {prints.map((print, i) => {
          const meta = [print.details.material, print.details.dimensions, print.details.status]
            .filter(Boolean)
            .join(' · ');
          return (
            <IndexRow
              key={print.id}
              index={String(i + 1).padStart(2, '0')}
              title={print.name}
              description={print.description}
              meta={meta}
              href={`/physical/prints/${print.id}`}
              accent="gold"
              media={{ src: print.image, alt: print.imageAlt }}
            />
          );
        })}
      </div>

      <p
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 12,
          letterSpacing: '0.08em',
          lineHeight: 1.65,
          color: 'var(--color-text-muted)',
          maxWidth: 'var(--prose-max)',
          margin: 0,
        }}
      >
        The pipeline is open source &mdash; text in, CadQuery parametric model out,
        printable as-is.{' '}
        <a
          href="https://github.com/stilwellc/parametric-3d-printing"
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          GitHub&nbsp;&#8599;
        </a>
      </p>
    </div>
  );
}
