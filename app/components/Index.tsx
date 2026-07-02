'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Horizon from './Horizon';
import Reveal from './Reveal';
import RevealLines from './RevealLines';
import SectionMark from './SectionMark';
import PhilosophySection from './PhilosophySection';
import { sections } from './sections';
import type { Section, SectionItem } from './types';
import { useScrollScrub } from './motion/useScrollScrub';

/**
 * THE CONTINUOUS THREAD — everything below the hero.
 *
 * Geometry: one 1px line. A vertical DROP falls from the center of
 * the hero horizon, a BEND carries it to the left rail, and the
 * SPINE descends the rest of the page, ending in a small coral sun
 * on a short sunset hairline just above the footer. Works attach to
 * the spine as stations: a node on the line, the line running
 * through the wordmark (the station sign hangs on the wire), the
 * body of the work hanging below.
 *
 * Light: one rAF scroll scrub (zero re-renders) writes transforms to
 * the three lit overlays — the light literally travels the path as
 * you scroll. Station nodes ignite via a single IntersectionObserver
 * when they cross the light line. Reduced motion: the whole thread
 * renders fully lit and static.
 *
 * Wayfinding: a front-matter INDEX table hangs on the first node —
 * ledger-numbered anchor cells (01.1–02.2) that jump the thread.
 * Station meta is a label/value ledger (Year / Stack / Status) with
 * hairline rules and per-token nowrap values.
 *
 * Typography: Space Mono 400 is the ONE voice for every label role —
 * eyebrows, numerals, tags, meta, actions. Wordmark titles keep their
 * per-project faces but are optically normalized so all four carry
 * equal visual mass.
 */

const DROP = 96; // px — keep in sync with --tc-drop below
const BEND_RUN = 110; // px of scroll that lights the bend

/* Optical compensation per wordmark face — cap/x-height mass match. */
const OPTICAL: Record<string, React.CSSProperties> = {
  'Ray': { fontSize: '1em' },
  'Soirée': { fontSize: '1.18em' },
  'Project 1122': { fontSize: '0.86em' },
  '3D Prints': { fontSize: '0.9em', letterSpacing: '-0.04em' },
};

/* Sitewide numbering law: Software = 01, Physical = 02. Items are
   ledger-numbered inside their section: 01.1, 01.2, 02.1, 02.2 —
   the same number appears in the INDEX table and at the station. */
const SECTION_MARKS: Record<string, string> = { software: '01', physical: '02' };

function accentVar(sectionId: string) {
  return sectionId === 'software' ? 'var(--color-accent-ocean-text)' : 'var(--color-accent-gold-text)';
}

