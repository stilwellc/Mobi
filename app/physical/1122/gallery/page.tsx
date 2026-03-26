'use client';

import Link from 'next/link';
import ThemeToggle from '../../../components/ThemeToggle';

export default function Gallery() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-fg)', fontFamily: "'Syne', sans-serif" }}>
      <nav style={{
        padding: '24px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-nav-bg)', backdropFilter: 'blur(30px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--color-fg)', fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em' }}>
          mobi<span style={{ color: 'var(--color-accent-gold)' }}>.</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ThemeToggle />
          <Link href="/physical/1122" style={{
            textDecoration: 'none', fontSize: 12, color: 'var(--color-text-subtle)', fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            &#8592; Back to Project 1122
          </Link>
        </div>
      </nav>

      <section style={{ padding: '80px 56px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 60, fontWeight: 300, letterSpacing: '-0.03em', marginBottom: 24,
        }}>
          Gallery
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-text-muted)', fontWeight: 400 }}>Coming Soon</p>
      </section>
    </div>
  );
}
