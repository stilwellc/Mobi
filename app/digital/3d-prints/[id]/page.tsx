'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import STLViewer from '../../../components/STLViewer';
import ThemeToggle from '../../../components/ThemeToggle';
import { prints } from '../data';

export default function PrintDetailPage() {
  const params = useParams();
  const print = prints.find((p) => p.id === params.id);
  const [modelLoaded, setModelLoaded] = useState(false);

  if (!print) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-fg)', fontFamily: "'Syne', sans-serif", padding: 56 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300 }}>Print not found</h1>
        <Link href="/digital/3d-prints" style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 16, display: 'inline-block' }}>
          &#8592; Back to 3D Prints
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-fg)', fontFamily: "'Syne', sans-serif" }}>
      <nav style={{
        padding: '24px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-nav-bg)', backdropFilter: 'blur(30px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--color-fg)', fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em' }}>
          mobi<span style={{ color: 'var(--color-accent-gold)' }}>.</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ThemeToggle />
          <Link href="/digital/3d-prints" style={{
            textDecoration: 'none', fontSize: 12, color: 'var(--color-text-subtle)', fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            &#8592; Back to 3D Prints
          </Link>
        </div>
      </nav>

      <section style={{ padding: '60px 56px 120px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          {/* 3D Viewer */}
          <div style={{
            position: 'relative', borderRadius: 20, overflow: 'hidden', background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)', aspectRatio: '1',
          }}>
            <STLViewer stlPath={print.stlPath} onLoad={() => setModelLoaded(true)} />
            {modelLoaded && (
              <div style={{
                position: 'absolute', bottom: 12, left: 12,
                fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--color-text-label)', fontWeight: 500, opacity: 0.6,
              }}>
                Drag to rotate &middot; Scroll to zoom
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent-blue)', opacity: 0.6 }} />
              <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-label)', fontWeight: 600 }}>
                3D Print
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em',
              marginBottom: 24,
            }}>{print.name}</h1>

            <p style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--color-text-muted)', fontWeight: 400, marginBottom: 36 }}>
              {print.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
              {print.details.material && (
                <div>
                  <dt style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-label)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Material</dt>
                  <dd style={{ fontSize: 15, color: 'var(--color-text-detail)' }}>{print.details.material}</dd>
                </div>
              )}
              {print.details.dimensions && (
                <div>
                  <dt style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-label)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Dimensions</dt>
                  <dd style={{ fontSize: 15, color: 'var(--color-text-detail)' }}>{print.details.dimensions}</dd>
                </div>
              )}
              {print.details.printTime && (
                <div>
                  <dt style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-label)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Print Time</dt>
                  <dd style={{ fontSize: 15, color: 'var(--color-text-detail)' }}>{print.details.printTime}</dd>
                </div>
              )}
              {print.details.layerHeight && (
                <div>
                  <dt style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-label)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Layer Height</dt>
                  <dd style={{ fontSize: 15, color: 'var(--color-text-detail)' }}>{print.details.layerHeight}</dd>
                </div>
              )}
              {print.details.infill && (
                <div>
                  <dt style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-label)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Infill</dt>
                  <dd style={{ fontSize: 15, color: 'var(--color-text-detail)' }}>{print.details.infill}</dd>
                </div>
              )}
            </div>

            {/* Download Button */}
            <a
              href={print.stlPath}
              download={`${print.id}.stl`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 32px', borderRadius: 60,
                border: '1px solid rgba(150,184,212,0.3)', background: 'rgba(150,184,212,0.06)',
                color: 'var(--color-accent-blue)', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'none', cursor: 'pointer',
                fontFamily: "'Syne', sans-serif",
                transition: 'all 0.3s ease',
                width: 'fit-content',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download STL
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
