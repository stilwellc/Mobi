'use client';

import { useState, useEffect } from 'react';
import MobiusStrip from './MobiusStrip';
import Horizon from './Horizon';
import { useTheme } from './ThemeProvider';
import { useWindowSize, usePrefersReducedMotion } from './hooks';

export default function HeroSection() {
  const { theme } = useTheme();
  const w = useWindowSize();
  const mobile = w < 768;
  const tablet = w < 1024;
  const reduced = usePrefersReducedMotion();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (reduced) {
      setBeat(2);
      return;
    }
    const t1 = setTimeout(() => setBeat(1), 200);
    const t2 = setTimeout(() => setBeat(2), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reduced]);

  const scrollToIndex = () => {
    const el = document.getElementById('directory-index');
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section
      aria-label="Hero"
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', zIndex: 1,
        padding: mobile ? '120px 24px 80px' : '140px 56px 100px',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .hero-cta{display:inline-flex;align-items:center;gap:12px;padding:16px 32px;border-radius:60px;border:1px solid var(--color-border-mid);background:transparent;color:var(--color-accent-gold);font-family:var(--font-sans),sans-serif;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;transition:border-color var(--duration-base) var(--ease-signature);-webkit-tap-highlight-color:transparent}
        .hero-cta:hover{border-color:var(--color-accent-gold)}
        .hero-cta svg{transition:transform var(--duration-fast) var(--ease-signature)}
        .hero-cta:hover svg{transform:translateX(2px)}
      `}</style>

      <MobiusStrip mobile={mobile} theme={theme} />

      {/* Beat 1 — eyebrow + headline */}
      <div style={{
        opacity: beat >= 1 ? 1 : 0,
        transform: beat >= 1 ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity var(--duration-slow) var(--ease-signature), transform var(--duration-slow) var(--ease-signature)',
        marginBottom: mobile ? 24 : 36,
        position: 'relative', zIndex: 2,
      }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--color-text-faint)',
        }}>
          The Studio of Collin Stilwell &mdash; Hoboken, NJ
        </span>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-serif), serif', fontWeight: 300,
        fontSize: 'var(--text-display)',
        lineHeight: 1.05, letterSpacing: '-0.02em',
        maxWidth: mobile ? '100%' : tablet ? '80%' : '68%',
        margin: 0,
        opacity: beat >= 1 ? 1 : 0,
        transform: beat >= 1 ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity var(--duration-slow) var(--ease-signature) 100ms, transform var(--duration-slow) var(--ease-signature) 100ms',
        position: 'relative', zIndex: 2,
      }}>
        <span style={{ display: 'block' }}>Software</span>
        <span style={{
          display: 'block', fontStyle: 'italic', fontWeight: 400,
          background: 'linear-gradient(135deg, var(--color-accent-gold) 0%, color-mix(in srgb, var(--color-accent-gold) 65%, var(--color-fg)) 45%, var(--color-accent-gold) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>&amp; matter,</span>
        <span style={{ display: 'block', color: 'var(--color-text-muted)' }}>one practice</span>
      </h1>

      {/* Beat 2 — sub-line + CTA */}
      <div style={{
        marginTop: mobile ? 40 : 64,
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        alignItems: mobile ? 'flex-start' : 'flex-end',
        gap: mobile ? 32 : 80,
        opacity: beat >= 2 ? 1 : 0,
        transform: beat >= 2 ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity var(--duration-slow) var(--ease-signature), transform var(--duration-slow) var(--ease-signature)',
        position: 'relative', zIndex: 2,
      }}>
        <p style={{
          maxWidth: mobile ? '100%' : 400, margin: 0,
          fontSize: mobile ? 14 : 15, lineHeight: 1.65,
          color: 'var(--color-text-muted)', fontWeight: 400,
        }}>
          I design and build across code and matter &mdash; one studio, one continuous surface.
        </p>
        <button className="hero-cta" onClick={scrollToIndex}>
          Explore
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* The Horizon — the hero's bottom edge. Deliberately full-bleed:
          the single exception to the shared content-max Horizon rail. */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        opacity: beat >= 2 ? 1 : 0,
        transition: 'opacity var(--duration-slow) var(--ease-signature)',
      }}>
        <Horizon variant="gold" />
      </div>
    </section>
  );
}
