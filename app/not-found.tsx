'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#060606', color: '#F0EDE8',
      fontFamily: "'Syne', sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 80, fontWeight: 300, marginBottom: 8,
          color: '#D4B896',
        }}>404</h1>
        <p style={{ fontSize: 15, color: '#555', marginBottom: 32 }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" style={{
          padding: '14px 32px', borderRadius: 60,
          border: '1px solid rgba(212,184,150,0.3)', background: 'rgba(212,184,150,0.06)',
          color: '#D4B896', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          textDecoration: 'none', display: 'inline-block',
          fontFamily: "'Syne', sans-serif",
        }}>Return Home</Link>
      </div>
    </div>
  );
}
