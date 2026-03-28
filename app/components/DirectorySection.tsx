'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ItemWrapper from './ItemWrapper';
import { sections } from './sections';
import { CARD_GRADIENTS } from './cardStyles';
import { Section } from './types';

// Abstract SVG pattern per section for visual texture
const SECTION_PATTERNS: Record<string, (accent: string, opacity: number) => React.ReactNode> = {
  physical: (accent, opacity) => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', opacity, pointerEvents: 'none' }}>
      <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={accent} stopOpacity="0.12" /><stop offset="100%" stopColor={accent} stopOpacity="0" /></linearGradient></defs>
      <rect x="120" y="20" width="60" height="60" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.15" transform="rotate(12 150 50)" />
      <rect x="130" y="30" width="40" height="40" fill="none" stroke={accent} strokeWidth="0.3" opacity="0.1" transform="rotate(12 150 50)" />
      <line x1="80" y1="140" x2="180" y2="140" stroke={accent} strokeWidth="0.4" opacity="0.08" />
      <line x1="80" y1="148" x2="160" y2="148" stroke={accent} strokeWidth="0.3" opacity="0.06" />
    </svg>
  ),
  digital: (accent, opacity) => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', opacity, pointerEvents: 'none' }}>
      <circle cx="150" cy="60" r="30" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.12" />
      <circle cx="150" cy="60" r="18" fill="none" stroke={accent} strokeWidth="0.3" opacity="0.08" />
      <circle cx="150" cy="60" r="6" fill={accent} opacity="0.06" />
      <path d="M100 140 L160 140 L160 180 L100 180 Z" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.08" strokeDasharray="4 4" />
    </svg>
  ),
  shop: (accent, opacity) => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', opacity, pointerEvents: 'none' }}>
      <path d="M130 40 L170 40 L180 80 L120 80 Z" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.12" />
      <line x1="150" y1="80" x2="150" y2="120" stroke={accent} strokeWidth="0.3" opacity="0.08" />
      <circle cx="150" cy="130" r="8" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.1" />
    </svg>
  ),
  social: (accent, opacity) => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', opacity, pointerEvents: 'none' }}>
      <circle cx="130" cy="60" r="10" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.12" />
      <circle cx="170" cy="80" r="10" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.12" />
      <circle cx="145" cy="120" r="10" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.12" />
      <line x1="138" y1="66" x2="163" y2="74" stroke={accent} strokeWidth="0.3" opacity="0.08" />
      <line x1="164" y1="88" x2="151" y2="112" stroke={accent} strokeWidth="0.3" opacity="0.08" />
      <line x1="136" y1="115" x2="133" y2="70" stroke={accent} strokeWidth="0.3" opacity="0.08" />
    </svg>
  ),
};

interface DirectorySectionProps {
  mobile: boolean;
  tablet: boolean;
  isVisible: boolean;
  sectionRef: React.RefObject<HTMLDivElement>;
}

