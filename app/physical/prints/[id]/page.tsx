'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import STLViewer from '../../../components/STLViewer';
import Horizon from '../../../components/Horizon';
import RevealLines from '../../../components/RevealLines';
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
  const [measured, setMeasured] = useState<string | null>(null);

  if (!print) {
    return (
      <div className="rail" style={{ paddingBlock: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif), serif', fontSize: 36, fontWeight: 300 }}>
          Print not found
        </h1>
        <Link
          href="/physical/prints"
          className="link-action"
          style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', display: 'inline-block' }}
        >
          <span className="arrow" data-dir="back">&#8592;</span> Prints
        </Link>
      </div>
    );
  }

  // Dimensions are seeded from the record; the STL measurement
  // silently confirms them once the model is in hand.
  const dimensions = measured ?? print.details.dimensions ?? null;

  const specs: Array<{ term: string; value: string }> = [
    print.details.material ? { term: 'Material', value: print.details.material } : null,
    dimensions ? { term: 'Dimensions', value: dimensions } : null,
    print.details.status ? { term: 'Status', value: print.details.status } : null,
    print.details.printTime ? { term: 'Print time', value: print.details.printTime } : null,
    print.details.layerHeight ? { term: 'Layer height', value: print.details.layerHeight } : null,
    print.details.infill ? { term: 'Infill', value: print.details.infill } : null,
  ].filter((s): s is { term: string; value: string } => s !== null);

  return (
    <div className="rail" style={{ paddingBlock: 'var(--space-5)' }}>
      {/* Ritual header */}
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <p className="eyebrow" style={{ margin: '0 0 var(--space-2)' }}>
          <Link href="/physical" className="link-draw" style={{ color: 'inherit' }}>
            Physical
          </Link>
          {' — Print'}
        </p>

        <RevealLines
          as="h1"
          trigger="mount"
          lines={[print.name]}
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 'clamp(2.25rem, 5vw, 4rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-2)',
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
          {print.description}
        </p>
      </header>

      <Horizon variant="gold" />

      {/* Full-width viewer — arrives when the model does */}
      <section style={{ padding: 'var(--space-4) 0 0' }}>
        <div
          className="glass"
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(360px, 60vh, 640px)',
            padding: 'var(--space-2)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              opacity: modelLoaded ? 1 : 0,
              transform: modelLoaded ? 'scale(1)' : 'scale(0.98)',
              transition:
                'opacity 600ms var(--ease-signature), transform 600ms var(--ease-signature)',
            }}
          >
            <STLViewer
              stlPath={print.stlPath}
              onLoad={() => setModelLoaded(true)}
              onDimensions={({ x, y, z }) =>
                setMeasured(`${Math.round(x)} × ${Math.round(y)} × ${Math.round(z)} mm`)
              }
            />
          </div>

          {/* Loading label sits outside the arrival wrapper so it stays visible */}
          <div
            aria-hidden={modelLoaded}
            style={{
              ...mono,
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              opacity: modelLoaded ? 0 : 1,
              transition: 'opacity 300ms var(--ease-signature)',
              pointerEvents: 'none',
            }}
          >
            Loading model
          </div>

          {/* The hint follows the arrival, one beat behind */}
          <div
            style={{
              ...mono,
              position: 'absolute',
              bottom: 'var(--space-2)',
              left: 'var(--space-2)',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              opacity: modelLoaded ? 1 : 0,
              transition: 'opacity 600ms var(--ease-signature) 600ms',
              pointerEvents: 'none',
            }}
          >
            Drag to rotate &middot; Scroll to zoom
          </div>
        </div>
      </section>

      <section
        style={{
          padding: 'var(--space-4) 0 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-4)',
          alignItems: 'start',
        }}
      >
        {/* Specs — real data only; rows hold their height while the STL confirms */}
        <dl
          className="glass glass-quiet"
          style={{ display: 'grid', gap: 'var(--space-2)', margin: 0, padding: 'var(--space-3)', alignContent: 'start' }}
        >
          {specs.map(({ term, value }) => (
            <div key={term} style={{ minHeight: 44 }}>
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

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            {print.downloadable && (
              <a
                href={print.stlPath}
                download={`${print.id}.stl`}
                className="link-action"
                style={{ color: 'var(--color-accent-gold-text)' }}
              >
                Download STL <span className="arrow">&#8595;</span>
              </a>
            )}
            <Link
              href="/physical/prints"
              className="link-action"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span className="arrow" data-dir="back">&#8592;</span> Prints
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
