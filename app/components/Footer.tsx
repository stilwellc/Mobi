'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Horizon from './Horizon';

/**
 * The footer — after the sun sets, the studio is still on.
 *
 * The sunset horizon is the footer's TOP boundary: on home, the
 * thread's coral sun sets onto this exact line; on interior pages
 * it is the page's closing rule. Below it the room runs one shade
 * darker — dusk into night.
 *
 * Functionally engineered:
 * - a live Hoboken clock (SSR-safe: server renders a fixed-width
 *   placeholder, the interval starts on mount, cleans up on unmount)
 * - copy-email control with clipboard API + visible confirmation
 *   (aria-live announced, keyboard accessible, 2s reset)
 * - back-to-top that returns you along the thread (respects
 *   prefers-reduced-motion)
 * - the proprietor coordinates in the record line, because the
 *   studio has a place in the world
 */

const EMAIL = 'cstilwell117@gmail.com';

const navigateLinks = [
  { label: 'Software', href: '/software' },
  { label: 'Physical', href: '/physical' },
  { label: 'Professional', href: '/professional' },
  { label: 'About', href: '/about' },
];

const elsewhereLinks = [
  { label: 'Substack', url: 'https://collinsthoughts.substack.com' },
  { label: 'GitHub', url: 'https://github.com/stilwellc' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/collin-stilwell/' },
];

function HobokenClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span
      suppressHydrationWarning
      style={{
        fontFamily: 'var(--font-mono), monospace',
        fontVariantNumeric: 'tabular-nums',
        display: 'inline-block',
        minWidth: '8ch',
      }}
    >
      {time ?? '--:--:--'}
    </span>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Clipboard API unavailable — fall back to a transient selection
      const ta = document.createElement('textarea');
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="glass glass-pill glass-quiet ftr-copy"
      aria-label="Copy email address"
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        {copied ? (
          <path d="M2 6.5L5 9.5L10 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M4 4V2.5H10V8.5H8.5M2 4H8V10H2V4Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

export default function Footer() {
  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <footer role="contentinfo" style={{ marginTop: 'var(--space-6)' }}>
      <style>{`
        .ftr-room{position:relative;overflow:hidden;background:linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-bg) 60%, black) 140%)}
        [data-theme=light] .ftr-room{background:linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-accent-gold) 7%, transparent) 140%)}
        .ftr-eyebrow{font-family:var(--font-sans),sans-serif;font-size:var(--text-label);font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--color-text-muted);margin-bottom:var(--space-2)}
        .ftr-hello{display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap;margin-bottom:var(--space-5)}
        .ftr-email{font-family:var(--font-serif),serif;font-weight:300;font-size:clamp(1.75rem,4vw,3rem);line-height:1.1;letter-spacing:-0.01em;color:var(--color-fg)}
        .ftr-copy{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--color-text-secondary);cursor:pointer;flex-shrink:0}
        .ftr-grid{position:relative;display:grid;grid-template-columns:repeat(3,minmax(160px,1fr)) auto;gap:var(--space-4);align-items:start}
        .ftr-links{display:flex;flex-direction:column;gap:var(--space-1);align-items:flex-start}
        .ftr-fact{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.06em;color:var(--color-text-secondary);line-height:2}
        .ftr-top{display:inline-flex;flex-direction:column;align-items:center;gap:8px;justify-self:end;padding:14px 12px;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.14em;color:var(--color-text-secondary);cursor:pointer;border-radius:100px}
        .ftr-top .ftr-top-arrow{display:inline-block;transition:transform var(--duration-fast) var(--ease-signature)}
        .ftr-top:hover .ftr-top-arrow{transform:translateY(-3px)}
        .ftr-record{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:var(--space-2)}
        .ftr-record span{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.02em}
        @media (max-width: 900px){
          .ftr-grid{grid-template-columns:repeat(2,minmax(140px,1fr));gap:var(--space-3)}
          .ftr-top{justify-self:start;flex-direction:row}
        }
        @media (max-width: 480px){
          .ftr-hello{gap:var(--space-2)}
          .ftr-record{flex-direction:column;gap:6px}
        }
      `}</style>

      {/* The horizon is the footer's top boundary — on home the thread's
          sun sets onto this line; everywhere it is the closing rule. */}
      <Horizon variant="sunset" draw />

      <div className="ftr-room">
        <div
          className="rail"
          style={{ position: 'relative', paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-4)' }}
        >
          {/* Ghost wordmark — behind everything, never above 4% */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: 0,
              bottom: '-0.08em',
              fontFamily: 'var(--font-serif), serif',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 0.8,
              fontSize: 'clamp(6rem, 16vw, 13rem)',
              letterSpacing: '-0.04em',
              color: 'var(--color-fg)',
              opacity: 0.03,
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            co.stil
          </span>

          {/* The action: write, or take the address with you */}
          <div style={{ position: 'relative' }}>
            <div className="ftr-eyebrow">Say hello</div>
            <div className="ftr-hello">
              <a href={`mailto:${EMAIL}`} className="ftr-email link-draw">
                {EMAIL}
              </a>
              <CopyEmail />
            </div>
          </div>

          <div className="ftr-grid">
            <nav aria-label="Footer">
              <div className="ftr-eyebrow">Navigate</div>
              <div className="ftr-links">
                {navigateLinks.map(link => (
                  <Link key={link.href} href={link.href} className="footer-link link-action" style={{ color: 'var(--color-text-secondary)' }}>
                    {link.label}
                    <span className="arrow" aria-hidden="true" style={{ marginLeft: 8, color: 'var(--color-text-muted)' }}>&rarr;</span>
                  </Link>
                ))}
              </div>
            </nav>

            <nav aria-label="Elsewhere">
              <div className="ftr-eyebrow">Elsewhere</div>
              <div className="ftr-links">
                {elsewhereLinks.map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="footer-link link-action" style={{ color: 'var(--color-text-secondary)' }}>
                    {link.label}
                    <span className="arrow" aria-hidden="true" style={{ marginLeft: 8, color: 'var(--color-text-muted)' }}>&#8599;</span>
                  </a>
                ))}
              </div>
            </nav>

            <div>
              <div className="ftr-eyebrow">Studio</div>
              <div className="ftr-fact">
                Hoboken, NJ
                <br />
                <HobokenClock /> local
                <br />
                Est. 2024
              </div>
            </div>

            <button type="button" className="ftr-top" onClick={toTop} aria-label="Back to top">
              <span className="ftr-top-arrow" aria-hidden="true">&uarr;</span>
              <span>Top</span>
            </button>
          </div>
        </div>

        <div className="rail" style={{ paddingBottom: 'var(--space-3)' }}>
          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: 'var(--space-2)',
            }}
          >
            <div className="ftr-record">
              <span style={{ color: 'var(--color-text-muted)' }}>
                &copy; {new Date().getFullYear()} co.stil &mdash; the studio of{' '}
                <span style={{ whiteSpace: 'nowrap' }}>Collin Stilwell</span>
              </span>
              <span style={{ color: 'var(--color-text-faint)' }}>
                40.7440&deg; N, 74.0324&deg; W
              </span>
              <span style={{ color: 'var(--color-text-faint)' }}>
                Set in Cormorant Garamond, Syne &amp; Space Mono
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
