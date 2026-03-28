'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

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
  const [loaded, setLoaded] = useState(false);
  const [hoveredPrinciple, setHoveredPrinciple] = useState<number | null>(null);
  const [hoveredHelp, setHoveredHelp] = useState<number | null>(null);
  const principlesReveal = useScrollReveal(0.1);
  const helpReveal = useScrollReveal(0.1);
  const visionReveal = useScrollReveal(0.15);
  const px = mobile ? 20 : tablet ? 36 : 56;

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes aboutHeroIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes svgDraw{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}
        .about-principle{position:relative;border-radius:20px;overflow:hidden;background:var(--color-bg-card);border:1px solid var(--color-border);transition:all 0.5s cubic-bezier(0.23,1,0.32,1)}
        .about-principle:hover{border-color:rgba(255,255,255,0.08);box-shadow:0 20px 60px rgba(0,0,0,0.15);transform:translateY(-4px)}
        .about-principle::before{content:'';position:absolute;inset:0;border-radius:20px;padding:1px;background:linear-gradient(135deg,var(--color-border-mid),transparent 40%,transparent 60%,var(--color-overlay-light));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
        .about-help-item{transition:all 0.4s cubic-bezier(0.23,1,0.32,1)}
        .about-help-item:hover{padding-left:${mobile ? 0 : 12}px}
      `}</style>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: `${mobile ? 100 : 140}px ${px}px ${mobile ? 48 : 80}px`,
        maxWidth: 1200, margin: '0 auto',
        minHeight: mobile ? 'auto' : 440,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {/* Decorative SVG - Mobius-inspired infinity loop */}
        {!mobile && (
          <div style={{
            position: 'absolute', top: 100, right: 40, width: '45%', height: '80%',
            opacity: loaded ? 0.5 : 0,
            transform: loaded ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 1.2s cubic-bezier(0.23,1,0.32,1) 0.3s',
            pointerEvents: 'none',
          }}>
            <svg viewBox="0 0 400 300" fill="none" style={{ width: '100%', height: '100%' }}>
              <path
                d="M100 150C100 100 140 70 180 90C220 110 240 80 280 80C320 80 350 110 350 150C350 190 320 220 280 220C240 220 220 190 180 210C140 230 100 200 100 150Z"
                stroke="var(--color-accent-gold)" strokeWidth="0.6" opacity="0.2"
                strokeDasharray="300" strokeDashoffset="0"
                style={{ animation: 'svgDraw 3s ease forwards' }}
              />
              <path
                d="M120 150C120 115 150 90 180 105C210 120 230 95 260 95C290 95 310 115 310 150C310 185 290 205 260 205C230 205 210 180 180 195C150 210 120 185 120 150Z"
                stroke="var(--color-accent-gold)" strokeWidth="0.4" opacity="0.1"
              />
              <circle cx="180" cy="150" r="3" fill="var(--color-accent-gold)" opacity="0.15" />
              <circle cx="280" cy="150" r="3" fill="var(--color-accent-gold)" opacity="0.15" />
              <line x1="60" y1="260" x2="340" y2="260" stroke="var(--color-accent-gold)" strokeWidth="0.3" opacity="0.06" />
              <line x1="60" y1="268" x2="240" y2="268" stroke="var(--color-accent-gold)" strokeWidth="0.2" opacity="0.04" />
            </svg>
          </div>
        )}

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
        }} />

        {/* Back */}
        <div style={{
          marginBottom: mobile ? 36 : 56,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.6s ease',
        }}>
          <span onClick={() => navigate('home')} style={{
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

        {/* Accent label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: mobile ? 16 : 24,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s cubic-bezier(0.23,1,0.32,1) 0.1s',
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: 'var(--color-accent-gold)', opacity: 0.7,
            boxShadow: '0 0 12px rgba(212,184,150,0.25)',
          }} />
          <span style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--color-accent-gold)', fontWeight: 700, opacity: 0.8,
          }}>Philosophy & Vision</span>
          <div style={{ width: 40, height: 1, background: 'var(--color-accent-gold)', opacity: 0.2 }} />
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
        }}>
          About <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>mobi</span>
        </h1>

        {/* Intro text - two column on desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? 20 : 48,
          maxWidth: 900,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1) 0.25s',
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
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease 0.4s',
        }}>
          <div style={{ width: 32, height: 1, background: 'var(--color-accent-gold)', opacity: 0.3 }} />
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-accent-gold)', opacity: 0.4 }} />
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
          opacity: principlesReveal.visible ? 1 : 0,
          transition: 'opacity 0.6s ease',
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
                  opacity: principlesReveal.visible ? 1 : 0,
                  transform: principlesReveal.visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 0.1}s`,
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
          opacity: helpReveal.visible ? 1 : 0,
          transform: helpReveal.visible ? 'translateY(0)' : 'translateY(20px)',
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
                    opacity: helpReveal.visible ? 1 : 0,
                    transform: helpReveal.visible ? 'translateY(0)' : 'translateY(16px)',
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
          opacity: visionReveal.visible ? 1 : 0,
          transform: visionReveal.visible ? 'translateY(0)' : 'translateY(20px)',
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
