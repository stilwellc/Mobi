'use client';

import React, { useMemo, useState } from 'react';
import { ARTISTS } from './constants';
import { useRayData } from './hooks/useRayData';
import { useSavedLots } from './hooks/useSavedLots';
import { formatPrice, getUpcomingCounts } from './utils';
import ArtistNav from './components/ArtistNav';
import LotCard from './components/LotCard';
import PastResults from './components/PastResults';

const PAGE_SIZE = 48;

export default function RayPage() {
  const { allLots, statsByArtist, sources, lastCrawl, loading, error } = useRayData();
  const { toggle, isSaved, savedIds } = useSavedLots();
  const [visibleUpcoming, setVisibleUpcoming] = useState(PAGE_SIZE);

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return allLots
      .filter(l => l.status === 'upcoming' && l.saleDate && l.saleDate >= today)
      .sort((a, b) => {
        if (!a.saleDate) return 1;
        if (!b.saleDate) return -1;
        return new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime();
      });
  }, [allLots]);

  const upcomingCounts = useMemo(() => getUpcomingCounts(allLots), [allLots]);

  const sold = useMemo(() =>
    allLots
      .filter(l => l.status === 'sold' && l.priceUsd)
      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()),
    [allLots]
  );

  // Truthful house count: crawler meta first, otherwise derived from the lots themselves
  const houseCount = useMemo(() =>
    sources.length || new Set(allLots.map(l => l.auctionHouse)).size,
    [sources, allLots]
  );

  const overviewStats = useMemo(() => {
    const totalLots = allLots.length;
    const totalSalesValue = Object.values(statsByArtist).reduce((sum, s) => sum + (s.totalAuctionRevenue || 0), 0);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const recentSold = sold.filter(l => {
      const d = new Date(l.saleDate);
      return !isNaN(d.getTime()) && d >= oneYearAgo;
    });
    const avgPrice = recentSold.length
      ? recentSold.reduce((sum, l) => sum + (l.priceUsd || 0), 0) / recentSold.length
      : 0;
    return [
      { label: 'Artists', value: `${ARTISTS.length}`, sub: `${houseCount} auction houses` },
      { label: 'Total Lots', value: totalLots.toLocaleString(), sub: 'sold, upcoming & bought-in' },
      { label: 'Total Sales Value', value: formatPrice(totalSalesValue), sub: 'aggregate realized prices' },
      { label: 'Avg. Price (12mo)', value: formatPrice(avgPrice), sub: `${recentSold.length.toLocaleString()} recent sales` },
    ];
  }, [allLots, sold, statsByArtist, houseCount]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-fg)',
      fontFamily: 'var(--font-sans), sans-serif',
    }}>
      <style>{`
        .ray-overview-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--color-border);
          border-radius: 16px;
          overflow: hidden;
        }
        .ray-overview-stats .ray-stat-card {
          background: var(--color-bg-elevated);
          padding: 28px 24px;
        }
        .ray-upcoming-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        @media (max-width: 768px) {
          .ray-overview-stats { grid-template-columns: repeat(2, 1fr); }
          .ray-overview-stats .ray-stat-card { padding: 20px 18px; }
          .ray-upcoming-grid { grid-template-columns: 1fr; gap: 14px; }
        }
      `}</style>

      <ArtistNav activeSlug={null} savedCount={savedIds.length} upcomingCounts={upcomingCounts} />

      <section className="ray-hero" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <span style={{
          display: 'inline-block',
          fontSize: 12,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          fontWeight: 600,
          marginBottom: 16,
        }}>
          Market Intelligence
        </span>
        <h1 style={{
          fontFamily: 'var(--font-serif), serif',
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.03em',
          lineHeight: 0.95,
          marginBottom: 16,
        }}>
          <span style={{ fontStyle: 'italic', color: 'var(--color-accent-ocean)' }}>Ray</span>
        </h1>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--color-text-muted)',
          fontWeight: 400,
          maxWidth: 500,
        }}>
          Tracking {ARTISTS.length} artists across {houseCount} auction houses.
        </p>

        {lastCrawl && (
          <span style={{
            display: 'inline-block',
            marginTop: 14,
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-text-faint)',
            fontWeight: 400,
          }}>
            Updated {new Date(lastCrawl).toLocaleDateString('en-US', {
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

      {error ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '120px 20px', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
              padding: '8px 20px', borderRadius: 100, border: '1px solid var(--color-border)',
              background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer',
              fontFamily: 'var(--font-sans), sans-serif',
            }}
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 120 }}>
          <span style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-text-faint)',
          }}>
            Loading
          </span>
        </div>
      ) : (
        <>
          <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 56px 0' }} className="ray-overview-stats-section">
            <style>{`
              @media (max-width: 768px) {
                .ray-overview-stats-section { padding: 32px 20px 0 !important; }
                .ray-upcoming-section { padding: 32px 20px 32px !important; }
              }
            `}</style>
            <div className="ray-overview-stats">
              {overviewStats.map((card) => (
                <div key={card.label} className="ray-stat-card">
                  <div style={{
                    fontSize: 12,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    fontWeight: 600,
                    marginBottom: 14,
                  }}>
                    {card.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-serif), serif',
                    fontSize: 34,
                    fontWeight: 300,
                    color: 'var(--color-accent-ocean)',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}>
                    {card.value}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'var(--color-text-muted)',
                    fontWeight: 400,
                  }}>
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {upcoming.length > 0 && (
            <section className="ray-upcoming-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 56px 48px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                <h2 style={{
                  fontFamily: 'var(--font-serif), serif',
                  fontSize: 32,
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                }}>
                  Upcoming <span style={{ fontStyle: 'italic', color: 'var(--color-accent-ocean)' }}>Lots</span>
                </h2>
                <span style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 12,
                  color: 'var(--color-text-faint)',
                }}>
                  {upcoming.length.toLocaleString()} lots
                </span>
              </div>

              <div className="ray-upcoming-grid">
                {upcoming.slice(0, visibleUpcoming).map(lot => (
                  <LotCard
                    key={lot.id}
                    lot={lot}
                    showArtist
                    allLots={allLots}
                    stats={statsByArtist[lot.artist]}
                    saved={isSaved(lot.id)}
                    onToggleSave={toggle}
                  />
                ))}
              </div>

              {visibleUpcoming < upcoming.length && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
                  <button
                    onClick={() => setVisibleUpcoming(v => v + PAGE_SIZE)}
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
                    Show more ({(upcoming.length - visibleUpcoming).toLocaleString()} remaining)
                  </button>
                </div>
              )}
            </section>
          )}

          {sold.length > 0 && (
            <PastResults lots={sold} showArtist savedIds={savedIds} onToggleSave={toggle} />
          )}
        </>
      )}
    </div>
  );
}
