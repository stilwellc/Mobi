import React from 'react';
import Link from 'next/link';
import Reveal from './motion/Reveal';

export type IndexSpreadProps = {
  index: string;
  title: React.ReactNode;
  titleStyle?: React.CSSProperties; // carries logoStyle at flagship scale
  description: string;
  meta?: string;
  href: string;
  accent?: 'gold' | 'wine';        // default 'gold'
  reverse?: boolean;                // image side alternates at >=768px
  image: { src: string; alt: string }; // composed 16:10
};

/**
 * The route spread — one full editorial unit that IS the link
 * (CSS: .index-spread in globals.css). Image ~58% column at desktop
 * (alternating via reverse), stacks ABOVE the text on mobile, and
 * unveils via Reveal variant=unveil. Small mono index sits in the
 * meta block — the route h1 owns the giant numeral on these pages.
 * Hover: hairline warms to accent + arrow nudge, var(--duration-fast).
 */
export default function IndexSpread({
  index,
  title,
  titleStyle,
  description,
  meta,
  href,
  accent = 'gold',
  reverse = false,
  image,
}: IndexSpreadProps) {
  return (
    <Link
      href={href}
      className="index-spread"
      data-accent={accent}
      data-reverse={reverse ? 'true' : undefined}
    >
      <Reveal variant="unveil" className="index-spread-media">
        <img src={image.src} alt={image.alt} loading="lazy" />
      </Reveal>
      <span className="index-spread-body">
        <span className="index-spread-title" style={titleStyle}>
          {title}
        </span>
        <span className="index-spread-desc">{description}</span>
        <span className="index-spread-meta">
          <span>{index}</span>
          {meta && <span>{meta}</span>}
          <span className="index-spread-arrow" aria-hidden="true">
            {'→'}
          </span>
        </span>
      </span>
    </Link>
  );
}
