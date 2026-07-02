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
 * The Index — the landing page as a scrolling magazine. Each work is
 * a full-width editorial band: imagery on one side, a display-scale
 * logotype on the other, alternating like spreads. Section heads are
 * monumental (serif display over the ghost route numeral), and each
 * section declares its temperature — ocean for Software, gold for
 * Physical — which HomeAmbience answers with a page-wide wash.
 *
 * Layout is CSS-only (server renders at a fake 1200px; branching
 * markup on useWindowSize causes hydration drift).
 */
const indexCss = `
.index-headband { position: relative; overflow: hidden; }
.index-head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-5) 0 var(--space-4);
}
.index-head-title { margin: 0; font-family: var(--font-serif), serif; font-weight: 300; font-size: clamp(2.5rem, 5.5vw, 4.25rem); line-height: 1.05; letter-spacing: -0.02em; color: var(--color-fg); }
.index-band {
  display: grid;
  grid-template-columns: 11fr 9fr;
  gap: clamp(24px, 4vw, 64px);
  align-items: center;
  padding: var(--space-4) 0;
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
  transition: border-color var(--duration-fast) var(--ease-signature), background var(--duration-fast) var(--ease-signature);
}
.index-band:last-of-type { border-bottom: none; }
.index-band[data-rev] .index-band-media { order: 2; }
.index-band[data-rev] .index-band-text { order: 1; }
.index-band-media { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid var(--color-border); aspect-ratio: 16 / 10; }
.index-band-media img { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1); filter: brightness(1); transition: transform var(--duration-slow) var(--ease-signature), filter var(--duration-slow) var(--ease-signature); }
.index-band-num { font-family: var(--font-mono), monospace; font-size: 12px; letter-spacing: 0.12em; display: block; margin-bottom: var(--space-2); }
.index-band-title { margin: 0 0 var(--space-2); font-size: clamp(1.9rem, 3.6vw, 3rem); line-height: 1.08; color: var(--color-fg); }
.index-band-desc { margin: 0 0 var(--space-2); font-size: 15px; line-height: 1.7; color: var(--color-text-secondary); max-width: 44ch; }
.index-band-meta { font-family: var(--font-mono), monospace; font-size: 12px; color: var(--color-text-muted); display: block; margin-bottom: var(--space-2); }
.index-band-go { display: inline-flex; align-items: baseline; gap: 8px; font-family: var(--font-sans), sans-serif; font-size: var(--text-label); font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; }
.index-band-go .arrow { display: inline-block; transition: transform var(--duration-fast) var(--ease-signature); }
@media (hover: hover) {
  .index-band:hover { border-color: color-mix(in srgb, var(--color-accent-gold) 35%, transparent); }
  .index-band:hover .index-band-media img { transform: scale(1.035); filter: brightness(1.06); }
  .index-band:hover .index-band-go .arrow { transform: translateX(3px); }
}
@media (max-width: 767px) {
  .index-head { flex-direction: column; align-items: flex-start; gap: var(--space-1); padding: var(--space-4) 0 var(--space-3); }
  .index-band { grid-template-columns: 1fr; gap: var(--space-2); padding: var(--space-3) 0; }
  .index-band[data-rev] .index-band-media { order: 1; }
  .index-band[data-rev] .index-band-text { order: 2; }
  .index-band-desc { font-size: 14px; }
}
`;

/* Sitewide numbering law: Software = 01, Physical = 02 (route order). */
const SECTION_MARKS: Record<string, string> = { software: '01', physical: '02' };

function accentToken(sectionId: string) {
  return sectionId === 'software' ? 'var(--color-accent-ocean)' : 'var(--color-accent-gold-text)';
}

function Band({ item, sectionId, index, rev }: { item: SectionItem; sectionId: string; index: number; rev: boolean }) {
  const inner = (
    <>
      <Reveal variant="unveil" className="index-band-media" as="figure" style={{ margin: 0 }}>
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.imageAlt ?? ''} loading="lazy" />
        )}
      </Reveal>
      <div className="index-band-text">
        <Reveal delay={90}>
          <span className="index-band-num" style={{ color: accentToken(sectionId) }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="index-band-title" style={item.logoStyle as React.CSSProperties}>
            {item.name}
          </h3>
          <p className="index-band-desc">{item.description}</p>
          {item.meta && (
            <span className="index-band-meta">
              {[item.meta.year, item.meta.stack ?? item.meta.material, item.meta.status].filter(Boolean).join(' · ')}
            </span>
          )}
          <span className="index-band-go" style={{ color: accentToken(sectionId) }}>
            {item.url ? 'Visit' : 'Enter'}
            <span className="arrow" aria-hidden="true">{item.url ? '↗' : '→'}</span>
          </span>
        </Reveal>
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="index-band" data-rev={rev ? '' : undefined}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="index-band" data-rev={rev ? '' : undefined}>
      {inner}
    </a>
  );
}

export default function Index() {
  let bandCount = 0;
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
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <div className="index-headband">
              <SectionMark n={SECTION_MARKS[section.id] ?? ''} align="right" style={{ fontSize: 'clamp(160px, 20vw, 300px)' }} />
              <Horizon variant={isSoftware ? 'ocean' : 'gold'} />
              <div className="index-head">
                <RevealLines
                  as="h2"
                  className="index-head-title"
                  lines={[<span key="l" id={`index-${section.id}`}>{section.label}</span>]}
                />
                <Reveal delay={120}>
                  <span className="eyebrow">{section.tagline}</span>
                </Reveal>
              </div>
            </div>

            <div>
              {section.items.map((item, i) => (
                <Band
                  key={item.name}
                  item={item}
                  sectionId={section.id}
                  index={i}
                  rev={bandCount++ % 2 === 1}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
