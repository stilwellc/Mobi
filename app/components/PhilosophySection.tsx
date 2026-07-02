'use client';

import Link from 'next/link';
import Horizon from './Horizon';
import Reveal from './Reveal';
import RevealLines from './RevealLines';

const PRINCIPLES = [
  {
    num: '01',
    title: 'One practice',
    desc: 'I ship TypeScript in the morning and sand a print in the evening. Same eye, same standards, different material.',
  },
  {
    num: '02',
    title: 'Deliberate',
    desc: 'Nothing here happened by default. A type scale, a tolerance, an easing curve — each one is a decision I can defend.',
  },
  {
    num: '03',
    title: 'Continuous',
    desc: 'The disciplines feed each other. Security work hardens my software; building a house changed how I structure code.',
  },
];

export default function PhilosophySection() {
  return (
    <section
      aria-label="Philosophy"
      className="philo-section rail"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <style>{`
        .philo-section{padding-bottom:160px}
        .philo-horizon{margin-bottom:104px}
        .philo-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px}
        .philo-h2{font-family:var(--font-serif),serif;font-size:60px;font-weight:300;letter-spacing:-0.02em;line-height:1.05;margin:0 0 36px}
        .philo-lede{font-size:16px}
        .philo-card{padding:28px}
        .philo-card-title{font-size:18px}
        .philo-card-desc{font-size:14px}
        /* Arm guard — see HeroSection: staggered .rl-line delays must not
           hold a pending transition through the armed state. */
        .philo-h2:not(.rl-revealed) .rl-line{transition:none}
        @media (max-width: 1023px) {
          .philo-h2{font-size:48px}
        }
        @media (max-width: 767px) {
          .philo-section{padding-bottom:80px}
          .philo-horizon{margin-bottom:64px}
          .philo-grid{grid-template-columns:1fr;gap:40px}
          .philo-h2{font-size:36px;margin:0 0 24px}
          .philo-lede{font-size:14px}
          .philo-card{padding:20px}
          .philo-card-title{font-size:16px}
          .philo-card-desc{font-size:13px}
        }
      `}</style>

      <div className="philo-horizon">
        <Horizon variant="gold" />
      </div>

      <div className="philo-grid">
        <div>
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
              lineHeight: 1.65,
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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} role="list" aria-label="Design principles">
          {PRINCIPLES.map((p, pi) => (
            <div key={p.num} role="listitem">
              <Reveal delay={pi * 90}>
                <div className="philo-card glass">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: 'var(--color-accent-gold)' }} aria-hidden="true">{p.num}</span>
                    <span className="philo-card-title" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>{p.title}</span>
                  </div>
                  <p className="philo-card-desc" style={{ color: 'var(--color-text-muted)', fontWeight: 400, lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