function slugOf(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* Meta as ledger rows — label/value with per-token nowrap values. */
function metaRows(item: SectionItem): Array<[string, string]> {
  const rows: Array<[string, string]> = [];
  const m = item.meta;
  if (!m) return rows;
  if (m.year) rows.push(['Year', m.year]);
  if (m.stack) rows.push(['Stack', m.stack]);
  if (m.material) rows.push(['Material', m.material]);
  if (m.status) rows.push(['Status', m.status]);
  return rows;
}

const css = `
.tc-root{--tc-drop:96px;--tc-g:clamp(30px,4.5vw,60px)}
.tc-inner{position:relative;padding-top:calc(var(--tc-drop) + 88px)}

.tc-drop,.tc-bend,.tc-spine{position:absolute;pointer-events:none;background:var(--color-border-mid)}
.tc-drop{top:0;left:50%;width:1px;height:var(--tc-drop)}
.tc-bend{top:var(--tc-drop);left:0;width:50%;height:1px}
.tc-spine{top:var(--tc-drop);bottom:0;left:0;width:1px}
.tc-lit{position:absolute;inset:0;pointer-events:none;background:var(--color-accent-gold);opacity:0.9}
.tc-drop .tc-lit{transform:scaleY(0);transform-origin:top}
.tc-bend .tc-lit{transform:scaleX(0);transform-origin:right}
.tc-spine .tc-lit{transform:scaleY(0);transform-origin:top}
.tc-headdot{position:absolute;left:-2.5px;top:-3px;width:6px;height:6px;border-radius:50%;background:var(--color-accent-gold);box-shadow:0 0 10px var(--color-accent-gold);opacity:0}

.tc-sec{position:relative;margin-bottom:var(--space-7)}
.tc-branch{position:relative}
.tc-node{position:absolute;left:-4px;top:50%;width:9px;height:9px;border-radius:50%;transform:translate(0,-50%);border:1px solid var(--color-border-mid);background:var(--color-bg);z-index:2;transition:background var(--duration-base) var(--ease-signature),border-color var(--duration-base) var(--ease-signature),box-shadow var(--duration-base) var(--ease-signature)}
.tc-litwatch[data-lit=true] .tc-node{background:var(--color-accent-gold);border-color:var(--color-accent-gold);box-shadow:0 0 12px color-mix(in srgb, var(--color-accent-gold) 55%, transparent)}
.tc-sec[data-accent=ocean] .tc-litwatch[data-lit=true] .tc-node{background:var(--color-accent-ocean);border-color:var(--color-accent-ocean);box-shadow:0 0 12px color-mix(in srgb, var(--color-accent-ocean) 55%, transparent)}

.tc-secbody{position:relative;overflow:hidden;padding:var(--space-4) 0 var(--space-5) var(--tc-g)}
.tc-eyebrow{font-family:var(--font-mono),monospace;font-size:12px;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;color:var(--color-text-muted)}
.tc-sechead-title{margin:var(--space-2) 0 0;font-family:var(--font-serif),serif;font-weight:300;font-size:clamp(2.6rem,5.5vw,4.4rem);line-height:1.04;letter-spacing:-0.02em;color:var(--color-fg)}
.tc-secdesc{margin:var(--space-3) 0 0;max-width:46ch;font-size:15px;line-height:1.7;color:var(--color-text-secondary)}

.tc-index{margin-bottom:var(--space-6)}
.tc-toc{padding:var(--space-3) 0 0 var(--tc-g)}
.tc-tochead{display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-2);padding-bottom:14px}
@media (max-width: 480px){
  .tc-tochead{flex-direction:column;align-items:flex-start;gap:6px}
}
.tc-tocgrid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--color-border-mid)}
.tc-toccell{display:flex;flex-direction:column;gap:8px;padding:var(--space-3) var(--space-2) var(--space-3) var(--space-2);text-decoration:none;border-left:1px solid var(--color-border);border-bottom:1px solid var(--color-border-mid);transition:border-color var(--duration-fast) var(--ease-signature)}
.tc-toccell:first-child{border-left:0;padding-left:0}
.tc-tocnum{font-family:var(--font-mono),monospace;font-size:12px;font-weight:400;letter-spacing:0.12em;color:var(--tc-accent)}
.tc-tocname{font-family:var(--font-sans),sans-serif;font-size:15px;font-weight:600;color:var(--color-fg);line-height:1.3}
.tc-toctag{font-family:var(--font-mono),monospace;font-size:12px;font-weight:400;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-muted)}

.tc-stations{display:flex;flex-direction:column;gap:var(--space-6)}
.tc-station{position:relative;display:block;text-decoration:none;color:var(--color-fg);scroll-margin-top:96px}
.tc-titlerow{display:flex;align-items:center;gap:18px}
.tc-lead{position:relative;flex:0 0 calc(var(--tc-g) - 18px);height:1px;background:var(--color-border-mid);transition:background var(--duration-base) var(--ease-signature)}
.tc-num{font-family:var(--font-mono),monospace;font-size:12px;font-weight:400;letter-spacing:0.14em;color:var(--color-text-muted)}
.tc-title{margin:0;font-family:var(--font-serif),serif;font-weight:300;font-size:clamp(2.05rem,3.5vw,3.05rem);line-height:1.08;color:var(--color-fg);white-space:nowrap}
.tc-trail{flex:1 1 24px;min-width:16px;height:1px;background:var(--color-border);transition:background var(--duration-base) var(--ease-signature)}

.tc-sbody{display:grid;grid-template-columns:1fr 44%;gap:clamp(28px,4vw,56px);align-items:stretch;padding-left:var(--tc-g);margin-top:var(--space-3)}
.tc-stext{display:flex;flex-direction:column;gap:var(--space-2);padding-top:6px}
.tc-tag{font-family:var(--font-mono),monospace;font-size:12px;font-weight:400;letter-spacing:0.18em;text-transform:uppercase}
.tc-sec[data-accent=ocean] .tc-tag{color:var(--color-accent-ocean-text)}
.tc-sec[data-accent=gold] .tc-tag{color:var(--color-accent-gold-text)}
.tc-desc{margin:0;max-width:44ch;font-size:15px;line-height:1.7;color:var(--color-text-secondary)}
.tc-meta{margin:auto 0 0;border-bottom:1px solid var(--color-border)}
.tc-metarow{display:grid;grid-template-columns:96px 1fr;column-gap:var(--space-2);padding:8px 0;border-top:1px solid var(--color-border)}
.tc-meta dt{font-family:var(--font-mono),monospace;font-size:12px;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;color:var(--color-text-muted)}
.tc-meta dd{margin:0;font-family:var(--font-mono),monospace;font-size:12px;letter-spacing:0.04em;color:var(--color-text-secondary)}
.tc-tok{white-space:nowrap}
.tc-foot{display:flex;justify-content:flex-end;margin-top:var(--space-2)}
.tc-stext .tc-meta + .tc-foot{margin-top:var(--space-2)}
.tc-go{font-family:var(--font-mono),monospace;font-size:12px;font-weight:400;letter-spacing:0.18em;text-transform:uppercase}
.tc-sec[data-accent=ocean] .tc-go{color:var(--color-accent-ocean-text)}
.tc-sec[data-accent=gold] .tc-go{color:var(--color-accent-gold-text)}
.tc-arrow{display:inline-block;margin-left:8px;transition:transform var(--duration-fast) var(--ease-signature)}

.tc-mat{margin:0;padding:10px;border-radius:16px}
.tc-mat img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:8px;transform:scale(1);filter:brightness(1);transition:transform var(--duration-slow) var(--ease-signature),filter var(--duration-slow) var(--ease-signature)}

@media (hover: hover){
  .tc-station:hover .tc-mat{--shimmer-o:1;background:var(--glass-bg-hover);box-shadow:var(--glass-shadow-hover)}
  .tc-station:hover .tc-mat img{transform:scale(1.03);filter:brightness(1.05)}
  .tc-station:hover .tc-arrow{transform:translateX(3px)}
  .tc-station:hover .tc-trail{background:var(--color-border-mid)}
  .tc-station:hover .tc-lead{background:var(--color-accent-gold)}
  .tc-sec[data-accent=ocean] .tc-station:hover .tc-lead{background:var(--color-accent-ocean)}
  .tc-toccell:hover{border-bottom-color:var(--tc-accent)}
}
.tc-station:focus-visible .tc-mat{background:var(--glass-bg-hover);box-shadow:var(--glass-shadow-hover)}
.tc-station:focus-visible .tc-mat img{transform:scale(1.03);filter:brightness(1.05)}
.tc-station:focus-visible .tc-arrow{transform:translateX(3px)}
.tc-station:focus-visible .tc-lead{background:var(--color-accent-gold)}
.tc-sec[data-accent=ocean] .tc-station:focus-visible .tc-lead{background:var(--color-accent-ocean)}
.tc-toccell:focus-visible{border-bottom-color:var(--tc-accent)}

.tc-terminus{position:relative;height:140px}
.tc-set{position:absolute;left:0;bottom:0;width:min(240px,42vw);height:1px;background:linear-gradient(90deg,var(--color-accent-coral),var(--color-accent-gold) 55%,transparent);opacity:0.75;transform:scaleX(0);transform-origin:left}
.tc-sun{position:absolute;left:-3.5px;bottom:-3.5px;width:8px;height:8px;border-radius:50%;background:var(--color-accent-coral);box-shadow:0 0 18px var(--color-accent-coral);opacity:0}

@media (max-width: 920px){
  .tc-tocgrid{grid-template-columns:1fr 1fr}
  .tc-toccell{border-left:0;padding-left:0}
  .tc-toccell:nth-child(even){border-left:1px solid var(--color-border);padding-left:var(--space-2)}
}
@media (max-width: 860px){
  .tc-sbody{grid-template-columns:1fr;gap:var(--space-3)}
  .tc-mat{order:-1}
  .tc-stext{max-width:none;padding-top:0}
  .tc-meta{margin-top:var(--space-1)}
}
@media (max-width: 767px){
  .tc-inner{padding-top:calc(var(--tc-drop) + 56px)}
  .tc-sec{margin-bottom:var(--space-6)}
  .tc-index{margin-bottom:var(--space-5)}
  .tc-stations{gap:var(--space-5)}
  .tc-secbody{padding:var(--space-3) 0 var(--space-4) var(--tc-g)}
  .tc-toc{padding:var(--space-2) 0 0 var(--tc-g)}
  .tc-desc{font-size:14px}
  .tc-secdesc{font-size:14px}
  .tc-metarow{grid-template-columns:84px 1fr}
  .tc-titlerow{gap:12px}
  .tc-lead{flex-basis:calc(var(--tc-g) - 12px)}
  .tc-terminus{height:96px}
}
@media (prefers-reduced-motion: reduce){
  .tc-drop .tc-lit,.tc-spine .tc-lit{transform:scaleY(1) !important}
  .tc-bend .tc-lit{transform:scaleX(1) !important}
  .tc-headdot{display:none}
  .tc-set{transform:scaleX(1) !important}
  .tc-sun{opacity:1 !important}
}
`;

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

function Station({ item, no }: { item: SectionItem; no: string }) {
  const rows = metaRows(item);
  const inner = (
    <>
      <div className="tc-titlerow">
        <span className="tc-lead" aria-hidden="true">
          <span className="tc-node" />
        </span>
        <span className="tc-num">{no}</span>
        <h3 className="tc-title">
          <span style={{ ...(item.logoStyle as React.CSSProperties), ...OPTICAL[item.name] }}>
            {item.name}
          </span>
        </h3>
        <span className="tc-trail" aria-hidden="true" />
      </div>
      <div className="tc-sbody">
        <div className="tc-stext">
          <span className="tc-tag">{item.tag}</span>
          <p className="tc-desc">{item.description}</p>
          {rows.length > 0 && (
            <dl className="tc-meta">
              {rows.map(([k, v]) => (
                <div className="tc-metarow" key={k}>
                  <dt>{k}</dt>
                  <dd>
                    {v.split(' · ').map((tok, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && ' · '}
                        <span className="tc-tok">{tok}</span>
                      </React.Fragment>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <div className="tc-foot">
            <span className="tc-go">
              {item.url ? 'Visit' : 'Enter'}
              <span className="tc-arrow" aria-hidden="true">{item.url ? '↗' : '→'}</span>
            </span>
          </div>
        </div>
        <Reveal variant="unveil" as="figure" className="tc-mat glass">
          {item.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.imageAlt ?? ''} loading="lazy" />
          )}
        </Reveal>
      </div>
    </>
  );

  const id = `station-${slugOf(item.name)}`;

  if (item.href) {
    return (
      <Reveal>
        <Link href={item.href} id={id} className="tc-station tc-litwatch" data-lit="false">
          {inner}
        </Link>
      </Reveal>
    );
  }
  return (
    <Reveal>
      <a
        href={item.url}
        id={id}
        target="_blank"
        rel="noopener noreferrer"
        className="tc-station tc-litwatch"
        data-lit="false"
      >
        {inner}
      </a>
    </Reveal>
  );
}

/* Front matter — the INDEX table, first station on the thread. */
function Toc() {
  const cells = sections.flatMap((section: Section) =>
    section.items.map((item, i) => ({
      item,
      no: `${SECTION_MARKS[section.id]}.${i + 1}`,
      accent: accentVar(section.id),
    }))
  );
  return (
    <div className="tc-sec tc-index" data-accent="gold">
      <div className="tc-litwatch" data-lit="false">
        <div className="tc-branch">
          <span className="tc-node" aria-hidden="true" />
          <Horizon variant="gold" draw origin="left" />
        </div>
        <nav className="tc-toc" aria-label="Work index">
          <div className="tc-tochead">
            <Reveal>
              <span className="tc-eyebrow">Index</span>
            </Reveal>
            <Reveal delay={60}>
              <span className="tc-eyebrow">
                {String(cells.length).padStart(2, '0')} works &middot;{' '}
                {String(sections.length).padStart(2, '0')} disciplines
              </span>
            </Reveal>
          </div>
          <div className="tc-tocgrid">
            {cells.map(({ item, no, accent }) => (
              <a
                key={item.name}
                className="tc-toccell"
                href={`#station-${slugOf(item.name)}`}
                style={{ ['--tc-accent']: accent } as React.CSSProperties}
              >
                <span className="tc-tocnum">{no}</span>
                <span className="tc-tocname">{item.name}</span>
                <span className="tc-toctag">{item.tag}</span>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function Index() {
  const innerRef = useRef<HTMLDivElement>(null);
  const dropLitRef = useRef<HTMLSpanElement>(null);
  const bendLitRef = useRef<HTMLSpanElement>(null);
  const spineLitRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const setRef = useRef<HTMLSpanElement>(null);
  const sunRef = useRef<HTMLSpanElement>(null);
  const terminusRef = useRef<HTMLDivElement>(null);

  /* The light travels the thread — one rAF write pass, no re-renders. */
  useScrollScrub((y) => {
    const inner = innerRef.current;
    if (!inner) return;
    const rect = inner.getBoundingClientRect();
    const topAbs = rect.top + y;
    const vh = window.innerHeight;
    const focus = y + vh * 0.72;
    const local = focus - topAbs;
    const spineLen = Math.max(rect.height - DROP, 1);
    const maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);
    const maxLocal = maxScroll + vh * 0.72 - topAbs;
    // Guarantee the thread completes by the time the page bottoms out.
    const k = Math.max(1, spineLen / Math.max(maxLocal - DROP - BEND_RUN, 1));

    const pDrop = clamp01(local / DROP);
    const pBend = clamp01((local - DROP) / BEND_RUN);
    const litRaw = Math.min(Math.max((local - DROP - BEND_RUN) * k, 0), spineLen);

    /* Terminus scrub is driven by where the terminus sits in the viewport —
       it completes when the sunset line crosses the same 72 percent focus
       line the rest of the light uses, so the ending always lands on screen
       (a tall footer no longer pushes the finished sun above the frame).
       A page-bottom guarantee covers layouts too short to ever cross it. */
    const term = terminusRef.current;
    let pT: number;
    if (term) {
      const tb = term.getBoundingClientRect().bottom;
      const pView = clamp01((vh * 0.72 + 200 - tb) / 200);
      const pBottom = clamp01((local - (maxLocal - 160)) / 160);
      pT = Math.max(pView, pBottom);
    } else {
      pT = clamp01((litRaw - (spineLen - 200)) / 200);
    }
    /* One clock for the ending: once the sun starts rising, the spine light
       closes its remaining run in lockstep, arriving the frame pT hits 1. */
    const lit = litRaw + pT * (spineLen - litRaw);

    if (dropLitRef.current) dropLitRef.current.style.transform = `scaleY(${pDrop.toFixed(4)})`;
    if (bendLitRef.current) bendLitRef.current.style.transform = `scaleX(${pBend.toFixed(4)})`;
    if (spineLitRef.current) spineLitRef.current.style.transform = `scaleY(${(lit / spineLen).toFixed(5)})`;
    const head = headRef.current;
    if (head) {
      /* The bead melts into the rising sun — fades out as pT climbs. */
      head.style.transform = `translate(0, ${lit.toFixed(1)}px)`;
      head.style.opacity = lit > 2 && lit < spineLen - 4 ? (1 - pT).toFixed(3) : '0';
    }
    if (setRef.current) setRef.current.style.transform = `scaleX(${pT.toFixed(4)})`;
    const sun = sunRef.current;
    if (sun) {
      sun.style.opacity = pT.toFixed(3);
      sun.style.transform = `scale(${(0.5 + 0.5 * pT).toFixed(3)})`;
    }
  });

  /* Nodes ignite as they cross the light line (toggles both ways). */
  useEffect(() => {
    const root = innerRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('.tc-litwatch'));
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          (e.target as HTMLElement).dataset.lit = e.isIntersecting ? 'true' : 'false';
        }
      },
      { rootMargin: '0px 0px -28% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div id="directory-index" className="tc-root rail">
      <style>{css}</style>
      <div className="tc-inner" ref={innerRef}>
        {/* THE THREAD — drop from the hero horizon, bend to the rail, spine down the page */}
        <div className="tc-drop" aria-hidden="true"><span className="tc-lit" ref={dropLitRef} /></div>
        <div className="tc-bend" aria-hidden="true"><span className="tc-lit" ref={bendLitRef} /></div>
        <div className="tc-spine" aria-hidden="true">
          <span className="tc-lit" ref={spineLitRef} />
          <span className="tc-headdot" ref={headRef} />
        </div>

        {/* FRONT MATTER — the index before the feature well */}
        <Toc />

        {sections.map((section) => {
          const accent = section.id === 'software' ? 'ocean' : 'gold';
          return (
            <section
              key={section.id}
              className="tc-sec"
              data-zone={section.id}
              data-accent={accent}
              aria-labelledby={`tc-sec-${section.id}`}
            >
              <div className="tc-litwatch" data-lit="false">
                <div className="tc-branch">
                  <span className="tc-node" aria-hidden="true" />
                  <Horizon variant={accent === 'ocean' ? 'ocean' : 'gold'} draw origin="left" />
                </div>
                <div className="tc-secbody">
                  <SectionMark
                    n={SECTION_MARKS[section.id] ?? ''}
                    align="right"
                    style={{ fontSize: 'clamp(150px, 19vw, 280px)' }}
                  />
                  <Reveal>
                    <span className="tc-eyebrow">{section.tagline}</span>
                  </Reveal>
                  <RevealLines
                    as="h2"
                    className="tc-sechead-title"
                    lines={[<span key="l" id={`tc-sec-${section.id}`}>{section.label}</span>]}
                  />
                  <Reveal delay={90}>
                    <p className="tc-secdesc">{section.description}</p>
                  </Reveal>
                </div>
              </div>
              <div className="tc-stations">
                {section.items.map((item, i) => (
                  <Station
                    key={item.name}
                    item={item}
                    no={`${SECTION_MARKS[section.id]}.${i + 1}`}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* PHILOSOPHY — the thread opens the manifesto, then sets. */}
        <PhilosophySection />

        {/* TERMINUS — the line ends the only way a golden hour can. */}
        <div className="tc-terminus" aria-hidden="true" ref={terminusRef}>
          <span className="tc-set" ref={setRef} />
          <span className="tc-sun" ref={sunRef} />
        </div>
      </div>
    </div>
  );
}
