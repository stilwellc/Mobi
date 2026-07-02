import type { Metadata } from 'next';
import Horizon from '../components/Horizon';
import IndexRow from '../components/IndexRow';
import RevealLines from '../components/RevealLines';
import SectionMark from '../components/SectionMark';
import { professional } from '../components/sections';

export const metadata: Metadata = {
  title: 'Professional — co.stil',
  description:
    'The professional record of Collin Stilwell — security engineering at Thirty Madison, open-source security work, and writing on application security.',
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
        .pro-write-row { position: relative; display: block; text-decoration: none; padding: var(--space-3) 0 var(--space-4); border-bottom: 1px solid var(--color-border); transition: border-color var(--duration-fast) var(--ease-signature); }
        .pro-write-row:hover, .pro-write-row:focus-visible { border-bottom-color: var(--color-accent-gold); }
        .pro-write-row .pro-arrow { display: inline-block; color: var(--color-text-muted); transition: transform var(--duration-fast) var(--ease-signature), color var(--duration-fast) var(--ease-signature); }
        .pro-write-row:hover .pro-arrow, .pro-write-row:focus-visible .pro-arrow { transform: translateX(2px); color: var(--color-accent-gold-text); }
        @media (max-width: 640px) {
          .pro-row { grid-template-columns: 1fr; gap: var(--space-1); }
        }
      `}</style>

      {/* 1 — Ritual header, route numeral 03 */}
      <section
        className="rail"
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 'clamp(120px, 18vh, 200px)',
          paddingBottom: 'var(--space-5)',
        }}
      >
        <SectionMark
          n="03"
          align="right"
          style={{ fontSize: 'clamp(180px, 22vw, 320px)' }}
        />
        <span
          className="eyebrow"
          style={{ display: 'block', marginBottom: 'var(--space-2)', position: 'relative' }}
        >
          The Record
        </span>
        <RevealLines
          as="h1"
          trigger="mount"
          delay={250}
          lines={['Professional']}
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
          Security engineering is the day job and the discipline under everything else.
          This is the record — where I work, what I&rsquo;ve shipped in the open, and what
          I write about it. The studio side of the practice lives everywhere else on this site.
        </p>
      </section>

      <div className="rail">
        <Horizon variant="gold" />
      </div>

      {/* 2 — Career (static ledger — not links, no hover) */}
      <section className="rail" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-5)' }}>
        <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>Career</span>
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

      {/* 3 — Selected work: the one list grammar; names in the light serif register */}
      <section className="rail" style={{ paddingBottom: 'var(--space-5)' }}>
        <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Selected work</span>
        <div style={{ maxWidth: 820 }}>
          {professional.work.map((item, i) => (
            <IndexRow
              key={item.name}
              index={String(i + 1).padStart(2, '0')}
              title={item.name}
              description={item.description}
              meta={`${item.meta.year} · ${item.meta.stack}`}
              href={item.url}
              external
            />
          ))}
        </div>
      </section>

      {/* 4 — Writing */}
      <section className="rail" style={{ paddingBottom: 'var(--space-6)' }}>
        <span className="eyebrow" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Writing</span>
        <div style={{ maxWidth: 820 }}>
          {professional.writing.map((piece) => (
            <a
              key={piece.title}
              className="pro-write-row"
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
              className="link-draw"
              href="https://collinsthoughts.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              collinsthoughts.substack.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
