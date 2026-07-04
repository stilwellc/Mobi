import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Horizon from '../../components/Horizon';
import Reveal from '../../components/Reveal';
import RevealLines from '../../components/RevealLines';
import SectionMark from '../../components/SectionMark';
import Plate from './Plate';
import { prints } from './data';

export const metadata: Metadata = {
  title: 'Prints — co.stil',
  description:
    'An AI text-to-print pipeline and the library it produces — lighting, furniture parts, and design studies, each with an inspectable model.',
};

/* The demo keeps only the essence of the generated model. */
const DEMO_CODE = [
  'shade = (cq.Workplane("XY")',
  '    .circle(70).circle(66)',
  '    .extrude(190))',
  '    .faces("<X").workplane()',
  '    .pushPoints(GRID).hole(9)',
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

export default function PrintsPage() {
  return (
    <div className="rail" style={{ paddingBlock: 'var(--space-5) var(--space-6)' }}>
      <style>{`
        .pr-sec{position:relative;overflow:hidden;padding:56px 0 20px}
        .pr-sec .eyebrow{margin:0 0 var(--space-1)}
        .pr-sec-title{margin:0;font-family:var(--font-serif),serif;font-weight:300;font-size:clamp(2rem,3.6vw,3rem);line-height:1.08;letter-spacing:-0.02em;color:var(--color-fg)}
        .demo{display:grid;grid-template-columns:1fr auto 1fr auto auto;gap:clamp(14px,1.8vw,26px);align-items:center;padding:clamp(18px,2vw,26px)}
        .demo-quote{margin:0;font-family:var(--font-serif),serif;font-style:italic;font-weight:300;font-size:clamp(1rem,1.35vw,1.2rem);line-height:1.5;color:var(--color-fg);max-width:26ch}
        .demo-arrow{font-family:var(--font-mono),monospace;font-size:16px;color:var(--color-accent-gold-text)}
        .demo-code{margin:0;overflow-x:auto}
        .demo-code code{display:block;font-family:var(--font-mono),monospace;font-size:12px;line-height:1.7;white-space:pre;color:var(--color-text-muted)}
        .demo-img{width:clamp(120px,12vw,170px);aspect-ratio:1/1;border-radius:10px;overflow:hidden;border:1px solid var(--color-border)}
        .demo-img img{width:100%;height:100%;object-fit:cover;display:block}
        .demo-cap{display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-2);flex-wrap:wrap;margin-top:12px;padding:0 clamp(18px,2vw,26px) clamp(14px,1.6vw,20px)}
        .demo-cap p{margin:0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-muted)}
        .setup{padding:clamp(22px,2.4vw,34px)}
        .setup-top{display:flex;justify-content:space-between;align-items:flex-end;gap:var(--space-2) var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-3)}
        .setup-repo{display:inline-block;font-family:var(--font-mono),monospace;font-size:clamp(1.2rem,2vw,1.7rem);letter-spacing:0.01em;color:var(--color-fg)}
        .setup-ext{color:var(--color-accent-gold-text);margin-left:8px}
        .setup-note{margin:0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.06em;line-height:1.7;color:var(--color-text-muted);max-width:42ch}
        .setup-files{display:grid;grid-template-columns:1fr 1fr;gap:0 var(--space-4)}
        .setup-file{display:grid;grid-template-columns:212px 1fr;gap:var(--space-2);padding:11px 0;border-top:1px solid var(--color-border);font-family:var(--font-mono),monospace;font-size:12px;line-height:1.65}
        .setup-file span:first-child{color:var(--color-accent-gold-text);white-space:nowrap}
        .setup-file span:last-child{color:var(--color-text-muted)}
        .plate{display:flex;flex-direction:column;flex:1;min-width:0;padding:clamp(18px,2vw,24px);text-decoration:none;color:inherit}
        .plate-head{display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-2);margin-bottom:var(--space-2);font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase}
        .plate-no{color:var(--color-accent-gold-text)}
        .plate-role{color:var(--color-text-muted)}
        .plate-body{display:flex;flex-direction:column;flex:1}
        .plate-cap{display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-2);margin-top:var(--space-2);padding-top:10px;border-top:1px solid var(--color-border);font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-muted)}
        .plate-xref{color:var(--color-accent-gold-text);transition:transform var(--duration-base) var(--ease-signature)}
        a.plate:hover .plate-xref{transform:translateX(4px)}
        .lib-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,1.8vw,26px);align-items:stretch}
        .lib-cell{min-width:0;display:flex}
        .lib-img{position:relative;border:1px solid var(--color-border);border-radius:12px;overflow:hidden;aspect-ratio:4/3;margin-bottom:var(--space-3)}
        .lib-img img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1);transition:transform var(--duration-slow) var(--ease-signature)}
        a.plate:hover .lib-img img{transform:scale(1.03)}
        .lib-title{margin:0 0 var(--space-1);font-family:var(--font-serif),serif;font-weight:300;font-size:clamp(1.5rem,2vw,1.85rem);line-height:1.15;letter-spacing:-0.01em}
        .lib-desc{margin:0 0 var(--space-2);font-size:0.9375rem;line-height:1.6;color:var(--color-text-secondary)}
        .lib-meta{margin:auto 0 0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;color:var(--color-text-muted)}
        @media (max-width: 900px){
          .demo{grid-template-columns:1fr;gap:var(--space-2)}
          .demo-arrow{transform:rotate(90deg);margin-left:2px}
          .demo-img{width:100%;aspect-ratio:16/10}
          .setup-files{grid-template-columns:1fr}
          .setup-file{grid-template-columns:1fr;gap:2px}
          .lib-grid{grid-template-columns:1fr}
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
          print-ready model. The code is open source, and the library below is what
          it&rsquo;s made so far.
        </p>
      </header>

      <Horizon variant="gold" />

      {/* THE DEMO — the value case in one glance, nothing more */}
      <Reveal>
        <section aria-label="The pipeline, in one pass" style={{ margin: 'var(--space-4) 0 0' }}>
          <div className="glass glass-quiet">
            <div className="demo">
              <p className="demo-quote">
                &ldquo;A wall sconce &mdash; perforated diffuser, flat plate that mounts flush.&rdquo;
              </p>
              <span className="demo-arrow" aria-hidden="true">&rarr;</span>
              <pre className="demo-code"><code>{DEMO_CODE.join('\n')}</code></pre>
              <span className="demo-arrow" aria-hidden="true">&rarr;</span>
              <div className="demo-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/3d-prints/wall-sconce.jpg"
                  alt="The printed wall sconce — the object the sentence became"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="demo-cap">
              <p>One sentence in &mdash; a watertight, printable model out.</p>
              <Link href="/physical/prints/wall-sconce" className="link-action" style={{ color: 'var(--color-accent-gold-text)' }}>
                The full object <span className="arrow" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ========== 01 — THE SETUP: the code that does it ========== */}
      <section aria-label="The setup">
        <div className="pr-sec">
          <SectionMark n="01" align="right" style={{ fontSize: 'clamp(110px, 13vw, 180px)', top: 4, transform: 'none' }} />
          <p className="eyebrow">The Setup</p>
          <h2 className="pr-sec-title">The code that does it</h2>
        </div>
        <Reveal>
          <div className="glass setup">
            <div className="setup-top">
              <a
                href="https://github.com/stilwellc/parametric-3d-printing"
                target="_blank"
                rel="noopener noreferrer"
                className="setup-repo link-draw"
              >
                stilwellc/parametric-3d-printing
                <span className="setup-ext" aria-hidden="true">&#8599;</span>
              </a>
              <p className="setup-note">
                Everything the pipeline needs, in one open-source repo &mdash; printable output,
                validated before it ever reaches the slicer.
              </p>
            </div>
            <div className="setup-files">
              {REPO_FILES.map(([name, desc]) => (
                <div className="setup-file" key={name}>
                  <span>{name}</span>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========== 02 — THE LIBRARY: what it made ========== */}
      <section aria-label="The library">
        <div className="pr-sec">
          <SectionMark n="02" align="right" style={{ fontSize: 'clamp(110px, 13vw, 180px)', top: 4, transform: 'none' }} />
          <p className="eyebrow">The Library</p>
          <h2 className="pr-sec-title">What it made</h2>
        </div>
        <div className="lib-grid">
          {prints.map((print, i) => (
            <Reveal className="lib-cell" key={print.id} delay={i * 90}>
              <Plate
                no={String(i + 1).padStart(2, '0')}
                role={print.details.material ?? 'PLA'}
                href={`/physical/prints/${print.id}`}
                caption={print.details.dimensions}
                xref="→"
              >
                <div className="lib-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={print.image} alt={print.imageAlt} loading="lazy" />
                </div>
                <h3 className="lib-title">{print.name}</h3>
                <p className="lib-desc">{print.description}</p>
                <p className="lib-meta">{print.details.status}</p>
              </Plate>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
