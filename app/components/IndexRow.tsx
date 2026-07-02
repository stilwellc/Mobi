import React from 'react';
import Link from 'next/link';
import Reveal from './motion/Reveal';

export type IndexRowProps = {
  index: string;                  // '01'
  title: React.ReactNode;
  description?: string;
  meta?: string;                  // mono meta line: 'year · stack'
  href: string;
  external?: boolean;
  accent?: 'gold' | 'wine';      // default 'gold'
  media?: { src: string; alt: string };  // optional 16:10 plate
  flagship?: boolean;
};

/**
 * The one list grammar — a full row that IS the link.
 * Anatomy (CSS: .index-row in globals.css): mono numeral / serif
 * title / description / mono meta / arrow (→ internal, ↗ external).
 * ONE hover grammar: bottom hairline warms border -> accent, arrow
 * nudges 2px + takes accent, all var(--duration-fast). No wash.
 * Media plate sits beside the title >=768px, stacks above on mobile
 * (never display:none), and unveils via Reveal variant=unveil.
 */
export default function IndexRow({
  index,
  title,
  description,
  meta,
  href,
  external = false,
  accent = 'gold',
  media,
  flagship = false,
}: IndexRowProps) {
  const content = (
    <>
      <span className="index-row-num">{index}</span>
      {media && (
        <Reveal variant="unveil" className="index-row-media">
          <img src={media.src} alt={media.alt} loading="lazy" />
        </Reveal>
      )}
      <span className="index-row-title">{title}</span>
      {description && <span className="index-row-desc">{description}</span>}
      {meta && <span className="index-row-meta">{meta}</span>}
      <span className="index-row-arrow" aria-hidden="true">
        {external ? '↗' : '→'}
      </span>
    </>
  );

  const shared = {
    className: 'index-row',
    'data-accent': accent,
    'data-flagship': flagship ? 'true' : undefined,
    'data-has-media': media ? 'true' : undefined,
  } as const;

  if (external) {
    return (
      <a {...shared} href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link {...shared} href={href}>
      {content}
    </Link>
  );
}
