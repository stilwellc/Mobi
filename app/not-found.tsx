import Link from 'next/link';
import Horizon from './components/Horizon';

export const metadata = { title: '404 — co.stil' };

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(120px, 18vh, 200px) clamp(20px, 5vw, 56px) var(--space-6)',
    }}>
      <style>{`
        .nf-home { display: inline-flex; align-items: center; gap: 10px; color: var(--color-fg); font-family: var(--font-mono), monospace; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none; border-bottom: 1px solid var(--color-accent-gold); padding-bottom: 2px; }
        .nf-home .nf-arrow { display: inline-block; transition: transform var(--duration-fast) var(--ease-signature); }
        .nf-home:hover .nf-arrow { transform: translateX(-2px); }
        @media (prefers-reduced-motion: reduce) { .nf-home .nf-arrow { transition: none; } .nf-home:hover .nf-arrow { transform: none; } }
      `}</style>

      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          fontFamily: 'var(--font-mono), monospace', fontSize: 12,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)',
        }}>Page not found</div>

        <h1 style={{
          fontFamily: 'var(--font-serif), serif',
          fontSize: 'var(--text-display)', fontWeight: 300,
          letterSpacing: '-0.02em', lineHeight: 1.05,
          margin: '0 0 var(--space-3)',
        }}>
          4<span style={{ color: 'var(--color-accent-gold)', fontStyle: 'italic' }}>0</span>4
        </h1>

        <Horizon variant="gold" style={{ marginBottom: 'var(--space-3)' }} />

        <p style={{
          fontFamily: 'var(--font-sans), sans-serif', fontSize: '1.0625rem',
          lineHeight: 1.65, color: 'var(--color-text-secondary)',
          margin: '0 auto var(--space-4)', maxWidth: '40ch',
        }}>
          This page doesn&apos;t exist. The strip keeps turning — head back to the start.
        </p>

        <Link href="/" className="nf-home">
          <span className="nf-arrow" aria-hidden="true">←</span> Back home
        </Link>
      </div>
    </div>
  );
}
