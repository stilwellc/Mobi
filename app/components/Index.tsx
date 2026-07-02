'use client';

import React from 'react';
import Horizon from './Horizon';
import ProjectCard from './ProjectCard';
import { sections } from './sections';
import { useScrollReveal, usePrefersReducedMotion } from './hooks';

/**
 * The Index — an always-open editorial table of the work.
 * One horizon opens each section; the work sits below it. No accordion.
 *
 * Layout is CSS-only (classes + @media): the server renders with a fake
 * 1200px width, so branching markup/styles on useWindowSize causes
 * hydration drift — phones kept the 2-column desktop grid and overflowed.
 */
const indexCss = `
#directory-index { padding: 0 56px; }
.index-head {
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
@media (max-width: 767px) {
  #directory-index { padding: 0 24px; }
  .index-head { flex-direction: column; align-items: flex-start; }
  .index-grid { grid-template-columns: 1fr; }
}
`;

export default function Index() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, isVisible } = useScrollReveal(0.08);

  const shown = reducedMotion || isVisible;
  let revealIndex = 0;

  const reveal = (): React.CSSProperties => {
    const delay = revealIndex++ * 80;
    return {
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : 'translateY(24px)',
      transition: reducedMotion
        ? 'none'
        : `opacity var(--duration-slow) var(--ease-signature) ${delay}ms, transform var(--duration-slow) var(--ease-signature) ${delay}ms`,
    };
  };

  // Shell matches PhilosophySection: outer horizontal padding (24px mobile
  // honors the 8px rhythm, 56px desktop), content-max container inside, no
  // extra inner padding — so every Horizon below the hero shares one left
  // edge and one width. The hero's Horizon is the single full-bleed exception.
  return (
    <div id="directory-index" ref={ref}>
      <style>{indexCss}</style>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
      {sections.map((section) => {
        const isSoftware = section.id === 'software';
        const flagshipName = isSoftware ? 'Ray' : null;

        return (
          <section
            key={section.id}
            aria-labelledby={`index-${section.id}`}
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <div style={reveal()}>
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
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 'var(--text-label)',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                  }}
                >
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
                    style={reveal()}
                  >
                    <ProjectCard item={item} accent={section.accent} index={i} flagship={flagship} />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      </div>
    </div>
  );
}
