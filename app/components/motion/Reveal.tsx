'use client';

import React, { useEffect, useRef, useState } from 'react';

export type RevealProps = {
  children: React.ReactNode;
  variant?: 'rise' | 'unveil';   // default 'rise'
  delay?: number;                 // ms, default 0 (transition-delay)
  threshold?: number;             // default 0.15
  as?: 'div' | 'section' | 'figure' | 'li';  // default 'div'
  style?: React.CSSProperties;
  className?: string;
};

/**
 * The one scroll-reveal primitive (supersedes app/about/Reveal.tsx).
 *
 * rise:   opacity 0->1 + translateY(16px)->0, 600ms var(--ease-signature).
 * unveil: .unveil / .is-shown clip-path contract from globals.css —
 *         put the image directly inside (img or .unveil-img).
 *
 * No-JS / print safety: the server HTML renders fully visible; the
 * mount effect arms the hidden pre-state, then a one-shot
 * IntersectionObserver (disconnected after fire) reveals it.
 * prefers-reduced-motion: final state rendered, no observer attached.
 *
 * Structure note: for unveil, the observed outer element stays
 * unclipped and .unveil rides an inner wrapper — Chromium's IO
 * reports zero intersection for an element clip-pathed to nothing,
 * so clipping the observed node would deadlock the reveal.
 */
export default function Reveal({
  children,
  variant = 'rise',
  delay = 0,
  threshold = 0.15,
  as = 'div',
  style,
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // idle = server/no-JS (visible) · static = reduced motion (visible)
  // hidden = armed pre-state · shown = revealed with transition
  const [phase, setPhase] = useState<'idle' | 'hidden' | 'shown' | 'static'>('idle');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('static');
      return;
    }
    const el = ref.current;
    if (!el) {
      setPhase('static');
      return;
    }
    setPhase('hidden');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('shown');
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const sty: React.CSSProperties = { ...style };

  if (variant === 'unveil') {
    const innerCls =
      phase === 'hidden' || phase === 'shown'
        ? `unveil${phase === 'shown' ? ' is-shown' : ''}`
        : undefined;
    const innerSty: React.CSSProperties | undefined = delay
      ? ({ '--unveil-delay': `${delay}ms` } as React.CSSProperties)
      : undefined;
    return React.createElement(
      as,
      { ref, className, style: sty },
      <div className={innerCls} style={innerSty}>
        {children}
      </div>
    );
  }

  if (phase === 'hidden') {
    sty.opacity = 0;
    sty.transform = 'translateY(16px)';
  } else if (phase === 'shown') {
    sty.opacity = 1;
    sty.transform = 'translateY(0)';
    sty.transition = `opacity 600ms var(--ease-signature) ${delay}ms, transform 600ms var(--ease-signature) ${delay}ms`;
  }

  return React.createElement(
    as,
    { ref, className, style: sty },
    children
  );
}
