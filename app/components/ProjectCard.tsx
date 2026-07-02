'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionItem } from './types';

interface ProjectCardProps {
  item: SectionItem;
  accent: string;
  index: number;
  flagship?: boolean;
}

/** hex accent → theme-aware token at 40% alpha for the hover border */
function accentBorder(accent: string) {
  const token = accent === '#96B8D4' ? 'var(--color-accent-ocean)' : 'var(--color-accent-gold)';
  return `color-mix(in srgb, ${token} 40%, transparent)`;
}

/** hex accent → theme-aware, AA-safe token for any small TEXT usage (light gold fails AA at 12px, so gold text uses the -text variant) */
function accentText(accent: string) {
  return accent === '#96B8D4' ? 'var(--color-accent-ocean)' : 'var(--color-accent-gold-text)';
}

export default function ProjectCard({ item, accent, index, flagship = false }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  const metaParts = item.meta
    ? [item.meta.year, item.meta.stack ?? item.meta.material, item.meta.status].filter(Boolean)
    : [];

  const card = (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-elevated)',
        border: `1px solid ${hovered ? accentBorder(accent) : 'var(--color-border)'}`,
        padding: flagship ? 'var(--space-4)' : 'var(--space-3)',
        transition: 'border-color var(--duration-fast) var(--ease-signature)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-2)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontSize: 14,
            color: hovered ? accentText(accent) : 'var(--color-text-muted)',
            transform: hovered ? 'translateX(2px)' : 'translateX(0)',
            transition: 'transform var(--duration-fast) var(--ease-signature), color var(--duration-fast) var(--ease-signature)',
          }}
        >
          {item.url ? '↗' : '→'}
        </span>
      </div>

      <h3
        style={{
          margin: 0,
          marginBottom: 'var(--space-1)',
          fontSize: flagship ? 34 : 26,
          lineHeight: 1.15,
          color: 'var(--color-fg)',
          fontFamily: 'var(--font-sans), sans-serif',
          ...(item.logoStyle as React.CSSProperties),
        }}
      >
        {item.name}
      </h3>

      <p
        style={{
          margin: 0,
          marginBottom: 'var(--space-2)',
          fontSize: 14,
          lineHeight: 1.65,
          color: 'var(--color-text-secondary)',
          maxWidth: 'var(--prose-max)',
        }}
      >
        {item.description}
      </p>

      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: 'var(--text-label)',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: accentText(accent),
            border: '1px solid var(--color-border-mid)',
            padding: '4px 10px',
          }}
        >
          {item.tag}
        </span>

        {metaParts.length > 0 && (
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            {metaParts.join(' · ')}
          </span>
        )}
      </div>
    </article>
  );

  if (item.href) {
    return (
      <Link href={item.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        {card}
      </Link>
    );
  }

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        {card}
      </a>
    );
  }

  return card;
}
