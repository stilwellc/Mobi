'use client';

import { useRef } from 'react';
import MobiusStrip from './MobiusStrip';
import Horizon from './Horizon';
import RevealLines from './RevealLines';
import { useTheme } from './ThemeProvider';
import { usePrefersReducedMotion } from './hooks';
import { useMagnetic } from './motion/useMagnetic';
import { useScrollScrub } from './motion/useScrollScrub';

/**
 * The hero — retimed under the route ritual (one clock, no setState
 * beats). template.tsx draws the horizon (0-480ms) and lifts the
 * page (90-690ms); the hero's own beats ride CSS animation-delay on
 * that same clock: eyebrow 480ms, headline lines 570/660/750ms
 * (RevealLines), subrow 840ms, bottom Horizon draws center-out to
 * 40% width at 960ms — then the scroll owns it.
 *
 * Scroll scene (seed C): ONE rAF-throttled listener writing directly
 * to DOM refs — the Mobius lifts and dissolves, the three headline
 * lines parallax apart, the horizon widens 0.4 -> 1 over the first
 * 70% of hero scroll. Zero React re-renders on scroll.
 */
export default function HeroSection() {
  const { theme } = useTheme();
  const reduced = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const mobiusLayerRef = useRef<HTMLDivElement>(null);
  const headWrapRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const horizonOwnedRef = useRef(false);
  const ctaRef = useMagnetic<HTMLButtonElement>();

  useScrollScrub((y) => {
    const h = sectionRef.current?.offsetHeight || window.innerHeight;
    const p = Math.min(Math.max(y / h, 0), 1);

    // (a) The Mobius lifts and dissolves as you commit to descending
    const mob = mobiusLayerRef.current;
    if (mob) {
      mob.style.transform = `translateY(${(-p * 90).toFixed(1)}px)`;
      mob.style.opacity = (1 - p).toFixed(3);
    }

    // (b) The three headline lines parallax apart at differential rates
    const masks = headWrapRef.current?.querySelectorAll<HTMLElement>('.rl-mask');
    if (masks && masks.length >= 2) {
      masks[0].style.transform = `translateY(${(-p * 36).toFixed(1)}px)`;
      masks[1].style.transform = `translateY(${(-p * 18).toFixed(1)}px)`;
    }

    // (c) The horizon opens under your scroll: 0.4 -> full bleed over
    // the first 70% of hero scroll. The entrance draw (CSS animation)
    // owns it until the visitor actually scrolls.
    const hz = horizonRef.current;
    if (hz && (horizonOwnedRef.current || y > 0)) {
      if (!horizonOwnedRef.current) {
        hz.style.animation = 'none';
        horizonOwnedRef.current = true;
      }
      const s = 0.4 + 0.6 * Math.min(p / 0.7, 1);
      hz.style.transform = `scaleX(${s.toFixed(4)})`;
    }
  });

  const scrollToIndex = () => {
    const el = document.getElementById('directory-index');
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
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
        .hero-section{padding-top:140px;padding-bottom:100px}
        .hero-inner{position:relative;z-index:2}
        .hero-mobius-layer{position:absolute;inset:0;z-index:0;opacity:1;pointer-events:none}
        .hero-bloom{position:absolute;top:50%;right:-6%;width:min(980px,64vw);aspect-ratio:1/1;transform:translateY(-50%);border-radius:50%;background:radial-gradient(circle, color-mix(in srgb, var(--color-accent-gold) 9%, transparent) 0%, transparent 62%);filter:blur(50px);pointer-events:none}
        @media (max-width: 767px) {
          .hero-bloom{width:min(115vw,560px);right:-20%;top:26%}
        }
        .hero-eyebrow{margin-bottom:36px}
        .hero-headline{max-width:68%}
        .hero-subrow{margin-top:64px;display:flex;flex-direction:row;align-items:flex-end;gap:64px}
        .hero-sub{max-width:42ch;font-size:1.0625rem}
        @media (max-width: 1023px) {
          .hero-headline{max-width:80%}
        }
        @media (max-width: 767px) {
          /* The strip owns the upper half; the words anchor the lower third */
          .hero-section{min-height:100svh;justify-content:flex-end;padding-top:96px;padding-bottom:56px}
          .hero-eyebrow{margin-bottom:20px}
          .hero-headline{max-width:100%}
          .hero-subrow{margin-top:32px;flex-direction:column;align-items:flex-start;gap:28px}
          .hero-sub{max-width:100%;font-size:0.9375rem}
        }
        @keyframes heroRise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes heroHorizonDraw{from{transform:scaleX(0)}to{transform:scaleX(0.4)}}
        .hero-eyebrow{animation:heroRise 600ms var(--ease-signature) 480ms both}
        .hero-subrow{animation:heroRise 600ms var(--ease-signature) 840ms both}
        .hero-horizon{position:absolute;bottom:0;left:0;right:0;transform-origin:center;animation:heroHorizonDraw 480ms var(--ease-signature) 960ms both}
        @media (prefers-reduced-motion: reduce) {
          .hero-horizon{animation:none}
        }
        .hero-cta{display:inline-flex;align-items:center;gap:12px;padding:16px 32px;color:var(--color-accent-gold);font-family:var(--font-sans),sans-serif;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;-webkit-tap-highlight-color:transparent}
        .hero-cta svg{transition:transform var(--duration-fast) var(--ease-signature)}
        .hero-cta:hover svg{transform:translateX(2px)}
        .hero-meta-band{position:absolute;left:0;right:0;bottom:26px;z-index:2;animation:heroRise 600ms var(--ease-signature) 1050ms both}
        .hero-meta{display:flex;justify-content:space-between;align-items:flex-end}
        .hero-cue{display:inline-flex;flex-direction:column;align-items:center;gap:10px;margin:0;background:none;border:0;padding:6px 8px;cursor:pointer;color:var(--color-text-muted);-webkit-tap-highlight-color:transparent;transition:color var(--duration-base) var(--ease-signature)}
        .hero-cue:hover{color:var(--color-accent-gold-text)}
        .hero-cue-label{font-family:var(--font-mono),monospace;font-size:10px;letter-spacing:0.24em;text-transform:uppercase}
        .hero-cue-track{position:relative;width:1px;height:40px;overflow:hidden;background:color-mix(in srgb,var(--color-accent-gold) 25%,transparent)}
        .hero-cue-dash{position:absolute;left:0;top:-14px;width:1px;height:14px;background:var(--color-accent-gold);animation:heroCueFall 2.4s cubic-bezier(0.45,0,0.55,1) infinite}
        @keyframes heroCueFall{0%{transform:translateY(0)}72%{transform:translateY(56px)}100%{transform:translateY(56px)}}
        .hero-coords{font-family:var(--font-mono),monospace;font-size:10px;letter-spacing:0.18em;color:var(--color-text-muted);padding-bottom:6px}
        @media (max-width: 767px) {
          .hero-meta-band{display:none}
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-cue-dash{animation:none;top:0;height:40px;opacity:0.6}
        }
      `}</style>

      {/* Scroll-scrubbed layer: the strip lifts 90px and dissolves.
          A soft golden bloom sits behind it — the strip is the light
          source of the page. */}
      <div ref={mobiusLayerRef} className="hero-mobius-layer" aria-hidden="true">
        <div className="hero-bloom" />
        <MobiusStrip theme={theme} />
      </div>

      <div className="rail hero-inner">
        <div className="hero-eyebrow">
          <span className="eyebrow">
            Hoboken, NJ
          </span>
        </div>

        <div ref={headWrapRef}>
          <RevealLines
            as="h1"
            trigger="mount"
            delay={570}
            stagger={90}
            className="hero-headline"
            style={{
              fontFamily: 'var(--font-serif), serif', fontWeight: 300,
              fontSize: 'var(--text-display)',
              lineHeight: 1.05, letterSpacing: '-0.02em',
              margin: 0,
            }}
            lines={[
              <span key="l1">Software</span>,
              <span key="l2" style={{
                fontStyle: 'italic', fontWeight: 400,
                background: 'linear-gradient(135deg, var(--color-accent-gold) 0%, color-mix(in srgb, var(--color-accent-gold) 65%, var(--color-fg)) 45%, var(--color-accent-gold) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>&amp; matter,</span>,
              <span key="l3" style={{ color: 'var(--color-text-secondary)' }}>one practice</span>,
            ]}
          />
        </div>

        <div className="hero-subrow">
          <p className="hero-sub" style={{
            margin: 0, lineHeight: 1.7,
            color: 'var(--color-text-secondary)', fontWeight: 400,
          }}>
            I design and build across code and matter &mdash; one studio, one continuous surface.
          </p>
          {/* The only magnetic element on the site */}
          <button ref={ctaRef} className="hero-cta glass glass-pill" onClick={scrollToIndex}>
            <span>Explore</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom meta band — the last entrance beat. A live scroll cue
          on the left rail edge, the studio coordinates on the right. */}
      <div className="hero-meta-band">
        <div className="rail hero-meta">
          <button className="hero-cue" onClick={scrollToIndex} aria-label="Scroll to the index">
            <span className="hero-cue-label">Scroll</span>
            <span className="hero-cue-track" aria-hidden="true">
              <span className="hero-cue-dash" />
            </span>
          </button>
          <span className="hero-coords" aria-hidden="true">40.7440&deg; N &middot; 74.0324&deg; W</span>
        </div>
      </div>

      {/* The Horizon — the hero's bottom edge. Deliberately full-bleed:
          the single exception to the shared .rail. Draws center-out to
          40% as beat 3 of the entrance; the scroll scene widens it to
          full bleed. Reduced motion: static, full width. */}
      <div ref={horizonRef} className="hero-horizon">
        <Horizon variant="gold" />
      </div>
    </section>
  );
}
