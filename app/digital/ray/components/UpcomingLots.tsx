'use client';

import { AuctionLot } from '../types';
import LotCard from './LotCard';

export default function UpcomingLots({ lots, showArtist = false }: { lots: AuctionLot[]; showArtist?: boolean }) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#96B8D4',
            animation: 'pulse 2s infinite',
            flexShrink: 0,
          }} />
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: '-0.02em',
          }}>
            Upcoming <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>Lots</span>
          </h2>
        </div>
      </div>

      <div className="ray-upcoming-grid">
        {lots.map((lot) => (
          <LotCard key={lot.id} lot={lot} showArtist={showArtist} />
        ))}
      </div>
    </section>
  );
}
