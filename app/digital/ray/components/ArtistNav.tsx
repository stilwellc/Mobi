'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ARTISTS, ARTIST_LABEL } from '../constants';

export default function ArtistNav({ activeSlug, savedCount = 0 }: { activeSlug: string | null; savedCount?: number }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const activeLabel = activeSlug === 'saved' ? `Saved${savedCount > 0 ? ` (${savedCount})` : ''}` : activeSlug ? (ARTIST_LABEL[activeSlug] || activeSlug) : 'Overview';

  return (
    <>
      {/* Desktop: horizontal pill row */}
      <div className="ray-artist-nav-desktop">
        <style>{`
          .ray-artist-nav-desktop {
            position: sticky;
            top: 57px;
            z-index: 90;
            background: var(--color-nav-bg);
            backdrop-filter: blur(30px);
            border-bottom: 1px solid var(--color-border);
            padding: 8px 56px;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            align-items: center;
            justify-content: center;
          }
          .ray-artist-pill {
            white-space: nowrap;
            font-family: 'Syne', sans-serif;
            font-weight: 500;
            font-size: 11px;
            letter-spacing: 0.04em;
            padding: 5px 13px;
            border-radius: 100px;
            border: 1px solid transparent;
            background: transparent;
            color: var(--color-text-muted);
            text-decoration: none;
            transition: all 0.15s ease;
          }
          .ray-artist-pill:hover {
            color: var(--color-accent-blue);
          }
          .ray-artist-pill[data-active="true"] {
            background: var(--color-accent-blue);
            color: #060606;
            font-weight: 600;
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
        <Link
          href="/digital/ray/saved"
          className="ray-artist-pill"
          data-active={activeSlug === 'saved' ? 'true' : 'false'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
        >
          <svg width="10" height="12" viewBox="0 0 12 14" fill="none" style={{ opacity: 0.7 }}>
            <path
              d="M1 1.5C1 1.22386 1.22386 1 1.5 1H10.5C10.7761 1 11 1.22386 11 1.5V12.5C11 12.6894 10.8862 12.8625 10.7096 12.9472C10.533 13.0319 10.3239 13.0136 10.1646 12.8994L6 9.91421L1.83541 12.8994C1.67614 13.0136 1.46698 13.0319 1.29037 12.9472C1.11377 12.8625 1 12.6894 1 12.5V1.5Z"
              fill="currentColor"
              strokeWidth="0.8"
            />
          </svg>
          Saved{savedCount > 0 ? ` (${savedCount})` : ''}
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

      {/* Mobile: dropdown */}
      <div className="ray-artist-nav-mobile">
        <style>{`
          .ray-artist-nav-mobile { display: none; }
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
            border-radius: 10px;
            border: 1px solid var(--color-border);
            background: var(--color-bg-card);
            color: var(--color-fg);
            font-family: 'Syne', sans-serif;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.04em;
            cursor: pointer;
            transition: border-color 0.15s;
          }
          .ray-artist-select-btn:hover { border-color: var(--color-accent-blue); }
          .ray-artist-dropdown {
            position: absolute;
            left: 20px;
            right: 20px;
            top: 100%;
            margin-top: 4px;
            background: var(--color-bg-card);
            border: 1px solid var(--color-border);
            border-radius: 12px;
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
            transition: background 0.1s, color 0.1s;
            border-bottom: 1px solid var(--color-border);
          }
          .ray-artist-dropdown-item:last-child { border-bottom: none; }
          .ray-artist-dropdown-item:hover {
            background: rgba(150, 184, 212, 0.06);
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
            opacity: 0.4,
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
            <button
              className="ray-artist-dropdown-item"
              data-active={activeSlug === 'saved' ? 'true' : 'false'}
              onClick={() => { setOpen(false); router.push('/digital/ray/saved'); }}
            >
              Saved{savedCount > 0 ? ` (${savedCount})` : ''}
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
