'use client';

import { AuctionLot } from '../types';
import { ARTIST_LABEL } from '../constants';
import { houseColors, categoryLabels, categoryColors } from '../utils';

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

export default function LotCard({ lot, showArtist = false }: { lot: AuctionLot; showArtist?: boolean }) {
  const color = houseColors[lot.auctionHouse] || '#96B8D4';
  const catColor = categoryColors[lot.category] || '#888';
  const catLabel = categoryLabels[lot.category] || null;

  return (
    <a
      href={lot.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="ray-lot-card" style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        transition: 'all 0.4s ease',
        cursor: 'pointer',
      }}>
        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          .ray-lot-img { height: 220px; }
          @media (max-width: 768px) {
            .ray-lot-img { height: 180px; }
          }
        `}</style>
        <div className="ray-lot-img" style={{
          position: 'relative',
          width: '100%',
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
          {lot.category && lot.category !== 'unknown' && (
            <div style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              padding: '3px 10px',
              borderRadius: 100,
              background: `${catColor}15`,
              border: `1px solid ${catColor}30`,
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: catColor,
              fontWeight: 600,
            }}>
              {catLabel}
            </div>
          )}
        </div>

        <div style={{ padding: '16px 20px 20px' }}>
          {showArtist && lot.artist && (
            <div style={{
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-text-label)',
              fontWeight: 600,
              marginBottom: 6,
            }}>
              {ARTIST_LABEL[lot.artist] || lot.artist}
            </div>
          )}
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
