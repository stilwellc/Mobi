'use client';

import { useState } from 'react';
import { AuctionLot, MarketStats } from '../types';
import LotCard from './LotCard';

export default function UpcomingLots({
  lots,
  showArtist = false,
  allLots = [],
  stats,
  savedIds = [],
  onToggleSave,
}: {
  lots: AuctionLot[];
  showArtist?: boolean;
  allLots?: AuctionLot[];
  stats?: MarketStats;
  savedIds?: string[];
  onToggleSave?: (lotId: string) => void;
}) {
  const [visible, setVisible] = useState(48);
  return (
    <section className="ray-upcoming" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        .ray-upcoming { padding: 40px 56px 48px; }
        .ray-upcoming-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        @media (max-width: 768px) {
          .ray-upcoming { padding: 32px 20px 32px; }
          .ray-upcoming-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "var(--font-serif), serif",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: '-0.02em',
        }}>
          Upcoming <span style={{ fontStyle: 'italic', color: 'var(--color-accent-ocean)' }}>Lots</span>
        </h2>
      </div>

      <div className="ray-upcoming-grid">
        {lots.slice(0, visible).map((lot) => (
          <LotCard
            key={lot.id}
            lot={lot}
            showArtist={showArtist}
            allLots={allLots}
            stats={stats}
            saved={savedIds.includes(lot.id)}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>

      {visible < lots.length && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <button
            onClick={() => setVisible(v => v + 48)}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 100,
              padding: '10px 32px',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans), sans-serif',
              transition: 'border-color var(--duration-fast) var(--ease-signature)',
            }}
          >
            Show more
          </button>
        </div>
      )}
    </section>
  );
}
