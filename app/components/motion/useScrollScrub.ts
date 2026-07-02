'use client';

import { useEffect, useRef } from 'react';

/**
 * ONE rAF-throttled passive scroll listener per page — the scroll
 * grammar. `onFrame(scrollY)` fires at most once per frame; write
 * styles/CSS vars directly to DOM refs inside it. Zero React
 * re-renders on scroll.
 *
 * prefers-reduced-motion: no listener attaches and onFrame never
 * fires — callers must leave their static (final) layout in place.
 * Fires once on mount and on resize so state is correct pre-scroll.
 */
export function useScrollScrub(
  onFrame: (scrollY: number) => void,
  options?: { disabled?: boolean }
) {
  const disabled = options?.disabled ?? false;
  const cbRef = useRef(onFrame);

  useEffect(() => {
    cbRef.current = onFrame;
  });

  useEffect(() => {
    if (disabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const frame = () => {
      raf = 0;
      cbRef.current(window.scrollY);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [disabled]);
}
