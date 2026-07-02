import type { Metadata } from 'next';
import Horizon from '../components/Horizon';
import { professional } from '../components/sections';

export const metadata: Metadata = {
  title: 'Professional — co.stil',
  description:
    'The professional record of Collin Stilwell — security engineering at Thirty Madison, open-source security work, and writing on application security.',
};

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

export default function ProfessionalRoute() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        .pro-row { display: grid; grid-template-columns: 120px 1fr auto; gap: var(--space-3); align-items: baseline; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border); }
        .pro-row:last-of-type { border-bottom: none; }
        .pro-work-row { display: block; text-decoration: none; padding: var(--space-4) 0; border-bottom: 1px solid var(--color-border); transition: border-color var(--duration-fast) var(--ease-signature); }
        .pro-work-row:last-of-type { border-bottom: none; }
        .pro-work-row:hover { border-color: color-mix(in srgb, var(--color-accent-gold) 40%, transparent); }
        .pro-work-row .pro-arrow { display: inline-block; transition: transform var(--duration-fast) var(--ease-signature); color: var(--color-text-faint); }
        .pro-work-row:hover .pro-arrow { transform: translateX(2px); color: var(--color-accent-gold); }
        .pro-beat-1 { animation: pageIn var(--duration-slow) var(--ease-signature) both; }
        .pro-beat-2 { animation: pageIn var(--duration-slow) var(--ease-signature) 150ms both; }
        @media (max-width: 640px) {
          .pro-row { grid-template-columns: 1fr; gap: var(--space-1); }
        }
      `}</style>

      {/* 1 — Hero */}
      <section style={{ ...container, paddingTop: 'clamp(120px, 18vh, 200px)', paddingBottom: 'var(--space-5)' }}>
        <h1
          className="pro-beat-1"
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
          Professional
        </h1>
        <p
          className="pro-beat-2"
          style={{
            margin: 0,
            fontSize: 'var(--text-body)',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
          }}
        >
          Security engineering is the day job and the discipline under everything else.
          This is the record — where I work, what I&rsquo;ve shipped in the open, and what
          I write about it. The studio side of the practice lives everywhere else on this site.
        </p>
      </section>

      <div style={container}>
        <Horizon variant="gold" />
      </div>

      {/* 2 — Career */}
      <section style={{ ...container, paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-5)' }}>
        <span style={{ ...label, display: 'block', marginBottom: 'var(--space-3)' }}>Career</span>
        <div style={{ maxWidth: 820 }}>
          {professional.career.map((row) => (
            <div key={row.label} className="pro-row">
              <span style={mono12}>{row.label}</span>
              <p style={{ margin: 0, fontSize: 'var(--text-body)', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
                {row.role} — <span style={{ color: 'var(--color-fg)' }}>{row.org}</span>
              </p>
              <span style={mono12}>{row.period}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — Selected work */}
      <section style={{ ...container, paddingBottom: 'var(--space-5)' }}>
        <span style={{ ...label, display: 'block', marginBottom: 'var(--space-2)' }}>Selected work</span>
        <div style={{ maxWidth: 820 }}>
          {professional.work.map((item, i) => (
            <a
              key={item.name}
              className="pro-work-row"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                <span style={mono12}>{String(i + 1).padStart(2, '0')}</span>
                <span
                  style={{
                    fontSize: 'var(--text-title)',
                    lineHeight: 1.15,
                    color: 'var(--color-fg)',
                    ...item.logoStyle,
                  }}
                >
                  {item.name}
                </span>
                <span className="pro-arrow" aria-hidden="true">↗</span>
              </div>
              <p style={{ margin: '0 0 var(--space-1)', fontSize: 15, lineHeight: 1.65, color: 'var(--color-text-muted)', maxWidth: 'var(--prose-max)' }}>
                {item.description}
              </p>
              <span style={mono12}>
                {item.meta.year} · {item.meta.stack}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 4 — Writing */}
      <section style={{ ...container, paddingBottom: 'var(--space-6)' }}>
        <span style={{ ...label, display: 'block', marginBottom: 'var(--space-2)' }}>Writing</span>
        <div style={{ maxWidth: 820 }}>
          {professional.writing.map((piece) => (
            <a
              key={piece.title}
              className="pro-work-row"
              href={piece.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                <span style={mono12}>{piece.date}</span>
                <span className="pro-arrow" aria-hidden="true">↗</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif), serif',
                  fontSize: 'var(--text-title)',
                  fontWeight: 300,
                  lineHeight: 1.2,
                  margin: '0 0 var(--space-1)',
                  color: 'var(--color-fg)',
                  maxWidth: '32ch',
                }}
              >
                {piece.title}
              </h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--color-text-muted)', maxWidth: 'var(--prose-max)' }}>
                {piece.description}
              </p>
            </a>
          ))}
          <p style={{ margin: 'var(--space-3) 0 0', fontSize: 14, color: 'var(--color-text-muted)' }}>
            More at{' '}
            <a
              href="https://collinsthoughts.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-text-secondary)', textDecorationColor: 'var(--color-border-mid)', textUnderlineOffset: 3 }}
            >
              collinsthoughts.substack.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
