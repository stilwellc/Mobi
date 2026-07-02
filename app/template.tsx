'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { horizonGradients } from './components/Horizon';

/**
 * THE ROUTE RITUAL — every click is the same gesture: horizon,
 * then light. One drawn 1px line (wine in software's rooms, gold
 * everywhere else), then content rises 20px into place. Next.js
 * remounts template.tsx per navigation, so the ritual fires on
 * every route change (and once on first load — that IS the beat 1
 * entrance; pages must not double-animate against it).
 *
 * Ray exception: a product sub-site does not perform the brand
 * ritual per tab — no route-line, children keep only routeRise.
 *
 * data-entered releases the animation (and its transform containing
 * block) after arrival. Reduced motion: fill-mode both + the global
 * 0.01ms override = final state immediately.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  const isRay = pathname.startsWith('/software/ray');
  const gradient = pathname.startsWith('/software')
    ? horizonGradients.wine
    : horizonGradients.gold;

  return (
    <>
      {!isRay && (
        <div className="rail" aria-hidden="true">
          <div
            className="route-line"
            style={{ background: gradient, opacity: 0.35 }}
          />
        </div>
      )}
      <div
        className="route-content"
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) {
            e.currentTarget.setAttribute('data-entered', 'true');
          }
        }}
      >
        {children}
      </div>
    </>
  );
}
