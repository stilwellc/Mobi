import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Horizon from '../../components/Horizon';
import IndexRow from '../../components/IndexRow';
import RevealLines from '../../components/RevealLines';
import Reveal from '../../components/Reveal';
import SectionMark from '../../components/SectionMark';
import { prints } from '../../physical/prints/data';

export const metadata: Metadata = {
  title: 'Prints — co.stil',
  description:
    'An AI text-to-print pipeline and the library it produces — lighting, furniture parts, and design studies, each with an inspectable model.',
};

/* THE MANUSCRIPT — the pipeline read top to bottom as a document.
   Each stage is a chapter: the sentence as a dedication page, the
   code as a typeset plate, the object as a full plate, the repo as
   a closing manifest. The library follows as the appendix. */

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

const MANIFEST: { file: string; role: string }[] = [
  { file: 'SKILL.md', role: 'the skill definition the AI follows — modes, triggers, print-safe design rules' },
  { file: 'run_cadquery_model.py', role: 'executes generated models, returns structured success or failure' },
  { file: 'preview.py', role: 'renders each STL so you see the object before the printer does' },
  { file: 'mesh_io.py', role: 'watertight validation — strict mode rejects unprintable meshes' },
  { file: 'stl_to_3mf.py', role: 'print-ready packaging for the slicer' },
  { file: 'tests/', role: 'the wrapper is tested like any other software here' },
];

function FlowMark() {
  return (
    <div className="ms-link" aria-hidden="true">
      <span className="ms-link-line" />
      <span className="ms-link-glyph">&darr;</span>
    </div>
  );
}

function ChapterMark({
  n,
  word,
  note,
}: {
  n: string;
  word: string;
  note: string;
}) {
  return (
    <div className="ms-marg">
      <div className="ms-mark">
        <span className="ms-no">{n}</span>
        <span className="ms-word">{word}</span>
      </div>
      <p className="ms-note">{note}</p>
    </div>
  );
}

