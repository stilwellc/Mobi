'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import MobiusStrip from './components/MobiusStrip';
import SectionPage from './components/SectionPage';
import AboutPage from './components/AboutPage';
import ItemWrapper from './components/ItemWrapper';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './components/ThemeProvider';
import { useWindowSize, useScrollReveal } from './components/hooks';
import { sections } from './components/sections';
import { CARD_GRADIENTS } from './components/cardStyles';


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
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionContentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [sectionHeights, setSectionHeights] = useState<Record<string, number>>({});
  const [pageTransition, setPageTransition] = useState(false);
  const { theme } = useTheme();
  const w = useWindowSize();
  const mobile = w < 768;
  const tablet = w < 1024;
  const directoryReveal = useScrollReveal(0.08);
  const philosophyReveal = useScrollReveal(0.15);
  const footerReveal = useScrollReveal(0.2);

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

  // Measure section content heights for smooth collapse animation
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
    // Re-measure after a frame so the DOM is updated
    requestAnimationFrame(() => measureHeights());
  };

  const navigate = (target: string) => {
    if (target === page) return;
    setPageTransition(true);
    setTimeout(() => {
      setPage(target);
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setTimeout(() => setPageTransition(false), 50);
    }, 300);
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
        @keyframes cardReveal{from{opacity:0;transform:translateY(24px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes expandLine{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes scrollReveal{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeOut{to{opacity:0;transform:scale(0.98) translateY(-10px)}}
        @keyframes pulseGlow{0%,100%{opacity:0.4}50%{opacity:0.8}}

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
        .hero-cta:hover{background:var(--color-accent-gold);border-color:var(--color-accent-gold);color:var(--color-bg);box-shadow:var(--shadow-btn-hover);transform:translateY(-2px)}
        .hero-cta:active{transform:scale(0.97)}
        .hero-cta svg{transition:transform 0.4s ease}
        .hero-cta:hover svg{transform:translateX(4px)}

        .hamburger-bar{display:block;width:24px;height:1.5px;background:var(--color-text-primary);transition:all 0.4s cubic-bezier(0.23,1,0.32,1);border-radius:1px}

        .footer-link{font-size:11px;color:var(--color-text-faint);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;transition:color 0.3s ease}
        .footer-link:hover{color:var(--color-accent-gold)}

        .section-label-sm{font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:var(--color-text-label);font-weight:600}
        .tag-chip{display:inline-block;padding:4px 14px;border-radius:100px;border:1px solid var(--color-chip-border);font-size:10px;color:var(--color-text-muted);letter-spacing:0.1em;text-transform:uppercase;font-weight:600;transition:all 0.4s ease;white-space:nowrap;backdrop-filter:blur(4px)}

        .page-transition{animation:pageIn 0.6s cubic-bezier(0.23,1,0.32,1) both}

        .section-toggle{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;transition:all 0.4s cubic-bezier(0.23,1,0.32,1)}
        .section-toggle:hover .section-name{color:var(--color-text-primary)!important}
        .section-toggle:hover .toggle-icon{opacity:0.8!important}

        .section-content-wrap{overflow:hidden;transition:max-height 0.7s cubic-bezier(0.23,1,0.32,1),opacity 0.5s ease}

        .card-stagger{animation:cardReveal 0.55s cubic-bezier(0.23,1,0.32,1) both}

        .project-card{transition:all 0.5s cubic-bezier(0.23,1,0.32,1)}
        .project-card:hover{box-shadow:var(--shadow-card-hover)}

        .section-count{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:11px;font-size:10px;font-weight:700;letter-spacing:0.04em;transition:all 0.4s ease}

        .scroll-reveal{opacity:0;transform:translateY(40px);transition:opacity 0.8s cubic-bezier(0.23,1,0.32,1),transform 0.8s cubic-bezier(0.23,1,0.32,1)}
        .scroll-reveal.visible{opacity:1;transform:translateY(0)}
        .scroll-reveal-delay-1{transition-delay:0.1s}
        .scroll-reveal-delay-2{transition-delay:0.2s}
        .scroll-reveal-delay-3{transition-delay:0.3s}

        .page-fade-out{animation:fadeOut 0.3s cubic-bezier(0.23,1,0.32,1) forwards}

        .magnetic-btn{transition:all 0.4s cubic-bezier(0.23,1,0.32,1)}
        .magnetic-btn:hover{transform:translateY(-3px);box-shadow:var(--shadow-btn-hover)}

        .footer-col-title{font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--color-text-ghost);font-weight:700;margin-bottom:16px}

        .card-pattern{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:20px;opacity:0;transition:opacity 0.6s ease}
        .project-card:hover .card-pattern{opacity:1}
      `}</style>

      <div className="grain-overlay" />

      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', width: mobile ? 200 : 450, height: mobile ? 200 : 450, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(150,184,212,0.05) 0%, transparent 60%)',
          bottom: '10%', left: '-5%', animation: 'floatSlow 20s ease-in-out infinite', filter: 'blur(60px)',
          transform: `translateY(${scrollY * 0.03}px)`,
        }} />
        <div style={{
          position: 'absolute', width: mobile ? 150 : 350, height: mobile ? 150 : 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,184,150,0.04) 0%, transparent 60%)',
          top: '20%', right: '-8%', animation: 'floatSlow 25s ease-in-out infinite reverse', filter: 'blur(80px)',
          transform: `translateY(${scrollY * -0.02}px)`,
        }} />
        <div style={{
          position: 'absolute', width: mobile ? 100 : 250, height: mobile ? 100 : 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,148,184,0.03) 0%, transparent 60%)',
          top: '60%', left: '30%', animation: 'floatSlow 30s ease-in-out infinite', filter: 'blur(70px)',
          transform: `translateY(${scrollY * 0.015}px)`,
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

      {/* Page transition overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 98,
        background: 'var(--color-bg)',
        opacity: pageTransition ? 1 : 0,
        pointerEvents: pageTransition ? 'all' : 'none',
        transition: 'opacity 0.3s cubic-bezier(0.23,1,0.32,1)',
      }} />

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
              <button className="hero-cta magnetic-btn" onClick={() => { const el = document.getElementById('directory'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
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
          <section
            id="directory"
            ref={directoryReveal.ref}
            style={{ padding: mobile ? '40px 0 20px' : '80px 0 40px', position: 'relative', zIndex: 1, scrollMarginTop: 80 }}
          >
            {sections.map((section, si) => {
              const isExpanded = expandedSection === section.id;
              const isSectionHov = hoveredSection === section.id;
              const contentHeight = sectionHeights[section.id] || 0;

              const renderCard = (item: typeof section.items[0], idx: number, opts?: { tall?: boolean; wide?: boolean; fontSize?: number }) => {
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
                    {/* Gradient thumbnail background */}
                    {cardGradient && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: cardGradient,
                        opacity: isHov ? 1.8 : 1,
                        transition: 'opacity 0.6s ease',
                        pointerEvents: 'none',
                      }} />
                    )}
                    {/* Abstract SVG pattern overlay on hover */}
                    {!mobile && patternFn && (
                      <div className="card-pattern" style={{ opacity: isHov ? 0.7 : 0 }}>
                        {patternFn(section.accent, 1)}
                      </div>
                    )}
                    {/* Accent glow */}
                    <div style={{
                      position: 'absolute', top: -80, right: -80,
                      width: tall ? 280 : 200, height: tall ? 280 : 200,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${section.accent}${isHov ? '1a' : '08'} 0%, transparent 70%)`,
                      transition: 'all 0.8s ease', pointerEvents: 'none',
                    }} />
                    {/* Bottom accent line on hover */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1,
                      background: `linear-gradient(90deg, transparent, ${section.accent}${isHov ? '40' : '00'}, transparent)`,
                      transition: 'all 0.5s ease', pointerEvents: 'none',
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: mobile ? 20 : tall ? 40 : 28, minHeight: 20 }}>
                        <span style={{
                          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                          color: isHov ? section.accent : 'var(--color-text-ghost)',
                          fontWeight: 600, transition: 'color 0.4s ease',
                          fontFamily: "'Syne', sans-serif",
                        }}>
                          {String(idx + 1).padStart(2, '0')}
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
                <div key={section.id} style={{
                  opacity: directoryReveal.isVisible ? 1 : 0,
                  transform: directoryReveal.isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${si * 0.1}s`,
                }}>
                  {/* Section header ��� clickable toggle */}
                  <div style={{ padding: mobile ? '0 20px' : '0 56px', maxWidth: 1200, margin: '0 auto' }}>
                    <div
                      className="section-toggle"
                      onClick={() => toggleSection(section.id)}
                      onMouseEnter={() => setHoveredSection(section.id)}
                      onMouseLeave={() => setHoveredSection(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: mobile ? 14 : 20,
                        padding: mobile ? '28px 0' : '40px 0',
                        borderTop: si === 0 ? 'none' : `1px solid ${isSectionHov ? 'var(--color-border-mid)' : 'var(--color-border)'}`,
                        transition: 'border-color 0.4s ease',
                      }}
                    >
                      {/* Accent dot — pulses when expanded */}
                      <div style={{
                        width: isExpanded ? 10 : 8,
                        height: isExpanded ? 10 : 8,
                        borderRadius: '50%',
                        background: isExpanded ? section.accent : (isSectionHov ? section.accent : 'var(--color-text-ghost)'),
                        opacity: isExpanded ? 0.9 : (isSectionHov ? 0.7 : 0.4),
                        flexShrink: 0,
                        transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
                        boxShadow: isExpanded ? `0 0 16px ${section.accent}40` : 'none',
                      }} />

                      {/* Section name */}
                      <span className="section-name" style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: mobile ? 28 : tablet ? 36 : 44,
                        fontWeight: 300, letterSpacing: '-0.02em',
                        color: isExpanded ? 'var(--color-text-primary)' : (isSectionHov ? 'var(--color-fg-dim)' : 'var(--color-text-secondary)'),
                        transition: 'color 0.4s ease',
                      }}>
                        {section.label}
                      </span>

                      {/* Project count pill */}
                      <span className="section-count" style={{
                        color: isExpanded ? section.accent : 'var(--color-text-ghost)',
                        background: isExpanded ? section.accent + '12' : 'var(--color-overlay-light)',
                        border: `1px solid ${isExpanded ? section.accent + '25' : 'var(--color-border)'}`,
                        padding: '2px 10px',
                      }}>
                        {section.items.length}
                      </span>

                      {/* Gradient line */}
                      <div style={{
                        flex: 1, height: 1,
                        background: isExpanded
                          ? `linear-gradient(90deg, ${section.accent}30, ${section.accent}08, transparent 80%)`
                          : `linear-gradient(90deg, var(--color-border-mid), transparent 60%)`,
                        transition: 'all 0.5s ease',
                      }} />

                      {/* Tagline — only visible on desktop */}
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

                      {/* Toggle icon */}
                      <div className="toggle-icon" style={{
                        width: mobile ? 28 : 32, height: mobile ? 28 : 32,
                        borderRadius: '50%',
                        border: `1px solid ${isExpanded ? section.accent + '40' : 'var(--color-border-mid)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        background: isExpanded ? section.accent + '0c' : 'transparent',
                        transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
                        opacity: isSectionHov || isExpanded ? 0.9 : 0.3,
                      }}>
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

                  {/* Collapsible content */}
                  <div
                    className="section-content-wrap"
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
                      {/* Section description */}
                      <p style={{
                        fontSize: mobile ? 13 : 15, lineHeight: 1.8,
                        color: 'var(--color-text-muted)', fontWeight: 400,
                        maxWidth: 480, marginBottom: mobile ? 24 : 32,
                      }}>
                        {section.description}
                      </p>

                      {/* Editorial card layouts */}
                      {section.id === 'physical' && !mobile ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gridTemplateRows: 'auto auto', gap: 18 }}>
                          <div style={{ gridRow: 'span 2' }}>
                            {renderCard(section.items[0], 0, { tall: true, fontSize: 42 })}
                          </div>
                          {section.items.slice(1).map((item, i) => renderCard(item, i + 1))}
                        </div>
                      ) : section.id === 'digital' && !mobile ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
                          {renderCard(section.items[3], 0, { wide: false, fontSize: 38 })}
                          {renderCard(section.items[0], 1, { wide: false, fontSize: 38 })}
                          {renderCard(section.items[1], 2)}
                          {renderCard(section.items[2], 3)}
                        </div>
                      ) : section.id === 'shop' && !mobile ? (
                        <div>
                          {renderCard(section.items[0], 0, { wide: false, fontSize: 48 })}
                        </div>
                      ) : section.id === 'social' && !mobile ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                          {section.items.map((item, i) => renderCard(item, i))}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {section.items.map((item, i) => renderCard(item, i))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* PHILOSOPHY */}
          <section
            ref={philosophyReveal.ref}
            style={{
              padding: mobile ? '60px 20px 80px' : '100px 56px 160px',
              position: 'relative', zIndex: 1,
            }}
          >
            {/* Decorative divider */}
            <div style={{ maxWidth: 1100, margin: '0 auto 0', paddingBottom: mobile ? 40 : 64 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20,
                opacity: philosophyReveal.isVisible ? 1 : 0,
                transition: 'opacity 1s ease 0.2s',
              }}>
                <div style={{ width: 40, height: 1, background: 'var(--color-accent-gold)', opacity: 0.3 }} />
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-accent-gold)', opacity: 0.4 }} />
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--color-border-mid), transparent 80%)' }} />
              </div>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 40 : 80 }}>
                <div style={{
                  opacity: philosophyReveal.isVisible ? 1 : 0,
                  transform: philosophyReveal.isVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
                }}>
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
                  <button className="hero-cta magnetic-btn" onClick={() => navigate('about')} style={{ marginTop: 8 }}>
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
                  ].map((p, pi) => (
                    <div key={p.num} style={{
                      padding: mobile ? 20 : 28, borderRadius: 16,
                      background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                      opacity: philosophyReveal.isVisible ? 1 : 0,
                      transform: philosophyReveal.isVisible ? 'translateY(0)' : 'translateY(30px)',
                      transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${0.15 + pi * 0.12}s`,
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
          <footer
            ref={footerReveal.ref}
            style={{
              padding: mobile ? '48px 20px 32px' : '80px 56px 40px',
              borderTop: '1px solid var(--color-border)',
              position: 'relative',
            }}
          >
            {/* Subtle gradient glow above footer */}
            <div style={{
              position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
              width: '60%', height: 120,
              background: 'radial-gradient(ellipse, rgba(212,184,150,0.03) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              {/* Top row: brand + columns */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: mobile ? '1fr' : '1.5fr 1fr 1fr 1fr',
                gap: mobile ? 36 : 40,
                marginBottom: mobile ? 40 : 56,
                opacity: footerReveal.isVisible ? 1 : 0,
                transform: footerReveal.isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
              }}>
                {/* Brand column */}
                <div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700,
                    letterSpacing: '-0.04em', marginBottom: 12,
                  }}>
                    mobi<span style={{ color: 'var(--color-accent-gold)' }}>.</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 400, lineHeight: 1.7, maxWidth: 260 }}>
                    Where design transcends boundaries — physical spaces, digital products, cultural connections.
                  </p>
                </div>

                {/* Studio column */}
                <div>
                  <div className="footer-col-title">Studio</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {sections.filter(s => s.id !== 'social').map(s => (
                      <span key={s.id} className="footer-link" onClick={() => navigate(s.id)} style={{ cursor: 'pointer' }}>
                        {s.label}
                      </span>
                    ))}
                    <span className="footer-link" onClick={() => navigate('about')} style={{ cursor: 'pointer' }}>
                      About
                    </span>
                  </div>
                </div>

                {/* Social column */}
                <div>
                  <div className="footer-col-title">Social</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {sections.filter(s => s.id === 'social').flatMap(s => s.items).map(item => (
                      <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="footer-link">
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Info column */}
                <div>
                  <div className="footer-col-title">Info</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-faint)', fontWeight: 400, lineHeight: 1.6 }}>
                      Kansas City, MO
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-faint)', fontWeight: 400, lineHeight: 1.6 }}>
                      Est. 2024
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div style={{
                display: 'flex', flexDirection: mobile ? 'column' : 'row',
                justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center',
                gap: mobile ? 12 : 0,
                paddingTop: mobile ? 24 : 32,
                borderTop: '1px solid var(--color-border)',
                opacity: footerReveal.isVisible ? 1 : 0,
                transition: 'opacity 0.8s ease 0.3s',
              }}>
                <span style={{ fontSize: 10, color: 'var(--color-text-ghost)', fontWeight: 500, letterSpacing: '0.1em' }}>
                  &copy; {new Date().getFullYear()} MOBI DESIGN STUDIO
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-accent-gold)', opacity: 0.4 }} />
                  <span style={{ fontSize: 10, color: 'var(--color-text-ghost)', fontWeight: 400, letterSpacing: '0.05em' }}>
                    Designed with obsession
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
