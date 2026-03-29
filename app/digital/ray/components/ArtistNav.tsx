'use client';

import Link from 'next/link';
import { ARTISTS } from '../constants';

export default function ArtistNav({ activeSlug }: { activeSlug: string | null }) {
  return (
    <div className="ray-artist-nav">
      <style>{`
        .ray-artist-nav {
          position: sticky;
          top: 57px;
          z-index: 90;
          background: var(--color-nav-bg);
          backdrop-filter: blur(30px);
          border-bottom: 1px solid var(--color-border);
          padding: 12px 56px;
          overflow-x: auto;
          scrollbar-width: none;
          display: flex;
          gap: 8px;
        }
        .ray-artist-nav::-webkit-scrollbar { display: none; }
        .ray-artist-pill {
          white-space: nowrap;
          font-family: 'Syne', sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.02em;
          padding: 8px 20px;
          border-radius: 24px;
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
        @media (max-width: 768px) {
          .ray-artist-nav {
            padding: 10px 20px;
            gap: 6px;
          }
          .ray-artist-pill {
            padding: 7px 14px;
            font-size: 12px;
          }
        }
      `}</style>

      <Link
        href="/digital/ray"
        className="ray-artist-pill"
        data-active={activeSlug === null ? 'true' : 'false'}
      >
        Overview
      </Link>
      {ARTISTS.map(a => (
        <Link
          key={a.slug}
          href={`/digital/ray/${a.slug}`}
          className="ray-artist-pill"
          data-active={activeSlug === a.slug ? 'true' : 'false'}
        >
          {a.label}
        </Link>
      ))}
    </div>
  );
}
