'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Horizon from './components/Horizon';

/**
 * Error joins the brand — eyebrow, light Cormorant headline, gold
 * horizon, glass-pill retry. Minimal client component, CSS only;
 * must render mid-crash. No reveals beyond the template entrance.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'clamp(120px, 18vh, 200px)',
        paddingBottom: 'var(--space-6)',
      }}
    >
      <div className="rail" style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Error</div>

        <h1
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 'var(--text-title)',
            fontWeight: 300,
            lineHeight: 1.1,
            margin: '0 0 var(--space-3)',
            color: 'var(--color-fg)',
          }}
        >
          Something went wrong
        </h1>

        <Horizon variant="gold" style={{ maxWidth: 480, margin: '0 auto var(--space-3)' }} />

        <p
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: '1.0625rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            margin: '0 auto var(--space-4)',
            maxWidth: '40ch',
          }}
        >
          This page hit an error while loading. Try again, or head back to the start.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={reset}
            className="glass glass-pill"
            style={{
              padding: '12px 28px',
              color: 'var(--color-fg)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            <span>Try again</span>
          </button>
          <Link href="/" className="link-action" style={{ color: 'var(--color-text-muted)' }}>
            <span className="arrow" data-dir="back" aria-hidden="true">←</span> Back home
          </Link>
        </div>

        {error.digest && (
          <p
            style={{
              margin: 'var(--space-3) 0 0',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            ref {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
