'use client';

import { useState } from 'react';
import { AuctionLot } from '../types';

const houseColors: Record<string, string> = {
  'Phillips': '#96B8D4',
  "Sotheby's": '#D4B896',
  "Christie's": '#D496B8',
  'Rago': '#B8D496',
  'Wright': '#B896D4',
  'Heritage': '#D4D496',
};

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default function PastResults({ lots }: { lots: AuctionLot[] }) {
  const [visible, setVisible] = useState(20);
  const shown = lots.slice(0, visible);

  return (
    <section className="ray-results" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        .ray-results { padding: 40px 56px 120px; }
        .ray-result-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          text-decoration: none;
          color: inherit;
          transition: background 0.2s;
        }
        .ray-result-row:hover { background: var(--color-hover-item); }
        .ray-result-price-col { text-align: right; flex-shrink: 0; }
        .ray-result-meta-row { display: flex; align-items: center; gap: 8px; }
        @media (max-width: 768px) {
          .ray-results { padding: 32px 20px 80px; }
          .ray-result-row {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 16px 16px;
          }
          .ray-result-price-col {
            text-align: left;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .ray-result-meta-row { flex-wrap: wrap; }
        }
      `}</style>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: '-0.02em',
        }}>
          Recent <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>Results</span>
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-subtle)', fontWeight: 400, marginTop: 8 }}>
          Sold lots at auction
        </p>
      </div>

      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 20,
        overflow: 'hidden',
      }}>
        {shown.map((lot, i) => {
          const color = houseColors[lot.auctionHouse] || '#96B8D4';
          return (
            <a
              key={lot.id}
              href={lot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ray-result-row"
              style={{
                borderBottom: i < shown.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18,
                  fontWeight: 300,
                  marginBottom: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {lot.title}
                </div>
                <div className="ray-result-meta-row" style={{
                  fontSize: 11,
                  color: 'var(--color-text-label)',
                }}>
                  {lot.year && <span>{lot.year}</span>}
                  {lot.year && lot.medium && <span style={{ opacity: 0.4 }}>·</span>}
                  {lot.medium && (
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                      {lot.medium}
                    </span>
                  )}
                </div>
              </div>

              <div className="ray-result-price-col">
                <div style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--color-accent-blue)',
                }}>
                  {lot.priceUsd ? formatPrice(lot.priceUsd) : '—'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-text-ghost)', marginTop: 2 }}>
                  {new Date(lot.saleDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div style={{
                padding: '3px 10px',
                borderRadius: 100,
                background: `${color}15`,
                border: `1px solid ${color}30`,
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: color,
                fontWeight: 600,
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}>
                {lot.auctionHouse}
              </div>
            </a>
          );
        })}
      </div>

      {visible < lots.length && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button
            onClick={() => setVisible((v) => v + 20)}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 100,
              padding: '10px 28px',
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-text-subtle)',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Syne', sans-serif",
              transition: 'all 0.3s',
            }}
          >
            Show More
          </button>
        </div>
      )}
    </section>
  );
}
