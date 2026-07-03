import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Horizon from '../../components/Horizon';
import Reveal from '../../components/Reveal';
import RevealLines from '../../components/RevealLines';
import SectionMark from '../../components/SectionMark';
import { prints } from '../../physical/prints/data';
import Plate from './Plate';

export const metadata: Metadata = {
  title: 'Prints — co.stil',
  description:
    'An AI text-to-print pipeline and the library it produces — lighting, furniture parts, and design studies, each with an inspectable model.',
};

/* The repo ledger — real files, verified one-liners. */
const REPO_FILES: Array<[string, string]> = [
  ['SKILL.md', 'the skill definition the AI follows — modes, triggers, print-safe design rules'],
  ['run_cadquery_model.py', 'executes generated models, returns structured success or failure'],
  ['preview.py', 'renders each STL so you see the object before the printer does'],
  ['mesh_io.py', 'watertight validation — strict mode rejects unprintable meshes'],
  ['stl_to_3mf.py', 'print-ready packaging for the slicer'],
  ['tests/', 'the wrapper is tested like any other software here'],
];

const LIB_NUMERALS = ['V', 'VI', 'VII'];

export default function PrintsFolioPage() {
  const sconce = prints.find((p) => p.id === 'wall-sconce') ?? prints[0];

  return (
    <div className="rail" style={{ paddingBlock: 'var(--space-5) var(--space-6)' }}>
      <style>{`
        .f-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(16px,1.7vw,24px);align-items:stretch}
        .f-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,1.7vw,24px);align-items:stretch}
        .f-cell{min-width:0;display:flex}
        .f-full{grid-column:1/-1}
        .plate{width:100%;display:flex;flex-direction:column;padding:clamp(20px,2.3vw,30px);min-width:0;text-decoration:none;color:var(--color-fg)}
        .plate-head{display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-2);margin-bottom:var(--space-3)}
        .plate-no{font-family:var(--font-mono),monospace;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--color-accent-gold-text);white-space:nowrap}
        .plate-role{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:var(--color-text-muted);text-align:right}
        .plate-body{flex:1;display:flex;flex-direction:column;min-width:0}
        .plate-cap{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px var(--space-2);margin-top:var(--space-3);padding-top:12px;border-top:1px solid var(--color-border);font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-muted)}
        .plate-xref{display:inline-block;color:var(--color-accent-gold-text);white-space:nowrap;transition:transform var(--duration-fast) var(--ease-signature)}
        a.plate:hover .plate-xref,a.plate:focus-visible .plate-xref{transform:translateX(2px)}
        .f-sec{position:relative;overflow:hidden;display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-2);flex-wrap:wrap;padding:52px 0 16px}
        .f-sec-flow{margin:0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.12em;color:var(--color-text-muted)}
        .f-sec .eyebrow{margin:0}
        .f-quote{margin:auto 0;padding:var(--space-2) 0;font-family:var(--font-serif),serif;font-style:italic;font-weight:300;font-size:clamp(1.4rem,1.9vw,1.8rem);line-height:1.45;letter-spacing:-0.01em;color:var(--color-fg);max-width:24ch}
        .f-quote-src{margin:var(--space-2) 0 0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;color:var(--color-text-muted);max-width:38ch;line-height:1.7}
        .f-code{margin:auto 0;overflow-x:auto}
        .f-code code{display:block;font-family:var(--font-mono),monospace;font-size:12.5px;line-height:1.72;color:var(--color-text-secondary);white-space:pre}
        .f-code .cmt{color:var(--color-accent-gold-text)}
        .f-print{flex:1;display:grid;grid-template-columns:1.35fr 1fr;gap:clamp(20px,3vw,48px);align-items:stretch}
        .f-print-img{position:relative;border:1px solid var(--color-border);border-radius:12px;overflow:hidden;min-height:340px}
        .f-print-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
        .f-print-facts{display:flex;flex-direction:column;justify-content:center;min-width:0;padding-block:var(--space-1)}
        .f-print-title{margin:0 0 var(--space-2);font-family:var(--font-serif),serif;font-weight:300;font-size:clamp(1.7rem,2.4vw,2.15rem);line-height:1.1;letter-spacing:-0.01em}
        .f-print-note{margin:0 0 var(--space-3);font-size:0.9375rem;line-height:1.65;color:var(--color-text-secondary);max-width:46ch}
        .f-fact{display:grid;grid-template-columns:118px 1fr;gap:var(--space-2);padding:9px 0;border-top:1px solid var(--color-border);font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.06em;line-height:1.6}
        .f-fact span:first-child{color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.12em}
        .f-fact span:last-child{color:var(--color-text-secondary)}
        .f-setup-top{display:flex;justify-content:space-between;align-items:flex-end;gap:var(--space-2) var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-3)}
        .f-repo{display:inline-block;font-family:var(--font-mono),monospace;font-size:clamp(1.05rem,1.5vw,1.3rem);letter-spacing:0.01em;color:var(--color-fg)}
        .f-repo-ext{color:var(--color-accent-gold-text);margin-left:6px}
        .f-setup-note{margin:0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.06em;line-height:1.7;color:var(--color-text-muted);max-width:42ch}
        .f-file{display:grid;grid-template-columns:224px 1fr;gap:var(--space-3);padding:10px 0;border-top:1px solid var(--color-border);font-family:var(--font-mono),monospace;font-size:12px;line-height:1.65}
        .f-file span:first-child{color:var(--color-accent-gold-text);white-space:nowrap}
        .f-file span:last-child{color:var(--color-text-muted)}
        .f-lib-img{position:relative;border:1px solid var(--color-border);border-radius:12px;overflow:hidden;aspect-ratio:4/3;margin-bottom:var(--space-3)}
        .f-lib-img img{width:100%;height:100%;object-fit:cover;display:block}
        .f-lib-title{margin:0 0 var(--space-1);font-family:var(--font-serif),serif;font-weight:300;font-size:clamp(1.4rem,1.8vw,1.7rem);line-height:1.15;letter-spacing:-0.01em}
        .f-lib-desc{margin:0 0 var(--space-2);font-size:0.9375rem;line-height:1.6;color:var(--color-text-secondary)}
        .f-lib-meta{margin:auto 0 0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;color:var(--color-text-muted)}
        @media (max-width:900px){
          .f-grid,.f-grid3{grid-template-columns:1fr}
          .f-print{grid-template-columns:1fr;gap:var(--space-3)}
          .f-print-img{min-height:0;aspect-ratio:4/3}
          .f-print-img img{position:static}
          .f-file{grid-template-columns:1fr;gap:2px;padding:12px 0}
          .f-quote{max-width:none;padding:var(--space-1) 0}
        }
      `}</style>

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
          print-ready model. A folio of the pipeline and the library it&rsquo;s building &mdash;
          lighting, furniture parts, and design studies, printed and in use.
        </p>
      </header>

      <Horizon variant="gold" />

      {/* ========== THE PIPELINE — plates I–IV ========== */}
      <section aria-label="The pipeline">
        <div className="f-sec">
          <SectionMark n="01" align="right" style={{ fontSize: 'clamp(96px, 11vw, 150px)', top: 4, transform: 'none' }} />
          <p className="eyebrow">The Pipeline</p>
          <p className="f-sec-flow" aria-hidden="true">
            sentence &rarr; model &rarr; object &rarr; setup
          </p>
        </div>

        <div className="f-grid">
          {/* PLATE I — the sentence */}
          <Reveal className="f-cell">
            <Plate no="I" role="Describe" caption="Input · plain language" xref={<>&rarr; Plate II</>}>
              <p className="f-quote">
                &ldquo;A wall sconce &mdash; cylindrical diffuser, perforated so the light
                spills, on a flat plate that mounts flush.&rdquo;
              </p>
              <p className="f-quote-src">
                One sentence, spoken to the skill. No sketch, no CAD session.
              </p>
            </Plate>
          </Reveal>

          {/* PLATE II — the generated model */}
          <Reveal className="f-cell" delay={90}>
            <Plate no="II" role="Model" caption="CadQuery · generated by the skill" xref={<>&rarr; Plate III</>}>
              <pre className="f-code">
                <code>
                  {'import cadquery as cq\n\n'}
                  <span className="cmt"># 4 mm shell</span>
                  {'\nshade = (cq.Workplane("XY")\n    .circle(70)\n    .circle(66)\n    .extrude(190))\n\n'}
                  <span className="cmt"># light spill</span>
                  {'\nshade = (shade.faces("<X")\n    .workplane()\n    .pushPoints(GRID)\n    .hole(9))\n\n'}
                  {'plate = (cq.Workplane("YZ")\n    .rect(120, 140)\n    .extrude(6))\n\n'}
                  {'cq.exporters.export(\n    shade.union(plate),\n    "sconce.3mf")'}
                </code>
              </pre>
            </Plate>
          </Reveal>

          {/* PLATE III — the object, full width. The payoff gets the mass. */}
          <Reveal className="f-cell f-full">
            <Plate
              no="III"
              role="Print"
              caption="Output · the object the sentence became"
              xref={<>cf. Plate V</>}
            >
              <div className="f-print">
                <div className="f-print-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sconce.image}
                    alt="The wall sconce, printed in PLA — the object the sentence became"
                    loading="lazy"
                  />
                </div>
                <div className="f-print-facts">
                  <h2 className="f-print-title">{sconce.name}</h2>
                  <p className="f-print-note">{sconce.notes}</p>
                  <div>
                    <div className="f-fact">
                      <span>Material</span>
                      <span>{sconce.details.material}</span>
                    </div>
                    <div className="f-fact">
                      <span>Dimensions</span>
                      <span>{sconce.details.dimensions}</span>
                    </div>
                    <div className="f-fact">
                      <span>Status</span>
                      <span>{sconce.details.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Plate>
          </Reveal>

          {/* PLATE IV — the setup. The repo IS the pipeline. */}
          <Reveal className="f-cell f-full">
            <Plate
              no="IV"
              role="The Setup"
              caption="Six files · everything the pipeline needs"
              xref="Open source"
            >
              <div className="f-setup-top">
                <a
                  href="https://github.com/stilwellc/parametric-3d-printing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f-repo link-draw"
                >
                  stilwellc/parametric-3d-printing
                  <span className="f-repo-ext" aria-hidden="true">&#8599;</span>
                </a>
                <p className="f-setup-note">
                  A sentence in, a watertight parametric model out, printable as-is.
                </p>
              </div>
              <div>
                {REPO_FILES.map(([name, desc]) => (
                  <div className="f-file" key={name}>
                    <span>{name}</span>
                    <span>{desc}</span>
                  </div>
                ))}
              </div>
            </Plate>
          </Reveal>
        </div>
      </section>

      {/* ========== THE LIBRARY — plates V–VII ========== */}
      <section aria-label="The library">
        <div className="f-sec" style={{ marginTop: 'var(--space-4)' }}>
          <SectionMark n="02" align="right" style={{ fontSize: 'clamp(96px, 11vw, 150px)', top: 4, transform: 'none' }} />
          <p className="eyebrow">The Library</p>
          <p className="f-sec-flow" aria-hidden="true">
            printed &middot; in use &middot; inspectable
          </p>
        </div>

        <div className="f-grid3">
          {prints.map((print, i) => (
            <Reveal className="f-cell" key={print.id} delay={i * 90}>
              <Plate
                no={LIB_NUMERALS[i]}
                role="The Library"
                href={`/physical/prints/${print.id}`}
                caption={[print.details.material, print.details.status].filter(Boolean).join(' · ')}
                xref="→"
              >
                <div className="f-lib-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={print.image} alt={print.imageAlt} loading="lazy" />
                </div>
                <h3 className="f-lib-title">{print.name}</h3>
                <p className="f-lib-desc">{print.description}</p>
                <p className="f-lib-meta">{print.details.dimensions}</p>
              </Plate>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
