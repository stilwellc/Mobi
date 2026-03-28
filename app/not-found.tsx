'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-fg)',
      fontFamily: "'Syne', sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes floatSlow{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(15px,-20px) scale(1.02)}66%{transform:translate(-10px,10px) scale(0.98)}}
        .nf-cta{display:inline-flex;align-items:center;gap:10px;padding:14px 32px;border-radius:60px;border:1px solid rgba(212,184,150,0.3);background:rgba(212,184,150,0.06);color:var(--color-accent-gold);font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;font-family:'Syne',sans-serif;transition:all 0.4s cubic-bezier(0.23,1,0.32,1)}
        .nf-cta:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(212,184,150,0.15);background:rgba(212,184,150,0.1);border-color:rgba(212,184,150,0.5)}
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,184,150,0.05) 0%, transparent 60%)',
          top: '15%', right: '10%', animation: 'floatSlow 20s ease-in-out infinite', filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(150,184,212,0.04) 0%, transparent 60%)',
          bottom: '20%', left: '5%', animation: 'floatSlow 25s ease-in-out infinite reverse', filter: 'blur(60px)',
        }} />
      </div>

      {/* Decorative SVG */}
      <div style={{
        position: 'absolute', opacity: loaded ? 0.4 : 0,
        transition: 'opacity 1.2s ease 0.5s',
        pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 400 400" fill="none" style={{ width: 400, height: 400 }}>
          <circle cx="200" cy="200" r="120" stroke="var(--color-accent-gold)" strokeWidth="0.4" opacity="0.12" />
          <circle cx="200" cy="200" r="80" stroke="var(--color-accent-gold)" strokeWidth="0.3" opacity="0.08" />
          <circle cx="200" cy="200" r="40" stroke="var(--color-accent-gold)" strokeWidth="0.2" opacity="0.06" />
          <line x1="80" y1="200" x2="320" y2="200" stroke="var(--color-accent-gold)" strokeWidth="0.2" opacity="0.06" />
          <line x1="200" y1="80" x2="200" y2="320" stroke="var(--color-accent-gold)" strokeWidth="0.2" opacity="0.06" />
        </svg>
      </div>

      <div style={{
        textAlign: 'center', position: 'relative', zIndex: 1,
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
      }}>
        {/* Label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
          marginBottom: 24,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease 0.2s',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--color-accent-gold)', opacity: 0.6,
            boxShadow: '0 0 12px rgba(212,184,150,0.3)',
          }} />
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--color-accent-gold)', fontWeight: 700, opacity: 0.7,
          }}>Page Not Found</span>
        </div>

        {/* 404 */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 140, fontWeight: 300, letterSpacing: '-0.04em',
          lineHeight: 0.85, marginBottom: 16,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.1s',
        }}>
          4<span style={{ color: 'var(--color-accent-gold)', fontStyle: 'italic' }}>0</span>4
        </h1>

        {/* Description */}
        <p style={{
          fontSize: 16, color: 'var(--color-text-muted)', fontWeight: 400,
          lineHeight: 1.7, maxWidth: 380, margin: '0 auto 40px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s',
        }}>
          This page doesn&apos;t exist yet. It might in the future — the Möbius strip never stops turning.
        </p>

        {/* CTA */}
        <div style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease 0.4s',
        }}>
          <Link href="/" className="nf-cta">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
