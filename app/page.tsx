'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobiusStrip from './components/MobiusStrip';
import SectionPage from './components/SectionPage';
import AboutPage from './components/AboutPage';
import ItemWrapper from './components/ItemWrapper';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './components/ThemeProvider';
import { useWindowSize } from './components/hooks';
import { sections } from './components/sections';

const PAGE_TITLES: Record<string, string> = {
  home: 'Mobi — Design Studio',
  physical: 'Physical — Mobi',
  digital: 'Digital — Mobi',
  shop: 'Shop — Mobi',
  social: 'Social — Mobi',
  about: 'About — Mobi',
};

export default function MobiSite() {
  const [loaded, setLoaded] = useState(false);
  const [phase, setPhase] = useState(0);
  const [page, setPage] = useState('home');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const w = useWindowSize();
  const mobile = w < 768;
  const tablet = w < 1024;

  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
    setTimeout(() => setPhase(1), 700);
    setTimeout(() => setPhase(2), 1400);
    setTimeout(() => setPhase(3), 2000);
    const hs = () => setScrollY(window.scrollY || 0);
    window.addEventListener('scroll', hs, { passive: true });
    return () => window.removeEventListener('scroll', hs);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    document.title = PAGE_TITLES[page] || 'Mobi — Design Studio';
  }, [page]);

  const navigate = (target: string) => {
    setPage(target);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const currentSection = sections.find(s => s.id === page);
  const hasLink = (item: { href?: string; url?: string }) => !!(item.href || item.url);

  return (
    <div style={{
      fontFamily: "'Syne', sans-serif",
      background: 'var(--color-bg)',
      color: 'var(--color-fg)',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes grainShift{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(7%,-25%)}50%{transform:translate(-15%,10%)}70%{transform:translate(0%,15%)}90%{transform:translate(-10%,10%)}}
        @keyframes floatSlow{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(15px,-20px) scale(1.02)}66%{transform:translate(-10px,10px) scale(0.98)}}
        @keyframes wipPulse{0%,100%{opacity:0.3}50%{opacity:0.8}}
        @keyframes menuReveal{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes pageIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}

        .grain-overlay{position:fixed;top:-50%;left:-50%;width:200%;height:200%;pointer-events:none;z-index:9999;opacity:var(--grain-opacity);animation:grainShift 0.5s steps(5) infinite;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")}

        .nav-item{color:var(--color-text-muted);text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;position:relative;padding:6px 0;transition:color 0.4s ease;-webkit-tap-highlight-color:transparent}
        .nav-item:hover{color:var(--color-text-primary)}
        .nav-item::after{content:'';position:absolute;bottom:0;left:0;width:0%;height:1px;background:var(--color-accent-gold);transition:width 0.5s cubic-bezier(0.23,1,0.32,1)}
        .nav-item:hover::after{width:100%}
        .nav-item-active{color:var(--color-text-primary)!important}
        .nav-item-active::after{width:100%!important;background:var(--color-accent-gold)!important}

        .back-link{transition:color 0.3s ease}
        .back-link:hover{color:var(--color-accent-gold)!important}

        .wip-dot{width:6px;height:6px;border-radius:50%;background:var(--color-wip);animation:wipPulse 2.5s ease-in-out infinite}

        .project-card::before{content:'';position:absolute;inset:0;border-radius:20px;padding:1px;background:linear-gradient(135deg,var(--color-border-mid),transparent 40%,transparent 60%,var(--color-overlay-light));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}

        .hero-cta{display:inline-flex;align-items:center;gap:14px;padding:18px 36px;border-radius:60px;border:1px solid rgba(212,184,150,0.3);background:rgba(212,184,150,0.06);color:var(--color-accent-gold);font-family:'Syne',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all 0.5s cubic-bezier(0.23,1,0.32,1);backdrop-filter:blur(10px);-webkit-tap-highlight-color:transparent}
        .hero-cta:hover{background:var(--color-accent-gold);border-color:var(--color-accent-gold);color:#060606;box-shadow:0 8px 40px rgba(212,184,150,0.2),0 0 80px rgba(212,184,150,0.08);transform:translateY(-2px)}
        .hero-cta:active{transform:scale(0.97)}
        .hero-cta svg{transition:transform 0.4s ease}
        .hero-cta:hover svg{transform:translateX(4px)}

        .hamburger-bar{display:block;width:24px;height:1.5px;background:var(--color-text-primary);transition:all 0.4s cubic-bezier(0.23,1,0.32,1);border-radius:1px}

        .footer-link{font-size:11px;color:var(--color-text-faint);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;transition:color 0.3s ease}
        .footer-link:hover{color:var(--color-accent-gold)}

        .section-label-sm{font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:var(--color-text-label);font-weight:600}
        .tag-chip{display:inline-block;padding:4px 14px;border-radius:100px;border:1px solid var(--color-chip-border);font-size:10px;color:var(--color-text-muted);letter-spacing:0.1em;text-transform:uppercase;font-weight:600;transition:all 0.4s ease;white-space:nowrap;backdrop-filter:blur(4px)}

        .page-transition{animation:pageIn 0.6s cubic-bezier(0.23,1,0.32,1) both}
      `}</style>

      <div className="grain-overlay" />

      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', width: mobile ? 200 : 450, height: mobile ? 200 : 450, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(150,184,212,0.05) 0%, transparent 60%)',
          bottom: '10%', left: '-5%', animation: 'floatSlow 20s ease-in-out infinite', filter: 'blur(60px)',
        }} />
      </div>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: mobile ? '18px 20px' : '24px 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrollY > 80 || menuOpen || page !== 'home' ? 'var(--color-nav-bg)' : 'transparent',
        backdropFilter: scrollY > 80 || menuOpen || page !== 'home' ? 'blur(30px) saturate(1.2)' : 'none',
        borderBottom: scrollY > 80 || page !== 'home' ? '1px solid var(--color-border)' : '1px solid transparent',
        transition: 'all 0.5s ease',
        opacity: loaded ? 1 : 0,
      }}>
        <div onClick={() => navigate('home')} style={{
          cursor: 'pointer', zIndex: 101,
          fontFamily: "'Syne', sans-serif",
          fontSize: mobile ? 22 : 26, fontWeight: 700,
          color: 'var(--color-fg)', letterSpacing: '-0.04em', lineHeight: 1,
        }}>
          mobi<span style={{ color: 'var(--color-accent-gold)' }}>.</span>
        </div>

        {!mobile && (
          <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            {sections.map((s) => (
              <span
                key={s.id}
                className={`nav-item ${page === s.id ? 'nav-item-active' : ''}`}
                onClick={() => navigate(s.id)}
              >{s.label}</span>
            ))}
            <div style={{ width: 1, height: 12, background: 'var(--color-divider)', margin: '0 4px' }} />
            <span
              className={`nav-item ${page === 'about' ? 'nav-item-active' : ''}`}
              style={{ color: page === 'about' ? 'var(--color-text-primary)' : 'var(--color-accent-gold)' }}
              onClick={() => navigate('about')}
            >about</span>
            <ThemeToggle />
          </div>
        )}

        {mobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, zIndex: 101 }}>
            <ThemeToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 10, display: 'flex', flexDirection: 'column', gap: 6,
              WebkitTapHighlightColor: 'transparent',
            }}>
              <span className="hamburger-bar" style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span className="hamburger-bar" style={{ opacity: menuOpen ? 0 : 1, width: 16 }} />
              <span className="hamburger-bar" style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'var(--color-modal-bg-deep)', backdropFilter: 'blur(40px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6,
          opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity 0.5s ease',
        }}>
          {[...sections.map(s => ({ label: s.label, id: s.id })), { label: 'About', id: 'about' }].map((item, i) => (
            <div key={item.id} onClick={() => navigate(item.id)} style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300,
              color: page === item.id ? 'var(--color-text-primary)' : (item.id === 'about' ? 'var(--color-accent-gold)' : 'var(--color-text-secondary)'),
              padding: '14px 0', cursor: 'pointer', textAlign: 'center',
              animation: menuOpen ? `menuReveal 0.5s ease ${i * 0.08}s both` : 'none',
            }}>{item.label}</div>
          ))}
        </div>
      )}

      {/* PAGES */}
      {currentSection && (
        <div key={page} className="page-transition">
          <SectionPage section={currentSection} mobile={mobile} tablet={tablet} navigate={navigate} />
        </div>
      )}

      {page === 'about' && (
        <div key="about" className="page-transition">
          <AboutPage mobile={mobile} tablet={tablet} navigate={navigate} />
        </div>
      )}

      {page === 'home' && (
        <>
          {/* HERO */}
          <section style={{
            minHeight: '100vh',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            position: 'relative', padding: mobile ? '120px 20px 80px' : '140px 56px 100px',
            overflow: 'hidden',
          }}>
            <MobiusStrip mobile={mobile} theme={theme} />

            <div style={{
              position: 'absolute', top: mobile ? '18%' : '15%', left: mobile ? '5%' : '8%',
              width: phase >= 1 ? (mobile ? 40 : 80) : 0, height: 1, background: 'var(--color-accent-gold)',
              transition: 'width 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.5s', opacity: 0.4,
            }} />

            <div style={{
              opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
              marginBottom: mobile ? 24 : 36, display: 'flex', alignItems: 'center', gap: 16,
              position: 'relative', zIndex: 2,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid var(--color-accent-gold)', opacity: 0.5 }} />
              <span className="section-label-sm">Design Studio &mdash; Est. 2024</span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: mobile ? 48 : tablet ? 72 : 'clamp(80px, 9vw, 140px)',
              lineHeight: mobile ? 1 : 0.9, letterSpacing: '-0.03em',
              maxWidth: mobile ? '100%' : '65%',
              opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.15s',
              position: 'relative', zIndex: 2,
            }}>
              <span style={{ display: 'block' }}>Where design</span>
              <span style={{
                display: 'block', fontStyle: 'italic', fontWeight: 400,
                background: 'linear-gradient(135deg, #D4B896 0%, #E8D5BC 40%, #D4B896 70%, #C4A886 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>transcends</span>
              <span style={{ display: 'block', color: 'var(--color-fg-half)' }}>boundaries</span>
            </h1>

            <div style={{
              marginTop: mobile ? 36 : 56, display: 'flex',
              flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'flex-start' : 'flex-end',
              gap: mobile ? 32 : 80,
              opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
              position: 'relative', zIndex: 2,
            }}>
              <p style={{ maxWidth: mobile ? '100%' : 380, fontSize: mobile ? 14 : 15, lineHeight: 1.85, color: 'var(--color-text-muted)', fontWeight: 400 }}>
                Physical spaces, digital products, and cultural connections — designed with intention, built with craft, refined through obsession.
              </p>
              <button className="hero-cta" onClick={() => { const el = document.getElementById('directory'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
                Explore
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {!mobile && (
              <div style={{
                position: 'absolute', bottom: 48, left: 56, right: 56,
                display: 'flex', alignItems: 'center', gap: 24,
                opacity: phase >= 3 ? 0.4 : 0, transition: 'opacity 1.5s ease',
              }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--color-border-strong), transparent)' }} />
                <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-text-faint)', fontWeight: 600 }}>Scroll to explore</span>
              </div>
            )}
          </section>

          {/* PROJECTS */}
          <section id="directory" style={{ padding: mobile ? '40px 20px 80px' : '80px 56px 140px', position: 'relative', zIndex: 1, scrollMarginTop: 80 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{
                display: 'flex', flexDirection: mobile ? 'column' : 'row',
                justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'flex-end',
                marginBottom: mobile ? 40 : 72, gap: mobile ? 12 : 0,
              }}>
                <div>
                  <div className="section-label-sm" style={{ marginBottom: 16 }}>Index</div>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: mobile ? 36 : tablet ? 48 : 60,
                    fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1,
                  }}>
                    Everything we{' '}<span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--color-accent-gold)' }}>make</span>
                  </h2>
                </div>
                {!mobile && (
                  <span style={{ fontSize: 11, color: 'var(--color-text-ghost)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {sections.reduce((a, s) => a + s.items.length, 0)} Projects
                  </span>
                )}
              </div>

              <div className="project-grid" style={{
                display: 'grid',
                gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
                gap: mobile ? 14 : 18,
              }}>
                {sections.flatMap((section) =>
                  section.items.map((item) => {
                    const linked = hasLink(item);
                    const cardId = `${section.id}-${item.name}`;
                    const isHov = hoveredItem === cardId;
                    const card = (
                      <div
                        key={cardId}
                        className="project-card"
                        onMouseEnter={() => setHoveredItem(cardId)}
                        onMouseLeave={() => setHoveredItem(null)}
                        style={{
                          position: 'relative',
                          borderRadius: 20,
                          overflow: 'hidden',
                          background: 'var(--color-bg-card)',
                          border: `1px solid ${isHov ? section.accent + '44' : 'var(--color-border)'}`,
                          padding: mobile ? '28px 24px' : '36px 32px',
                          minHeight: mobile ? 160 : 200,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          cursor: linked ? 'pointer' : 'default',
                          transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                          transform: isHov ? 'translateY(-4px)' : 'none',
                        }}
                      >
                        {/* Accent glow */}
                        <div style={{
                          position: 'absolute',
                          top: -60,
                          right: -60,
                          width: 160,
                          height: 160,
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${section.accent}${isHov ? '18' : '08'} 0%, transparent 70%)`,
                          transition: 'all 0.6s ease',
                          pointerEvents: 'none',
                        }} />

                        {/* Top row: category + status */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: mobile ? 20 : 28 }}>
                            <span style={{
                              fontSize: 9,
                              letterSpacing: '0.2em',
                              textTransform: 'uppercase',
                              color: section.accent,
                              fontWeight: 600,
                              background: `${section.accent}0a`,
                              padding: '4px 12px',
                              borderRadius: 100,
                              border: `1px solid ${section.accent}18`,
                            }}>
                              {section.label}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {item.wip && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                  <div className="wip-dot" />
                                  <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 600 }}>WIP</span>
                                </div>
                              )}
                              {!linked && !item.wip && (
                                <span style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-faint)', fontWeight: 600 }}>Soon</span>
                              )}
                              {linked && (
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{
                                  opacity: isHov ? 0.6 : 0.15,
                                  transform: isHov ? 'translate(2px,-2px)' : 'none',
                                  transition: 'all 0.4s ease',
                                }}>
                                  <path d="M4 12L12 4M12 4H7M12 4V9" stroke={section.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Logo-style project name */}
                          <div style={{
                            fontSize: mobile ? 26 : 32,
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

                        {/* Bottom: description + tag */}
                        <div style={{ marginTop: mobile ? 20 : 24 }}>
                          <p style={{
                            fontSize: 12,
                            lineHeight: 1.6,
                            color: 'var(--color-text-label)',
                            fontWeight: 400,
                            marginBottom: 14,
                          }}>
                            {item.description}
                          </p>
                          <span style={{
                            fontSize: 9,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            color: isHov ? section.accent : 'var(--color-text-subtle)',
                            padding: '4px 12px',
                            borderRadius: 100,
                            border: `1px solid ${isHov ? section.accent + '33' : 'var(--color-chip-border)'}`,
                            transition: 'all 0.4s ease',
                          }}>
                            {item.tag}
                          </span>
                          {item.handle && (
                            <span style={{ fontSize: 11, color: 'var(--color-text-faint)', marginLeft: 10 }}>{item.handle}</span>
                          )}
                        </div>
                      </div>
                    );

                    if (linked) {
                      return (
                        <ItemWrapper key={cardId} item={item}>
                          {card}
                        </ItemWrapper>
                      );
                    }
                    return card;
                  })
                )}
              </div>
            </div>
          </section>

          {/* PHILOSOPHY */}
          <section style={{ padding: mobile ? '60px 20px 80px' : '100px 56px 160px', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 40 : 80 }}>
                <div>
                  <div className="section-label-sm" style={{ marginBottom: 16 }}>Philosophy</div>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: mobile ? 36 : tablet ? 48 : 60,
                    fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1,
                    marginBottom: mobile ? 24 : 36,
                  }}>
                    The infinite<br /><span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--color-accent-gold)' }}>loop</span>
                  </h2>
                  <p style={{ fontSize: mobile ? 14 : 16, lineHeight: 1.85, color: 'var(--color-text-subtle)', fontWeight: 400, marginBottom: 24 }}>
                    Named after the Möbius strip — a surface with only one side and one boundary. It represents our belief that great design has no beginning or end, no separation between form and function, no divide between physical and digital.
                  </p>
                  <button className="hero-cta" onClick={() => navigate('about')} style={{ marginTop: 8 }}>
                    Learn More
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {[
                    { num: '01', title: 'Seamless', desc: 'Design that flows naturally between physical spaces and digital experiences.' },
                    { num: '02', title: 'Continuous', desc: 'Every project builds on the last — an evolving body of interconnected work.' },
                    { num: '03', title: 'Infinite', desc: 'No boundaries between disciplines. Architecture informs software. Software reshapes space.' },
                  ].map((p) => (
                    <div key={p.num} style={{
                      padding: mobile ? 20 : 28, borderRadius: 16,
                      background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: 'var(--color-accent-gold)', fontWeight: 400 }}>{p.num}</span>
                        <span style={{ fontSize: mobile ? 16 : 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{p.title}</span>
                      </div>
                      <p style={{ fontSize: mobile ? 13 : 14, color: 'var(--color-text-label)', fontWeight: 400, lineHeight: 1.7 }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{
            padding: mobile ? '40px 20px' : '60px 56px',
            borderTop: '1px solid var(--color-border)',
          }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{
                display: 'flex', flexDirection: mobile ? 'column' : 'row',
                justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center',
                gap: mobile ? 24 : 0,
              }}>
                <div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700,
                    letterSpacing: '-0.04em', marginBottom: 8,
                  }}>
                    mobi<span style={{ color: 'var(--color-accent-gold)' }}>.</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-faint)', fontWeight: 400 }}>Design studio &mdash; Est. 2024</p>
                </div>
                <div style={{ display: 'flex', gap: 28 }}>
                  {sections.filter(s => s.id === 'social').flatMap(s => s.items).map(item => (
                    <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="footer-link">
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
