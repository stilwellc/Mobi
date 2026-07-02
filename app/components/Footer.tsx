import React from 'react';
import Link from 'next/link';
import Horizon from './Horizon';

const colTitle: React.CSSProperties = {
  fontFamily: 'var(--font-sans), sans-serif',
  fontSize: 'var(--text-label)',
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--color-text-muted)',
  marginBottom: 'var(--space-2)',
};

const actionStyle: React.CSSProperties = {
  color: 'var(--color-text-secondary)',
};

const arrowStyle: React.CSSProperties = {
  marginLeft: 8,
  color: 'var(--color-text-muted)',
};

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

export default function Footer() {
  return (
    <footer role="contentinfo" style={{ marginTop: 'var(--space-6)' }}>
      <div
        className="rail"
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 'var(--space-5)',
          paddingBottom: 'var(--space-4)',
        }}
      >
        {/* Ghost wordmark — behind the columns, never above 4% */}
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

        {/* The email — the largest type on the page, its own row */}
        <div style={{ position: 'relative', marginBottom: 'var(--space-5)' }}>
          <div style={colTitle}>Say hello</div>
          <a
            href="mailto:cstilwell117@gmail.com"
            className="footer-email link-draw"
            style={{
              fontFamily: 'var(--font-serif), serif',
              fontWeight: 300,
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              color: 'var(--color-fg)',
            }}
          >
            cstilwell117@gmail.com
          </a>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          <nav aria-label="Footer">
            <div style={colTitle}>Navigate</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', alignItems: 'flex-start' }}>
              {navigateLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="footer-link link-action"
                  style={actionStyle}
                >
                  {link.label}
                  <span className="arrow" aria-hidden="true" style={arrowStyle}>
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Elsewhere">
            <div style={colTitle}>Elsewhere</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', alignItems: 'flex-start' }}>
              {elsewhereLinks.map(link => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link link-action"
                  style={actionStyle}
                >
                  {link.label}
                  <span className="arrow" aria-hidden="true" style={arrowStyle}>
                    &#8599;
                  </span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* The sunset closes every page — draws in center-out on arrival */}
      <Horizon variant="sunset" draw />

      <div className="rail" style={{ paddingBlock: 'var(--space-3)' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 'var(--space-2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.02em',
            }}
          >
            &copy; {new Date().getFullYear()} co.stil &mdash; the studio of Collin Stilwell
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              color: 'var(--color-text-faint)',
              letterSpacing: '0.02em',
            }}
          >
            Set in Cormorant Garamond, Syne &amp; Space Mono
          </span>
        </div>
      </div>
    </footer>
  );
}
