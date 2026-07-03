import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Horizon from '../../components/Horizon';
import Reveal from '../../components/Reveal';
import RevealLines from '../../components/RevealLines';
import SectionMark from '../../components/SectionMark';
import Plate from './Plate';
import PlateIndex, { type PlateIndexItem } from './PlateIndex';
import { prints } from './data';

export const metadata: Metadata = {
  title: 'Prints — co.stil',
  description:
    'An AI text-to-print pipeline and the library it produces — lighting, furniture parts, and design studies, each with an inspectable model.',
};

/* The generated model, typeset line by line — real CadQuery,
   excerpted; comments dimmed to gold like margin notes. */
const CODE_LINES: { text: string; comment?: boolean }[] = [
  { text: 'import cadquery as cq' },
  { text: '' },
  { text: '# the shade — a 4 mm shell', comment: true },
  { text: 'shade = (cq.Workplane("XY")' },
  { text: '    .circle(70).circle(66)' },
  { text: '    .extrude(190))' },
  { text: '' },
  { text: '# perforate — the light spill', comment: true },
  { text: 'shade = (shade.faces("<X")' },
  { text: '    .workplane()' },
  { text: '    .pushPoints(GRID).hole(9))' },
  { text: '' },
  { text: '# the plate, mounting flush', comment: true },
  { text: 'plate = (cq.Workplane("YZ")' },
  { text: '    .rect(120, 140).extrude(6))' },
  { text: '' },
  { text: 'cq.exporters.export(' },
  { text: '    shade.union(plate),' },
  { text: '    "sconce.3mf")' },
];

/* The repo ledger — real files, verified one-liners. */
const REPO_FILES: Array<[string, string]> = [
  ['SKILL.md', 'the skill definition the AI follows — modes, triggers, print-safe design rules'],
  ['run_cadquery_model.py', 'executes generated models, returns structured success or failure'],
  ['preview.py', 'renders each STL so you see the object before the printer does'],
  ['mesh_io.py', 'watertight validation — strict mode rejects unprintable meshes'],
  ['stl_to_3mf.py', 'print-ready packaging for the slicer'],
  ['tests/', 'the wrapper is tested like any other software here'],
];

const LIB_NUMBERS = ['05', '06', '07'];

