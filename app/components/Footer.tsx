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

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans), sans-serif',
  fontSize: 14,
  color: 'var(--color-text-secondary)',
  textDecoration: 'none',
  transition: 'color var(--duration-fast) var(--ease-signature)',
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
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: 'var(--space-5) var(--space-3) var(--space-4)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-5)',
          }}
        >
          <div>
            <div style={colTitle}>Say hello</div>
            <a
              href="mailto:cstilwell117@gmail.com"
              className="footer-email"
              style={{
                fontFamily: 'var(--font-serif), serif',
                fontWeight: 400,
                fontSize: 22,
                letterSpacing: '-0.01em',
                color: 'var(--color-fg)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--color-border-mid)',
                paddingBottom: 2,
                transition: 'border-color var(--duration-fast) var(--ease-signature)',
              }}
            >
              cstilwell117@gmail.com
            </a>
          </div>

          <nav aria-label="Footer">
            <div style={colTitle}>Navigate</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {navigateLinks.map(link => (
                <Link key={link.href} href={link.href} className="footer-link" style={linkStyle}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Elsewhere">
            <div style={colTitle}>Elsewhere</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {elsewhereLinks.map(link => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                  style={linkStyle}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <Horizon variant="sunset" />

      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: 'var(--space-3)',
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
      </div>
    </footer>
  );
}
