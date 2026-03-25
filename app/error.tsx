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
      minHeight: '100vh', background: '#060606', color: '#F0EDE8',
      fontFamily: "'Syne', sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 48, fontWeight: 300, marginBottom: 16,
        }}>Something went wrong</h1>
        <p style={{ fontSize: 15, color: '#555', marginBottom: 32 }}>
          We&apos;re sorry, but there was an error loading this page.
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              padding: '12px 28px', borderRadius: 60,
              border: '1px solid rgba(212,184,150,0.3)', background: 'rgba(212,184,150,0.06)',
              color: '#D4B896', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: "'Syne', sans-serif",
            }}
          >Try again</button>
          <Link href="/" style={{
            padding: '12px 28px', borderRadius: 60,
            border: '1px solid rgba(255,255,255,0.06)', background: 'transparent',
            color: '#777', fontSize: 13, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            textDecoration: 'none', display: 'inline-block',
          }}>Return Home</Link>
        </div>
      </div>
    </div>
  );
}
