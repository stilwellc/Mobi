'use client';

import { useState, useEffect } from 'react';
import { useScrollReveal } from './hooks';
import SectionHero3D from './SectionHero3D';
import { useTheme } from './ThemeProvider';

const PRINCIPLES = [
  {
    title: 'Modern Design',
    text: 'Cutting-edge design with timeless elegance — spaces and experiences that are both contemporary and enduring.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" style={{ width: 32, height: 32 }}>
        <rect x="8" y="12" width="32" height="24" rx="2" stroke="var(--color-accent-gold)" strokeWidth="1" opacity="0.5" />
        <line x1="8" y1="24" x2="40" y2="24" stroke="var(--color-accent-gold)" strokeWidth="0.6" opacity="0.3" />
        <line x1="24" y1="12" x2="24" y2="36" stroke="var(--color-accent-gold)" strokeWidth="0.6" opacity="0.3" />
        <circle cx="24" cy="24" r="5" stroke="var(--color-accent-gold)" strokeWidth="0.8" opacity="0.35" />
      </svg>
    ),
  },
  {
    title: 'Optimized Experiences',
    text: 'Designs that maximize functionality, comfort, and aesthetics. Advanced technology creating spaces that enhance the human experience.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" style={{ width: 32, height: 32 }}>
        <circle cx="24" cy="24" r="14" stroke="var(--color-accent-gold)" strokeWidth="0.8" opacity="0.35" />
        <circle cx="24" cy="24" r="8" stroke="var(--color-accent-gold)" strokeWidth="0.6" opacity="0.3" />
        <circle cx="24" cy="24" r="2" fill="var(--color-accent-gold)" opacity="0.5" />
        <line x1="24" y1="6" x2="24" y2="10" stroke="var(--color-accent-gold)" strokeWidth="0.6" opacity="0.3" />
        <line x1="24" y1="38" x2="24" y2="42" stroke="var(--color-accent-gold)" strokeWidth="0.6" opacity="0.3" />
        <line x1="6" y1="24" x2="10" y2="24" stroke="var(--color-accent-gold)" strokeWidth="0.6" opacity="0.3" />
        <line x1="38" y1="24" x2="42" y2="24" stroke="var(--color-accent-gold)" strokeWidth="0.6" opacity="0.3" />
      </svg>
    ),
  },
  {
    title: 'Balanced Innovation',
    text: 'Smart technology, sustainable practices, and timeless aesthetics integrated into a harmonious whole.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" style={{ width: 32, height: 32 }}>
        <path d="M12 36L24 12L36 36" stroke="var(--color-accent-gold)" strokeWidth="0.8" opacity="0.4" strokeLinejoin="round" />
        <line x1="16" y1="28" x2="32" y2="28" stroke="var(--color-accent-gold)" strokeWidth="0.6" opacity="0.3" />
        <circle cx="24" cy="22" r="3" stroke="var(--color-accent-gold)" strokeWidth="0.6" opacity="0.3" />
      </svg>
    ),
  },
];

const HELPS = [
  { title: 'Augmenting Everyday Life', text: 'Mobi creates designs that amplify human potential. From smart homes to collaborative workspaces, our design solutions support and enhance the way you live, work, and connect with others.' },
  { title: 'Sustainable Innovation', text: 'Our sustainable design solutions seamlessly incorporate eco-friendly materials and energy-efficient technologies into all spaces, reducing your environmental footprint without compromising style or comfort.' },
  { title: 'Smart Integration', text: 'We integrate technology in a way that enhances your lifestyle without disrupting it. From automated systems that enhance comfort to innovative tools that make life easier, our design flows with you.' },
  { title: 'Community & Connectivity', text: 'Mobi believes design should foster connection. We design spaces that bring people together, whether at home, in the office, or in public spaces, fostering collaboration, creativity, and community.' },
];

