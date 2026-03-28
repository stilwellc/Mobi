'use client';

interface PhilosophySectionProps {
  mobile: boolean;
  tablet: boolean;
  isVisible: boolean;
  sectionRef: React.RefObject<HTMLDivElement>;
  navigate: (target: string) => void;
}

const PRINCIPLES = [
  { num: '01', title: 'Seamless', desc: 'Design that flows naturally between physical spaces and digital experiences.' },
  { num: '02', title: 'Continuous', desc: 'Every project builds on the last — an evolving body of interconnected work.' },
  { num: '03', title: 'Infinite', desc: 'No boundaries between disciplines. Architecture informs software. Software reshapes space.' },
];

export default function PhilosophySection({ mobile, tablet, isVisible, sectionRef, navigate }: PhilosophySectionProps) {
  return (
    <div
      ref={sectionRef}
      role="region"
      aria-label="Philosophy"
      style={{
        padding: mobile ? '60px 20px 80px' : '100px 56px 160px',
        position: 'relative', zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto 0', paddingBottom: mobile ? 40 : 64 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1s ease 0.2s',
        }} aria-hidden="true">
          <div style={{ width: 40, height: 1, background: 'var(--color-accent-gold)', opacity: 0.3 }} />
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-accent-gold)', opacity: 0.4 }} />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--color-border-mid), transparent 80%)' }} />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 40 : 80 }}>
          <div style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} role="list" aria-label="Design principles">
            {PRINCIPLES.map((p, pi) => (
              <div key={p.num} role="listitem" style={{
                padding: mobile ? 20 : 28, borderRadius: 16,
                background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${0.15 + pi * 0.12}s`,
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: 'var(--color-accent-gold)', fontWeight: 400 }} aria-hidden="true">{p.num}</span>
                  <span style={{ fontSize: mobile ? 16 : 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{p.title}</span>
                </div>
                <p style={{ fontSize: mobile ? 13 : 14, color: 'var(--color-text-label)', fontWeight: 400, lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
