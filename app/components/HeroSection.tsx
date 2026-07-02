'use client';

import { useState, useEffect } from 'react';
import MobiusStrip from './MobiusStrip';
import Horizon from './Horizon';
import { useTheme } from './ThemeProvider';
import { usePrefersReducedMotion } from './hooks';

export default function HeroSection() {
  const { theme } = useTheme();
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
      className="hero-section"
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <style>{`
        .hero-section{padding:140px 56px 100px}
        .hero-eyebrow{margin-bottom:36px}
        .hero-headline{max-width:68%}
        .hero-subrow{margin-top:64px;display:flex;flex-direction:row;align-items:flex-end;gap:80px}
        .hero-sub{max-width:400px;font-size:15px}
        @media (max-width: 1023px) {
          .hero-headline{max-width:80%}
        }
        @media (max-width: 767px) {
          .hero-section{padding:120px 24px 80px}
          .hero-eyebrow{margin-bottom:24px}
          .hero-headline{max-width:100%}
          .hero-subrow{margin-top:40px;flex-direction:column;align-items:flex-start;gap:32px}
          .hero-sub{max-width:100%;font-size:14px}
        }
        .hero-cta{display:inline-flex;align-items:center;gap:12px;padding:16px 32px;color:var(--color-accent-gold);font-family:var(--font-sans),sans-serif;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;-webkit-tap-highlight-color:transparent}
        .hero-cta svg{transition:transform var(--duration-fast) var(--ease-signature)}
        .hero-cta:hover svg{transform:translateX(2px)}
      `}</style>

      <MobiusStrip theme={theme} />

      {/* Beat 1 — eyebrow + headline */}
      <div className="hero-eyebrow" style={{
        opacity: beat >= 1 ? 1 : 0,
        transform: beat >= 1 ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity var(--duration-slow) var(--ease-signature), transform var(--duration-slow) var(--ease-signature)',
        position: 'relative', zIndex: 2,
      }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--color-text-faint)',
        }}>
          The Studio of Collin Stilwell &mdash; Hoboken, NJ
        </span>
      </div>

      <h1 className="hero-headline" style={{
        fontFamily: 'var(--font-serif), serif', fontWeight: 300,
        fontSize: 'var(--text-display)',
        lineHeight: 1.05, letterSpacing: '-0.02em',
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
      <div className="hero-subrow" style={{
        opacity: beat >= 2 ? 1 : 0,
        transform: beat >= 2 ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity var(--duration-slow) var(--ease-signature), transform var(--duration-slow) var(--ease-signature)',
        position: 'relative', zIndex: 2,
      }}>
        <p className="hero-sub" style={{
          margin: 0, lineHeight: 1.65,
          color: 'var(--color-text-muted)', fontWeight: 400,
        }}>
          I design and build across code and matter &mdash; one studio, one continuous surface.
        </p>
        <button className="hero-cta glass glass-pill" onClick={scrollToIndex}>
          <span>Explore</span>
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
