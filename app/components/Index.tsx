'use client';

import React from 'react';
import Horizon from './Horizon';
import ProjectCard from './ProjectCard';
import Reveal from './Reveal';
import SectionMark from './SectionMark';
import { sections } from './sections';

/**
 * The Index — an always-open editorial table of the work.
 * One horizon opens each section; the work sits below it. No accordion.
 *
 * Each section carries its own Reveal (Physical fires on ITS
 * intersection, not the top of the index), and each card image
 * unveils inside ProjectCard. Ghost numerals 01/02 sit behind the
 * section heads — the sitewide sequence, matching the routes.
 *
 * Layout is CSS-only (classes + @media): the server renders with a fake
 * 1200px width, so branching markup/styles on useWindowSize causes
 * hydration drift — phones kept the 2-column desktop grid and overflowed.
 */
const indexCss = `
.index-headband { position: relative; overflow: hidden; }
.index-head {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-1);
  padding: var(--space-4) 0 var(--space-4);
}
.index-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.index-flagship { grid-column: 1 / -1; }
.pc-media div { height: 100%; }
@media (max-width: 767px) {
  .index-head { flex-direction: column; align-items: flex-start; }
  .index-grid { grid-template-columns: 1fr; }
}
`;

/* Sitewide numbering law: Software = 01, Physical = 02 (route order). */
const SECTION_MARKS: Record<string, string> = { software: '01', physical: '02' };

export default function Index() {
  return (
    <div id="directory-index" className="rail">
      <style>{indexCss}</style>
      {sections.map((section) => {
        const isSoftware = section.id === 'software';
        const flagshipName = isSoftware ? 'Ray' : null;

        return (
          <section
            key={section.id}
            aria-labelledby={`index-${section.id}`}
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <Reveal threshold={0.08}>
              <div className="index-headband">
                <SectionMark n={SECTION_MARKS[section.id] ?? ''} />
                <Horizon variant={isSoftware ? 'ocean' : 'gold'} />
                <div className="index-head">
                  <h2
                    id={`index-${section.id}`}
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-serif), serif',
                      fontWeight: 300,
                      fontSize: 'var(--text-title)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      color: 'var(--color-fg)',
                    }}
                  >
                    {section.label}
                  </h2>
                  <span className="eyebrow">
                    {section.tagline}
                  </span>
                </div>
              </div>

              <div className="index-grid">
                {section.items.map((item, i) => {
                  const flagship = item.name === flagshipName;
                  return (
                    <div
                      key={item.name}
                      className={flagship ? 'index-flagship' : undefined}
                    >
                      <ProjectCard item={item} accent={section.accent} index={i} flagship={flagship} />
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </section>
        );
      })}
    </div>
  );
}
