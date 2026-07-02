'use client';

import Link from 'next/link';
import Horizon from './Horizon';
import Reveal from './Reveal';
import RevealLines from './RevealLines';
import { MOBIUS_EDGE } from './Logo';

/**
 * The manifesto band — one statement, no cards. The Möbius thesis
 * gets the full width and display scale; the only action is the
 * about link. Horizon opens it, the footer's sunset closes the page.
 */
export default function PhilosophySection() {
  return (
    <section
      aria-label="Philosophy"
      className="philo-section rail"
      data-zone="close"
      style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}
    >
      <style>{`
        .philo-section{padding-bottom:160px}
        .philo-horizon{margin-bottom:104px}
        .philo-h2{font-family:var(--font-serif),serif;font-size:clamp(2.5rem,5.5vw,4.75rem);font-weight:300;letter-spacing:-0.02em;line-height:1.08;margin:0 0 40px;max-width:18ch}
        .philo-lede{font-size:17px}
        /* The mark as architecture — the boundary curve, monumental and
           barely there, turning once every two minutes. */
        .philo-shape{position:absolute;right:-14%;top:44%;width:min(56vw,640px);aspect-ratio:1/1;opacity:0.05;pointer-events:none;animation:philoTurn 140s linear infinite}
        @keyframes philoTurn{to{transform:rotate(360deg)}}
        /* Arm guard — see HeroSection: staggered .rl-line delays must not
           hold a pending transition through the armed state. */
        .philo-h2:not(.rl-revealed) .rl-line{transition:none}
        @media (max-width: 767px) {
          .philo-section{padding-bottom:80px}
          .philo-horizon{margin-bottom:64px}
          .philo-h2{margin:0 0 24px}
          .philo-lede{font-size:14px}
          .philo-shape{width:80vw;right:-30%;top:52%}
        }
        @media (prefers-reduced-motion: reduce){
          .philo-shape{animation:none}
        }
      `}</style>

      <svg className="philo-shape" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <path d={MOBIUS_EDGE} stroke="var(--color-fg)" strokeWidth="0.8" />
      </svg>

      <div className="philo-horizon">
        <Horizon variant="gold" />
      </div>

      <Reveal>
        <div className="eyebrow" style={{ marginBottom: 16 }}>Philosophy</div>
      </Reveal>
      <RevealLines
        as="h2"
        className="philo-h2"
        lines={[
          <span key="l1">One side.</span>,
          <span key="l2" style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--color-accent-gold)' }}>One boundary.</span>,
        ]}
      />
      <Reveal delay={90}>
        <p className="philo-lede" style={{
          lineHeight: 1.7,
          color: 'var(--color-text-secondary)', fontWeight: 400,
          maxWidth: 'var(--prose-max)', margin: '0 0 32px',
        }}>
          The M&ouml;bius strip has one side and one boundary &mdash; you can trace the entire
          surface without ever lifting your finger. That is how I work: software and matter
          are not two departments, they are one surface I keep traveling.
        </p>
        <Link href="/about" className="link-action" style={{ color: 'var(--color-accent-gold-text)' }}>
          About the studio <span className="arrow" aria-hidden="true">&rarr;</span>
        </Link>
      </Reveal>
    </section>
  );
}
