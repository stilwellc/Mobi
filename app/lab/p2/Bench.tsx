'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Reveal from '../../components/Reveal';
import IndexRow from '../../components/IndexRow';
import SectionMark from '../../components/SectionMark';
import { prints } from '../../physical/prints/data';

/**
 * THE BENCH — a workbench split for the text-to-print pipeline.
 * Sticky left rail carries the four stage markers (01–04); an
 * IntersectionObserver ignites them as the right column scrolls
 * past each stage. Zero React state on scroll — the observer
 * mutates classList directly. On mobile the rail collapses into
 * a per-stage progress spine on the left edge.
 */

const STAGES = [
  { id: 'b2-describe', num: '01', name: 'Describe' },
  { id: 'b2-model', num: '02', name: 'Model' },
  { id: 'b2-print', num: '03', name: 'Print' },
  { id: 'b2-setup', num: '04', name: 'The Setup' },
];

const REPO_FILES: Array<[string, string]> = [
  ['SKILL.md', 'the skill definition the AI follows — modes, triggers, print-safe design rules'],
  ['run_cadquery_model.py', 'executes generated models, returns structured success or failure'],
  ['preview.py', 'renders each STL so you see the object before the printer does'],
  ['mesh_io.py', 'watertight validation — strict mode rejects unprintable meshes'],
  ['stl_to_3mf.py', 'print-ready packaging for the slicer'],
  ['tests/', 'the wrapper is tested like any other software here'],
];

const COMMENT = { color: 'var(--color-accent-gold-text)' } as const;

