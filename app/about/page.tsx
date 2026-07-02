import type { Metadata } from 'next';
import Horizon from '../components/Horizon';
import Reveal from './Reveal';

export const metadata: Metadata = {
  title: 'About — co.stil',
  description:
    "I'm Collin Stilwell — a security engineer who cares about craft. Why the studio is shaped like a Möbius strip, and what I'm building now.",
};

const PRINCIPLES = [
  {
    number: '01',
    title: 'Design-first software',
    text: 'I start with how a thing should feel and let the engineering follow. Ray and Soirée began as design problems, not tickets — every screen has to earn its place.',
  },
  {
    number: '02',
    title: 'Physical craft',
    text: 'The practice leaves the screen. A residence in progress, 3D-printed lighting and furniture — objects held to the same standard as anything I ship.',
  },
  {
    number: '03',
    title: 'Security as craft',
    text: 'A decade in security sits underneath all of it. I build systems to be trusted under pressure, not just admired at launch.',
  },
];

const CURRENTLY = [
  { label: 'Studio', text: 'Ray, Soirée, a residence in progress, and objects on the printer.' },
  {
    label: 'Work',
    text: 'The professional record — career, security engineering, writing — lives at ',
    link: { href: '/professional', label: '/professional' },
  },
  {
    label: 'Writing',
    text: 'Essays on security and design engineering at ',
    link: { href: 'https://collinsthoughts.substack.com', label: 'collinsthoughts.substack.com' },
  },
];

const container: React.CSSProperties = {
  maxWidth: 'var(--content-max)',
  margin: '0 auto',
  padding: '0 clamp(20px, 5vw, 56px)',
};

const label: React.CSSProperties = {
  fontFamily: 'var(--font-sans), sans-serif',
  fontSize: 'var(--text-label)',
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--color-text-faint)',
};

const mono12: React.CSSProperties = {
  fontFamily: 'var(--font-mono), monospace',
  fontSize: 12,
  color: 'var(--color-text-muted)',
};

export default function AboutRoute() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        .about-intro { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); max-width: 940px; }
        .about-principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); }
        .about-row { display: grid; grid-template-columns: 180px 1fr; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border); }
        .about-row:last-of-type { border-bottom: none; }
        @media (max-width: 900px) {
          .about-principles { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .about-intro { grid-template-columns: 1fr; gap: var(--space-2); }
          .about-row { grid-template-columns: 1fr; gap: var(--space-1); }
        }
        .about-card { transition: border-color var(--duration-fast) var(--ease-signature); }
        .about-card:hover { border-color: color-mix(in srgb, var(--color-accent-gold) 40%, transparent); }
        .about-link { color: var(--color-text-secondary); text-decoration: underline; text-decoration-color: var(--color-border-mid); text-underline-offset: 3px; transition: color var(--duration-fast) var(--ease-signature); }
        .about-link:hover { color: var(--color-accent-gold); }
        .about-cta { display: inline-flex; align-items: baseline; gap: var(--space-1); color: var(--color-accent-gold); text-decoration: none; }
        .about-cta .about-cta-arrow { display: inline-block; transition: transform var(--duration-fast) var(--ease-signature); }
        .about-cta:hover .about-cta-arrow { transform: translateX(2px); }
        .about-beat-1 { animation: pageIn var(--duration-slow) var(--ease-signature) both; }
        .about-beat-2 { animation: pageIn var(--duration-slow) var(--ease-signature) 150ms both; }
      `}</style>

      {/* 1 — Hero */}
      <section style={{ ...container, paddingTop: 'clamp(120px, 18vh, 200px)', paddingBottom: 'var(--space-5)' }}>
        <h1
          className="about-beat-1"
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 'var(--text-display)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-4)',
            color: 'var(--color-fg)',
          }}
        >
          About{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>co.stil</span>
        </h1>

        <div className="about-intro about-beat-2">
          <p style={{ margin: 0, fontSize: 'var(--text-body)', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: 'var(--prose-max)' }}>
            co.stil is my studio practice. It takes its shape from the Möbius strip — one side,
            one boundary — because the work refuses a divide: software designed like objects,
            objects informed by software, one surface with no seam between them.
          </p>
          <p style={{ margin: 0, fontSize: 'var(--text-body)', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: 'var(--prose-max)' }}>
            By day I&rsquo;m a security engineer who cares about craft. The rest of the time I build
            things that feel good to use — security tooling, design systems, lighting, furniture,
            and the space between code and art.
          </p>
        </div>
      </section>

      {/* 2 — Horizon */}
      <div style={container}>
        <Horizon variant="gold" />
      </div>

      {/* 3 — Principles */}
      <section style={{ ...container, paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-5)' }}>
        <Reveal>
          <span style={{ ...label, display: 'block', marginBottom: 'var(--space-4)' }}>Principles</span>
          <div className="about-principles">
            {PRINCIPLES.map((p) => (
              <div
                key={p.number}
                className="about-card"
                style={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  padding: 'var(--space-4) var(--space-3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                }}
              >
                <span style={mono12}>{p.number}</span>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif), serif',
                    fontSize: 'var(--text-title)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    lineHeight: 1.15,
                    margin: 0,
                    color: 'var(--color-fg)',
                  }}
                >
                  {p.title}
                </h2>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--color-text-muted)' }}>
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 4 — Currently */}
      <section style={{ ...container, paddingBottom: 'var(--space-6)' }}>
        <Reveal>
          <span style={{ ...label, display: 'block', marginBottom: 'var(--space-3)' }}>Currently</span>
          <div style={{ maxWidth: 820 }}>
            {CURRENTLY.map((row) => (
              <div key={row.label} className="about-row">
                <span style={{ ...mono12, paddingTop: 3 }}>{row.label}</span>
                <p style={{ margin: 0, fontSize: 'var(--text-body)', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
                  {row.text}
                  {row.link && (
                    <a
                      className="about-link"
                      href={row.link.href}
                      target={row.link.href.startsWith('http') ? '_blank' : undefined}
                      rel={row.link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {row.link.label}
                    </a>
                  )}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 5 — Closing */}
      <section style={{ ...container, paddingBottom: 'var(--space-6)' }}>
        <Reveal>
          <div
            className="about-card"
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              padding: 'clamp(28px, 5vw, 64px)',
            }}
          >
            <span style={{ ...label, display: 'block', marginBottom: 'var(--space-3)' }}>
              What I&rsquo;m after
            </span>
            <p
              style={{
                fontFamily: 'var(--font-serif), serif',
                fontSize: 'var(--text-title)',
                fontWeight: 300,
                lineHeight: 1.3,
                margin: '0 0 var(--space-4)',
                color: 'var(--color-fg)',
                maxWidth: '28ch',
              }}
            >
              Things that feel inevitable — software with the weight of an object, objects with
              the intelligence of software.
            </p>
            <a className="about-cta" href="mailto:cstilwell117@gmail.com" style={{ fontSize: 'var(--text-body)', fontWeight: 600 }}>
              Say hello <span className="about-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
