'use client';

import React from 'react';
import Link from 'next/link';
import Horizon from './Horizon';
import Reveal from './Reveal';
import RevealLines from './RevealLines';
import SectionMark from './SectionMark';
import { sections } from './sections';
import type { SectionItem } from './types';

/**
 * The Index — the landing page as a scrolling magazine, in the
 * site's own material. Each work is a GLASS SPREAD: a full-width
 * golden-glass panel (meniscus, caustics, cursor shimmer) holding
 * the imagery matted on one side and a weighted text architecture
 * on the other, alternating like pages. Section heads are
 * monumental serif over the ghost route numerals, and each section
 * declares its temperature — HomeAmbience answers with a page-wide
 * wash.
 *
 * Layout is CSS-only (server renders at a fake 1200px; branching
 * markup on useWindowSize causes hydration drift).
 */
const indexCss = `
.index-headband { position: relative; overflow: hidden; }
.index-head { position: relative; z-index: 1; padding: var(--space-5) 0 var(--space-4); }
.index-head-eyebrow { display: block; margin-bottom: var(--space-2); }
.index-head-title { margin: 0; font-family: var(--font-serif), serif; font-weight: 300; font-size: clamp(2.75rem, 6vw, 4.75rem); line-height: 1.02; letter-spacing: -0.02em; color: var(--color-fg); }
.index-spreads { display: flex; flex-direction: column; gap: var(--space-4); }
.index-spread {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(24px, 3vw, 48px);
  align-items: stretch;
  padding: clamp(20px, 2.2vw, 32px);
  text-decoration: none;
}
.index-spread[data-rev] .index-spread-media { order: 2; }
.index-spread[data-rev] .index-spread-text { order: 1; }
.index-spread-media { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid var(--color-border); min-height: 340px; }
.index-spread-media .unveil, .index-spread-media .unveil img { height: 100%; }
.index-spread-media img { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1); filter: brightness(1); transition: transform var(--duration-slow) var(--ease-signature), filter var(--duration-slow) var(--ease-signature); }
.index-spread-text { display: flex; flex-direction: column; justify-content: space-between; gap: var(--space-3); padding: clamp(4px, 1vw, 12px) 0; }
.index-spread-toprow { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-2); }
.index-spread-num { font-family: var(--font-mono), monospace; font-size: 12px; letter-spacing: 0.12em; }
.index-spread-tag { font-family: var(--font-sans), sans-serif; font-size: var(--text-label); font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; border: 1px solid var(--color-border-mid); padding: 5px 12px; white-space: nowrap; }
.index-spread-title { margin: 0 0 var(--space-2); font-size: clamp(2.1rem, 3.8vw, 3.4rem); line-height: 1.06; color: var(--color-fg); }
.index-spread-desc { margin: 0; font-size: 15px; line-height: 1.7; color: var(--color-text-secondary); max-width: 42ch; }
.index-spread-botrow { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-2); flex-wrap: wrap; }
.index-spread-meta { font-family: var(--font-mono), monospace; font-size: 12px; color: var(--color-text-muted); }
.index-spread-go { display: inline-flex; align-items: baseline; gap: 8px; font-family: var(--font-sans), sans-serif; font-size: var(--text-label); font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; }
.index-spread-go .arrow { display: inline-block; transition: transform var(--duration-fast) var(--ease-signature); }
@media (hover: hover) {
  .index-spread:hover .index-spread-media img { transform: scale(1.03); filter: brightness(1.06); }
  .index-spread:hover .index-spread-go .arrow { transform: translateX(3px); }
}
@media (max-width: 900px) {
  .index-spread { grid-template-columns: 1fr; }
  .index-spread[data-rev] .index-spread-media { order: 1; }
  .index-spread[data-rev] .index-spread-text { order: 2; }
  .index-spread-media { min-height: 0; aspect-ratio: 16 / 10; }
  .index-spread-text { gap: var(--space-2); }
}
@media (max-width: 767px) {
  .index-head { padding: var(--space-4) 0 var(--space-3); }
  .index-spread-desc { font-size: 14px; }
}
`;

/* Sitewide numbering law: Software = 01, Physical = 02 (route order). */
const SECTION_MARKS: Record<string, string> = { software: '01', physical: '02' };

function accentToken(sectionId: string) {
  return sectionId === 'software' ? 'var(--color-accent-ocean)' : 'var(--color-accent-gold-text)';
}

function Spread({ item, sectionId, index, rev }: { item: SectionItem; sectionId: string; index: number; rev: boolean }) {
  const accent = accentToken(sectionId);
  const inner = (
    <>
      <Reveal variant="unveil" className="index-spread-media" as="figure" style={{ margin: 0 }}>
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.imageAlt ?? ''} loading="lazy" />
        )}
      </Reveal>
      <div className="index-spread-text">
        <div className="index-spread-toprow">
          <span className="index-spread-num" style={{ color: accent }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="index-spread-tag" style={{ color: accent }}>{item.tag}</span>
        </div>
        <div>
          <h3 className="index-spread-title" style={item.logoStyle as React.CSSProperties}>
            {item.name}
          </h3>
          <p className="index-spread-desc">{item.description}</p>
        </div>
        <div className="index-spread-botrow">
          {item.meta && (
            <span className="index-spread-meta">
              {[item.meta.year, item.meta.stack ?? item.meta.material, item.meta.status].filter(Boolean).join(' · ')}
            </span>
          )}
          <span className="index-spread-go" style={{ color: accent }}>
            {item.url ? 'Visit' : 'Enter'}
            <span className="arrow" aria-hidden="true">{item.url ? '↗' : '→'}</span>
          </span>
        </div>
      </div>
    </>
  );

  if (item.href) {
    return (
      <Reveal>
        <Link href={item.href} className="index-spread glass" data-rev={rev ? '' : undefined}>
          {inner}
        </Link>
      </Reveal>
    );
  }
  return (
    <Reveal>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="index-spread glass" data-rev={rev ? '' : undefined}>
        {inner}
      </a>
    </Reveal>
  );
}

export default function Index() {
  let spreadCount = 0;
  return (
    <div id="directory-index" className="rail">
      <style>{indexCss}</style>
      {sections.map((section) => {
        const isSoftware = section.id === 'software';
        return (
          <section
            key={section.id}
            aria-labelledby={`index-${section.id}`}
            data-zone={section.id}
            style={{ marginBottom: 'var(--space-7)' }}
          >
            <div className="index-headband">
              <SectionMark n={SECTION_MARKS[section.id] ?? ''} align="right" style={{ fontSize: 'clamp(160px, 20vw, 300px)' }} />
              <Horizon variant={isSoftware ? 'ocean' : 'gold'} />
              <div className="index-head">
                <Reveal>
                  <span className="eyebrow index-head-eyebrow">{section.tagline}</span>
                </Reveal>
                <RevealLines
                  as="h2"
                  className="index-head-title"
                  lines={[<span key="l" id={`index-${section.id}`}>{section.label}</span>]}
                />
              </div>
            </div>

            <div className="index-spreads">
              {section.items.map((item, i) => (
                <Spread
                  key={item.name}
                  item={item}
                  sectionId={section.id}
                  index={i}
                  rev={spreadCount++ % 2 === 1}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
