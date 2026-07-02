'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ARTISTS } from '../constants';
import { useRayData } from '../hooks/useRayData';
import { useSavedLots } from '../hooks/useSavedLots';
import ArtistNav from '../components/ArtistNav';
import { formatDate, getUpcomingCounts } from '../utils';
import PortfolioHeader from '../components/analytics/PortfolioHeader';
import ArtistRankingsTable from '../components/analytics/ArtistRankingsTable';
import TopSales from '../components/analytics/TopSales';

const PortfolioPerformanceChart = dynamic(() => import('../components/analytics/PortfolioPerformanceChart'), { ssr: false });
const ArtistSparklines = dynamic(() => import('../components/analytics/ArtistSparklines'), { ssr: false });
const CategoryBreakdown = dynamic(() => import('../components/analytics/CategoryBreakdown'), { ssr: false });
const AuctionHouseDistribution = dynamic(() => import('../components/analytics/AuctionHouseDistribution'), { ssr: false });
const PriceDistribution = dynamic(() => import('../components/analytics/PriceDistribution'), { ssr: false });

export default function AnalyticsPage() {
  const { allLots, statsByArtist, sources, lastCrawl, loading } = useRayData();
  const { savedIds } = useSavedLots();

  const upcomingCounts = useMemo(() => getUpcomingCounts(allLots), [allLots]);

  const houseCount = useMemo(() =>
    sources.length || new Set(allLots.map(l => l.auctionHouse)).size,
    [sources, allLots]
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-fg)',
      fontFamily: 'var(--font-sans), sans-serif',
    }}>
      <ArtistNav activeSlug="analytics" savedCount={savedIds.length} upcomingCounts={upcomingCounts} />

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
          Market Analytics
        </span>
        <h1 style={{
          fontFamily: 'var(--font-serif), serif',
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.03em',
          lineHeight: 0.95,
          marginBottom: 16,
        }}>
          <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>Analytics</span>
        </h1>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--color-text-muted)',
          fontWeight: 400,
          maxWidth: 500,
        }}>
          Market-level intelligence across {ARTISTS.length} artists
          and {houseCount} auction houses.
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
            Updated {formatDate(lastCrawl)}
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
          <PortfolioHeader statsByArtist={statsByArtist} allLots={allLots} />
          <PortfolioPerformanceChart statsByArtist={statsByArtist} />
          <ArtistSparklines statsByArtist={statsByArtist} allLots={allLots} />
          <ArtistRankingsTable statsByArtist={statsByArtist} allLots={allLots} />
          <CategoryBreakdown allLots={allLots} />
          <AuctionHouseDistribution statsByArtist={statsByArtist} />
          <TopSales allLots={allLots} />
          <PriceDistribution allLots={allLots} />
        </>
      )}
    </div>
  );
}
