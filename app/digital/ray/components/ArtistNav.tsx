'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ARTISTS, ARTIST_LABEL } from '../constants';

export default function ArtistNav({ activeSlug, savedCount = 0, upcomingCounts = {} }: { activeSlug: string | null; savedCount?: number; upcomingCounts?: Record<string, number> }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const activeLabel = activeSlug === 'saved'
    ? `Saved${savedCount > 0 ? ` (${savedCount})` : ''}`
    : activeSlug === 'analytics'
      ? 'Analytics'
      : activeSlug
        ? (ARTIST_LABEL[activeSlug] || activeSlug)
        : 'Overview';

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleScroll() { setOpen(false); }
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  function navigate(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <div className="ray-artist-nav" ref={ref}>
      <style>{`
        .ray-artist-nav {
          position: sticky;
          top: 57px;
          z-index: 90;
          background: var(--color-nav-bg);
          backdrop-filter: blur(30px);
          border-bottom: 1px solid var(--color-border);
          padding: 8px 56px;
        }
        .ray-artist-nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
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
          left: 0;
          right: 0;
          top: 100%;
          margin-top: 4px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          max-height: 400px;
          overflow-y: auto;
          scrollbar-width: none;
          z-index: 100;
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
        .ray-artist-count {
          font-size: 10px;
          font-weight: 600;
          color: #060606;
          background: var(--color-accent-blue);
          border-radius: 100px;
          padding: 1px 7px;
          margin-left: 8px;
        }
        .ray-artist-dropdown-divider {
          height: 1px;
          background: var(--color-border);
          margin: 0;
          border: none;
        }
        .ray-artist-dropdown-label {
          padding: 8px 16px 4px;
          font-family: 'Syne', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-text-ghost);
          border-bottom: 1px solid var(--color-border);
        }
        @media (max-width: 768px) {
          .ray-artist-nav { padding: 8px 20px; top: 49px; }
        }
      `}</style>

      <div className="ray-artist-nav-inner">
        <button
          className="ray-artist-select-btn"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Navigate Ray — currently: ${activeLabel}`}
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
              onClick={() => navigate('/digital/ray')}
            >
              Overview
            </button>
            <button
              className="ray-artist-dropdown-item"
              data-active={activeSlug === 'saved' ? 'true' : 'false'}
              onClick={() => navigate('/digital/ray/saved')}
            >
              Saved{savedCount > 0 ? ` (${savedCount})` : ''}
            </button>
            <button
              className="ray-artist-dropdown-item"
              data-active={activeSlug === 'analytics' ? 'true' : 'false'}
              onClick={() => navigate('/digital/ray/analytics')}
            >
              Analytics
            </button>
            <div className="ray-artist-dropdown-label">Artists</div>
            {ARTISTS.map(a => (
              <button
                key={a.slug}
                className="ray-artist-dropdown-item"
                data-active={activeSlug === a.slug ? 'true' : 'false'}
                onClick={() => navigate(`/digital/ray/${a.slug}`)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>{a.label}</span>
                {(upcomingCounts[a.slug] || 0) > 0 && (
                  <span className="ray-artist-count">{upcomingCounts[a.slug]}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
