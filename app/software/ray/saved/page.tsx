'use client';

import React, { useMemo } from 'react';
import { useRayData } from '../hooks/useRayData';
import { useSavedLots } from '../hooks/useSavedLots';
import ArtistNav from '../components/ArtistNav';
import LotCard from '../components/LotCard';
import PastResults from '../components/PastResults';
import { getUpcomingCounts } from '../utils';

export default function SavedPage() {
  const { allLots, statsByArtist, loading } = useRayData();
  const { savedIds, toggle, isSaved } = useSavedLots();

  const savedLots = useMemo(() =>
    savedIds
      .map(id => allLots.find(l => l.id === id))
      .filter(Boolean) as typeof allLots,
    [savedIds, allLots]
  );

  const upcoming = useMemo(() =>
    savedLots
      .filter(l => l.status === 'upcoming')
      .sort((a, b) => new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime()),
    [savedLots]
  );

  const sold = useMemo(() =>
    savedLots
      .filter(l => l.status === 'sold')
      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()),
    [savedLots]
  );

  const upcomingCounts = useMemo(() => getUpcomingCounts(allLots), [allLots]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-fg)',
      fontFamily: 'var(--font-sans), sans-serif',
    }}>
      <style>{`
        .ray-saved-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .ray-saved-section { padding: 40px 56px 48px; }
        @media (max-width: 768px) {
          .ray-saved-grid { grid-template-columns: 1fr; gap: 14px; }
          .ray-saved-section { padding: 32px 20px 32px; }
        }
      `}</style>

      <ArtistNav activeSlug="saved" savedCount={savedIds.length} upcomingCounts={upcomingCounts} />

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
          Watchlist
        </span>
        <h1 style={{
          fontFamily: 'var(--font-serif), serif',
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.03em',
          lineHeight: 0.95,
          marginBottom: 16,
        }}>
          <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>Saved</span>
        </h1>
        <p style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--color-text-muted)',
          fontWeight: 400,
          maxWidth: 500,
        }}>
          {savedIds.length === 0
            ? 'No lots saved yet. Bookmark lots from the overview or artist pages.'
            : `${savedIds.length} lot${savedIds.length === 1 ? '' : 's'} saved.`
          }
        </p>
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
      ) : savedLots.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px 120px',
          color: 'var(--color-text-faint)',
        }}>
          <svg width="32" height="38" viewBox="0 0 12 14" fill="none" style={{ opacity: 0.2, marginBottom: 16 }} aria-hidden="true">
            <path
              d="M1 1.5C1 1.22386 1.22386 1 1.5 1H10.5C10.7761 1 11 1.22386 11 1.5V12.5C11 12.6894 10.8862 12.8625 10.7096 12.9472C10.533 13.0319 10.3239 13.0136 10.1646 12.8994L6 9.91421L1.83541 12.8994C1.67614 13.0136 1.46698 13.0319 1.29037 12.9472C1.11377 12.8625 1 12.6894 1 12.5V1.5Z"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          <p style={{ fontSize: 13, fontWeight: 400 }}>
            Click the bookmark icon on any lot to save it here.
          </p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="ray-saved-section" style={{ maxWidth: 1100, margin: '0 auto' }}>
              <h2 style={{
                fontFamily: 'var(--font-serif), serif',
                fontSize: 32,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                marginBottom: 24,
              }}>
                Upcoming <span style={{ fontStyle: 'italic', color: 'var(--color-accent-ocean)' }}>Lots</span>
              </h2>

              <div className="ray-saved-grid">
                {upcoming.map(lot => (
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
