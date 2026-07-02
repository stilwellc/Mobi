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
      `}</style>
      {children}
    </div>
  );
}
