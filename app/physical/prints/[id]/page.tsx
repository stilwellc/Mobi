'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import STLViewer from '../../../components/STLViewer';
import Horizon from '../../../components/Horizon';
import { prints } from '../data';

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono), monospace',
  fontSize: 12,
  letterSpacing: '0.08em',
  color: 'var(--color-text-muted)',
};

const label: React.CSSProperties = {
  fontSize: 'var(--text-label)',
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--color-text-faint)',
  margin: '0 0 var(--space-1)',
};

export default function PrintDetailPage() {
  const params = useParams();
  const print = prints.find((p) => p.id === params.id);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [dimensions, setDimensions] = useState<string | null>(null);

  if (!print) {
    return (
      <div
        style={{
          background: 'var(--color-bg)',
          color: 'var(--color-fg)',
          padding: 'var(--space-6) var(--space-4)',
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
        }}
      >
        <h1 style={{ fontFamily: 'var(--font-serif), serif', fontSize: 36, fontWeight: 300 }}>
          Print not found
        </h1>
        <Link
          href="/physical/prints"
          style={{ ...mono, textDecoration: 'none', marginTop: 'var(--space-2)', display: 'inline-block' }}
        >
          &#8592; Back to prints
        </Link>
      </div>
    );
  }

  const specs: Array<{ term: string; value: string }> = [
    print.details.material ? { term: 'Material', value: print.details.material } : null,
    { term: 'Dimensions', value: dimensions ?? 'Measuring…' },
    print.details.status ? { term: 'Status', value: print.details.status } : null,
    print.details.printTime ? { term: 'Print time', value: print.details.printTime } : null,
    print.details.layerHeight ? { term: 'Layer height', value: print.details.layerHeight } : null,
    print.details.infill ? { term: 'Infill', value: print.details.infill } : null,
  ].filter((s): s is { term: string; value: string } => s !== null);

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-fg)' }}>
      <section
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: 'var(--space-5) var(--space-4) var(--space-4)',
        }}
      >
        <Link
          href="/physical/prints"
          style={{
            ...mono,
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            display: 'inline-block',
            marginBottom: 'var(--space-4)',
          }}
        >
          &#8592; Prints
        </Link>

        <p style={label}>Physical &mdash; Print</p>

        <h1
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 'clamp(2.25rem, 5vw, 4rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-2)',
          }}
        >
          {print.name}
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
          {print.description}
        </p>
      </section>

      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 var(--space-4)' }}>
        <Horizon variant="gold" />
      </div>

      {/* Full-width viewer — this is where the 3D belongs */}
      <section
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: 'var(--space-4) var(--space-4) 0',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(360px, 60vh, 640px)',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <STLViewer
            stlPath={print.stlPath}
            onLoad={() => setModelLoaded(true)}
            onDimensions={({ x, y, z }) =>
              setDimensions(`${Math.round(x)} × ${Math.round(y)} × ${Math.round(z)} mm`)
            }
          />
          {modelLoaded && (
            <div
              style={{
                ...mono,
                position: 'absolute',
                bottom: 'var(--space-2)',
                left: 'var(--space-2)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                pointerEvents: 'none',
              }}
            >
              Drag to rotate &middot; Scroll to zoom
            </div>
          )}
        </div>
      </section>

      <section
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: 'var(--space-4) var(--space-4) var(--space-6)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-4)',
          alignItems: 'start',
        }}
      >
        {/* Specs — real data only; dimensions are measured from the STL at load */}
        <dl style={{ display: 'grid', gap: 'var(--space-2)', margin: 0 }}>
          {specs.map(({ term, value }) => (
            <div key={term}>
              <dt style={label}>{term}</dt>
              <dd style={{ ...mono, color: 'var(--color-text-secondary)', margin: 0 }}>{value}</dd>
            </div>
          ))}
        </dl>

        <div>
          <p style={label}>Notes</p>
          <p
            style={{
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'var(--color-text-secondary)',
              maxWidth: 'var(--prose-max)',
              margin: '0 0 var(--space-3)',
            }}
          >
            {print.notes}
          </p>

          {print.downloadable && (
            <a
              href={print.stlPath}
              download={`${print.id}.stl`}
              style={{
                ...mono,
                display: 'inline-block',
                color: 'var(--color-accent-gold)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                padding: 'var(--space-1) var(--space-2)',
                border: '1px solid var(--color-border-mid)',
                borderRadius: 4,
              }}
            >
              Download STL &#8595;
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
