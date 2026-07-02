'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ARTISTS, ARTIST_LABEL } from '../constants';
import type { LotCategory } from '../types';
import { useRayData } from '../hooks/useRayData';
import { useSavedLots } from '../hooks/useSavedLots';
import { getUpcomingCounts } from '../utils';

import ArtistNav from '../components/ArtistNav';
import StatsGrid from '../components/StatsGrid';
import UpcomingLots from '../components/UpcomingLots';
import PastResults from '../components/PastResults';

const PriceChart = dynamic(() => import('../components/PriceChart'), { ssr: false });

type CategoryFilter = 'all' | LotCategory;

export default function ArtistDetailPage() {
  const params = useParams();
  const slug = params.artist as string;
  const { statsByArtist, allLots, lastCrawl, loading } = useRayData();
  const { toggle, savedIds } = useSavedLots();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const label = ARTIST_LABEL[slug];
  const valid = ARTISTS.some(a => a.slug === slug);

  const stats = statsByArtist[slug] || null;
  const lots = allLots.filter(l => l.artist === slug);
  const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD string
  const upcoming = lots
    .filter(l => l.status === 'upcoming' && l.saleDate && l.saleDate >= today)
    .sort((a, b) => {
      if (!a.saleDate) return 1;
      if (!b.saleDate) return -1;
      return new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime();
    });
  const sold = lots.filter(l => l.status === 'sold');

  const upcomingCounts = useMemo(() => getUpcomingCounts(allLots), [allLots]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-fg)',
      fontFamily: "var(--font-sans), sans-serif",
    }}>
      <ArtistNav activeSlug={slug} savedCount={savedIds.length} upcomingCounts={upcomingCounts} />

      {!valid ? (
        <div style={{ padding: '120px 56px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: 36,
            fontWeight: 300,
            marginBottom: 16,
          }}>
            Artist not found
          </h2>
          <Link href="/software/ray" style={{
            color: 'var(--color-accent-ocean)',
            fontSize: 14,
            textDecoration: 'none',
          }}>
            &#8592; Back to overview
          </Link>
        </div>
      ) : (
        <>
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
              Artist Detail
            </span>
            <h1 style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              marginBottom: 16,
            }}>
              <span style={{ fontStyle: 'italic', color: 'var(--color-accent-ocean)' }}>{label}</span>
            </h1>
            <p style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: 'var(--color-text-muted)',
              fontWeight: 400,
              maxWidth: 500,
            }}>
              {lots.length} lots across{' '}
              {stats?.houseDistribution?.length || 0} auction houses.
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
              {stats && <StatsGrid stats={stats} lots={lots} categoryFilter={categoryFilter} />}
              {sold.length > 0 && <PriceChart lots={sold} allLots={lots} categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter} fallbackData={stats?.priceHistory} />}
              {upcoming.length > 0 && <UpcomingLots lots={upcoming} allLots={allLots} stats={stats || undefined} savedIds={savedIds} onToggleSave={toggle} />}
              {sold.length > 0 && <PastResults lots={sold} categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter} savedIds={savedIds} onToggleSave={toggle} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