export default function AboutPage({ mobile, tablet, navigate }: {
  mobile: boolean;
  tablet: boolean;
  navigate: (t: string) => void;
}) {
  const [phase, setPhase] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredPrinciple, setHoveredPrinciple] = useState<number | null>(null);
  const [hoveredHelp, setHoveredHelp] = useState<number | null>(null);
  const principlesReveal = useScrollReveal(0.1);
  const helpReveal = useScrollReveal(0.1);
  const visionReveal = useScrollReveal(0.15);
  const { theme } = useTheme();
  const px = mobile ? 20 : tablet ? 36 : 56;

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

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes floatOrb{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(15px,-20px) scale(1.03)}66%{transform:translate(-10px,12px) scale(0.97)}}
        @keyframes pulseGlow{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.7;transform:scale(1.15)}}
        @keyframes driftLine{0%,100%{transform:translateX(0) scaleX(1)}50%{transform:translateX(20px) scaleX(1.3)}}
        .about-principle{position:relative;border-radius:20px;overflow:hidden;background:var(--color-bg-card);border:1px solid var(--color-border);transition:all 0.5s cubic-bezier(0.23,1,0.32,1)}
        .about-principle:hover{border-color:var(--color-border-strong);box-shadow:var(--shadow-card-hover);transform:translateY(-4px)}
        .about-principle::before{content:'';position:absolute;inset:0;border-radius:20px;padding:1px;background:linear-gradient(135deg,var(--color-border-mid),transparent 40%,transparent 60%,var(--color-overlay-light));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
        .about-help-item{transition:all 0.4s cubic-bezier(0.23,1,0.32,1)}
        .about-help-item:hover{padding-left:${mobile ? 0 : 12}px}
      `}</style>

      {/* Ambient floating orbs — gold-colored, parallax */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} aria-hidden="true">
        <div style={{
          position: 'absolute', width: mobile ? 180 : 400, height: mobile ? 180 : 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,184,150,0.06) 0%, transparent 60%)',
          bottom: '10%', left: '-5%',
          animation: 'floatOrb 20s ease-in-out infinite', filter: 'blur(60px)',
          transform: `translateY(${scrollY * 0.03}px)`,
          opacity: phase >= 1 ? 1 : 0, transition: 'opacity 1.5s ease',
        }} />
        <div style={{
          position: 'absolute', width: mobile ? 120 : 300, height: mobile ? 120 : 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(150,184,212,0.05) 0%, transparent 60%)',
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
          background: 'var(--color-accent-gold)',
          animation: 'pulseGlow 4s ease-in-out infinite',
          opacity: phase >= 3 ? 0.5 : 0, transition: 'opacity 1s ease',
        }} />
        {/* Drifting accent line */}
        <div style={{
          position: 'absolute', top: '70%', left: '8%',
          width: mobile ? 40 : 80, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(212,184,150,0.15), transparent)',
          animation: 'driftLine 12s ease-in-out infinite',
          opacity: phase >= 4 ? 0.6 : 0, transition: 'opacity 1s ease',
        }} />
      </div>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: `${mobile ? 100 : 140}px ${px}px ${mobile ? 48 : 80}px`,
        maxWidth: 1200, margin: '0 auto',
        minHeight: mobile ? 'auto' : 440,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {/* Three.js 3D hero — torus knot */}
        <SectionHero3D variant="about" mobile={mobile} theme={theme} accent="#D4B896" />

        {/* Accent gradient blob */}
        <div style={{
          position: 'absolute',
          top: mobile ? '30%' : '20%',
          right: mobile ? '-20%' : '10%',
          width: mobile ? 200 : 350, height: mobile ? 200 : 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,184,150,0.05) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }} />

        {/* Accent line drawing in */}
        <div style={{
          position: 'absolute', top: mobile ? '18%' : '15%', left: mobile ? '5%' : `${px}px`,
          width: phase >= 1 ? (mobile ? 40 : 80) : 0, height: 1,
          background: 'var(--color-accent-gold)', opacity: 0.4,
          transition: 'width 1.2s cubic-bezier(0.23,1,0.32,1)',
        }} />

        {/* Back */}
        <div style={{
          marginBottom: mobile ? 36 : 56,
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <span onClick={() => navigate('home')} style={{
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

        {/* Accent label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: mobile ? 16 : 24,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <div style={{
            width: phase >= 2 ? 10 : 0, height: phase >= 2 ? 10 : 0, borderRadius: '50%',
            background: 'var(--color-accent-gold)', opacity: 0.7,
            boxShadow: phase >= 2 ? '0 0 12px rgba(212,184,150,0.25)' : 'none',
            transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1)',
          }} />
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--color-accent-gold)', fontWeight: 700, opacity: 0.8,
          }}>Philosophy & Vision</span>
          <div style={{
            width: phase >= 2 ? 40 : 0, height: 1, background: 'var(--color-accent-gold)', opacity: 0.2,
            transition: 'width 0.8s cubic-bezier(0.23,1,0.32,1) 0.1s',
          }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: mobile ? 56 : tablet ? 80 : 110,
          fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 0.9,
          marginBottom: mobile ? 24 : 36,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s cubic-bezier(0.23,1,0.32,1) 0.1s',
          position: 'relative', zIndex: 1,
        }}>
          About <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>mobi</span>
        </h1>

        {/* Intro text - two column on desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? 20 : 48,
          maxWidth: 900,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(25px)',
          transition: 'all 0.9s cubic-bezier(0.23,1,0.32,1)',
          position: 'relative', zIndex: 1,
        }}>
          <p style={{ fontSize: mobile ? 15 : 17, lineHeight: 1.9, color: 'var(--color-text-muted)', fontWeight: 400 }}>
            Mobi draws inspiration from the Möbius strip — a symbol of infinity and seamless continuity. Just as the Möbius strip weaves unexpected elements into a continuous flow, Mobi integrates diverse design principles into a harmonious, fluid experience.
          </p>
          <p style={{ fontSize: mobile ? 15 : 17, lineHeight: 1.9, color: 'var(--color-text-muted)', fontWeight: 400 }}>
            We believe design goes beyond the home. It is about enhancing the way we live, work, and interact with the world around us. Our goal is to create design that flows effortlessly through all aspects of life.
          </p>
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
            width: phase >= 5 ? 32 : 0, height: 1, background: 'var(--color-accent-gold)', opacity: 0.3,
            transition: 'width 0.8s cubic-bezier(0.23,1,0.32,1)',
          }} />
          <div style={{
            width: phase >= 5 ? 4 : 0, height: phase >= 5 ? 4 : 0, borderRadius: '50%',
            background: 'var(--color-accent-gold)', opacity: 0.4,
            transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1) 0.2s',
          }} />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--color-border-mid), transparent 80%)' }} />
        </div>
      </div>

      {/* Principles Section */}
      <section
        ref={principlesReveal.ref}
        style={{
          padding: `${mobile ? 48 : 80}px ${px}px`,
          maxWidth: 1200, margin: '0 auto',
        }}
      >
        <div style={{
          marginBottom: mobile ? 32 : 48,
          opacity: principlesReveal.isVisible ? 1 : 0,
          transform: principlesReveal.isVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s ease',
        }}>
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--color-text-label)', fontWeight: 600,
          }}>Core Principles</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : tablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: mobile ? 16 : 20,
        }}>
          {PRINCIPLES.map((p, i) => {
            const isHov = hoveredPrinciple === i;
            return (
              <div
                key={p.title}
                className="about-principle"
                onMouseEnter={() => setHoveredPrinciple(i)}
                onMouseLeave={() => setHoveredPrinciple(null)}
                style={{
                  padding: mobile ? '28px 24px' : '36px 32px',
                  minHeight: mobile ? 200 : 260,
                  display: 'flex', flexDirection: 'column',
                  opacity: principlesReveal.isVisible ? 1 : 0,
                  transform: principlesReveal.isVisible ? 'translateY(0)' : 'translateY(24px) scale(0.97)',
                  transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 0.12}s`,
                }}
              >
                {/* Gradient bg */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, rgba(212,184,150,0.08) 0%, transparent 60%)',
                  opacity: isHov ? 1.5 : 1,
                  transition: 'opacity 0.6s ease',
                  pointerEvents: 'none',
                }} />
                {/* Glow */}
                <div style={{
                  position: 'absolute', top: -60, right: -60,
                  width: 200, height: 200, borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(212,184,150,${isHov ? '0.09' : '0.03'}) 0%, transparent 70%)`,
                  transition: 'all 0.8s ease', pointerEvents: 'none',
                }} />
                {/* Bottom accent */}
                <div style={{
                  position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1,
                  background: `linear-gradient(90deg, transparent, rgba(212,184,150,${isHov ? '0.25' : '0'}) , transparent)`,
                  transition: 'all 0.5s ease', pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Icon */}
                  <div style={{
                    marginBottom: 24,
                    opacity: isHov ? 0.9 : 0.5,
                    transition: 'opacity 0.4s ease',
                  }}>
                    {p.icon}
                  </div>

                  {/* Number */}
                  <span style={{
                    fontSize: 10, letterSpacing: '0.2em',
                    color: isHov ? 'var(--color-accent-gold)' : 'var(--color-text-ghost)',
                    fontWeight: 600, marginBottom: 12,
                    transition: 'color 0.4s ease',
                    fontFamily: "'Syne', sans-serif",
                  }}>{String(i + 1).padStart(2, '0')}</span>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: mobile ? 24 : 28, fontWeight: 300, fontStyle: 'italic',
                    color: isHov ? 'var(--color-text-primary)' : 'var(--color-fg-soft)',
                    lineHeight: 1.2, marginBottom: 16,
                    transition: 'color 0.4s ease',
                  }}>{p.title}</h3>

                  {/* Text */}
                  <p style={{
                    fontSize: mobile ? 13 : 14, lineHeight: 1.8,
                    color: 'var(--color-text-label)', fontWeight: 400,
                    marginTop: 'auto',
                  }}>{p.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Second Divider */}
      <div style={{ padding: `0 ${px}px`, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, var(--color-border-mid) 20%, transparent 80%)' }} />
        </div>
      </div>

      {/* How We Help Section */}
      <section
        ref={helpReveal.ref}
        style={{
          padding: `${mobile ? 48 : 80}px ${px}px`,
          maxWidth: 1200, margin: '0 auto',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '300px 1fr',
          gap: mobile ? 32 : 80,
          opacity: helpReveal.isVisible ? 1 : 0,
          transform: helpReveal.isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
        }}>
          {/* Left heading */}
          <div>
            <span style={{
              fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'var(--color-text-label)', fontWeight: 600,
              display: 'block', marginBottom: 20,
            }}>Our Approach</span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? 40 : 56, fontWeight: 300, letterSpacing: '-0.03em',
              lineHeight: 0.95,
            }}>
              How We{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>Help</span>
            </h2>
          </div>

          {/* Right items */}
          <div>
            {HELPS.map((block, i) => {
              const isHov = hoveredHelp === i;
              return (
                <div
                  key={block.title}
                  className="about-help-item"
                  onMouseEnter={() => setHoveredHelp(i)}
                  onMouseLeave={() => setHoveredHelp(null)}
                  style={{
                    paddingBottom: mobile ? 28 : 36,
                    marginBottom: mobile ? 28 : 36,
                    borderBottom: i < HELPS.length - 1 ? '1px solid var(--color-border)' : 'none',
                    opacity: helpReveal.isVisible ? 1 : 0,
                    transform: helpReveal.isVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `all 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 0.08 + 0.1}s`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
                    <span style={{
                      fontSize: 10, letterSpacing: '0.15em',
                      color: isHov ? 'var(--color-accent-gold)' : 'var(--color-text-ghost)',
                      fontWeight: 600, transition: 'color 0.4s ease',
                      fontFamily: "'Syne', sans-serif", flexShrink: 0,
                    }}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: mobile ? 22 : 26, fontWeight: 300, fontStyle: 'italic',
                      color: isHov ? 'var(--color-accent-gold)' : 'var(--color-fg-soft)',
                      lineHeight: 1.2, transition: 'color 0.4s ease',
                    }}>{block.title}</h3>
                  </div>
                  <p style={{
                    fontSize: mobile ? 13 : 15, lineHeight: 1.85,
                    color: 'var(--color-text-subtle)', fontWeight: 400,
                    paddingLeft: mobile ? 0 : 36,
                  }}>{block.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision CTA Card */}
      <section
        ref={visionReveal.ref}
        style={{
          padding: `0 ${px}px ${mobile ? 80 : 120}px`,
          maxWidth: 1200, margin: '0 auto',
        }}
      >
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: mobile ? '36px 28px' : '64px 56px',
          borderRadius: 24,
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          opacity: visionReveal.isVisible ? 1 : 0,
          transform: visionReveal.isVisible ? 'translateY(0)' : 'translateY(24px) scale(0.98)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
        }}>
          {/* Gradient border effect */}
          <div style={{
            position: 'absolute', inset: -1, borderRadius: 25, padding: 1,
            background: 'linear-gradient(135deg, rgba(212,184,150,0.15), transparent 40%, transparent 60%, rgba(212,184,150,0.08))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude' as any,
            pointerEvents: 'none',
          }} />
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,184,150,0.06) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{
              fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'var(--color-accent-gold)', fontWeight: 700, opacity: 0.7,
              display: 'block', marginBottom: 20,
            }}>Looking Forward</span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? 32 : 48, fontWeight: 300, letterSpacing: '-0.02em',
              lineHeight: 1.05, marginBottom: 24,
            }}>
              Our <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>Vision</span>
            </h2>
            <p style={{
              fontSize: mobile ? 15 : 18, lineHeight: 1.9, color: 'var(--color-text-muted)',
              fontWeight: 400, maxWidth: 700,
            }}>
              To redefine the way we experience design by weaving together sustainability, modern aesthetics, and cutting-edge technology in a way that enhances life at every level. Like the Möbius strip, our designs aim to create a seamless, continuous flow, augmenting the spaces where we live, work, and play.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
