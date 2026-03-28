'use client';

import { sections } from './sections';

interface FooterSectionProps {
  mobile: boolean;
  isVisible: boolean;
  footerRef: React.RefObject<HTMLDivElement>;
  navigate: (target: string) => void;
}

export default function FooterSection({ mobile, isVisible, footerRef, navigate }: FooterSectionProps) {
  return (
    <div
      ref={footerRef}
      role="contentinfo"
      style={{
        padding: mobile ? '48px 20px 32px' : '80px 56px 40px',
        borderTop: '1px solid var(--color-border)',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: 120,
        background: 'radial-gradient(ellipse, rgba(212,184,150,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} aria-hidden="true" />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1.5fr 1fr 1fr 1fr',
          gap: mobile ? 36 : 40,
          marginBottom: mobile ? 40 : 56,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
        }}>
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

          <nav aria-label="Studio links">
            <div className="footer-col-title">Studio</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sections.filter(s => s.id !== 'social').map(s => (
                <span key={s.id} className="footer-link" onClick={() => navigate(s.id)} style={{ cursor: 'pointer' }} role="link" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate(s.id)}>
                  {s.label}
                </span>
              ))}
              <span className="footer-link" onClick={() => navigate('about')} style={{ cursor: 'pointer' }} role="link" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate('about')}>
                About
              </span>
            </div>
          </nav>

          <nav aria-label="Social links">
            <div className="footer-col-title">Social</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sections.filter(s => s.id === 'social').flatMap(s => s.items).map(item => (
                <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="footer-link">
                  {item.name}
                </a>
              ))}
            </div>
          </nav>

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

        <div style={{
          display: 'flex', flexDirection: mobile ? 'column' : 'row',
          justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center',
          gap: mobile ? 12 : 0,
          paddingTop: mobile ? 24 : 32,
          borderTop: '1px solid var(--color-border)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          <span style={{ fontSize: 10, color: 'var(--color-text-ghost)', fontWeight: 500, letterSpacing: '0.1em' }}>
            &copy; {new Date().getFullYear()} MOBI DESIGN STUDIO
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--color-accent-gold)', opacity: 0.4 }} aria-hidden="true" />
            <span style={{ fontSize: 10, color: 'var(--color-text-ghost)', fontWeight: 400, letterSpacing: '0.05em' }}>
              Designed with obsession
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
