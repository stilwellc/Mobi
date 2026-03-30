'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ARTISTS } from '../constants';
import { ARTIST_LABEL } from '../constants';

export default function ArtistNav({ activeSlug }: { activeSlug: string | null }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const activeLabel = activeSlug ? (ARTIST_LABEL[activeSlug] || activeSlug) : 'Overview';

  return (
    <>
      {/* Desktop: 2-row wrapped pill grid */}
      <div className="ray-artist-nav-desktop">
        <style>{`
          .ray-artist-nav-desktop {
            position: sticky;
            top: 57px;
            z-index: 90;
            background: var(--color-nav-bg);
            backdrop-filter: blur(30px);
            border-bottom: 1px solid var(--color-border);
            padding: 10px 56px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-items: center;
            justify-content: center;
          }
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
            .ray-artist-nav-desktop { display: none; }
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

      {/* Mobile: dropdown select */}
      <div className="ray-artist-nav-mobile">
        <style>{`
          .ray-artist-nav-mobile {
            display: none;
          }
          @media (max-width: 768px) {
            .ray-artist-nav-mobile {
              display: block;
              position: sticky;
              top: 49px;
              z-index: 90;
              background: var(--color-nav-bg);
              backdrop-filter: blur(30px);
              border-bottom: 1px solid var(--color-border);
              padding: 8px 20px;
            }
          }
          .ray-artist-select-btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 14px;
            border-radius: 12px;
            border: 1px solid var(--color-border);
            background: var(--color-bg-card);
            color: var(--color-fg);
            font-family: 'Syne', sans-serif;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.06em;
            cursor: pointer;
            transition: border-color 0.2s;
          }
          .ray-artist-select-btn:hover {
            border-color: var(--color-accent-blue);
          }
          .ray-artist-dropdown {
            position: absolute;
            left: 20px;
            right: 20px;
            top: 100%;
            margin-top: 4px;
            background: var(--color-bg-card);
            border: 1px solid var(--color-border);
            border-radius: 16px;
            overflow: hidden;
            max-height: 320px;
            overflow-y: auto;
            scrollbar-width: none;
          }
          .ray-artist-dropdown::-webkit-scrollbar { display: none; }
          .ray-artist-dropdown-item {
            display: block;
            width: 100%;
            padding: 10px 16px;
            font-family: 'Syne', sans-serif;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.04em;
            color: var(--color-text-muted);
            text-decoration: none;
            border: none;
            background: transparent;
            text-align: left;
            cursor: pointer;
            transition: background 0.15s, color 0.15s;
            border-bottom: 1px solid var(--color-border);
          }
          .ray-artist-dropdown-item:last-child { border-bottom: none; }
          .ray-artist-dropdown-item:hover {
            background: rgba(150, 184, 212, 0.08);
            color: var(--color-accent-blue);
          }
          .ray-artist-dropdown-item[data-active="true"] {
            color: var(--color-accent-blue);
            font-weight: 600;
          }
        `}</style>

        <button
          className="ray-artist-select-btn"
          onClick={() => setOpen(o => !o)}
        >
          <span>{activeLabel}</span>
          <span style={{
            fontSize: 10,
            opacity: 0.5,
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
          }}>
            &#9660;
          </span>
        </button>

        {open && (
          <div className="ray-artist-dropdown">
            <button
              className="ray-artist-dropdown-item"
              data-active={activeSlug === null ? 'true' : 'false'}
              onClick={() => { setOpen(false); router.push('/digital/ray'); }}
            >
              Overview
            </button>
            {ARTISTS.map(a => (
              <button
                key={a.slug}
                className="ray-artist-dropdown-item"
                data-active={activeSlug === a.slug ? 'true' : 'false'}
                onClick={() => { setOpen(false); router.push(`/digital/ray/${a.slug}`); }}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
