'use client';

import { AuctionLot, MarketStats } from '../types';
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

export default function LotCard({
  lot,
  showArtist = false,
  allLots = [],
  stats,
}: {
  lot: AuctionLot;
  showArtist?: boolean;
  allLots?: AuctionLot[];
  stats?: MarketStats;
}) {
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
        borderRadius: 16,
        overflow: 'hidden',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        transition: 'border-color 0.2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          .ray-lot-card:hover { border-color: var(--color-accent-blue) !important; }
          .ray-lot-img { height: 200px; }
          @media (max-width: 768px) {
            .ray-lot-img { height: 170px; }
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
              fontSize: 42,
              fontWeight: 300,
              color: 'var(--color-text-ghost)',
              opacity: 0.3,
              fontStyle: 'italic',
            }}>
              {lot.title.charAt(0)}
            </div>
          )}
          {lot.status === 'upcoming' && (
            <div style={{
              position: 'absolute',
              top: 10,
              left: 10,
              padding: '3px 10px',
              borderRadius: 100,
              background: 'rgba(150, 184, 212, 0.12)',
              border: '1px solid rgba(150, 184, 212, 0.25)',
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#96B8D4',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}>
              <span style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#96B8D4',
                animation: 'pulse 2s infinite',
              }} />
              Live
            </div>
          )}
        </div>

        <div style={{ padding: '14px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 8,
          }}>
            <span style={{
              fontSize: 9,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: color,
              fontWeight: 600,
            }}>
              {lot.auctionHouse}
            </span>
            {catLabel && lot.category !== 'unknown' && (
              <>
                <span style={{ color: 'var(--color-text-ghost)', fontSize: 9 }}>·</span>
                <span style={{
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: catColor,
                  fontWeight: 600,
                }}>
                  {catLabel}
                </span>
              </>
            )}
          </div>

          {showArtist && lot.artist && (
            <div style={{
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-label)',
              fontWeight: 600,
              marginBottom: 4,
            }}>
              {ARTIST_LABEL[lot.artist] || lot.artist}
            </div>
          )}
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 19,
            fontWeight: 400,
            marginBottom: 4,
            lineHeight: 1.25,
            flex: 1,
          }}>
            {lot.title}
          </h3>
          {lot.year && (
            <div style={{ fontSize: 11, color: 'var(--color-text-ghost)', marginBottom: 10 }}>
              {lot.year}{lot.medium ? ` · ${lot.medium}` : ''}
            </div>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 8,
            marginTop: 'auto',
          }}>
            <span style={{
              fontSize: 14,
              color: 'var(--color-accent-blue)',
              fontWeight: 500,
            }}>
              {formatEstimate(lot)}
            </span>
            <span style={{
              fontSize: 10,
              color: 'var(--color-text-ghost)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              {new Date(lot.saleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
