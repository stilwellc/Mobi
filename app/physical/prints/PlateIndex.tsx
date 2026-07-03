'use client';

import React, { useEffect, useRef } from 'react';

export type PlateIndexItem = {
  /** Anchor id of the plate this entry tracks. */
  id: string;
  /** Folio numeral — 'I' … 'VII'. */
  no: string;
  /** Short role or object name. */
  label: string;
};

/**
 * THE PLATE INDEX — a running table of plates for the desktop scroll
 * (grafted from the bench rail). Sticky in the folio's left column;
 * an IntersectionObserver ignites entries as plates pass. Zero React
 * state on scroll — the observer mutates classList directly. Hidden
 * on mobile, where the plate headers do the wayfinding.
 */
export default function PlateIndex({ items }: { items: PlateIndexItem[] }) {
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll<HTMLElement>('.f-ientry'));
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    const visible = new Set<number>();
    let current = 0;

    const apply = () => {
      links.forEach((link, i) => {
        link.classList.toggle('is-lit', i <= current);
        link.classList.toggle('is-now', i === current);
      });
    };
    apply();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = targets.indexOf(entry.target as HTMLElement);
          if (i < 0) continue;
          if (entry.isIntersecting) visible.add(i);
          else visible.delete(i);
        }
        if (visible.size) {
          const next = Math.max(...Array.from(visible));
          if (next !== current) {
            current = next;
            apply();
          }
        }
      },
      { rootMargin: '-25% 0px -45% 0px', threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav ref={navRef} className="f-index" aria-label="On this page">
      <p className="f-index-title">On this page</p>
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} className="f-ientry">
          <span className="f-ientry-no">{item.no}</span>
          <span className="f-ientry-name">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