export default function Bench() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stages = Array.from(root.querySelectorAll<HTMLElement>('[data-b2-stage]'));
    const marks = Array.from(root.querySelectorAll<HTMLElement>('[data-b2-mark]'));
    const active = new Set<number>();
    let current = 0;

    const apply = () => {
      marks.forEach((m, i) => {
        m.classList.toggle('is-lit', i <= current);
        m.classList.toggle('is-now', i === current);
      });
      stages.forEach((s, i) => s.classList.toggle('is-live', i <= current));
    };
    apply();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = stages.indexOf(e.target as HTMLElement);
          if (i < 0) continue;
          if (e.isIntersecting) active.add(i);
          else active.delete(i);
        }
        if (active.size) {
          const next = Math.max(...Array.from(active));
          if (next !== current) {
            current = next;
            apply();
          }
        }
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: 0 }
    );
    stages.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const sconce = prints[0];

  return (
    <div ref={rootRef}>
      <style>{`
        .b2-bench{display:grid;grid-template-columns:172px minmax(0,1fr);column-gap:clamp(32px,5vw,88px)}
        .b2-rail{position:sticky;top:112px;align-self:start;display:flex;flex-direction:column;gap:26px;padding-top:6px}
        .b2-rail-title{font-family:var(--font-mono),monospace;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--color-text-muted);margin:0 0 6px}
        .b2-mark{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--color-text-muted)}
        .b2-tick{flex:none;width:24px;height:1px;background:var(--color-border-mid);transform:scaleX(0.4);transform-origin:left;transition:transform var(--duration-base) var(--ease-signature),background var(--duration-base) var(--ease-signature)}
        .b2-mark-num{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.12em;transition:color var(--duration-base) var(--ease-signature)}
        .b2-mark-name{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;transition:color var(--duration-base) var(--ease-signature)}
        .b2-mark.is-lit .b2-mark-num{color:var(--color-accent-gold-text)}
        .b2-mark.is-now .b2-tick{transform:scaleX(1);background:var(--color-accent-gold)}
        .b2-mark.is-now .b2-mark-name{color:var(--color-fg)}
        .b2-mark:hover .b2-mark-name{color:var(--color-fg)}
        .b2-stages{display:flex;flex-direction:column;gap:clamp(80px,9vw,128px);min-width:0}
        .b2-stage{display:grid;grid-template-columns:minmax(0,1fr);scroll-margin-top:120px}
        .b2-spine{display:none}
        .b2-stage-label{margin:0 0 clamp(16px,2vw,24px);font-family:var(--font-mono),monospace;font-size:12px;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;color:var(--color-text-muted)}
        .b2-stage-label b{font-weight:400;color:var(--color-accent-gold-text);margin-right:10px}
        .b2-sentence{margin:0;font-family:var(--font-serif),serif;font-style:italic;font-weight:300;font-size:clamp(1.7rem,3.2vw,2.5rem);line-height:1.35;letter-spacing:-0.01em;color:var(--color-fg);max-width:26ch}
        .b2-cue{margin:clamp(14px,1.8vw,20px) 0 0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.06em;line-height:1.7;color:var(--color-text-muted)}
        .b2-model{display:grid;grid-template-columns:minmax(0,auto) minmax(220px,340px);justify-content:start;column-gap:clamp(32px,4.5vw,72px);row-gap:20px;align-items:center}
        .b2-code{margin:0;padding:clamp(20px,2.2vw,28px) clamp(22px,2.6vw,34px);border:1px solid var(--color-border);border-radius:12px;background:color-mix(in srgb,var(--color-bg-elevated) 62%,transparent);max-width:100%;overflow-x:auto}
        .b2-code code{font-family:var(--font-mono),monospace;font-size:13px;line-height:1.85;color:var(--color-text-secondary);white-space:pre}
        .b2-model-note{margin:0;font-size:0.9375rem;line-height:1.65;color:var(--color-text-secondary);max-width:34ch}
        .b2-model-note em{font-style:normal;color:var(--color-accent-gold-text)}
        .b2-figure{margin:0}
        .b2-figure img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}
        .b2-plate{border:1px solid var(--color-border);border-radius:12px;overflow:hidden}
        .b2-caption{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;margin-top:14px}
        .b2-caption-meta{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;color:var(--color-text-muted)}
        .b2-repo{display:inline-block;margin:2px 0 clamp(14px,1.6vw,18px);font-family:var(--font-mono),monospace;font-size:clamp(1.15rem,2vw,1.6rem);letter-spacing:0.01em;color:var(--color-fg)}
        .b2-repo .b2-ext{color:var(--color-text-muted);margin-left:10px;font-size:0.8em}
        .b2-setup-note{margin:0 0 clamp(24px,3vw,36px);font-size:0.9375rem;line-height:1.65;color:var(--color-text-secondary);max-width:52ch}
        .b2-ledger{border-top:1px solid var(--color-border)}
        .b2-file{display:grid;grid-template-columns:220px minmax(0,1fr);column-gap:var(--space-3);padding:11px 0;border-bottom:1px solid var(--color-border);font-family:var(--font-mono),monospace;font-size:12px;line-height:1.65}
        .b2-file dt{margin:0;color:var(--color-accent-gold-text);letter-spacing:0.04em}
        .b2-file dd{margin:0;color:var(--color-text-muted);letter-spacing:0.02em}
        .b2-lib{display:grid;grid-template-columns:172px minmax(0,1fr);column-gap:clamp(32px,5vw,88px);margin-top:var(--space-6)}
        .b2-lib-rows{position:relative;overflow:hidden}
        .b2-lib-side{position:sticky;top:112px;align-self:start;padding-top:6px}
        .b2-lib-count{margin:10px 0 0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;line-height:1.7;color:var(--color-text-muted)}
        @media (max-width:820px){
          .b2-bench{grid-template-columns:minmax(0,1fr)}
          .b2-rail{display:none}
          .b2-stages{gap:64px}
          .b2-stage{grid-template-columns:26px minmax(0,1fr);column-gap:14px;scroll-margin-top:96px}
          .b2-spine{display:flex;flex-direction:column;align-items:center;gap:10px;padding-top:2px}
          .b2-spine-num{font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.08em;color:var(--color-text-muted);transition:color var(--duration-base) var(--ease-signature)}
          .b2-spine-line{width:1px;flex:1;background:var(--color-border-mid);transition:background var(--duration-base) var(--ease-signature),opacity var(--duration-base) var(--ease-signature)}
          .b2-stage.is-live .b2-spine-num{color:var(--color-accent-gold-text)}
          .b2-stage.is-live .b2-spine-line{background:var(--color-accent-gold);opacity:0.55}
          .b2-stage-label b{display:none}
          .b2-model{grid-template-columns:minmax(0,1fr)}
          .b2-code code{font-size:12px;line-height:1.8}
          .b2-file{grid-template-columns:minmax(0,1fr);row-gap:2px;padding:10px 0}
          .b2-lib{grid-template-columns:minmax(0,1fr);row-gap:18px;margin-top:var(--space-5)}
          .b2-lib-side{position:static;padding-top:0}
          .b2-lib-count{margin-top:6px}
        }
      `}</style>

      {/* THE BENCH — pipeline as four stations */}
      <section aria-label="The pipeline" className="b2-bench" style={{ margin: 'var(--space-5) 0 0' }}>
        <nav className="b2-rail" aria-label="Pipeline stages">
          <p className="b2-rail-title">The Bench</p>
          {STAGES.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="b2-mark" data-b2-mark>
              <span className="b2-tick" aria-hidden="true" />
              <span className="b2-mark-num">{s.num}</span>
              <span className="b2-mark-name">{s.name}</span>
            </a>
          ))}
        </nav>

        <div className="b2-stages">
          {/* 01 — DESCRIBE */}
          <article id="b2-describe" className="b2-stage" data-b2-stage>
            <span className="b2-spine" aria-hidden="true">
              <span className="b2-spine-num">01</span>
              <span className="b2-spine-line" />
            </span>
            <div>
              <h2 className="b2-stage-label"><b>01</b>Describe</h2>
              <Reveal>
                <p className="b2-sentence">
                  &ldquo;A wall sconce &mdash; cylindrical diffuser, perforated so the
                  light spills, on a flat plate that mounts flush.&rdquo;
                </p>
                <p className="b2-cue">One sentence in. No sketch, no CAD file.</p>
              </Reveal>
            </div>
          </article>

          {/* 02 — MODEL */}
          <article id="b2-model" className="b2-stage" data-b2-stage>
            <span className="b2-spine" aria-hidden="true">
              <span className="b2-spine-num">02</span>
              <span className="b2-spine-line" />
            </span>
            <div>
              <h2 className="b2-stage-label"><b>02</b>Model</h2>
              <Reveal>
                <div className="b2-model">
                  <pre className="b2-code"><code>{`import cadquery as cq

`}<span style={COMMENT}>{`# 4 mm shell`}</span>{`
shade = (cq.Workplane("XY")
    .circle(70)
    .circle(66)
    .extrude(190))

`}<span style={COMMENT}>{`# light spill`}</span>{`
shade = (shade.faces("<X")
    .workplane()
    .pushPoints(GRID)
    .hole(9))

`}<span style={COMMENT}>{`# mounting plate`}</span>{`
plate = (cq.Workplane("YZ")
    .rect(120, 140)
    .extrude(6))

cq.exporters.export(
    shade.union(plate),
    "sconce.3mf")`}</code></pre>
                  <p className="b2-model-note">
                    The pipeline answers in CadQuery &mdash; geometry as code.
                    <em> A 4&nbsp;mm shell, a grid of light holes, a mounting
                    plate</em>, unioned and exported straight for the slicer.
                    Every dimension is a variable you can argue with.
                  </p>
                </div>
              </Reveal>
            </div>
          </article>

          {/* 03 — PRINT */}
          <article id="b2-print" className="b2-stage" data-b2-stage>
            <span className="b2-spine" aria-hidden="true">
              <span className="b2-spine-num">03</span>
              <span className="b2-spine-line" />
            </span>
            <div>
              <h2 className="b2-stage-label"><b>03</b>Print</h2>
              <figure className="b2-figure">
                <Reveal variant="unveil" className="b2-plate">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/3d-prints/wall-sconce.jpg"
                    alt="The wall sconce, printed in PLA — the object the sentence became"
                    loading="lazy"
                  />
                </Reveal>
                <figcaption className="b2-caption">
                  <span className="b2-caption-meta">
                    {sconce.name} &middot; {sconce.details.material} &middot;{' '}
                    {sconce.details.dimensions} &middot; printed
                  </span>
                  <Link
                    href="/physical/prints/wall-sconce"
                    className="link-action"
                    style={{ color: 'var(--color-accent-gold-text)' }}
                  >
                    In the library <span className="arrow" aria-hidden="true">&rarr;</span>
                  </Link>
                </figcaption>
              </figure>
            </div>
          </article>

          {/* 04 — THE SETUP */}
          <article id="b2-setup" className="b2-stage" data-b2-stage>
            <span className="b2-spine" aria-hidden="true">
              <span className="b2-spine-num">04</span>
              <span className="b2-spine-line" />
            </span>
            <div>
              <h2 className="b2-stage-label"><b>04</b>The Setup</h2>
              <a
                href="https://github.com/stilwellc/parametric-3d-printing"
                target="_blank"
                rel="noopener noreferrer"
                className="b2-repo link-draw"
              >
                stilwellc/parametric-3d-printing
                <span className="b2-ext" aria-hidden="true">&#8599;</span>
              </a>
              <p className="b2-setup-note">
                Everything the pipeline needs, open source &mdash; a sentence in,
                a watertight parametric model out, printable as-is.
              </p>
              <Reveal>
                <dl className="b2-ledger">
                  {REPO_FILES.map(([file, desc]) => (
                    <div key={file} className="b2-file">
                      <dt>{file}</dt>
                      <dd>{desc}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </article>
        </div>
      </section>

      {/* THE LIBRARY — same bench grammar */}
      <section aria-label="The library" className="b2-lib">
        <div className="b2-lib-side">
          <p className="eyebrow" style={{ margin: 0 }}>The Library</p>
          <p className="b2-lib-count">
            {String(prints.length).padStart(2, '0')} objects &mdash; printed,
            in use, each with an inspectable model.
          </p>
        </div>
        <div className="b2-lib-rows">
          <SectionMark n="03" align="right" />
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
