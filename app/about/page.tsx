import type { Metadata } from 'next';
import Horizon from '../components/Horizon';
import Reveal from '../components/Reveal';
import RevealLines from '../components/RevealLines';
import SectionMark from '../components/SectionMark';

export const metadata: Metadata = {
  title: 'About — co.stil',
  description:
    "I'm Collin Stilwell — a security engineer who cares about craft. Why the studio is shaped like a Möbius strip, and what I'm building now.",
};

const PRACTICE = [
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

const mono12: React.CSSProperties = {
  fontFamily: 'var(--font-mono), monospace',
  fontSize: 12,
  color: 'var(--color-text-muted)',
};

export default function AboutRoute() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        .about-intro { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); max-width: 940px; position: relative; }
        .about-row { display: grid; grid-template-columns: 180px 1fr; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border); }
        .about-row:last-of-type { border-bottom: none; }
        .about-ledger-row { position: relative; overflow: hidden; display: grid; grid-template-columns: minmax(220px, 1fr) 1.7fr; gap: var(--space-3) var(--space-5); align-items: start; padding: var(--space-4) 0; border-bottom: 1px solid var(--color-border); }
        @media (max-width: 640px) {
          .about-intro { grid-template-columns: 1fr; gap: var(--space-2); }
          .about-row { grid-template-columns: 1fr; gap: var(--space-1); }
          .about-ledger-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* 1 — Manifesto hero (the ghost Möbius is this page's mark; no route numeral) */}
      <section
        className="rail"
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 'clamp(120px, 18vh, 200px)',
          paddingBottom: 'var(--space-5)',
        }}
      >
        {/* Ghost Möbius — static, formal reference only. 1px stroke, 3.5% opacity. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 520 320"
          fill="none"
          style={{
            position: 'absolute',
            top: '4%',
            right: '-8%',
            width: '40vw',
            minWidth: 340,
            opacity: 0.035,
            color: 'var(--color-fg)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <path
            d="M40 160 C40 68 176 68 260 160 C344 252 480 252 480 160 C480 68 344 68 260 160 C176 252 40 252 40 160 Z"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M78 160 C78 96 188 96 260 160 C332 224 442 224 442 160 C442 96 332 96 260 160 C188 224 78 224 78 160 Z"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span
          className="eyebrow"
          style={{ display: 'block', marginBottom: 'var(--space-2)', position: 'relative' }}
        >
          About
        </span>
        <RevealLines
          as="h1"
          trigger="mount"
          delay={250}
          lines={[
            'One surface,',
            <span
              key="seam"
              style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}
            >
              no seam.
            </span>,
          ]}
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 'var(--text-display)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-4)',
            color: 'var(--color-fg)',
            position: 'relative',
          }}
        />

        <Reveal delay={90}>
          <div className="about-intro">
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
        </Reveal>
      </section>

      {/* 2 — Horizon */}
      <div className="rail">
        <Horizon variant="gold" />
      </div>

      {/* 3 — The Practice ledger */}
      <section className="rail" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-5)' }}>
        <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>
          Practice
        </span>
        <div>
          {PRACTICE.map((p, i) => (
            <Reveal key={p.number} delay={i * 90}>
              <div className="about-ledger-row">
                <SectionMark n={p.number} style={{ fontSize: 'clamp(6.5rem, 11vw, 9.5rem)' }} />
                <h2
                  style={{
                    fontFamily: 'var(--font-serif), serif',
                    fontSize: 'var(--text-title)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    lineHeight: 1.15,
                    margin: 0,
                    color: 'var(--color-fg)',
                    position: 'relative',
                  }}
                >
                  {p.title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: 'var(--text-body)',
                    lineHeight: 1.65,
                    color: 'var(--color-text-secondary)',
                    maxWidth: 'var(--prose-max)',
                    position: 'relative',
                  }}
                >
                  {p.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4 — Currently */}
      <section className="rail" style={{ paddingBottom: 'var(--space-6)' }}>
        <Reveal>
          <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>
            Currently
          </span>
          <div style={{ maxWidth: 820 }}>
            {CURRENTLY.map((row) => (
              <div key={row.label} className="about-row">
                <span style={{ ...mono12, paddingTop: 3 }}>{row.label}</span>
                <p style={{ margin: 0, fontSize: 'var(--text-body)', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
                  {row.text}
                  {row.link && (
                    <a
                      className="link-draw"
                      href={row.link.href}
                      target={row.link.href.startsWith('http') ? '_blank' : undefined}
                      rel={row.link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      style={{ color: 'var(--color-text-secondary)' }}
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

      {/* 5 — Closing pull-quote */}
      <section className="rail" style={{ paddingBottom: 'var(--space-6)' }}>
        <Horizon variant="sunset" draw style={{ marginBottom: 'var(--space-5)' }} />
        <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>
          What I&rsquo;m after
        </span>
        <RevealLines
          as="p"
          lines={[
            'Things that feel inevitable —',
            <span key="l2">
              software with the <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>weight of an object</span>,
            </span>,
            'objects with the intelligence of software.',
          ]}
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            margin: '0 0 var(--space-4)',
            color: 'var(--color-fg)',
          }}
        />
        <a
          className="link-action"
          href="https://www.linkedin.com/in/collin-stilwell/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-accent-gold-text)' }}
        >
          Say hello <span className="arrow" aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
