'use client';

import { AuctionLot } from '../types';
import LotCard from './LotCard';

export default function UpcomingLots({ lots }: { lots: AuctionLot[] }) {
  return (
    <section style={{ padding: '40px 56px 60px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#96B8D4',
          animation: 'pulse 2s infinite',
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 20,
      }}>
        {lots.map((lot) => (
          <LotCard key={lot.id} lot={lot} />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
