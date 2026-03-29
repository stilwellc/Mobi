'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';
import { ARTISTS, ARTIST_LABEL } from './constants';
import { useRayData } from './hooks/useRayData';
import ArtistNav from './components/ArtistNav';
import LotCard from './components/LotCard';

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

export default function RayPage() {
  const { allLots, lastCrawl, loading } = useRayData();

  const upcoming = allLots
    .filter(l => l.status === 'upcoming')
    .sort((a, b) => {
      if (!a.saleDate) return 1;
      if (!b.saleDate) return -1;
      return new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime();
    });

  const recentSold = allLots
    .filter(l => l.status === 'sold' && l.priceUsd)
    .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
    .slice(0, 8);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-fg)',
      fontFamily: "'Syne', sans-serif",
    }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .ray-nav { padding: 24px 56px; }
        .ray-hero { padding: 60px 56px 40px; }
        .ray-divider-wrap { padding: 0 56px; }
        .ray-upcoming-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .ray-sold-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 16px;
          padding: 14px 24px;
          text-decoration: none;
          color: inherit;
          transition: background 0.2s;
        }
        .ray-sold-row:hover { background: var(--color-hover-item); }
        @media (max-width: 768px) {
          .ray-nav { padding: 16px 20px; }
          .ray-hero { padding: 40px 20px 32px; }
          .ray-divider-wrap { padding: 0 20px; }
          .ray-upcoming-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .ray-sold-row {
            grid-template-columns: 1fr;
            gap: 6px;
            padding: 14px 16px;
          }
        }
      `}</style>

      <nav className="ray-nav" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-nav-bg)',
        backdropFilter: 'blur(30px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{
          textDecoration: 'none',
          color: 'var(--color-fg)',
          fontFamily: "'Syne', sans-serif",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: '-0.04em',
        }}>
          mobi<span style={{ color: 'var(--color-accent-gold)' }}>.</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ThemeToggle />
          <Link href="/" style={{
            textDecoration: 'none',
            fontSize: 12,
            color: 'var(--color-text-subtle)',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            &#8592; Back
          </Link>
        </div>
      </nav>

      <ArtistNav activeSlug={null} />

      <section className="ray-hero" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--color-accent-blue)',
            opacity: 0.6,
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 11,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-text-label)',
            fontWeight: 600,
          }}>
            Digital &mdash; Market Intelligence
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.03em',
          lineHeight: 0.95,
          marginBottom: 16,
        }}>
          <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>Ray</span>
        </h1>
        <p style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: 'var(--color-text-muted)',
          fontWeight: 400,
          maxWidth: 560,
        }}>
          Auction intelligence — tracking {ARTISTS.length} artists across Phillips, Sotheby&apos;s,
          Christie&apos;s, and Wright/Rago. Select an artist to drill into their market data.
        </p>

        {lastCrawl && (
          <span style={{
            display: 'inline-block',
            marginTop: 16,
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-ghost)',
            fontWeight: 500,
          }}>
            Last updated: {new Date(lastCrawl).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </span>
        )}
      </section>

      <div className="ray-divider-wrap" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          width: '100%',
          height: 1,
          background: 'linear-gradient(90deg, var(--color-border-mid), transparent 80%)',
        }} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 120 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-accent-blue)',
            opacity: 0.5,
            animation: 'pulse 2s infinite',
          }} />
        </div>
      ) : (
        <>
          {/* Upcoming Lots — all artists */}
          {upcoming.length > 0 && (
            <section className="ray-upcoming-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 56px 60px' }}>
              <style>{`
                @media (max-width: 768px) {
                  .ray-upcoming-section { padding: 32px 20px 40px !important; }
                  .ray-sold-section { padding: 0 20px 80px !important; }
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
                <span style={{
                  fontSize: 12,
                  color: 'var(--color-text-ghost)',
                  fontWeight: 500,
                  marginLeft: 4,
                }}>
                  {upcoming.length}
                </span>
              </div>

              <div className="ray-upcoming-grid">
                {upcoming.map(lot => (
                  <LotCard key={lot.id} lot={lot} showArtist />
                ))}
              </div>
            </section>
          )}

          {/* Recently Sold — compact preview */}
          {recentSold.length > 0 && (
            <section className="ray-sold-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 56px 120px' }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32,
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                }}>
                  Recent <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>Results</span>
                </h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-subtle)', fontWeight: 400, marginTop: 8 }}>
                  Latest sold lots across all artists
                </p>
              </div>

              <div style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 20,
                overflow: 'hidden',
              }}>
                {recentSold.map((lot, i) => {
                  const color = houseColors[lot.auctionHouse] || '#96B8D4';
                  return (
                    <a
                      key={lot.id}
                      href={lot.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ray-sold-row"
                      style={{
                        borderBottom: i < recentSold.length - 1 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 18,
                          fontWeight: 300,
                          marginBottom: 3,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {lot.title}
                        </div>
                        <div style={{
                          fontSize: 10,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--color-text-label)',
                          fontWeight: 600,
                        }}>
                          {ARTIST_LABEL[lot.artist] || lot.artist}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
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
            </section>
          )}
        </>
      )}
    </div>
  );
}
