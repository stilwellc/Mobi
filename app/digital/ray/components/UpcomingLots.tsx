'use client';

import { AuctionLot } from '../types';
import LotCard from './LotCard';

export default function UpcomingLots({ lots }: { lots: AuctionLot[] }) {
  return (
    <section className="ray-upcoming" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <style>{`
        .ray-upcoming { padding: 40px 56px 60px; }
        .ray-upcoming-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        @media (max-width: 768px) {
          .ray-upcoming { padding: 32px 20px 40px; }
          .ray-upcoming-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <span style={{
          width: 8,
          height: 8,
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

      <div className="ray-upcoming-grid">
        {lots.map((lot) => (
          <LotCard key={lot.id} lot={lot} />
        ))}
      </div>
    </section>
  );
}
