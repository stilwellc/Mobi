'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-fg)',
      fontFamily: "'Syne', sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 80, fontWeight: 300, marginBottom: 8,
          color: 'var(--color-accent-gold)',
        }}>404</h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-muted)', marginBottom: 32 }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" style={{
          padding: '14px 32px', borderRadius: 60,
          border: '1px solid rgba(212,184,150,0.3)', background: 'rgba(212,184,150,0.06)',
          color: 'var(--color-accent-gold)', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          textDecoration: 'none', display: 'inline-block',
          fontFamily: "'Syne', sans-serif",
        }}>Return Home</Link>
      </div>
    </div>
  );
}
