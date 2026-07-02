import type { Metadata } from 'next';
import { ARTISTS } from './constants';

export const metadata: Metadata = {
  title: {
    default: 'Ray — co.stil',
    template: '%s — Ray — co.stil',
  },
  description: `Auction intelligence for the art market — ${ARTISTS.length} artists tracked across 5 major houses, crawled automatically.`,
};

export default function RayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ray-shell">
      <style>{`
        /* Clear the fixed site nav rendered by the root layout */
        .ray-shell { padding-top: 88px; }
        /* Every numeric display in Ray uses tabular figures */
        .ray-shell { font-variant-numeric: tabular-nums; }
        @media (max-width: 768px) {
          .ray-shell { padding-top: 64px; }
        }
        /* THE MARKET DRAWS ITSELF — chart bodies wipe in left to
           right along the time axis on first intersection (attribute
           set by useChartDraw, one shared IO). Only the series groups
           are clipped; axes, grid and labels stay outside the clip.
           Category-filter changes never replay (fired flag on hook).
           NOTE: keep this style block free of quotes, apostrophes
           and angle brackets - React escapes them server-side and
           hydration of raw-text elements then fails. */
        .ray-chart-draw .recharts-area,
        .ray-chart-draw .recharts-line {
          clip-path: inset(0 100% 0 0);
        }
        .ray-chart-draw[data-drawn=true] .recharts-area,
        .ray-chart-draw[data-drawn=true] .recharts-line {
          clip-path: inset(0 0 0 0);
          transition: clip-path 800ms var(--ease-signature);
        }
        /* Bookmark press — 0.88 scale on press, 120ms back */
        .ray-save-btn {
          transition:
            background var(--duration-fast) var(--ease-signature),
            border-color var(--duration-fast) var(--ease-signature),
            transform 120ms var(--ease-signature);
        }
        .ray-save-btn:active { transform: scale(0.88); }
        @media (prefers-reduced-motion: reduce) {
          .ray-chart-draw .recharts-area,
          .ray-chart-draw .recharts-line { clip-path: none; }
          .ray-save-btn:active { transform: none; }
        }
      `}</style>
      {children}
    </div>
  );
}