export default function PrintsManuscriptPage() {
  return (
    <div className="rail" style={{ paddingBlock: 'var(--space-5) var(--space-6)' }}>
      <style>{`
        .ms-ch{position:relative;overflow:hidden;display:grid;grid-template-columns:1fr;row-gap:var(--space-3);padding:var(--space-4) 0}
        .ms-marg{position:relative;z-index:1}
        .ms-body{position:relative;z-index:1;min-width:0}
        .ms-mark{display:flex;align-items:baseline;gap:12px;padding-bottom:12px;border-bottom:1px solid var(--color-border-mid);margin-bottom:14px}
        .ms-no{font-family:var(--font-mono),monospace;font-size:12px;font-weight:700;letter-spacing:0.18em;color:var(--color-accent-gold-text)}
        .ms-word{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:var(--color-text-secondary)}
        .ms-note{margin:0;font-family:var(--font-mono),monospace;font-size:12px;line-height:1.7;letter-spacing:0.04em;color:var(--color-text-muted);max-width:44ch}
        .ms-quote{margin:0;font-family:var(--font-serif),serif;font-style:italic;font-weight:300;font-size:clamp(1.4rem,12px + 2.8vw,3.3rem);line-height:1.32;letter-spacing:-0.01em;color:var(--color-fg);text-wrap:balance}
        .ms-plate{margin:0;max-width:37rem}
        .ms-plate-head{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:13px 20px;border-bottom:1px solid var(--color-border);font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;color:var(--color-text-muted)}
        .ms-plate-head b{font-weight:400;color:var(--color-text-secondary)}
        .ms-code{margin:0;padding:18px 20px 22px;overflow-x:auto}
        .ms-row{display:grid;grid-template-columns:2.4ch minmax(0,1fr);column-gap:16px;font-family:var(--font-mono),monospace;font-size:clamp(0.75rem,0.66rem + 0.3vw,0.875rem);line-height:1.95}
        .ms-ln{color:var(--color-text-muted);text-align:right;user-select:none}
        .ms-src{white-space:pre;color:var(--color-text-secondary)}
        .ms-cmt{color:var(--color-accent-gold-text)}
        .ms-fig{margin:0}
        .ms-img{border:1px solid var(--color-border);border-radius:14px;overflow:hidden}
        .ms-img img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}
        .ms-cap{margin:12px 0 0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.06em;line-height:1.7;color:var(--color-text-muted);max-width:62ch}
        .ms-repo{font-family:var(--font-mono),monospace;font-size:clamp(1.05rem,0.9rem + 1vw,1.55rem);letter-spacing:0.01em;color:var(--color-fg);overflow-wrap:anywhere}
        .ms-repo-mark{color:var(--color-accent-gold-text)}
        .ms-setup-line{margin:14px 0 0;font-size:1rem;line-height:1.65;color:var(--color-text-secondary);max-width:55ch}
        .ms-man{margin-top:var(--space-3)}
        .ms-man-label{margin:0;padding-bottom:10px;border-bottom:1px solid var(--color-border-mid);font-family:var(--font-mono),monospace;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--color-text-muted)}
        .ms-file{display:grid;grid-template-columns:15rem minmax(0,1fr);column-gap:var(--space-3);padding:11px 0;border-bottom:1px solid var(--color-border);font-family:var(--font-mono),monospace;font-size:12px;line-height:1.65}
        .ms-file-name{color:var(--color-accent-gold-text);white-space:nowrap}
        .ms-file-role{color:var(--color-text-muted)}
        .ms-link{display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:2px 0 2px 1px}
        .ms-link-line{width:1px;height:44px;background:linear-gradient(180deg,transparent,var(--color-accent-gold));opacity:0.6}
        .ms-link-glyph{font-family:var(--font-mono),monospace;font-size:13px;line-height:1;color:var(--color-accent-gold-text)}
        @media (min-width: 960px){
          .ms-ch{grid-template-columns:190px minmax(0,1fr);column-gap:clamp(40px,5vw,72px);padding:var(--space-5) 0}
          .ms-marg{padding-top:5px}
          .ms-note{max-width:24ch}
          .ms-link{margin-left:calc(190px + clamp(40px,5vw,72px))}
        }
        @media (max-width: 700px){
          .ms-file{grid-template-columns:1fr;row-gap:3px;padding:13px 0}
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
          print-ready model. Read one pass of the pipeline below, top to bottom &mdash; then
          the library it&rsquo;s building.
        </p>
      </header>

      <Horizon variant="gold" />

      <article aria-label="The pipeline, read as a document" style={{ margin: 'var(--space-3) 0 0' }}>
        {/* 01 — DESCRIBE */}
        <section className="ms-ch" aria-label="Chapter one — describe">
          <SectionMark n="01" align="right" />
          <ChapterMark
            n="01"
            word="Describe"
            note="The whole input — one sentence. No sketch, no CAD, no dimensions beyond intent."
          />
          <div className="ms-body">
            <RevealLines
              as="p"
              className="ms-quote"
              lines={[
                '“A wall sconce —',
                'cylindrical diffuser,',
                'perforated so the light spills,',
                'on a flat plate that mounts flush.”',
              ]}
            />
          </div>
        </section>

        <FlowMark />

        {/* 02 — MODEL */}
        <section className="ms-ch" aria-label="Chapter two — model">
          <SectionMark n="02" align="right" />
          <ChapterMark
            n="02"
            word="Model"
            note="What the skill wrote back — parametric CadQuery, excerpted: shell, perforation, plate."
          />
          <div className="ms-body">
            <Reveal>
              <figure className="glass glass-quiet ms-plate" aria-label="CadQuery excerpt">
                <figcaption className="ms-plate-head">
                  <b>wall_sconce.py</b>
                  <span>CadQuery &mdash; excerpt</span>
                </figcaption>
                <pre className="ms-code"><code>
                  {CODE_LINES.map((line, i) => (
                    <span key={i} className="ms-row">
                      <span className="ms-ln" aria-hidden="true">
                        {line.text ? String(i + 1).padStart(2, '0') : ''}
                      </span>
                      <span className={line.comment ? 'ms-src ms-cmt' : 'ms-src'}>
                        {line.text || ' '}
                      </span>
                    </span>
                  ))}
                </code></pre>
              </figure>
            </Reveal>
          </div>
        </section>

        <FlowMark />

        {/* 03 — PRINT */}
        <section className="ms-ch" aria-label="Chapter three — print">
          <SectionMark n="03" align="right" />
          <ChapterMark
            n="03"
            word="Print"
            note="The shell is the finished diffuser — no glass, no fabric, no post-processing."
          />
          <div className="ms-body">
            <figure className="ms-fig">
              <Reveal variant="unveil" className="ms-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/work/prints.jpg"
                  alt="The wall sconce twice — the parametric model rendered as a wireframe beside the object printed in PLA"
                  loading="lazy"
                />
              </Reveal>
              <figcaption className="ms-cap">
                The same geometry twice &mdash; the model as wireframe, the object in PLA.
                199 &times; 140 &times; 191 mm, printed as drawn.
              </figcaption>
            </figure>
          </div>
        </section>

        <FlowMark />

        {/* 04 — THE SETUP */}
        <section className="ms-ch" aria-label="Chapter four — the setup">
          <SectionMark n="04" align="right" />
          <ChapterMark
            n="04"
            word="The Setup"
            note="Everything chapters 01–03 need, in one place — open source."
          />
          <div className="ms-body">
            <Reveal>
              <a
                className="link-draw ms-repo"
                href="https://github.com/stilwellc/parametric-3d-printing"
                target="_blank"
                rel="noopener noreferrer"
              >
                stilwellc/parametric-3d-printing<span className="ms-repo-mark" aria-hidden="true">&nbsp;&#8599;</span>
              </a>
              <p className="ms-setup-line">
                A sentence in, a watertight parametric model out &mdash; printable as-is.
              </p>
              <div className="ms-man">
                <p className="ms-man-label">Manifest &mdash; 6 entries</p>
                {MANIFEST.map((entry) => (
                  <div className="ms-file" key={entry.file}>
                    <span className="ms-file-name">{entry.file}</span>
                    <span className="ms-file-role">{entry.role}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </article>

      <Horizon variant="gold" style={{ marginBlock: 'var(--space-4) var(--space-5)' }} />

      {/* APPENDIX — the library */}
      <section aria-label="The library">
        <p className="eyebrow" style={{ margin: '0 0 var(--space-1)' }}>Appendix &mdash; The Library</p>
        <p
          style={{
            margin: '0 0 var(--space-3)',
            fontSize: '1rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
          }}
        >
          What the pipeline is building &mdash; lighting, furniture parts, and design studies,
          printed and in use.
        </p>
        <div>
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
      </section>
    </div>
  );
}
