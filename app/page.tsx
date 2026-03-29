'use client';

import { useState, useEffect } from 'react';
import SectionPage from './components/SectionPage';
import AboutPage from './components/AboutPage';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './components/ThemeProvider';
import { useWindowSize, useScrollReveal } from './components/hooks';
import { sections } from './components/sections';
import HeroSection from './components/HeroSection';
import DirectorySection from './components/DirectorySection';
import PhilosophySection from './components/PhilosophySection';
import FooterSection from './components/FooterSection';


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
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
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

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .grain-overlay { display: none !important; }
        }

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

      <div className="grain-overlay" aria-hidden="true" />

      {/* Ambient background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} aria-hidden="true">
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
      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: mobile ? '18px 20px' : '24px 56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrollY > 80 || menuOpen || page !== 'home' ? 'var(--color-nav-bg)' : 'transparent',
          backdropFilter: scrollY > 80 || menuOpen || page !== 'home' ? 'blur(30px) saturate(1.2)' : 'none',
          borderBottom: scrollY > 80 || page !== 'home' ? '1px solid var(--color-border)' : '1px solid transparent',
          transition: 'all 0.5s ease',
          opacity: loaded ? 1 : 0,
        }}
      >
        <div onClick={() => navigate('home')} style={{
          cursor: 'pointer', zIndex: 101,
          fontFamily: "'Syne', sans-serif",
          fontSize: mobile ? 22 : 26, fontWeight: 700,
          color: 'var(--color-fg)', letterSpacing: '-0.04em', lineHeight: 1,
        }} role="link" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate('home')} aria-label="Mobi home">
          mobi<span style={{ color: 'var(--color-accent-gold)' }}>.</span>
        </div>

        {!mobile && (
          <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            {sections.map((s) => (
              <span
                key={s.id}
                className={`nav-item ${page === s.id ? 'nav-item-active' : ''}`}
                onClick={() => navigate(s.id)}
                role="link"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(s.id)}
              >{s.label}</span>
            ))}
            <div style={{ width: 1, height: 12, background: 'var(--color-divider)', margin: '0 4px' }} aria-hidden="true" />
            <span
              className={`nav-item ${page === 'about' ? 'nav-item-active' : ''}`}
              style={{ color: page === 'about' ? 'var(--color-text-primary)' : 'var(--color-accent-gold)' }}
              onClick={() => navigate('about')}
              role="link"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate('about')}
            >about</span>
            <ThemeToggle />
          </div>
        )}

        {mobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 101 }}>
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 12, display: 'flex', flexDirection: 'column', gap: 6,
                WebkitTapHighlightColor: 'transparent',
                minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span className="hamburger-bar" style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span className="hamburger-bar" style={{ opacity: menuOpen ? 0 : 1, width: 16 }} />
              <span className="hamburger-bar" style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobile && (
        <div
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: 'var(--color-modal-bg-deep)', backdropFilter: 'blur(40px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4,
            opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity 0.5s ease',
          }}
        >
          {[...sections.map(s => ({ label: s.label, id: s.id })), { label: 'About', id: 'about' }].map((item, i) => (
            <div
              key={item.id}
              onClick={() => navigate(item.id)}
              role="link"
              tabIndex={menuOpen ? 0 : -1}
              onKeyDown={e => e.key === 'Enter' && navigate(item.id)}
              style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300,
                color: page === item.id ? 'var(--color-text-primary)' : (item.id === 'about' ? 'var(--color-accent-gold)' : 'var(--color-text-secondary)'),
                padding: '16px 40px', cursor: 'pointer', textAlign: 'center',
                minHeight: 48,
                animation: menuOpen ? `menuReveal 0.5s ease ${i * 0.08}s both` : 'none',
              }}
            >{item.label}</div>
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
      }} aria-hidden="true" />

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
          <HeroSection mobile={mobile} tablet={tablet} phase={phase} scrollY={scrollY} theme={theme} />
          <DirectorySection mobile={mobile} tablet={tablet} isVisible={directoryReveal.isVisible} sectionRef={directoryReveal.ref} />
          <PhilosophySection mobile={mobile} tablet={tablet} isVisible={philosophyReveal.isVisible} sectionRef={philosophyReveal.ref} navigate={navigate} />
          <FooterSection mobile={mobile} isVisible={footerReveal.isVisible} footerRef={footerReveal.ref} navigate={navigate} />
        </>
      )}
    </div>
  );
}
