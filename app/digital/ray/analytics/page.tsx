'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ThemeToggle from '../../../components/ThemeToggle';
import { ARTISTS } from '../constants';
import { useRayData } from '../hooks/useRayData';
import { useSavedLots } from '../hooks/useSavedLots';
import ArtistNav from '../components/ArtistNav';
import { getUpcomingCounts } from '../utils';
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-fg)',
      fontFamily: "'Syne', sans-serif",
    }}>

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
          <Link href="/digital/ray" style={{
            textDecoration: 'none',
            fontSize: 12,
            color: 'var(--color-text-subtle)',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            &#8592; Ray
          </Link>
        </div>
      </nav>

      <ArtistNav activeSlug="analytics" savedCount={savedIds.length} upcomingCounts={upcomingCounts} />

      <section className="ray-hero" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-accent-green)',
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
            Portfolio Analytics
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
          <span style={{ fontStyle: 'italic', color: 'var(--color-accent-green)' }}>Analytics</span>
        </h1>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--color-text-muted)',
          fontWeight: 400,
          maxWidth: 500,
        }}>
          Portfolio-level intelligence across {ARTISTS.length} artists
          and {sources.length || 5} auction houses.
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
            background: 'var(--color-accent-green)',
            opacity: 0.5,
            animation: 'pulse 2s infinite',
          }} />
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
