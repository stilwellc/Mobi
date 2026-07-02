'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Reveal from './Reveal';
import { SectionItem } from './types';

interface ProjectCardProps {
  item: SectionItem;
  accent: string;
  index: number;
  flagship?: boolean;
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

  // Glass lives on the link wrapper when the card is a link (so the whole
  // touchable object shimmers); on the article itself otherwise.
  const wrapped = Boolean(item.href || item.url);

  const card = (
    <article
      className={wrapped ? undefined : 'glass'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: flagship ? 'var(--space-4)' : 'var(--space-3)',
      }}
    >
      {item.image && (
        /* Editorial unveil on the plate; the hover scale rides a
           separate layer so it never fights the unveil transform
           (.unveil img owns the img transform). Height chain
           (.pc-media div) lives in Index.tsx CSS. */
        <Reveal
          variant="unveil"
          className="pc-media"
          style={{
            aspectRatio: '16 / 10',
            borderRadius: 10,
            overflow: 'hidden',
            marginBottom: 'var(--space-2)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            className="pc-hover"
            style={{
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
              filter: hovered ? 'brightness(1.05)' : 'brightness(1)',
              transition: 'transform var(--duration-slow) var(--ease-signature), filter var(--duration-slow) var(--ease-signature)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.imageAlt ?? ''}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
                display: 'block',
              }}
            />
          </div>
        </Reveal>
      )}
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
      <Link href={item.href} className="glass" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
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
        className="glass"
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        {card}
      </a>
    );
  }

  return card;
}
