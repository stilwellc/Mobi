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

export default function RayPage() {
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [lots, setLots] = useState<AuctionLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCrawl, setLastCrawl] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/data/ray/stats.json').then(r => r.json()),
      fetch('/data/ray/lots.json').then(r => r.json()),
      fetch('/data/ray/meta.json').then(r => r.json()),
    ]).then(([statsData, lotsData, metaData]) => {
      setStats(statsData);
      setLots(lotsData);
      setLastCrawl(metaData.lastCrawl);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcoming = lots.filter(l => l.status === 'upcoming');
  const sold = lots.filter(l => l.status === 'sold');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-fg)',
      fontFamily: "'Syne', sans-serif",
    }}>
      <nav style={{
        padding: '24px 56px',
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

      <section style={{ padding: '60px 56px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--color-accent-blue)',
            opacity: 0.6,
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
          fontSize: 16,
          lineHeight: 1.8,
          color: 'var(--color-text-muted)',
          fontWeight: 400,
          maxWidth: 560,
        }}>
          George Condo auction intelligence — tracking lots across Phillips, Sotheby&apos;s,
          Christie&apos;s, and Wright/Rago with daily automated data collection.
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

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 56px' }}>
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
          <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
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
