'use client';

import { useEffect } from 'react';
import Link from 'next/link';

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
    <div style={{
      minHeight: '70vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(120px, 18vh, 200px) clamp(20px, 5vw, 56px) var(--space-6)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          fontFamily: 'var(--font-mono), monospace', fontSize: 12,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)',
        }}>Error</div>

        <h1 style={{
          fontFamily: 'var(--font-serif), serif',
          fontSize: 'var(--text-title)', fontWeight: 300,
          lineHeight: 1.1, margin: '0 0 var(--space-2)',
        }}>Something went wrong</h1>

        <p style={{
          fontFamily: 'var(--font-sans), sans-serif', fontSize: '1.0625rem',
          lineHeight: 1.65, color: 'var(--color-text-secondary)',
          margin: '0 auto var(--space-4)', maxWidth: '40ch',
        }}>
          This page hit an error while loading. Try again, or head back to the start.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={reset}
            className="glass glass-pill"
            style={{
              padding: '12px 28px',
              color: 'var(--color-fg)',
              fontFamily: 'var(--font-mono), monospace', fontSize: 12,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          ><span>Try again</span></button>
          <Link href="/" style={{
            fontFamily: 'var(--font-mono), monospace', fontSize: 12,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--color-text-muted)', textDecoration: 'none',
          }}>Back home</Link>
        </div>
      </div>
    </div>
  );
}
