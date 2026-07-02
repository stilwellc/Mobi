'use client';

import React, { useEffect, useRef, useState } from 'react';

export type RevealLinesProps = {
  lines: React.ReactNode[];       // one entry per masked line
  as?: 'h1' | 'h2' | 'p' | 'div'; // default 'div'; single element, lines are spans
  trigger?: 'mount' | 'inview';   // default 'inview'
  delay?: number;                 // ms before first line, default 0
  stagger?: number;               // ms, default 90
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Masked line reveals — .rl-mask / .rl-line / .rl-revealed / .rl-mount
 * contract from globals.css. Heading semantics preserved: one element
 * of type `as`, each line a <span class=rl-mask><span class=rl-line>.
 *
 * trigger=mount: SSR ships the armed state (.rl-mount, lines masked)
 * and the reveal is a CSS animation riding animation-delay — the same
 * paint clock as the other entrance beats, so hydration timing can
 * never flash the headline or invert the choreography. No JS runs for
 * this path. No-JS safety: the animation itself plays without JS; a
 * <noscript> override makes it instant. Reduced motion: the global
 * override plus an explicit .rl-mount rule pin lines static.
 *
 * trigger=inview: server HTML ships .rl-revealed (lines visible).
 * On mount the mask is armed (class removed — instant, the transition
 * only exists under .rl-revealed), then re-applied on intersection.
 * Per-line stagger rides transition-delay: delay + i * stagger.
 * prefers-reduced-motion: .rl-revealed stays put; the global override
 * kills all transitions.
 */
export default function RevealLines({
  lines,
  as = 'div',
  trigger = 'inview',
  delay = 0,
  stagger = 90,
  className,
  style,
}: RevealLinesProps) {
  const ref = useRef<HTMLElement | null>(null);
  // inview only: ssr = revealed (server/no-JS/reduced) · armed = masked · revealed = animating in
  const [phase, setPhase] = useState<'ssr' | 'armed' | 'revealed'>('ssr');

  useEffect(() => {
    if (trigger === 'mount') return; // CSS owns the mount reveal — no JS beat
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    setPhase('armed');

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('revealed');
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

  const mount = trigger === 'mount';
  const revealed = phase !== 'armed';

  const children: React.ReactNode[] = lines.map((line, i) => (
    <span key={i} className="rl-mask">
      <span
        className="rl-line"
        style={
          mount
            ? { animationDelay: `${delay + i * stagger}ms` }
            : { transitionDelay: `${delay + i * stagger}ms` }
        }
      >
        {line}
      </span>
    </span>
  ));
  if (mount) {
    children.push(
      <noscript key="noscript">
        <style>{`.rl-mount .rl-line{animation:none;transform:none}`}</style>
      </noscript>
    );
  }

  return React.createElement(
    as,
    {
      ref,
      className: [className, mount ? 'rl-mount' : revealed ? 'rl-revealed' : '']
        .filter(Boolean)
        .join(' '),
      style,
    },
    children
  );
}
