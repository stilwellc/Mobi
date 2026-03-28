'use client';

import { useState, useEffect, useRef } from 'react';
import { Section } from './types';
import ItemWrapper from './ItemWrapper';
import { CARD_GRADIENTS } from './cardStyles';

// Reuse the same SVG patterns from the homepage
const SECTION_HEROES: Record<string, (accent: string) => React.ReactNode> = {
  physical: (accent) => (
    <svg viewBox="0 0 400 300" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="60" y="40" width="120" height="90" stroke={accent} strokeWidth="0.6" opacity="0.2" transform="rotate(-3 120 85)" />
      <rect x="70" y="50" width="100" height="70" stroke={accent} strokeWidth="0.4" opacity="0.12" transform="rotate(-3 120 85)" />
      <rect x="220" y="80" width="80" height="60" stroke={accent} strokeWidth="0.5" opacity="0.15" transform="rotate(5 260 110)" />
      <line x1="40" y1="180" x2="360" y2="180" stroke={accent} strokeWidth="0.3" opacity="0.08" />
      <line x1="40" y1="188" x2="280" y2="188" stroke={accent} strokeWidth="0.2" opacity="0.05" />
      <line x1="160" y1="40" x2="160" y2="160" stroke={accent} strokeWidth="0.2" opacity="0.06" strokeDasharray="6 6" />
      <circle cx="320" cy="60" r="20" stroke={accent} strokeWidth="0.3" opacity="0.08" />
      <rect x="80" y="210" width="240" height="50" stroke={accent} strokeWidth="0.3" opacity="0.06" rx="2" strokeDasharray="4 4" />
    </svg>
  ),
  digital: (accent) => (
    <svg viewBox="0 0 400 300" fill="none" style={{ width: '100%', height: '100%' }}>
      <circle cx="200" cy="120" r="80" stroke={accent} strokeWidth="0.5" opacity="0.12" />
      <circle cx="200" cy="120" r="50" stroke={accent} strokeWidth="0.4" opacity="0.08" />
      <circle cx="200" cy="120" r="20" stroke={accent} strokeWidth="0.3" opacity="0.06" />
      <circle cx="200" cy="120" r="4" fill={accent} opacity="0.1" />
      <line x1="120" y1="120" x2="60" y2="80" stroke={accent} strokeWidth="0.3" opacity="0.08" />
      <line x1="280" y1="120" x2="340" y2="80" stroke={accent} strokeWidth="0.3" opacity="0.08" />
      <line x1="200" y1="200" x2="200" y2="260" stroke={accent} strokeWidth="0.3" opacity="0.08" />
      <circle cx="60" cy="80" r="6" stroke={accent} strokeWidth="0.4" opacity="0.1" />
      <circle cx="340" cy="80" r="6" stroke={accent} strokeWidth="0.4" opacity="0.1" />
      <circle cx="200" cy="260" r="6" stroke={accent} strokeWidth="0.4" opacity="0.1" />
      <rect x="80" y="230" width="60" height="30" stroke={accent} strokeWidth="0.3" opacity="0.06" rx="4" strokeDasharray="3 3" />
      <rect x="260" y="230" width="60" height="30" stroke={accent} strokeWidth="0.3" opacity="0.06" rx="4" strokeDasharray="3 3" />
    </svg>
  ),
  shop: (accent) => (
    <svg viewBox="0 0 400 300" fill="none" style={{ width: '100%', height: '100%' }}>
      <path d="M140 60 L260 60 L280 120 L120 120 Z" stroke={accent} strokeWidth="0.5" opacity="0.15" />
      <line x1="200" y1="120" x2="200" y2="200" stroke={accent} strokeWidth="0.4" opacity="0.1" />
      <circle cx="200" cy="220" r="16" stroke={accent} strokeWidth="0.5" opacity="0.12" />
      <circle cx="200" cy="220" r="6" fill={accent} opacity="0.06" />
      <line x1="120" y1="120" x2="100" y2="200" stroke={accent} strokeWidth="0.2" opacity="0.06" strokeDasharray="4 4" />
      <line x1="280" y1="120" x2="300" y2="200" stroke={accent} strokeWidth="0.2" opacity="0.06" strokeDasharray="4 4" />
      <rect x="60" y="240" width="280" height="1" fill={accent} opacity="0.06" />
    </svg>
  ),
  social: (accent) => (
    <svg viewBox="0 0 400 300" fill="none" style={{ width: '100%', height: '100%' }}>
      <circle cx="120" cy="100" r="24" stroke={accent} strokeWidth="0.5" opacity="0.15" />
      <circle cx="280" cy="80" r="24" stroke={accent} strokeWidth="0.5" opacity="0.15" />
      <circle cx="200" cy="210" r="24" stroke={accent} strokeWidth="0.5" opacity="0.15" />
      <line x1="140" y1="110" x2="260" y2="90" stroke={accent} strokeWidth="0.4" opacity="0.1" />
      <line x1="270" y1="100" x2="210" y2="190" stroke={accent} strokeWidth="0.4" opacity="0.1" />
      <line x1="130" y1="120" x2="190" y2="195" stroke={accent} strokeWidth="0.4" opacity="0.1" />
      <circle cx="120" cy="100" r="8" fill={accent} opacity="0.05" />
      <circle cx="280" cy="80" r="8" fill={accent} opacity="0.05" />
      <circle cx="200" cy="210" r="8" fill={accent} opacity="0.05" />
    </svg>
  ),
};


