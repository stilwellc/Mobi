'use client';

import { useEffect, useRef } from 'react';

/**
 * The landing page breathes with its content: a fixed, page-wide
 * color wash that crossfades as you scroll — neutral gold at the
 * hero, ocean through Software, warm gold through Physical, a low
 * sunset ember at the manifesto. Driven by one IntersectionObserver
 * over [data-zone] sections writing a data attribute; the layers are
 * opacity-only CSS transitions. Reduced motion still gets the color
 * (it is not movement), just with instant switches.
 */
export default function HomeAmbience() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const zones = Array.from(document.querySelectorAll<HTMLElement>('[data-zone]'));
    if (zones.length === 0) return;
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const z = (e.target as HTMLElement).dataset.zone!;
          visible.set(z, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let best = 'hero';
        let bestR = 0.12; // below this, the hero's neutral wash holds
        visible.forEach((r, z) => {
          if (r > bestR) { best = z; bestR = r; }
        });
        el.dataset.tint = best;
      },
      { threshold: [0, 0.15, 0.35, 0.6] }
    );
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="home-ambience" data-tint="hero" aria-hidden="true">
      <style>{`
        .home-ambience{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
        .home-ambience .wash{position:absolute;inset:-20%;opacity:0;transition:opacity 1400ms var(--ease-signature)}
        .wash-ocean{background:
          radial-gradient(55% 45% at 18% 30%, color-mix(in srgb, var(--color-accent-ocean) 7%, transparent) 0%, transparent 70%),
          radial-gradient(45% 40% at 85% 75%, color-mix(in srgb, var(--color-accent-ocean) 4%, transparent) 0%, transparent 70%)}
        .wash-gold{background:
          radial-gradient(55% 45% at 80% 30%, color-mix(in srgb, var(--color-accent-gold) 7%, transparent) 0%, transparent 70%),
          radial-gradient(45% 40% at 15% 78%, color-mix(in srgb, var(--color-accent-gold) 4%, transparent) 0%, transparent 70%)}
        .wash-ember{background:
          radial-gradient(70% 35% at 50% 96%, color-mix(in srgb, var(--color-accent-coral) 6%, transparent) 0%, transparent 72%)}
        .home-ambience[data-tint=software] .wash-ocean{opacity:1}
        .home-ambience[data-tint=physical] .wash-gold{opacity:1}
        .home-ambience[data-tint=close] .wash-ember{opacity:1}
        @media (prefers-reduced-motion: reduce){
          .home-ambience .wash{transition:none}
        }
      `}</style>
      <div className="wash wash-ocean" />
      <div className="wash wash-gold" />
      <div className="wash wash-ember" />
    </div>
  );
}
