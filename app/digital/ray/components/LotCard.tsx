'use client';

import { AuctionLot } from '../types';

const houseColors: Record<string, string> = {
  'Phillips': '#96B8D4',
  "Sotheby's": '#D4B896',
  "Christie's": '#D496B8',
  'Rago': '#B8D496',
};

function formatEstimate(lot: AuctionLot): string {
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
  };
  if (lot.estimateLow && lot.estimateHigh) {
    return `${fmt(lot.estimateLow)} — ${fmt(lot.estimateHigh)} ${lot.currency}`;
  }
  return 'Estimate on request';
}

export default function LotCard({ lot }: { lot: AuctionLot }) {
  const color = houseColors[lot.auctionHouse] || '#96B8D4';

  return (
    <a
      href={lot.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        transition: 'all 0.4s ease',
        cursor: 'pointer',
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: 220,
          background: `linear-gradient(135deg, var(--color-bg-card) 0%, var(--color-bg) 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {lot.imageUrl ? (
            <img
              src={lot.imageUrl}
              alt={lot.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 48,
              fontWeight: 300,
              color: 'var(--color-text-ghost)',
              opacity: 0.4,
              fontStyle: 'italic',
            }}>
              {lot.title.charAt(0)}
            </div>
          )}
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            padding: '4px 12px',
            borderRadius: 100,
            background: `${color}15`,
            border: `1px solid ${color}30`,
            fontSize: 9,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: color,
            fontWeight: 600,
          }}>
            {lot.auctionHouse}
          </div>
          {lot.status === 'upcoming' && (
            <div style={{
              position: 'absolute',
              top: 12,
              left: 12,
              padding: '4px 12px',
              borderRadius: 100,
              background: 'rgba(150, 184, 212, 0.15)',
              border: '1px solid rgba(150, 184, 212, 0.3)',
              fontSize: 9,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#96B8D4',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#96B8D4',
                animation: 'pulse 2s infinite',
              }} />
              Live
            </div>
          )}
        </div>

        <div style={{ padding: '16px 20px 20px' }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
            fontWeight: 300,
            marginBottom: 4,
            lineHeight: 1.2,
          }}>
            {lot.title}
          </h3>
          {lot.year && (
            <div style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginBottom: 8 }}>
              {lot.year}{lot.medium ? ` · ${lot.medium}` : ''}
            </div>
          )}
          <div style={{
            fontSize: 14,
            color: 'var(--color-accent-blue)',
            fontWeight: 500,
            marginBottom: 6,
          }}>
            {formatEstimate(lot)}
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--color-text-label)',
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}>
            {new Date(lot.saleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {lot.saleName ? ` · ${lot.saleName}` : ''}
          </div>
        </div>
      </div>
    </a>
  );
}
