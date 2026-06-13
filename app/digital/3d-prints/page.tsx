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

      {/* Featured: Parametric 3D Printing Skill */}
      <section style={{ padding: '0 56px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <a
          href="https://github.com/stilwellc/parametric-3d-printing"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-card)',
            padding: '36px 40px',
            display: 'flex', alignItems: 'center', gap: 40,
            transition: 'all 0.4s ease',
            cursor: 'pointer',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(150,184,212,0.08)', border: '1px solid rgba(150,184,212,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{
                  fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'var(--color-accent-blue)', fontWeight: 600,
                  padding: '3px 10px', borderRadius: 100,
                  background: 'rgba(150,184,212,0.08)', border: '1px solid rgba(150,184,212,0.15)',
                }}>Featured</span>
                <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-label)', fontWeight: 500 }}>
                  Open Source
                </span>
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24, fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 6,
              }}>
                Parametric 3D Printing Skill
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-text-muted)', fontWeight: 400, margin: 0 }}>
                A Claude Code skill for generating parametric 3D-printable models using CadQuery. Describe a physical object and Claude will write a parametric script, export STL, render previews, and iterate until it&apos;s right.
              </p>
            </div>
            <div style={{
              fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--color-text-label)', fontWeight: 500, flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              View on GitHub &#8594;
            </div>
          </div>
        </a>
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
