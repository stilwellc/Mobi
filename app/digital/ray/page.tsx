'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';
import { ARTISTS } from './constants';
import { useRayData } from './hooks/useRayData';
import { formatPrice } from './utils';
import ArtistNav from './components/ArtistNav';
import LotCard from './components/LotCard';
import PastResults from './components/PastResults';

export default function RayPage() {
  const { allLots, statsByArtist, sources, lastCrawl, loading } = useRayData();

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD string
    return allLots
      .filter(l => l.status === 'upcoming' && l.saleDate && l.saleDate >= today)
      .sort((a, b) => {
        if (!a.saleDate) return 1;
        if (!b.saleDate) return -1;
        return new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime();
      });
  }, [allLots]);

  const sold = useMemo(() =>
    allLots
      .filter(l => l.status === 'sold' && l.priceUsd)
      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()),
    [allLots]
  );

  const overviewStats = useMemo(() => {
    const totalLots = allLots.length;
    const totalRevenue = Object.values(statsByArtist).reduce((sum, s) => sum + (s.totalAuctionRevenue || 0), 0);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const recentSold = sold.filter(l => {
      const d = new Date(l.saleDate);
      return d.getTime() === d.getTime() && d >= oneYearAgo;
    });
    const avgPrice = recentSold.length
      ? recentSold.reduce((sum, l) => sum + (l.priceUsd || 0), 0) / recentSold.length
      : 0;
    return [
      { label: 'Artists', value: `${ARTISTS.length}`, sub: `${sources.length || 5} auction houses` },
      { label: 'Total Lots', value: totalLots.toLocaleString(), sub: 'sold, upcoming & bought-in' },
      { label: 'Revenue', value: formatPrice(totalRevenue), sub: 'aggregate hammer prices' },
      { label: 'Avg. Price (12mo)', value: formatPrice(avgPrice), sub: `${recentSold.length.toLocaleString()} recent sales` },
    ];
  }, [allLots, sold, statsByArtist, sources]);

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
        .ray-overview-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--color-border);
          border-radius: 16px;
          overflow: hidden;
        }
        .ray-overview-stats .ray-stat-card {
          background: var(--color-bg-card);
          padding: 28px 24px;
        }
        .ray-upcoming-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        @media (max-width: 768px) {
          .ray-nav { padding: 16px 20px; }
          .ray-hero { padding: 40px 20px 32px; }
          .ray-divider-wrap { padding: 0 20px; }
          .ray-overview-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .ray-overview-stats .ray-stat-card { padding: 20px 18px; }
          .ray-upcoming-grid {
            grid-template-columns: 1fr;
            gap: 14px;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-accent-blue)',
            opacity: 0.5,
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-text-label)',
            fontWeight: 600,
          }}>
            Market Intelligence
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.03em',
          lineHeight: 0.95,
          marginBottom: 16,
        }}>
          <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>Ray</span>
        </h1>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--color-text-muted)',
          fontWeight: 400,
          maxWidth: 500,
        }}>
          Tracking {ARTISTS.length} artists across{' '}
          {sources.length || 5} auction houses.
        </p>

        {lastCrawl && (
          <span style={{
            display: 'inline-block',
            marginTop: 14,
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-ghost)',
            fontWeight: 500,
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
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-label)',
                    fontWeight: 600,
                    marginBottom: 14,
                  }}>
                    {card.label}
                  </div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 34,
                    fontWeight: 300,
                    color: 'var(--color-accent-blue)',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}>
                    {card.value}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: 'var(--color-text-subtle)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
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

              <div className="ray-upcoming-grid">
                {upcoming.map(lot => (
                  <LotCard
                    key={lot.id}
                    lot={lot}
                    showArtist
                    allLots={allLots}
                    stats={statsByArtist[lot.artist]}
                  />
                ))}
              </div>
            </section>
          )}

          {sold.length > 0 && (
            <PastResults lots={sold} showArtist />
          )}
        </>
      )}
    </div>
  );
}
