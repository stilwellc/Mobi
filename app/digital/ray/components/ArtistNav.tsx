'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ARTISTS } from '../constants';

export default function ArtistNav({ activeSlug }: { activeSlug: string | null }) {
  const navRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (activeRef.current && navRef.current) {
      const nav = navRef.current;
      const pill = activeRef.current;
      const offset = pill.offsetLeft - nav.offsetWidth / 2 + pill.offsetWidth / 2;
      nav.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [activeSlug]);

  return (
    <div className="ray-artist-nav" ref={navRef}>
      <style>{`
        .ray-artist-nav {
          position: sticky;
          top: 57px;
          z-index: 90;
          background: var(--color-nav-bg);
          backdrop-filter: blur(30px);
          border-bottom: 1px solid var(--color-border);
          padding: 10px 56px;
          overflow-x: auto;
          scrollbar-width: none;
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .ray-artist-nav::-webkit-scrollbar { display: none; }
        .ray-artist-pill {
          white-space: nowrap;
          font-family: 'Syne', sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.06em;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-muted);
          text-decoration: none;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .ray-artist-pill:hover {
          border-color: var(--color-accent-blue);
          color: var(--color-accent-blue);
        }
        .ray-artist-pill[data-active="true"] {
          background: var(--color-accent-blue);
          border-color: var(--color-accent-blue);
          color: #060606;
        }
        .ray-artist-nav-sep {
          width: 1px;
          height: 16px;
          background: var(--color-border);
          flex-shrink: 0;
          margin: 0 2px;
        }
        @media (max-width: 768px) {
          .ray-artist-nav {
            padding: 8px 16px;
            gap: 5px;
          }
          .ray-artist-pill {
            padding: 5px 12px;
            font-size: 11px;
          }
        }
      `}</style>

      <Link
        href="/digital/ray"
        className="ray-artist-pill"
        data-active={activeSlug === null ? 'true' : 'false'}
        ref={activeSlug === null ? activeRef : undefined}
      >
        Overview
      </Link>
      <div className="ray-artist-nav-sep" />
      {ARTISTS.map(a => (
        <Link
          key={a.slug}
          href={`/digital/ray/${a.slug}`}
          className="ray-artist-pill"
          data-active={activeSlug === a.slug ? 'true' : 'false'}
          ref={activeSlug === a.slug ? activeRef : undefined}
        >
          {a.label}
        </Link>
      ))}
    </div>
  );
}
