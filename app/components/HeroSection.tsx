'use client';

import MobiusStrip from './MobiusStrip';

interface HeroSectionProps {
  mobile: boolean;
  tablet: boolean;
  phase: number;
  scrollY: number;
  theme: 'dark' | 'light';
}

export default function HeroSection({ mobile, tablet, phase, scrollY, theme }: HeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', padding: mobile ? '120px 20px 80px' : '140px 56px 100px',
        overflow: 'hidden',
      }}
    >
      <MobiusStrip mobile={mobile} theme={theme} />

      <div style={{
        position: 'absolute', top: mobile ? '18%' : '15%', left: mobile ? '5%' : '8%',
        width: phase >= 1 ? (mobile ? 40 : 80) : 0, height: 1, background: 'var(--color-accent-gold)',
        transition: 'width 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.5s', opacity: 0.4,
      }} />

      <div style={{
        opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
        marginBottom: mobile ? 24 : 36, display: 'flex', alignItems: 'center', gap: 16,
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid var(--color-accent-gold)', opacity: 0.5 }} aria-hidden="true" />
        <span className="section-label-sm">Design Studio &mdash; Est. 2024</span>
      </div>

      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: mobile ? 48 : tablet ? 72 : 'clamp(80px, 9vw, 140px)',
        lineHeight: mobile ? 1 : 0.9, letterSpacing: '-0.03em',
        maxWidth: mobile ? '100%' : '65%',
        opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.15s',
        position: 'relative', zIndex: 2,
      }}>
        <span style={{ display: 'block' }}>Where design</span>
        <span style={{
          display: 'block', fontStyle: 'italic', fontWeight: 400,
          background: 'linear-gradient(135deg, #D4B896 0%, #E8D5BC 40%, #D4B896 70%, #C4A886 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>transcends</span>
        <span style={{ display: 'block', color: 'var(--color-fg-half)' }}>boundaries</span>
      </h1>

      <div style={{
        marginTop: mobile ? 36 : 56, display: 'flex',
        flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'flex-start' : 'flex-end',
        gap: mobile ? 32 : 80,
        opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
        position: 'relative', zIndex: 2,
      }}>
        <p style={{ maxWidth: mobile ? '100%' : 380, fontSize: mobile ? 14 : 15, lineHeight: 1.85, color: 'var(--color-text-muted)', fontWeight: 400 }}>
          Physical spaces, digital products, and cultural connections — designed with intention, built with craft, refined through obsession.
        </p>
        <button className="hero-cta magnetic-btn" onClick={() => { const el = document.getElementById('directory'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
          Explore
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {!mobile && (
        <div style={{
          position: 'absolute', bottom: 48, left: 56, right: 56,
          display: 'flex', alignItems: 'center', gap: 24,
          opacity: phase >= 3 ? 0.4 : 0, transition: 'opacity 1.5s ease',
        }} aria-hidden="true">
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--color-border-strong), transparent)' }} />
          <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-text-faint)', fontWeight: 600 }}>Scroll to explore</span>
        </div>
      )}
    </section>
  );
}
