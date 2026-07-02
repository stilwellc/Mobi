'use client';

import Link from 'next/link';
import Horizon from './Horizon';
import Reveal from './Reveal';
import RevealLines from './RevealLines';
import { MOBIUS_EDGE } from './Logo';

/**
 * The manifesto band — the last station on the continuous thread.
 * Rendered INSIDE the thread (see Index.tsx): it hangs on the spine
 * with its own node, ignites like the work stations, and hands the
 * line to the coral-sun terminus directly below. Shared thread
 * classes (tc-sec, tc-branch, tc-node, tc-litwatch, tc-eyebrow,
 * tc-go, tc-arrow) are defined in the Index style block; only the
 * philosophy-specific rules live here.
 */
export default function PhilosophySection() {
  return (
    <section
      className="tc-sec tc-philo"
      data-zone="close"
      data-accent="gold"
      aria-label="Philosophy"
    >
      <style>{`
        .tc-philo{margin-bottom:0}
        .tc-philobody{position:relative;overflow:hidden;padding:var(--space-4) 0 var(--space-6) var(--tc-g)}
        .tc-philo-h2{font-family:var(--font-serif),serif;font-size:clamp(2.5rem,5.5vw,4.5rem);font-weight:300;letter-spacing:-0.02em;line-height:1.08;margin:var(--space-2) 0 var(--space-4);max-width:18ch}
        .tc-philo-h2:not(.rl-revealed) .rl-line{transition:none}
        .tc-philo-lede{margin:0 0 var(--space-4);max-width:var(--prose-max);font-size:16px;line-height:1.7;color:var(--color-text-secondary)}
        .tc-shape{position:absolute;right:-14%;top:36%;width:min(52vw,600px);aspect-ratio:1/1;opacity:0.05;pointer-events:none;animation:tcTurn 140s linear infinite}
        @keyframes tcTurn{to{transform:rotate(360deg)}}
        @media (max-width: 767px){
          .tc-philobody{padding:var(--space-3) 0 var(--space-5) var(--tc-g)}
          .tc-philo-lede{font-size:14px}
          .tc-shape{width:78vw;right:-30%;top:50%}
        }
        @media (prefers-reduced-motion: reduce){
          .tc-shape{animation:none}
        }
      `}</style>

      <div className="tc-litwatch" data-lit="false">
        <div className="tc-branch">
          <span className="tc-node" aria-hidden="true" />
          <Horizon variant="gold" draw origin="left" />
        </div>
        <div className="tc-philobody">
          <svg className="tc-shape" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <path d={MOBIUS_EDGE} stroke="var(--color-fg)" strokeWidth="0.8" />
          </svg>
          <Reveal>
            <span className="tc-eyebrow">Philosophy</span>
          </Reveal>
          <RevealLines
            as="h2"
            className="tc-philo-h2"
            lines={[
              <span key="l1">One side.</span>,
              <span
                key="l2"
                style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--color-accent-gold-text)' }}
              >
                One boundary.
              </span>,
            ]}
          />
          <Reveal delay={90}>
            <p className="tc-philo-lede">
              The M&ouml;bius strip has one side and one boundary &mdash; you can trace the
              entire surface without ever lifting your finger. That is how I work: software
              and matter are not two departments, they are one surface I keep traveling.
            </p>
            <Link href="/about" className="tc-go" style={{ color: 'var(--color-accent-gold-text)' }}>
              About the studio <span className="tc-arrow" aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
