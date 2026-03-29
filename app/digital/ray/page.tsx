'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ThemeToggle from '../../components/ThemeToggle';
import StatsGrid from './components/StatsGrid';
import UpcomingLots from './components/UpcomingLots';
import PastResults from './components/PastResults';
import { AuctionLot, MarketStats } from './types';

const PriceChart = dynamic(() => import('./components/PriceChart'), { ssr: false });

const ARTISTS = [
  { slug: 'george-condo', label: 'George Condo' },
  { slug: 'futura-2000', label: 'Futura 2000' },
  { slug: 'kaws', label: 'KAWS' },
  { slug: 'george-nakashima', label: 'George Nakashima' },
  { slug: 'charles-eames', label: 'Charles & Ray Eames' },
  { slug: 'andy-warhol', label: 'Andy Warhol' },
  { slug: 'tom-sachs', label: 'Tom Sachs' },
  { slug: 'barry-mcgee', label: 'Barry McGee' },
  { slug: 'keith-haring', label: 'Keith Haring' },
  { slug: 'peter-saul', label: 'Peter Saul' },
];

export default function RayPage() {
  const [statsByArtist, setStatsByArtist] = useState<Record<string, MarketStats>>({});
  const [allLots, setAllLots] = useState<AuctionLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCrawl, setLastCrawl] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('george-condo');

  useEffect(() => {
    Promise.all([
      fetch('/data/ray/stats.json').then(r => r.json()),
      fetch('/data/ray/lots.json').then(r => r.json()),
      fetch('/data/ray/meta.json').then(r => r.json()),
    ]).then(([statsData, lotsData, metaData]) => {
      // Handle both old format (single MarketStats) and new format (keyed by artist)
      if (statsData.lastUpdated) {
        setStatsByArtist({ 'george-condo': statsData });
      } else {
        setStatsByArtist(statsData);
      }
      setAllLots(lotsData);
      setLastCrawl(metaData.lastCrawl);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = statsByArtist[selectedArtist] || null;
  const lots = allLots.filter(l => !l.artist || l.artist === selectedArtist);
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
        .ray-pills { gap: 8px; }
        .ray-pills button { padding: 8px 20px; font-size: 13px; }
        @media (max-width: 768px) {
          .ray-nav { padding: 16px 20px; }
          .ray-hero { padding: 40px 20px 32px; }
          .ray-divider-wrap { padding: 0 20px; }
          .ray-pills { gap: 6px; }
          .ray-pills button { padding: 7px 14px; font-size: 12px; }
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
          Auction intelligence — tracking lots across Phillips, Sotheby&apos;s,
          Christie&apos;s, and Wright/Rago with daily automated data collection.
        </p>

        <div className="ray-pills" style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
          {ARTISTS.map(a => (
            <button
              key={a.slug}
              onClick={() => setSelectedArtist(a.slug)}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                letterSpacing: '0.02em',
                border: '1px solid',
                borderColor: selectedArtist === a.slug ? 'var(--color-accent-blue)' : 'var(--color-border)',
                borderRadius: 24,
                background: selectedArtist === a.slug ? 'var(--color-accent-blue)' : 'transparent',
                color: selectedArtist === a.slug ? '#060606' : 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {a.label}
            </button>
          ))}
        </div>

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
          {stats && <StatsGrid stats={stats} />}
          {stats?.priceHistory?.length ? <PriceChart data={stats.priceHistory} /> : null}
          {upcoming.length > 0 && <UpcomingLots lots={upcoming} />}
          {sold.length > 0 && <PastResults lots={sold} />}
        </>
      )}
    </div>
  );
}
