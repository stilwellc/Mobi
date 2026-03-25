'use client';

import Link from 'next/link';

export default function Gallery() {
  return (
    <div style={{ minHeight: '100vh', background: '#060606', color: '#F0EDE8', fontFamily: "'Syne', sans-serif" }}>
      <nav style={{
        padding: '24px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(6,6,6,0.85)', backdropFilter: 'blur(30px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#F0EDE8', fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em' }}>
          mobi<span style={{ color: '#D4B896' }}>.</span>
        </Link>
        <Link href="/physical/1122" style={{
          textDecoration: 'none', fontSize: 12, color: '#444', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          &#8592; Back to Project 1122
        </Link>
      </nav>

      <section style={{ padding: '80px 56px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 60, fontWeight: 300, letterSpacing: '-0.03em', marginBottom: 24,
        }}>
          Gallery
        </h1>
        <p style={{ fontSize: 16, color: '#555', fontWeight: 400 }}>Coming Soon</p>
      </section>
    </div>
  );
}
