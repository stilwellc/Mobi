'use client';

import { useState } from 'react';
import { Section } from './types';
import ItemWrapper from './ItemWrapper';

export default function SectionPage({ section, mobile, tablet, navigate }: {
  section: Section;
  mobile: boolean;
  tablet: boolean;
  navigate: (t: string) => void;
}) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const px = mobile ? 20 : tablet ? 36 : 56;
  const hasLink = (item: { href?: string; url?: string }) => !!(item.href || item.url);

  return (
    <div style={{ minHeight: '100vh', paddingTop: mobile ? 100 : 140 }}>
      <section style={{ padding: `0 ${px}px 80px`, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <span className="back-link" onClick={() => navigate('home')} style={{
            fontSize: 12, color: 'var(--color-text-subtle)', cursor: 'pointer', fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>&#8592; Back</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: section.accent, opacity: 0.6,
          }} />
          <span style={{
            fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--color-text-label)', fontWeight: 600,
          }}>{section.tagline}</span>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: mobile ? 48 : tablet ? 64 : 90,
          fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95,
          marginBottom: mobile ? 24 : 36,
        }}>{section.label}</h1>

        <p style={{
          fontSize: mobile ? 15 : 17, lineHeight: 1.8, color: 'var(--color-text-muted)',
          fontWeight: 400, maxWidth: 520,
        }}>{section.description}</p>

        <div style={{
          width: '100%', height: 1, marginTop: mobile ? 40 : 64,
          background: 'linear-gradient(90deg, var(--color-border-mid), transparent 80%)',
        }} />
      </section>

      <section style={{ padding: `0 ${px}px 120px`, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--color-text-label)', fontWeight: 600,
          }}>Projects &mdash; {section.items.length}</span>
        </div>

        {section.items.map((item, i) => {
          const isHov = hoveredItem === i;
          const linked = hasLink(item);
          return (
            <ItemWrapper key={item.name} item={item}>
              <div
                onMouseEnter={() => setHoveredItem(i)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  display: 'flex',
                  alignItems: mobile ? 'flex-start' : 'center',
                  flexDirection: mobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  gap: mobile ? 12 : 24,
                  padding: mobile ? '24px 0' : '32px 0',
                  borderBottom: '1px solid var(--color-border)',
                  cursor: linked ? 'pointer' : 'default',
                  transition: 'all 0.4s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: mobile ? 16 : 28, flex: 1 }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: mobile ? 14 : 16, color: isHov ? section.accent : 'var(--color-text-ghost)',
                    fontWeight: 400, minWidth: 32, transition: 'color 0.4s ease',
                  }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: mobile ? 28 : 36, fontWeight: 300, letterSpacing: '-0.02em',
                        transition: 'color 0.4s ease',
                        color: isHov ? 'var(--color-text-primary)' : 'var(--color-fg-soft)',
                      }}>{item.name}</span>
                      {item.wip && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '4px 14px', borderRadius: 100,
                          background: 'var(--color-overlay-light)', border: '1px solid var(--color-overlay-lighter)',
                        }}>
                          <div className="wip-dot" />
                          <span style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 600 }}>WIP</span>
                        </div>
                      )}
                      {!linked && !item.wip && (
                        <span style={{
                          fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                          color: 'var(--color-text-faint)', fontWeight: 600, padding: '4px 14px', borderRadius: 100,
                          border: '1px solid var(--color-overlay-lighter)', background: 'var(--color-overlay-light)',
                        }}>Coming Soon</span>
                      )}
                      {item.handle && (
                        <span style={{ fontSize: 13, color: 'var(--color-text-subtle)', fontWeight: 400 }}>{item.handle}</span>
                      )}
                    </div>
                    <p style={{ fontSize: mobile ? 13 : 15, color: 'var(--color-text-label)', fontWeight: 400, lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                  <span style={{
                    padding: '5px 16px', borderRadius: 100,
                    border: `1px solid ${isHov ? section.accent + '33' : 'var(--color-chip-border)'}`,
                    fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                    fontWeight: 600, color: isHov ? section.accent : 'var(--color-text-subtle)',
                    transition: 'all 0.4s ease',
                  }}>{item.tag}</span>
                  {linked && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
                      opacity: isHov ? 0.7 : 0.1,
                      transform: isHov ? 'translate(2px,-2px)' : 'none',
                      transition: 'all 0.4s ease',
                    }}>
                      <path d="M4 12L12 4M12 4H7M12 4V9" stroke={section.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </ItemWrapper>
          );
        })}
      </section>
    </div>
  );
}