export default function SectionPage({ section, mobile, tablet, navigate }: {
  section: Section;
  mobile: boolean;
  tablet: boolean;
  navigate: (t: string) => void;
}) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(false);
  const itemsRef = useRef<HTMLDivElement>(null);
  const px = mobile ? 20 : tablet ? 36 : 56;
  const hasLink = (item: { href?: string; url?: string }) => !!(item.href || item.url);
  const heroFn = SECTION_HEROES[section.id];

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const el = itemsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setItemsVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes heroSlideIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes heroPatternFade{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        @keyframes itemSlideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .section-card{position:relative;border-radius:20px;overflow:hidden;background:var(--color-bg-card);border:1px solid var(--color-border);transition:all 0.5s cubic-bezier(0.23,1,0.32,1)}
        .section-card:hover{border-color:var(--color-border-strong);box-shadow:var(--shadow-card-hover);transform:translateY(-4px)}
        .section-card::before{content:'';position:absolute;inset:0;border-radius:20px;padding:1px;background:linear-gradient(135deg,var(--color-border-mid),transparent 40%,transparent 60%,var(--color-overlay-light));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
      `}</style>

      {/* Hero section */}
      <section style={{
        position: 'relative',
        paddingTop: mobile ? 100 : 140,
        paddingBottom: mobile ? 48 : 80,
        padding: `${mobile ? 100 : 140}px ${px}px ${mobile ? 48 : 80}px`,
        maxWidth: 1200, margin: '0 auto',
        minHeight: mobile ? 'auto' : 440,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {/* Abstract hero pattern */}
        {!mobile && heroFn && (
          <div style={{
            position: 'absolute', top: 100, right: 0, width: '50%', height: '80%',
            opacity: loaded ? 0.6 : 0,
            transform: loaded ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 1.2s cubic-bezier(0.23,1,0.32,1) 0.3s',
            pointerEvents: 'none',
          }}>
            {heroFn(section.accent)}
          </div>
        )}

        {/* Accent gradient blob */}
        <div style={{
          position: 'absolute',
          top: mobile ? '30%' : '20%',
          right: mobile ? '-20%' : '5%',
          width: mobile ? 200 : 400, height: mobile ? 200 : 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${section.accent}0c 0%, transparent 60%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        {/* Back */}
        <div style={{
          marginBottom: mobile ? 36 : 56,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="back-link" onClick={() => navigate('home')} style={{
            fontSize: 11, color: 'var(--color-text-subtle)', cursor: 'pointer', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </span>
        </div>

        {/* Category label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: mobile ? 16 : 24,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s cubic-bezier(0.23,1,0.32,1) 0.1s',
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: section.accent, opacity: 0.7,
            boxShadow: `0 0 12px ${section.accent}40`,
          }} />
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: section.accent, fontWeight: 700, opacity: 0.8,
          }}>{section.tagline}</span>
          <div style={{ width: 40, height: 1, background: section.accent, opacity: 0.2 }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: mobile ? 56 : tablet ? 80 : 110,
          fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 0.9,
          marginBottom: mobile ? 24 : 36,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.15s',
          position: 'relative', zIndex: 1,
        }}>{section.label}</h1>

        {/* Description */}
        <p style={{
          fontSize: mobile ? 15 : 18, lineHeight: 1.8, color: 'var(--color-text-muted)',
          fontWeight: 400, maxWidth: 560,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.25s',
          position: 'relative', zIndex: 1,
        }}>{section.description}</p>

        {/* Stats bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: mobile ? 24 : 40,
          marginTop: mobile ? 32 : 48,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.35s',
          position: 'relative', zIndex: 1,
        }}>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? 32 : 42, fontWeight: 300, color: section.accent,
              lineHeight: 1,
            }}>{String(section.items.length).padStart(2, '0')}</div>
            <div style={{
              fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--color-text-ghost)', fontWeight: 600, marginTop: 4,
            }}>Projects</div>
          </div>
          <div style={{ width: 1, height: 36, background: 'var(--color-border-mid)' }} />
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? 32 : 42, fontWeight: 300, color: 'var(--color-fg-dim)',
              lineHeight: 1,
            }}>{String(section.items.filter(i => hasLink(i)).length).padStart(2, '0')}</div>
            <div style={{
              fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--color-text-ghost)', fontWeight: 600, marginTop: 4,
            }}>Live</div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ padding: `0 ${px}px`, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease 0.4s',
        }}>
          <div style={{ width: 32, height: 1, background: section.accent, opacity: 0.3 }} />
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: section.accent, opacity: 0.4 }} />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--color-border-mid), transparent 80%)' }} />
        </div>
      </div>

      {/* Project cards */}
      <section
        ref={itemsRef}
        style={{
          padding: `${mobile ? 40 : 64}px ${px}px ${mobile ? 80 : 120}px`,
          maxWidth: 1200, margin: '0 auto',
        }}
      >
        <div style={{
          marginBottom: mobile ? 32 : 48,
          opacity: itemsVisible ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--color-text-label)', fontWeight: 600,
          }}>All Projects</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : section.items.length === 1 ? '1fr' : 'repeat(2, 1fr)',
          gap: mobile ? 16 : 20,
        }}>
          {section.items.map((item, i) => {
            const isHov = hoveredItem === i;
            const linked = hasLink(item);
            const gradient = CARD_GRADIENTS[item.name] || '';

            return (
              <ItemWrapper key={item.name} item={item}>
                <div
                  className="section-card"
                  onMouseEnter={() => setHoveredItem(i)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    padding: mobile ? '28px 24px' : '36px 32px',
                    minHeight: mobile ? 180 : 220,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    cursor: linked ? 'pointer' : 'default',
                    opacity: itemsVisible ? 1 : 0,
                    transform: itemsVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 0.08}s`,
                    // Make first card span full width if more than 2 items and not on mobile
                    gridColumn: i === 0 && section.items.length > 2 && !mobile ? 'span 2' : undefined,
                  }}
                >
                  {/* Gradient bg */}
                  {gradient && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: gradient,
                      opacity: isHov ? 1.5 : 1,
                      transition: 'opacity 0.6s ease',
                      pointerEvents: 'none',
                    }} />
                  )}
                  {/* Glow */}
                  <div style={{
                    position: 'absolute', top: -60, right: -60,
                    width: 200, height: 200, borderRadius: '50%',
                    background: `radial-gradient(circle, ${section.accent}${isHov ? '18' : '08'} 0%, transparent 70%)`,
                    transition: 'all 0.8s ease', pointerEvents: 'none',
                  }} />
                  {/* Bottom line */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${section.accent}${isHov ? '40' : '00'}, transparent)`,
                    transition: 'all 0.5s ease', pointerEvents: 'none',
                  }} />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Top bar: index + status */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: mobile ? 20 : 28,
                    }}>
                      <span style={{
                        fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: isHov ? section.accent : 'var(--color-text-ghost)',
                        fontWeight: 600, transition: 'color 0.4s ease',
                        fontFamily: "'Syne', sans-serif",
                      }}>{String(i + 1).padStart(2, '0')}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {item.wip && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div className="wip-dot" />
                            <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 600 }}>WIP</span>
                          </div>
                        )}
                        {!linked && !item.wip && (
                          <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-faint)', fontWeight: 600 }}>Coming Soon</span>
                        )}
                        {linked && (
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{
                            opacity: isHov ? 0.7 : 0.12,
                            transform: isHov ? 'translate(3px,-3px)' : 'none',
                            transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
                          }}>
                            <path d="M4 12L12 4M12 4H7M12 4V9" stroke={section.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <div style={{
                      fontSize: i === 0 && !mobile ? (mobile ? 32 : 42) : (mobile ? 28 : 34),
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
                    {item.handle && (
                      <span style={{ fontSize: 13, color: 'var(--color-text-subtle)', fontWeight: 400, marginTop: 4, display: 'block' }}>{item.handle}</span>
                    )}
                  </div>

                  <div style={{ position: 'relative', zIndex: 1, marginTop: mobile ? 20 : 24 }}>
                    <p style={{
                      fontSize: mobile ? 12 : 13, lineHeight: 1.7,
                      color: 'var(--color-text-label)', fontWeight: 400,
                      marginBottom: 14, maxWidth: 400,
                    }}>
                      {item.description}
                    </p>
                    <span style={{
                      fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
                      color: isHov ? section.accent : 'var(--color-text-subtle)',
                      padding: '5px 14px', borderRadius: 100,
                      border: `1px solid ${isHov ? section.accent + '33' : 'var(--color-chip-border)'}`,
                      background: isHov ? section.accent + '0a' : 'transparent',
                      transition: 'all 0.4s ease',
                      display: 'inline-block',
                    }}>
                      {item.tag}
                    </span>
                  </div>
                </div>
              </ItemWrapper>
            );
          })}
        </div>
      </section>
    </div>
  );
}
