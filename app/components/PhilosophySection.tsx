'use client';

import Link from 'next/link';
import Horizon from './Horizon';
import { useWindowSize, useScrollReveal } from './hooks';

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
  const w = useWindowSize();
  const mobile = w < 768;
  const tablet = w < 1024;
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section
      ref={ref}
      aria-label="Philosophy"
      style={{
        padding: mobile ? '0 24px 80px' : '0 56px 160px',
        position: 'relative', zIndex: 1,
      }}
    >
      <style>{`
        .about-link{display:inline-flex;align-items:center;gap:10px;color:var(--color-accent-gold);font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;transition:color var(--duration-base) var(--ease-signature)}
        .about-link .about-link-arrow{display:inline-block;transition:transform var(--duration-fast) var(--ease-signature)}
        .about-link:hover .about-link-arrow{transform:translateX(2px)}
      `}</style>

      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <Horizon variant="gold" style={{ marginBottom: mobile ? 64 : 104 }} />

        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 40 : 80 }}>
          <div style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity var(--duration-slow) var(--ease-signature), transform var(--duration-slow) var(--ease-signature)',
          }}>
            <div style={{
              fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--color-text-faint)',
              marginBottom: 16,
            }}>Philosophy</div>
            <h2 style={{
              fontFamily: 'var(--font-serif), serif',
              fontSize: mobile ? 36 : tablet ? 48 : 60,
              fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.05,
              margin: `0 0 ${mobile ? 24 : 36}px`,
            }}>
              One side.<br />
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--color-accent-gold)' }}>One boundary.</span>
            </h2>
            <p style={{
              fontSize: mobile ? 14 : 16, lineHeight: 1.65,
              color: 'var(--color-text-secondary)', fontWeight: 400,
              maxWidth: 'var(--prose-max)', margin: '0 0 32px',
            }}>
              The M&ouml;bius strip has one side and one boundary &mdash; you can trace the entire
              surface without ever lifting your finger. That is how I work: software and matter
              are not two departments, they are one surface I keep traveling.
            </p>
            <Link href="/about" className="about-link">
              About the studio <span className="about-link-arrow" aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} role="list" aria-label="Design principles">
            {PRINCIPLES.map((p, pi) => (
              <div key={p.num} role="listitem" style={{
                padding: mobile ? 20 : 28, borderRadius: 16,
                background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity var(--duration-slow) var(--ease-signature) ${0.1 + pi * 0.1}s, transform var(--duration-slow) var(--ease-signature) ${0.1 + pi * 0.1}s`,
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: 'var(--color-accent-gold)' }} aria-hidden="true">{p.num}</span>
                  <span style={{ fontSize: mobile ? 16 : 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{p.title}</span>
                </div>
                <p style={{ fontSize: mobile ? 13 : 14, color: 'var(--color-text-muted)', fontWeight: 400, lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
