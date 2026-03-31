'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import ThemeToggle from '../../../components/ThemeToggle';
import { ARTISTS, ARTIST_LABEL } from '../constants';
import type { LotCategory } from '../types';
import { useRayData } from '../hooks/useRayData';
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
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const label = ARTIST_LABEL[slug];
  const valid = ARTISTS.some(a => a.slug === slug);

  const stats = statsByArtist[slug] || null;
  const lots = allLots.filter(l => l.artist === slug);
  const upcoming = lots.filter(l => l.status === 'upcoming');
  const sold = lots.filter(l => l.status === 'sold');

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
        @media (max-width: 768px) {
          .ray-nav { padding: 16px 20px; }
          .ray-hero { padding: 40px 20px 32px; }
          .ray-divider-wrap { padding: 0 20px; }
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

      <ArtistNav activeSlug={slug} />

      {!valid ? (
        <div style={{ padding: '120px 56px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 36,
            fontWeight: 300,
            marginBottom: 16,
          }}>
            Artist not found
          </h2>
          <Link href="/digital/ray" style={{
            color: 'var(--color-accent-blue)',
            fontSize: 14,
            textDecoration: 'none',
          }}>
            &#8592; Back to overview
          </Link>
        </div>
      ) : (
        <>
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
                Artist Detail
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
              <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>{label}</span>
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
              {stats && <StatsGrid stats={stats} lots={lots} categoryFilter={categoryFilter} />}
              {sold.length > 0 && <PriceChart lots={sold} allLots={lots} categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter} fallbackData={stats?.priceHistory} />}
              {upcoming.length > 0 && <UpcomingLots lots={upcoming} />}
              {sold.length > 0 && <PastResults lots={sold} categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
