'use client';

import React from 'react';
import Link from 'next/link';
import STLViewer from '../../components/STLViewer';
import ThemeToggle from '../../components/ThemeToggle';
import { prints } from './data';

export default function PrintsPage() {
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
          <Link href="/" style={{
            textDecoration: 'none', fontSize: 12, color: 'var(--color-text-subtle)', fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            &#8592; Back
          </Link>
        </div>
      </nav>

      <section style={{ padding: '60px 56px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-accent-blue)', opacity: 0.6 }} />
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-label)', fontWeight: 600 }}>
            Digital &mdash; Fabrication
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95,
          marginBottom: 16,
        }}>
          3D <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>Prints</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--color-text-muted)', fontWeight: 400, maxWidth: 520 }}>
          Digital-to-physical explorations through additive manufacturing. Each model is available for download.
        </p>
      </section>

      <section style={{ padding: '20px 56px 120px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {prints.map((print) => (
            <Link key={print.id} href={`/digital/3d-prints/${print.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                position: 'relative', borderRadius: 20, overflow: 'hidden', background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)', transition: 'all 0.4s ease',
                cursor: 'pointer',
              }}>
                <div style={{ position: 'relative', width: '100%', height: 300, background: 'var(--color-bg-card)' }}>
                  <STLViewer stlPath={print.stlPath} />
                  <div style={{
                    position: 'absolute', bottom: 12, right: 12,
                    padding: '4px 12px', borderRadius: 100,
                    background: 'rgba(150,184,212,0.1)', border: '1px solid rgba(150,184,212,0.2)',
                    fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'var(--color-accent-blue)', fontWeight: 600,
                    zIndex: 1, pointerEvents: 'none',
                  }}>STL</div>
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 300, marginBottom: 4,
                  }}>{print.name}</h3>
                  <span style={{ fontSize: 11, color: 'var(--color-text-label)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    View Model &#8594;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
