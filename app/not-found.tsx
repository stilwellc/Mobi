import Link from 'next/link';
import RevealLines from './components/RevealLines';
import { horizonGradients } from './components/Horizon';

export const metadata = { title: '404 — co.stil' };

/**
 * The zero becomes the sun — a monument-scale gold horizon runs
 * behind the numerals at their optical midline; the italic gold 0
 * sits on it. Horizon draws (routeDraw, center-out), numerals rise
 * through the RevealLines mask. Centered, empty, no ghost numerals.
 */
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'clamp(120px, 18vh, 200px)',
        paddingBottom: 'var(--space-6)',
      }}
    >
      <style>{`
        .nf-horizon {
          position: absolute; left: 0; right: 0; top: 58%;
          height: 1px; opacity: 0.35; transform-origin: center;
          animation: routeDraw 480ms var(--ease-signature) both;
        }
      `}</style>

      <div className="rail" style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div
            className="nf-horizon"
            aria-hidden="true"
            style={{ background: horizonGradients.gold }}
          />
          <RevealLines
            as="h1"
            trigger="mount"
            delay={200}
            lines={[
              <span key="n">
                4<span style={{ color: 'var(--color-accent-gold)', fontStyle: 'italic' }}>0</span>4
              </span>,
            ]}
            style={{
              position: 'relative',
              margin: 0,
              fontFamily: 'var(--font-serif), serif',
              fontSize: 'clamp(6rem, 18vw, 11rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: 'var(--color-fg)',
            }}
          />
        </div>

        <p
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: '1.0625rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            margin: 'var(--space-3) auto var(--space-4)',
            maxWidth: '40ch',
          }}
        >
          This page doesn&rsquo;t exist.
        </p>

        <Link href="/" className="link-action" style={{ color: 'var(--color-fg)' }}>
          <span className="arrow" data-dir="back" aria-hidden="true">←</span> Back home
        </Link>
      </div>
    </div>
  );
}