export default function DirectorySection({ mobile, tablet, isVisible, sectionRef }: DirectorySectionProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const sectionContentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [sectionHeights, setSectionHeights] = useState<Record<string, number>>({});

  const measureHeights = useCallback(() => {
    const heights: Record<string, number> = {};
    for (const id of Object.keys(sectionContentRefs.current)) {
      const el = sectionContentRefs.current[id];
      if (el) heights[id] = el.scrollHeight;
    }
    setSectionHeights(heights);
  }, []);

  useEffect(() => {
    measureHeights();
    window.addEventListener('resize', measureHeights);
    return () => window.removeEventListener('resize', measureHeights);
  }, [measureHeights]);

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
    requestAnimationFrame(() => measureHeights());
  };

  const hasLink = (item: { href?: string; url?: string }) => !!(item.href || item.url);

  const renderCard = (section: Section, item: typeof section.items[0], idx: number, opts?: { tall?: boolean; wide?: boolean; fontSize?: number }) => {
    const linked = hasLink(item);
    const cardId = `${section.id}-${item.name}`;
    const isHov = hoveredItem === cardId;
    const tall = opts?.tall;
    const nameSize = opts?.fontSize || (mobile ? 26 : 32);
    const cardGradient = CARD_GRADIENTS[item.name] || '';
    const patternFn = SECTION_PATTERNS[section.id];
    const card = (
      <div
        key={cardId}
        className="project-card card-stagger"
        onMouseEnter={() => setHoveredItem(cardId)}
        onMouseLeave={() => setHoveredItem(null)}
        role={linked ? 'link' : undefined}
        tabIndex={linked ? 0 : undefined}
        style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          background: 'var(--color-bg-card)',
          border: `1px solid ${isHov ? section.accent + '44' : 'var(--color-border)'}`,
          padding: mobile ? '28px 24px' : tall ? '44px 36px' : '36px 32px',
          minHeight: mobile ? 160 : tall ? 340 : 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: linked ? 'pointer' : 'default',
          transform: isHov ? 'translateY(-6px) scale(1.01)' : 'none',
          gridColumn: opts?.wide && !mobile ? 'span 2' : undefined,
          gridRow: tall && !mobile ? 'span 2' : undefined,
          animationDelay: `${idx * 0.08}s`,
        }}
      >
        {cardGradient && (
          <div style={{
            position: 'absolute', inset: 0,
            background: cardGradient,
            opacity: isHov ? 1.8 : 1,
            transition: 'opacity 0.6s ease',
            pointerEvents: 'none',
          }} aria-hidden="true" />
        )}
        {!mobile && patternFn && (
          <div className="card-pattern" style={{ opacity: isHov ? 0.7 : 0 }} aria-hidden="true">
            {patternFn(section.accent, 1)}
          </div>
        )}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: tall ? 280 : 200, height: tall ? 280 : 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${section.accent}${isHov ? '1a' : '08'} 0%, transparent 70%)`,
          transition: 'all 0.8s ease', pointerEvents: 'none',
        }} aria-hidden="true" />
        <div style={{
          position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1,
          background: `linear-gradient(90deg, transparent, ${section.accent}${isHov ? '40' : '00'}, transparent)`,
          transition: 'all 0.5s ease', pointerEvents: 'none',
        }} aria-hidden="true" />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: mobile ? 20 : tall ? 40 : 28, minHeight: 20 }}>
            <span style={{
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: isHov ? section.accent : 'var(--color-text-ghost)',
              fontWeight: 600, transition: 'color 0.4s ease',
              fontFamily: "'Syne', sans-serif",
            }} aria-hidden="true">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.wip && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div className="wip-dot" aria-hidden="true" />
                  <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 600 }}>WIP</span>
                </div>
              )}
              {!linked && !item.wip && (
                <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-faint)', fontWeight: 600 }}>Soon</span>
              )}
              {linked && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{
                  opacity: isHov ? 0.7 : 0.12,
                  transform: isHov ? 'translate(3px,-3px)' : 'none',
                  transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
                }}>
                  <path d="M4 12L12 4M12 4H7M12 4V9" stroke={section.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>

          <div style={{
            fontSize: nameSize,
            fontWeight: 300,
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: isHov ? 'var(--color-text-primary)' : 'var(--color-fg-soft)',
            transition: 'color 0.4s ease',
            ...item.logoStyle,
          }}>
            {item.name}
          </div>
        </div>

        <div style={{ marginTop: mobile ? 20 : 24, position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--color-text-label)', fontWeight: 400, marginBottom: 14, maxWidth: 320 }}>
            {item.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
              color: isHov ? section.accent : 'var(--color-text-subtle)',
              padding: '5px 14px', borderRadius: 100,
              border: `1px solid ${isHov ? section.accent + '33' : 'var(--color-chip-border)'}`,
              background: isHov ? section.accent + '0a' : 'transparent',
              transition: 'all 0.4s ease',
            }}>
              {item.tag}
            </span>
            {item.handle && (
              <span style={{ fontSize: 11, color: 'var(--color-text-faint)', fontWeight: 400 }}>{item.handle}</span>
            )}
          </div>
        </div>
      </div>
    );
    if (linked) return <ItemWrapper key={cardId} item={item}>{card}</ItemWrapper>;
    return card;
  };

  return (
    <div
      id="directory"
      ref={sectionRef}
      role="region"
      aria-label="Project directory"
      style={{ padding: mobile ? '40px 0 20px' : '80px 0 40px', position: 'relative', zIndex: 1, scrollMarginTop: 80 }}
    >
      {sections.map((section, si) => {
        const isExpanded = expandedSection === section.id;
        const isSectionHov = hoveredSection === section.id;
        const contentHeight = sectionHeights[section.id] || 0;

        return (
          <div key={section.id} style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${si * 0.1}s`,
          }}>
            <div style={{ padding: mobile ? '0 20px' : '0 56px', maxWidth: 1200, margin: '0 auto' }}>
              <div
                className="section-toggle"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`section-content-${section.id}`}
                onClick={() => toggleSection(section.id)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleSection(section.id))}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: mobile ? 14 : 20,
                  padding: mobile ? '28px 0' : '40px 0',
                  borderTop: si === 0 ? 'none' : `1px solid ${isSectionHov ? 'var(--color-border-mid)' : 'var(--color-border)'}`,
                  transition: 'border-color 0.4s ease',
                }}
              >
                <div style={{
                  width: isExpanded ? 10 : 8,
                  height: isExpanded ? 10 : 8,
                  borderRadius: '50%',
                  background: isExpanded ? section.accent : (isSectionHov ? section.accent : 'var(--color-text-ghost)'),
                  opacity: isExpanded ? 0.9 : (isSectionHov ? 0.7 : 0.4),
                  flexShrink: 0,
                  transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
                  boxShadow: isExpanded ? `0 0 16px ${section.accent}40` : 'none',
                }} aria-hidden="true" />

                <span className="section-name" style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: mobile ? 28 : tablet ? 36 : 44,
                  fontWeight: 300, letterSpacing: '-0.02em',
                  color: isExpanded ? 'var(--color-text-primary)' : (isSectionHov ? 'var(--color-fg-dim)' : 'var(--color-text-secondary)'),
                  transition: 'color 0.4s ease',
                }}>
                  {section.label}
                </span>

                <span className="section-count" style={{
                  color: isExpanded ? section.accent : 'var(--color-text-ghost)',
                  background: isExpanded ? section.accent + '12' : 'var(--color-overlay-light)',
                  border: `1px solid ${isExpanded ? section.accent + '25' : 'var(--color-border)'}`,
                  padding: '2px 10px',
                }} aria-label={`${section.items.length} projects`}>
                  {section.items.length}
                </span>

                <div style={{
                  flex: 1, height: 1,
                  background: isExpanded
                    ? `linear-gradient(90deg, ${section.accent}30, ${section.accent}08, transparent 80%)`
                    : `linear-gradient(90deg, var(--color-border-mid), transparent 60%)`,
                  transition: 'all 0.5s ease',
                }} aria-hidden="true" />

                {!mobile && (
                  <span style={{
                    fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: isExpanded ? section.accent + 'aa' : 'var(--color-text-ghost)',
                    fontWeight: 600, flexShrink: 0,
                    opacity: isExpanded || isSectionHov ? 1 : 0.6,
                    transition: 'all 0.4s ease',
                  }}>
                    {section.tagline}
                  </span>
                )}

                <div className="toggle-icon" style={{
                  width: mobile ? 28 : 32, height: mobile ? 28 : 32,
                  borderRadius: '50%',
                  border: `1px solid ${isExpanded ? section.accent + '40' : 'var(--color-border-mid)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  background: isExpanded ? section.accent + '0c' : 'transparent',
                  transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
                  opacity: isSectionHov || isExpanded ? 0.9 : 0.3,
                }} aria-hidden="true">
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
                    }}
                  >
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke={isExpanded ? section.accent : 'var(--color-text-subtle)'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div
              id={`section-content-${section.id}`}
              className="section-content-wrap"
              role="region"
              aria-label={`${section.label} projects`}
              style={{
                maxHeight: isExpanded ? (contentHeight || 2000) : 0,
                opacity: isExpanded ? 1 : 0,
                pointerEvents: isExpanded ? 'auto' : 'none',
              }}
            >
              <div
                ref={el => { sectionContentRefs.current[section.id] = el; }}
                style={{ padding: mobile ? '0 20px 32px' : '0 56px 48px', maxWidth: 1200, margin: '0 auto' }}
              >
                <p style={{
                  fontSize: mobile ? 13 : 15, lineHeight: 1.8,
                  color: 'var(--color-text-muted)', fontWeight: 400,
                  maxWidth: 480, marginBottom: mobile ? 24 : 32,
                }}>
                  {section.description}
                </p>

                {section.id === 'physical' && !mobile ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gridTemplateRows: 'auto auto', gap: 18 }}>
                    <div style={{ gridRow: 'span 2' }}>
                      {renderCard(section, section.items[0], 0, { tall: true, fontSize: 42 })}
                    </div>
                    {section.items.slice(1).map((item, i) => renderCard(section, item, i + 1))}
                  </div>
                ) : section.id === 'digital' && !mobile ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
                    {renderCard(section, section.items[3], 0, { wide: false, fontSize: 38 })}
                    {renderCard(section, section.items[0], 1, { wide: false, fontSize: 38 })}
                    {renderCard(section, section.items[1], 2)}
                    {renderCard(section, section.items[2], 3)}
                  </div>
                ) : section.id === 'shop' && !mobile ? (
                  <div>
                    {renderCard(section, section.items[0], 0, { wide: false, fontSize: 48 })}
                  </div>
                ) : section.id === 'social' && !mobile ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                    {section.items.map((item, i) => renderCard(section, item, i))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {section.items.map((item, i) => renderCard(section, item, i))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
