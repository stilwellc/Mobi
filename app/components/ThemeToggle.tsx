'use client';

import { useTheme } from './ThemeProvider';

/**
 * The sun dips below the horizon — one persistent SVG scene in the
 * 32px glass pill. A 1px horizon line crosses the pill; above it the
 * sun; on light→dark the sun translates down behind an SVG clipPath
 * while a moon crescent rises from below. Transform + opacity only,
 * 400ms var(--ease-signature), driven entirely by the theme value.
 * The global reduced-motion override collapses the transitions.
 */
const sceneTransition =
  'transform 400ms var(--ease-signature), opacity 400ms var(--ease-signature)';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="glass glass-pill glass-quiet"
      style={{
        width: 32,
        height: 32,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--color-text-muted)',
        flexShrink: 0,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <defs>
          {/* Everything above the horizon line — the sky */}
          <clipPath id="tt-sky">
            <rect x="0" y="0" width="18" height="12.5" />
          </clipPath>
        </defs>

        <g clipPath="url(#tt-sky)">
          {/* Sun — up in light, dipped below the horizon in dark */}
          <g
            style={{
              transform: dark ? 'translateY(11px)' : 'translateY(0px)',
              opacity: dark ? 0 : 1,
              transition: sceneTransition,
            }}
          >
            <circle cx="9" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M9 1.2v1.6M3.2 7h1.6M13.2 7h1.6M4.9 2.9l1.13 1.13M13.1 2.9l-1.13 1.13"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>

          {/* Moon — rises from below the horizon in dark */}
          <g
            style={{
              transform: dark ? 'translateY(0px)' : 'translateY(11px)',
              opacity: dark ? 1 : 0,
              transition: sceneTransition,
            }}
          >
            <path
              d="M11.6 8.1a3 3 0 01-3.27-3.27A3 3 0 1011.6 8.1z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* The horizon — always present */}
        <line
          x1="2.5"
          y1="13"
          x2="15.5"
          y2="13"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
    </button>
  );
}
