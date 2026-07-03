import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Horizon from '../../components/Horizon';
import IndexRow from '../../components/IndexRow';
import RevealLines from '../../components/RevealLines';
import { prints } from './data';

export const metadata: Metadata = {
  title: 'Prints — co.stil',
  description: 'An AI text-to-print pipeline and the library it produces — lighting, furniture parts, and design studies, each with an inspectable model.',
};

export default function PrintsPage() {
  return (
    <div className="rail" style={{ paddingBlock: 'var(--space-5) var(--space-6)' }}>
      {/* Ritual header */}
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <p className="eyebrow" style={{ margin: '0 0 var(--space-2)' }}>
          <Link href="/physical" className="link-draw" style={{ color: 'inherit' }}>
            Physical
          </Link>
          {' — Additive'}
        </p>
        <RevealLines
          as="h1"
          trigger="mount"
          lines={['Prints']}
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 'var(--text-display)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-3)',
          }}
        />
        <p
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
            margin: 0,
          }}
        >
          Describe an object in plain language; an AI pipeline turns it into a parametric,
          print-ready model. This is the library it&rsquo;s building &mdash; lighting, furniture
          parts, and design studies, printed and in use.
        </p>
      </header>

      <Horizon variant="gold" />

      {/* THE PIPELINE — shown, not linked: a sentence becomes a
          parametric model becomes an object, in three stages. */}
      <section
        aria-label="The pipeline"
        style={{ margin: 'var(--space-5) 0 var(--space-6)' }}
      >
        <style>{`
          .pipe-grid{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:clamp(16px,2vw,28px);align-items:stretch;padding:clamp(20px,2.2vw,32px)}
          .pipe-stage{display:flex;flex-direction:column;gap:var(--space-2);min-width:0}
          .pipe-arrow{align-self:center;font-family:var(--font-mono),monospace;font-size:18px;color:var(--color-accent-gold)}
          .pipe-label{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:var(--color-text-muted)}
          .pipe-label b{color:var(--color-accent-gold-text);font-weight:400;margin-right:8px}
          .pipe-quote{margin:0;font-family:var(--font-serif),serif;font-style:italic;font-weight:300;font-size:clamp(1.15rem,1.6vw,1.45rem);line-height:1.5;color:var(--color-fg)}
          .pipe-code{margin:0;padding:14px 16px;border:1px solid var(--color-border);border-radius:10px;background:color-mix(in srgb, var(--color-bg) 92%, black);overflow-x:auto}
          .pipe-code code{font-family:var(--font-mono),monospace;font-size:12px;line-height:1.75;color:var(--color-text-secondary);white-space:pre}
          .pipe-img{position:relative;border:1px solid var(--color-border);border-radius:10px;overflow:hidden;aspect-ratio:16/10}
          .pipe-img img{width:100%;height:100%;object-fit:cover;display:block}
          .pipe-foot{display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-2);flex-wrap:wrap;padding:0 clamp(20px,2.2vw,32px) clamp(16px,1.8vw,24px)}
          .pipe-note{margin:0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.06em;color:var(--color-text-muted)}
          @media (max-width: 900px){
            .pipe-grid{grid-template-columns:1fr}
            .pipe-arrow{transform:rotate(90deg);align-self:flex-start;margin-left:2px}
          }
        `}</style>
        <div className="glass">
          <div className="pipe-grid">
            <div className="pipe-stage">
              <span className="pipe-label"><b>01</b>Describe</span>
              <p className="pipe-quote">
                &ldquo;A wall sconce &mdash; cylindrical diffuser, perforated so the
                light spills, on a flat plate that mounts flush.&rdquo;
              </p>
            </div>
            <span className="pipe-arrow" aria-hidden="true">&rarr;</span>
            <div className="pipe-stage">
              <span className="pipe-label"><b>02</b>Model</span>
              <pre className="pipe-code"><code>{`import cadquery as cq

shade = (cq.Workplane("XY")
    .circle(70).circle(66)     # 4 mm shell
    .extrude(190))

shade = (shade.faces("<X")
    .workplane()
    .pushPoints(GRID).hole(9)) # light spill

plate = cq.Workplane("YZ").rect(120, 140).extrude(6)
cq.exporters.export(shade.union(plate), "sconce.3mf")`}</code></pre>
            </div>
            <span className="pipe-arrow" aria-hidden="true">&rarr;</span>
            <div className="pipe-stage">
              <span className="pipe-label"><b>03</b>Print</span>
              <div className="pipe-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/3d-prints/wall-sconce.jpg" alt="The wall sconce, printed in PLA — the object the sentence became" loading="lazy" />
              </div>
            </div>
          </div>
          <div className="pipe-foot">
            <p className="pipe-note">
              A sentence in, a watertight parametric model out &mdash; printable as-is.
            </p>
            <a
              href="https://github.com/stilwellc/parametric-3d-printing"
              target="_blank"
              rel="noopener noreferrer"
              className="link-action"
              style={{ color: 'var(--color-accent-gold-text)' }}
            >
              The pipeline is open source <span className="arrow" aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </div>
      </section>

      <p className="eyebrow" style={{ margin: '0 0 var(--space-3)' }}>The Library</p>

      {/* The objects — one list grammar, each row shows the thing itself */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        {prints.map((print, i) => {
          const meta = [print.details.material, print.details.dimensions, print.details.status]
            .filter(Boolean)
            .join(' · ');
          return (
            <IndexRow
              key={print.id}
              index={String(i + 1).padStart(2, '0')}
              title={print.name}
              description={print.description}
              meta={meta}
              href={`/physical/prints/${print.id}`}
              accent="gold"
              media={{ src: print.image, alt: print.imageAlt }}
            />
          );
        })}
      </div>

    </div>
  );
}
