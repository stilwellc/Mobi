'use client';

import { useEffect, useRef } from 'react';

/**
 * The light in the room. One delegated listener drives:
 * - per-card shimmer: writes --mx/--my onto the .glass element under the cursor
 * - the cursor veil: a faint traveling light, lerped via rAF, transform-only
 * Renders the ambient orbs + veil; no React re-renders after mount.
 */
export default function GlassEffects() {
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const veil = veilRef.current;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let vx = tx;
    let vy = ty;
    let raf = 0;
    let active = false;

    const loop = () => {
      vx += (tx - vx) * 0.08;
      vy += (ty - vy) * 0.08;
      if (veil) veil.style.transform = `translate(${vx - 280}px, ${vy - 280}px)`;
      if (Math.abs(tx - vx) + Math.abs(ty - vy) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) {
        active = true;
        veil?.classList.add('on');
      }
      if (!raf) raf = requestAnimationFrame(loop);

      const glass = (e.target as Element | null)?.closest?.('.glass') as HTMLElement | null;
      if (glass) {
        const r = glass.getBoundingClientRect();
        glass.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        glass.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      }
    };

    const onLeave = () => {
      active = false;
      veil?.classList.remove('on');
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="ambient-field" aria-hidden="true">
        <div className="orb-gold" />
        <div className="orb-ocean" />
      </div>
      <div ref={veilRef} className="cursor-veil" aria-hidden="true" />
    </>
  );
}
