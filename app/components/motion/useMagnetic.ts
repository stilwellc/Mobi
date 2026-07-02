'use client';

import { useEffect, useRef } from 'react';

/**
 * The ONLY sanctioned magnetic effect on the site (home hero CTA).
 * One window pointermove listener; within ~1.6x the element's hit
 * radius the element is rAF-lerped toward the cursor, clamped to
 * +/- maxOffset px (attraction factor 0.15); on leave it springs
 * back via transition: transform 500ms var(--ease-signature).
 *
 * Gated on (pointer: fine) AND not prefers-reduced-motion — else
 * ZERO listeners attach. Transform applied to the ref only, no
 * React state, no re-renders. Focus ring / keyboard untouched.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options?: { maxOffset?: number; factor?: number; radiusScale?: number }
) {
  const { maxOffset = 6, factor = 0.15, radiusScale = 1.6 } = options ?? {};
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;
    let active = false;

    const clampv = (v: number) => Math.max(-maxOffset, Math.min(maxOffset, v));

    const loop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      if (active || Math.abs(tx - cx) + Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const hitRadius = (Math.hypot(r.width, r.height) / 2) * radiusScale;

      if (Math.hypot(dx, dy) < hitRadius) {
        if (!active) {
          active = true;
          el.style.transition = 'none';
        }
        tx = clampv(dx * factor);
        ty = clampv(dy * factor);
        if (!raf) raf = requestAnimationFrame(loop);
      } else if (active) {
        active = false;
        tx = 0;
        ty = 0;
        cx = 0;
        cy = 0;
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        el.style.transition = 'transform 500ms var(--ease-signature)';
        el.style.transform = 'translate(0px, 0px)';
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
      el.style.transition = '';
    };
  }, [maxOffset, factor, radiusScale]);

  return ref;
}