export default function PrintsPage() {
  const sconce = prints.find((p) => p.id === 'wall-sconce') ?? prints[0];

  const indexItems: PlateIndexItem[] = [
    { id: 'step-01', no: '01', label: 'Describe' },
    { id: 'step-02', no: '02', label: 'Model' },
    { id: 'step-03', no: '03', label: 'Print' },
    { id: 'step-04', no: '04', label: 'The Setup' },
    ...prints.map((print, i) => ({
      id: `item-${LIB_NUMBERS[i]}`,
      no: LIB_NUMBERS[i],
      label: print.name,
    })),
  ];

  return (
    <div className="rail" style={{ paddingBlock: 'var(--space-5) var(--space-6)' }}>
      <style>{`
        .folio{display:grid;grid-template-columns:minmax(0,1fr)}
        .f-indexcol{display:none}
        .f-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(16px,1.7vw,24px);align-items:stretch}
        .f-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,1.7vw,24px);align-items:stretch}
        .f-cell{min-width:0;display:flex}
        .f-full{grid-column:1/-1}
        .plate{width:100%;display:flex;flex-direction:column;padding:clamp(20px,2.3vw,30px);min-width:0;text-decoration:none;color:var(--color-fg);scroll-margin-top:104px}
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
        .f-codehead{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding-bottom:10px;margin-bottom:14px;border-bottom:1px solid var(--color-border);font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;color:var(--color-text-muted)}
        .f-codehead b{font-weight:400;color:var(--color-text-secondary)}
        .f-code{margin:0;overflow-x:auto}
        .f-code code{display:block;font-family:var(--font-mono),monospace;font-size:12.5px;line-height:1.8}
        .f-coderow{display:grid;grid-template-columns:2.4ch minmax(0,1fr);column-gap:14px}
        .f-ln{color:var(--color-text-muted);text-align:right;user-select:none}
        .f-src{white-space:pre;color:var(--color-text-secondary)}
        .f-cmt{color:var(--color-accent-gold-text)}
        .f-code-note{margin:var(--space-3) 0 0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.04em;line-height:1.7;color:var(--color-text-muted);max-width:52ch}
        .f-print{flex:1;display:grid;grid-template-columns:1.35fr 1fr;gap:clamp(20px,3vw,48px);align-items:stretch}
        .f-print-fig{margin:0;display:flex;flex-direction:column;min-width:0}
        .f-print-img{position:relative;flex:1;border:1px solid var(--color-border);border-radius:12px;overflow:hidden;min-height:340px}
        .f-print-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
        .f-img-cap{margin:12px 0 0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.06em;line-height:1.7;color:var(--color-text-muted)}
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
        .f-index-title{margin:0 0 4px;font-family:var(--font-mono),monospace;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--color-text-muted)}
        .f-ientry{display:grid;grid-template-columns:2.6ch minmax(0,1fr);align-items:baseline;column-gap:12px;text-decoration:none}
        .f-ientry-no{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.1em;color:var(--color-text-muted);transition:color var(--duration-base) var(--ease-signature)}
        .f-ientry-name{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;line-height:1.5;color:var(--color-text-muted);transition:color var(--duration-base) var(--ease-signature),transform var(--duration-base) var(--ease-signature)}
        .f-ientry.is-lit .f-ientry-no{color:var(--color-accent-gold-text)}
        .f-ientry.is-now .f-ientry-name{color:var(--color-fg);transform:translateX(2px)}
        .f-ientry:hover .f-ientry-name,.f-ientry:focus-visible .f-ientry-name{color:var(--color-fg)}
        @media (min-width:1000px){
          .folio{grid-template-columns:148px minmax(0,1fr);column-gap:clamp(36px,4.5vw,80px)}
          .f-indexcol{display:block}
          .f-index{position:sticky;top:112px;display:flex;flex-direction:column;gap:16px;padding-top:56px}
        }
        @media (max-width:900px){
          .f-grid,.f-grid3{grid-template-columns:1fr}
          .f-print{grid-template-columns:1fr;gap:var(--space-3)}
          .f-print-img{flex:none;min-height:0;aspect-ratio:16/10}
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
          print-ready model. The pipeline, step by step, and the library it&rsquo;s building &mdash;
          lighting, furniture parts, and design studies, printed and in use.
        </p>
      </header>

      <Horizon variant="gold" />

      <div className="folio">
        {/* Running page index — desktop only */}
        <div className="f-indexcol">
          <PlateIndex items={indexItems} />
        </div>

        <div>
          {/* ========== THE PIPELINE — steps 01-04 ========== */}
          <section aria-label="The pipeline">
            <div className="f-sec">
              <SectionMark n="01" align="right" style={{ fontSize: 'clamp(96px, 11vw, 150px)', top: 4, transform: 'none' }} />
              <p className="eyebrow">The Pipeline</p>
              <p className="f-sec-flow" aria-hidden="true">
                sentence &rarr; model &rarr; object &rarr; setup
              </p>
            </div>

            <div className="f-grid">
              {/* Step 01 — the sentence */}
              <Reveal className="f-cell">
                <Plate id="step-01" no="Step 01" role="Describe" caption="Input · plain language" xref={<>Next &middot; Model &rarr;</>}>
                  <p className="f-quote">
                    &ldquo;A wall sconce &mdash; cylindrical diffuser, perforated so the light
                    spills, on a flat plate that mounts flush.&rdquo;
                  </p>
                  <p className="f-quote-src">
                    One sentence, spoken to the skill. No sketch, no CAD session.
                  </p>
                </Plate>
              </Reveal>

              {/* Step 02 — the generated model, typeset */}
              <Reveal className="f-cell" delay={90}>
                <Plate id="step-02" no="Step 02" role="Model" caption="CadQuery · generated by the skill" xref={<>Next &middot; Print &rarr;</>}>
                  <div className="f-codehead">
                    <b>wall_sconce.py</b>
                    <span>CadQuery &mdash; excerpt</span>
                  </div>
                  <pre className="f-code">
                    <code>
                      {CODE_LINES.map((line, i) => (
                        <span key={i} className="f-coderow">
                          <span className="f-ln" aria-hidden="true">
                            {line.text ? String(i + 1).padStart(2, '0') : ''}
                          </span>
                          <span className={line.comment ? 'f-src f-cmt' : 'f-src'}>
                            {line.text || ' '}
                          </span>
                        </span>
                      ))}
                    </code>
                  </pre>
                  <p className="f-code-note">
                    Geometry as code &mdash; a 4&nbsp;mm shell, a grid of light holes, a mounting
                    plate, unioned and exported for the slicer. Every dimension is a variable
                    you can argue with.
                  </p>
                </Plate>
              </Reveal>

              {/* Step 03 — the object, full width. The payoff gets the mass. */}
              <Reveal className="f-cell f-full">
                <Plate
                  id="step-03"
                  no="Step 03"
                  role="Print"
                  caption="Output · the object the sentence became"
                  xref={
                    <Link
                      href="/physical/prints/wall-sconce"
                      className="link-action"
                      style={{ color: 'var(--color-accent-gold-text)' }}
                    >
                      See it in the library{' '}
                      <span className="arrow" aria-hidden="true">&rarr;</span>
                    </Link>
                  }
                >
                  <div className="f-print">
                    <figure className="f-print-fig">
                      <div className="f-print-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/work/prints.jpg"
                          alt="The wall sconce twice — the parametric model rendered as a wireframe beside the object printed in PLA"
                          loading="lazy"
                        />
                      </div>
                      <figcaption className="f-img-cap">
                        The same geometry twice &mdash; the model as wireframe, the object in PLA.
                        Printed as drawn.
                      </figcaption>
                    </figure>
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

              {/* Step 04 — the setup. The repo IS the pipeline. */}
              <Reveal className="f-cell f-full">
                <Plate
                  id="step-04"
                  no="Step 04"
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

          {/* ========== THE LIBRARY — items 05-07 ========== */}
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
                    id={`item-${LIB_NUMBERS[i]}`}
                    no={LIB_NUMBERS[i]}
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
      </div>
    </div>
  );
}
