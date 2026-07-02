'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../../components/ThemeToggle';
import { useRayData } from '../hooks/useRayData';
import { useSavedLots } from '../hooks/useSavedLots';
import ArtistNav from '../components/ArtistNav';
import LotCard from '../components/LotCard';
import { ARTIST_LABEL } from '../constants';
import { houseColors, formatPrice, categoryLabels, categoryColors, getUpcomingCounts } from '../utils';

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
      fontFamily: "'Syne', sans-serif",
    }}>
      <style>{`
        .ray-saved-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .ray-saved-section { padding: 40px 56px 48px; }
        .ray-saved-results { padding: 40px 56px 120px; }
        .ray-result-row {
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          align-items: center;
          gap: 20px;
          padding: 14px 24px;
          text-decoration: none;
          color: inherit;
          transition: background 0.15s;
        }
        .ray-result-row:hover { background: var(--color-hover-item); }
        @media (max-width: 768px) {
          .ray-saved-grid { grid-template-columns: 1fr; gap: 14px; }
          .ray-saved-section { padding: 32px 20px 32px; }
          .ray-saved-results { padding: 32px 20px 80px; }
          .ray-result-row {
            grid-template-columns: 1fr auto;
            gap: 8px;
            padding: 14px 16px;
          }
          .ray-result-badges { display: none; }
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
          co<span style={{ color: 'var(--color-accent-gold)' }}>.</span>stil
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

      <ArtistNav activeSlug="saved" savedCount={savedIds.length} upcomingCounts={upcomingCounts} />

      <section className="ray-hero" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-accent-gold)',
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
            Watchlist
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
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-accent-blue)',
            opacity: 0.5,
            animation: 'pulse 2s infinite',
          }} />
        </div>
      ) : savedLots.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px 120px',
          color: 'var(--color-text-ghost)',
        }}>
          <svg width="32" height="38" viewBox="0 0 12 14" fill="none" style={{ opacity: 0.2, marginBottom: 16 }}>
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
            <section className="ray-saved-results" style={{ maxWidth: 1100, margin: '0 auto' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                marginBottom: 24,
              }}>
                Past <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>Results</span>
              </h2>

              <div style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 16,
                overflow: 'hidden',
              }}>
                {sold.map((lot, i) => {
                  const color = houseColors[lot.auctionHouse] || '#96B8D4';
                  const catColor = (lot.category && lot.category !== 'unknown') ? categoryColors[lot.category] : null;
                  return (
                    <div
                      key={lot.id}
                      className="ray-result-row"
                      style={{
                        borderBottom: i < sold.length - 1 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      <a
                        href={lot.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit', minWidth: 0 }}
                      >
                        <div style={{
                          fontSize: 10,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--color-text-label)',
                          fontWeight: 600,
                          marginBottom: 2,
                        }}>
                          {ARTIST_LABEL[lot.artist] || lot.artist}
                        </div>
                        <div style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 17,
                          fontWeight: 400,
                          lineHeight: 1.3,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {lot.title}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          marginTop: 3,
                          fontSize: 11,
                          color: 'var(--color-text-ghost)',
                        }}>
                          {lot.year && <span>{lot.year}</span>}
                          {lot.year && lot.medium && <span style={{ opacity: 0.4 }}>·</span>}
                          {lot.medium && (
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                              {lot.medium}
                            </span>
                          )}
                        </div>
                      </a>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: 'var(--color-accent-blue)',
                          lineHeight: 1.3,
                        }}>
                          {lot.priceUsd ? formatPrice(lot.priceUsd) : '—'}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--color-text-ghost)', marginTop: 1 }}>
                          {new Date(lot.saleDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>

                      <div className="ray-result-badges" style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        {catColor && (
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 100,
                            background: `${catColor}12`,
                            border: `1px solid ${catColor}25`,
                            fontSize: 9,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: catColor,
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}>
                            {categoryLabels[lot.category] || lot.category}
                          </span>
                        )}
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: 100,
                          background: `${color}12`,
                          border: `1px solid ${color}25`,
                          fontSize: 9,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: color,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}>
                          {lot.auctionHouse}
                        </span>
                      </div>

                      <button
                        onClick={() => toggle(lot.id)}
                        style={{
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--color-accent-blue)',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                          padding: 0,
                          flexShrink: 0,
                          transition: 'all 0.15s',
                        }}
                        aria-label="Remove from saved"
                      >
                        <svg width="10" height="12" viewBox="0 0 12 14" fill="none">
                          <path
                            d="M1 1.5C1 1.22386 1.22386 1 1.5 1H10.5C10.7761 1 11 1.22386 11 1.5V12.5C11 12.6894 10.8862 12.8625 10.7096 12.9472C10.533 13.0319 10.3239 13.0136 10.1646 12.8994L6 9.91421L1.83541 12.8994C1.67614 13.0136 1.46698 13.0319 1.29037 12.9472C1.11377 12.8625 1 12.6894 1 12.5V1.5Z"
                            fill="#060606"
                            stroke="#060606"
                            strokeWidth="0.8"
                          />
                        </svg>
                      </button>
                    </div>
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
