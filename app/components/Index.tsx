'use client';

import React from 'react';
import Horizon from './Horizon';
import ProjectCard from './ProjectCard';
import { sections } from './sections';
import { useWindowSize, useScrollReveal, usePrefersReducedMotion } from './hooks';

/**
 * The Index — an always-open editorial table of the work.
 * One horizon opens each section; the work sits below it. No accordion.
 */
export default function Index() {
  const w = useWindowSize();
  const mobile = w < 768;
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
    <div
      id="directory-index"
      ref={ref}
      style={{
        padding: mobile ? '0 24px' : '0 56px',
      }}
    >
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: mobile ? 'column' : 'row',
                  alignItems: mobile ? 'flex-start' : 'baseline',
                  justifyContent: 'space-between',
                  gap: 'var(--space-1)',
                  padding: 'var(--space-4) 0 var(--space-4)',
                }}
              >
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

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
                gap: 'var(--space-3)',
              }}
            >
              {section.items.map((item, i) => {
                const flagship = item.name === flagshipName;
                return (
                  <div
                    key={item.name}
                    style={{
                      ...(flagship && !mobile ? { gridColumn: '1 / -1' } : {}),
                      ...reveal(),
                    }}
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
