'use client';

import React from 'react';
import { useScrollReveal, usePrefersReducedMotion } from '../components/hooks';

/**
 * Smallest possible client wrapper — scroll-reveals its children.
 * Max 24px translate, signature easing, gated by prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, isVisible } = useScrollReveal(0.12);
  const reduced = usePrefersReducedMotion();
  const shown = isVisible || reduced;
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(24px)',
        transition: reduced
          ? 'none'
          : `opacity var(--duration-slow) var(--ease-signature) ${delay}ms, transform var(--duration-slow) var(--ease-signature) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
