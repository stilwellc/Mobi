'use client';

import { useState, useEffect, useRef } from 'react';
import { Section } from './types';
import ItemWrapper from './ItemWrapper';
import { CARD_GRADIENTS } from './cardStyles';
import SectionHero3D from './SectionHero3D';
import { useTheme } from './ThemeProvider';


export default function SectionPage({ section, mobile, tablet, navigate }: {
  section: Section;
  mobile: boolean;
  tablet: boolean;
  navigate: (t: string) => void;
}) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [phase, setPhase] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(false);
  const itemsRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const px = mobile ? 20 : tablet ? 36 : 56;
  const hasLink = (item: { href?: string; url?: string }) => !!(item.href || item.url);

  // Phased entrance — matches homepage cadence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 400);
    const t3 = setTimeout(() => setPhase(3), 700);
    const t4 = setTimeout(() => setPhase(4), 1000);
    const t5 = setTimeout(() => setPhase(5), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  useEffect(() => {
    const hs = () => setScrollY(window.scrollY || 0);
    window.addEventListener('scroll', hs, { passive: true });
    return () => window.removeEventListener('scroll', hs);
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
        @keyframes floatOrb{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(15px,-20px) scale(1.03)}66%{transform:translate(-10px,12px) scale(0.97)}}
        @keyframes pulseGlow{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.7;transform:scale(1.15)}}
        @keyframes driftLine{0%,100%{transform:translateX(0) scaleX(1)}50%{transform:translateX(20px) scaleX(1.3)}}
        .section-card{position:relative;border-radius:20px;overflow:hidden;background:var(--color-bg-card);border:1px solid var(--color-border);transition:all 0.5s cubic-bezier(0.23,1,0.32,1)}
        .section-card:hover{border-color:var(--color-border-strong);box-shadow:var(--shadow-card-hover);transform:translateY(-4px)}
        .section-card::before{content:'';position:absolute;inset:0;border-radius:20px;padding:1px;background:linear-gradient(135deg,var(--color-border-mid),transparent 40%,transparent 60%,var(--color-overlay-light));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
      `}</style>

      {/* Ambient floating orbs — accent-colored, parallax */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} aria-hidden="true">
        <div style={{
          position: 'absolute', width: mobile ? 180 : 400, height: mobile ? 180 : 400, borderRadius: '50%',
          background: `radial-gradient(circle, ${section.accent}0a 0%, transparent 60%)`,
          bottom: '10%', left: '-5%',
          animation: 'floatOrb 20s ease-in-out infinite', filter: 'blur(60px)',
          transform: `translateY(${scrollY * 0.03}px)`,
          opacity: phase >= 1 ? 1 : 0, transition: 'opacity 1.5s ease',
        }} />
        <div style={{
          position: 'absolute', width: mobile ? 120 : 300, height: mobile ? 120 : 300, borderRadius: '50%',
          background: `radial-gradient(circle, ${section.accent}08 0%, transparent 60%)`,
          top: '20%', right: '-8%',
          animation: 'floatOrb 25s ease-in-out infinite reverse', filter: 'blur(80px)',
          transform: `translateY(${scrollY * -0.02}px)`,
          opacity: phase >= 1 ? 1 : 0, transition: 'opacity 1.5s ease 0.3s',
        }} />
        <div style={{
          position: 'absolute', width: mobile ? 80 : 200, height: mobile ? 80 : 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,148,184,0.03) 0%, transparent 60%)',
          top: '55%', left: '25%',
          animation: 'floatOrb 30s ease-in-out infinite', filter: 'blur(70px)',
          transform: `translateY(${scrollY * 0.015}px)`,
          opacity: phase >= 2 ? 1 : 0, transition: 'opacity 1.5s ease 0.6s',
        }} />
        {/* Pulsing accent dot */}
        <div style={{
          position: 'absolute', top: '35%', right: '12%',
          width: 6, height: 6, borderRadius: '50%',
          background: section.accent,
          animation: 'pulseGlow 4s ease-in-out infinite',
          opacity: phase >= 3 ? 0.5 : 0, transition: 'opacity 1s ease',
        }} />
        {/* Drifting accent line */}
        <div style={{
          position: 'absolute', top: '70%', left: '8%',
          width: mobile ? 40 : 80, height: 1,
          background: `linear-gradient(90deg, transparent, ${section.accent}20, transparent)`,
          animation: 'driftLine 12s ease-in-out infinite',
          opacity: phase >= 4 ? 0.6 : 0, transition: 'opacity 1s ease',
        }} />
      </div>

      {/* Hero section */}
      <section style={{
        position: 'relative',
        padding: `${mobile ? 90 : 140}px ${px}px ${mobile ? 40 : 80}px`,
        maxWidth: 1200, margin: '0 auto',
        minHeight: mobile ? 'auto' : 440,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {/* Three.js 3D hero */}
        <SectionHero3D variant={section.id} mobile={mobile} theme={theme} accent={section.accent} />

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
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }} />

        {/* Accent line drawing in */}
        <div style={{
          position: 'absolute', top: mobile ? '18%' : '15%', left: mobile ? '5%' : `${px}px`,
          width: phase >= 1 ? (mobile ? 40 : 80) : 0, height: 1,
          background: section.accent, opacity: 0.4,
          transition: 'width 1.2s cubic-bezier(0.23,1,0.32,1)',
        }} />

        {/* Back */}
        <div style={{
          marginBottom: mobile ? 24 : 56,
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <span className="back-link" onClick={() => navigate('home')} style={{
            fontSize: 11, color: 'var(--color-text-subtle)', cursor: 'pointer', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </span>
        </div>

        {/* Category label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: mobile ? 16 : 24,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <div style={{
            width: phase >= 2 ? 10 : 0, height: phase >= 2 ? 10 : 0, borderRadius: '50%',
            background: section.accent, opacity: 0.7,
            boxShadow: phase >= 2 ? `0 0 12px ${section.accent}40` : 'none',
            transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1)',
          }} />
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: section.accent, fontWeight: 700, opacity: 0.8,
          }}>{section.tagline}</span>
          <div style={{
            width: phase >= 2 ? 40 : 0, height: 1, background: section.accent, opacity: 0.2,
            transition: 'width 0.8s cubic-bezier(0.23,1,0.32,1) 0.1s',
          }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: mobile ? 44 : tablet ? 80 : 110,
          fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 0.9,
          marginBottom: mobile ? 20 : 36,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s cubic-bezier(0.23,1,0.32,1) 0.1s',
          position: 'relative', zIndex: 1,
        }}>{section.label}</h1>

        {/* Description */}
        <p style={{
          fontSize: mobile ? 15 : 18, lineHeight: 1.8, color: 'var(--color-text-muted)',
          fontWeight: 400, maxWidth: 560,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(25px)',
          transition: 'all 0.9s cubic-bezier(0.23,1,0.32,1)',
          position: 'relative', zIndex: 1,
        }}>{section.description}</p>

        {/* Stats bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: mobile ? 24 : 40,
          marginTop: mobile ? 24 : 48,
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
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
          <div style={{
            width: 1, height: phase >= 4 ? 36 : 0, background: 'var(--color-border-mid)',
            transition: 'height 0.6s cubic-bezier(0.23,1,0.32,1) 0.1s',
          }} />
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
          opacity: phase >= 5 ? 1 : 0,
          transition: 'opacity 1s ease',
        }}>
          <div style={{
            width: phase >= 5 ? 32 : 0, height: 1, background: section.accent, opacity: 0.3,
            transition: 'width 0.8s cubic-bezier(0.23,1,0.32,1)',
          }} />
          <div style={{
            width: phase >= 5 ? 4 : 0, height: phase >= 5 ? 4 : 0, borderRadius: '50%',
            background: section.accent, opacity: 0.4,
            transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1) 0.2s',
          }} />
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
          transform: itemsVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s ease',
        }}>
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--color-text-label)', fontWeight: 600,
          }}>All Projects</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : section.items.length === 1 ? '1fr' : 'repeat(2, 1fr)',
          gap: mobile ? 12 : 20,
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
                    padding: mobile ? '24px 20px' : '36px 32px',
                    minHeight: mobile ? 160 : 220,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    cursor: linked ? 'pointer' : 'default',
                    opacity: itemsVisible ? 1 : 0,
                    transform: itemsVisible ? 'translateY(0)' : 'translateY(24px) scale(0.97)',
                    transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 0.1}s`,
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
