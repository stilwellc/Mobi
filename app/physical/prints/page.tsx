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
  ['SKILL.md', 'The skill definition the AI follows — modes, triggers, print-safe design rules.'],
  ['run_cadquery_model.py', 'Executes generated models, returns structured success or failure.'],
  ['preview.py', 'Renders each STL so you see the object before the printer does.'],
  ['mesh_io.py', 'Watertight validation — strict mode rejects unprintable meshes.'],
  ['stl_to_3mf.py', 'Print-ready packaging for the slicer.'],
  ['tests/', 'The wrapper is tested like any other software here.'],
];

export default function PrintsPage() {
  return (
    <div className="rail" style={{ paddingBlock: 'var(--space-5)' }}>
      <style>{`
        .pr-sec{position:relative;overflow:hidden;padding:80px 0 30px}
        .pr-sec .eyebrow{margin:0 0 var(--space-1)}
        .pr-sec-title{margin:0;font-family:var(--font-serif),serif;font-weight:300;font-size:clamp(2rem,3.6vw,3rem);line-height:1.08;letter-spacing:-0.02em;color:var(--color-fg)}
        .pass{position:relative;display:grid;grid-template-columns:1fr 1fr 1fr;gap:clamp(18px,2.4vw,32px);align-items:stretch}
        .pass-line{position:absolute;left:2%;right:2%;top:34px;height:1px;background:linear-gradient(90deg,transparent,var(--color-accent-gold) 10%,var(--color-accent-gold) 90%,transparent);opacity:0.5;z-index:0}
        .pass-card{position:relative;z-index:1;display:flex;flex-direction:column;min-width:0;padding:clamp(20px,2.2vw,28px)}
        .pass-tag{display:flex;align-items:center;gap:10px;margin:0 0 var(--space-2);font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--color-accent-gold-text)}
        .pass-dot{flex:none;width:7px;height:7px;border-radius:50%;background:var(--color-accent-gold);box-shadow:0 0 10px var(--color-accent-gold)}
        .pass-quote{margin:auto 0;padding:var(--space-2) 0;font-family:var(--font-serif),serif;font-style:italic;font-weight:300;font-size:clamp(1.3rem,1.75vw,1.65rem);line-height:1.45;color:var(--color-fg)}
        .pass-code{flex:1;display:flex;align-items:center;margin:0 0 var(--space-2);padding:16px 18px;border:1px solid var(--color-border);border-radius:10px;background:color-mix(in srgb,var(--color-bg) 55%,transparent);overflow-x:auto}
        .pass-code pre{margin:0}
        .pass-code code{display:block;font-family:var(--font-mono),monospace;font-size:12.5px;line-height:1.75;white-space:pre;color:var(--color-text-secondary)}
        .pass-obj{flex:1;min-height:230px;margin:0 0 var(--space-2);border:1px solid var(--color-border);border-radius:10px;overflow:hidden}
        .pass-obj img{width:100%;height:100%;object-fit:cover;display:block}
        .pass-foot{margin-top:auto;margin-bottom:0;font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-muted)}
        .pass-cap{display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-2);flex-wrap:wrap;margin-top:var(--space-3)}
        .pass-cap p{margin:0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-muted)}
        .setup{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(26px,3.4vw,52px);padding:clamp(24px,2.8vw,42px)}
        .setup-lede{margin:0 0 var(--space-3);font-family:var(--font-serif),serif;font-weight:300;font-size:clamp(1.4rem,2vw,1.8rem);line-height:1.35;color:var(--color-fg)}
        .repo-cta{display:block;margin:var(--space-3) 0 0;padding:18px 22px;border:1px solid color-mix(in srgb,var(--color-accent-gold) 55%,transparent);border-radius:14px;background:color-mix(in srgb,var(--color-accent-gold) 8%,transparent);text-decoration:none;transition:background var(--duration-base) var(--ease-signature),border-color var(--duration-base) var(--ease-signature),transform var(--duration-base) var(--ease-signature)}
        .repo-cta:hover{background:color-mix(in srgb,var(--color-accent-gold) 14%,transparent);border-color:var(--color-accent-gold);transform:translateY(-2px)}
        .repo-cta-eyebrow{display:block;margin:0 0 6px;font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--color-accent-gold-text)}
        .repo-cta-name{font-family:var(--font-mono),monospace;font-size:clamp(0.95rem,1.2vw,1.15rem);line-height:1.5;color:var(--color-fg);word-break:break-word}
        .repo-cta-arrow{display:inline-block;margin-left:8px;color:var(--color-accent-gold-text);transition:transform var(--duration-base) var(--ease-signature)}
        .repo-cta:hover .repo-cta-arrow{transform:translate(3px,-3px)}
        .setup-note{margin:var(--space-2) 0 0;font-size:0.9375rem;line-height:1.6;color:var(--color-text-secondary);max-width:36ch}
        .setup-files{display:grid;grid-template-columns:1fr 1fr;gap:0 var(--space-4);align-content:start}
        .setup-file{padding:14px 0;border-top:1px solid var(--color-border)}
        .setup-name{display:block;margin:0 0 4px;font-family:var(--font-mono),monospace;font-size:13px;color:var(--color-accent-gold-text)}
        .setup-desc{display:block;font-size:0.9rem;line-height:1.55;color:var(--color-text-secondary)}
        .plate{display:flex;flex-direction:column;flex:1;min-width:0;padding:clamp(20px,2.2vw,26px);text-decoration:none;color:inherit}
        a.plate{transition:transform var(--duration-base) var(--ease-signature),background var(--duration-base) var(--ease-signature),border-color var(--duration-base) var(--ease-signature),box-shadow var(--duration-base) var(--ease-signature)}
        a.plate:hover{transform:translateY(-4px)}
        .plate-head{display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-2);margin-bottom:var(--space-2);font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase}
        .plate-no{color:var(--color-accent-gold-text)}
        .plate-role{color:var(--color-text-muted)}
        .plate-body{display:flex;flex-direction:column;flex:1}
        .plate-cap{display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-2);margin-top:var(--space-2);padding-top:12px;border-top:1px solid var(--color-border);font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-muted)}
        .plate-xref{color:var(--color-accent-gold-text);transition:transform var(--duration-base) var(--ease-signature)}
        a.plate:hover .plate-xref{transform:translateX(4px)}
        .lib-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(18px,2vw,28px);align-items:stretch}
        .lib-cell{min-width:0;display:flex}
        .lib-img{position:relative;border:1px solid var(--color-border);border-radius:12px;overflow:hidden;aspect-ratio:4/3;margin-bottom:var(--space-3)}
        .lib-img img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1);transition:transform var(--duration-slow) var(--ease-signature)}
        a.plate:hover .lib-img img{transform:scale(1.04)}
        .lib-title{margin:0 0 var(--space-1);font-family:var(--font-serif),serif;font-weight:300;font-size:clamp(1.5rem,2vw,1.85rem);line-height:1.15;letter-spacing:-0.01em}
        .lib-desc{margin:0 0 var(--space-2);font-size:0.9375rem;line-height:1.6;color:var(--color-text-secondary)}
        .lib-meta{margin:auto 0 0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;color:var(--color-text-muted)}
        @media (max-width: 900px){
          .pass{grid-template-columns:1fr;gap:var(--space-3);padding-left:22px}
          .pass-line{left:3px;right:auto;top:10px;bottom:10px;width:1px;height:auto;background:linear-gradient(180deg,transparent,var(--color-accent-gold) 8%,var(--color-accent-gold) 92%,transparent)}
          .pass-obj{min-height:0;aspect-ratio:16/10;flex:none}
          .pass-code{flex:none}
          .pass-cap{padding-left:22px}
          .setup{grid-template-columns:1fr}
          .setup-files{grid-template-columns:1fr}
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

      {/* THE DEMO — one pass along the thread: ask → model → object */}
      <Reveal>
        <section aria-label="The pipeline, in one pass" style={{ margin: 'var(--space-4) 0 0' }}>
          <div className="pass">
            <div className="pass-line" aria-hidden="true" />
            <article className="glass glass-quiet pass-card">
              <p className="pass-tag">
                <span className="pass-dot" aria-hidden="true" />
                01 &middot; The ask
              </p>
              <p className="pass-quote">
                &ldquo;A wall sconce &mdash; perforated diffuser, flat plate that mounts
                flush.&rdquo;
              </p>
              <p className="pass-foot">Plain language &middot; no CAD</p>
            </article>
            <article className="glass glass-quiet pass-card">
              <p className="pass-tag">
                <span className="pass-dot" aria-hidden="true" />
                02 &middot; The model
              </p>
              <div className="pass-code">
                <pre>
                  <code>{DEMO_CODE.join('\n')}</code>
                </pre>
              </div>
              <p className="pass-foot">Parametric &middot; generated end-to-end</p>
            </article>
            <article className="glass glass-quiet pass-card">
              <p className="pass-tag">
                <span className="pass-dot" aria-hidden="true" />
                03 &middot; The object
              </p>
              <div className="pass-obj">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/3d-prints/wall-sconce.jpg"
                  alt="The printed wall sconce — the object the sentence became"
                  loading="lazy"
                />
              </div>
              <p className="pass-foot">Printed in PLA &middot; in use</p>
            </article>
          </div>
          <div className="pass-cap">
            <p>One sentence in &mdash; a watertight, printable model out.</p>
            <Link
              href="/physical/prints/wall-sconce"
              className="link-action"
              style={{ color: 'var(--color-accent-gold-text)' }}
            >
              The full object <span className="arrow" aria-hidden="true">&rarr;</span>
            </Link>
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
            <div>
              <p className="setup-lede">
                Everything the pipeline needs &mdash; generation rules, validation,
                packaging &mdash; lives in one open-source repo.
              </p>
              <a
                href="https://github.com/stilwellc/parametric-3d-printing"
                target="_blank"
                rel="noopener noreferrer"
                className="repo-cta"
              >
                <span className="repo-cta-eyebrow">Get the code &middot; GitHub</span>
                <span className="repo-cta-name">
                  stilwellc/parametric-3d-printing
                  <span className="repo-cta-arrow" aria-hidden="true">&#8599;</span>
                </span>
              </a>
              <p className="setup-note">
                Nothing reaches the slicer without passing watertight validation first.
              </p>
            </div>
            <div className="setup-files">
              {REPO_FILES.map(([name, desc]) => (
                <div className="setup-file" key={name}>
                  <span className="setup-name">{name}</span>
                  <span className="setup-desc">{desc}</span>
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
