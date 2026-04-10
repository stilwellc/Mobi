'use client';

import { useEffect, useMemo } from 'react';
import { AuctionLot } from '../types';
import { ARTIST_LABEL } from '../constants';
import { houseColors, categoryLabels, categoryColors, formatPrice } from '../utils';

function formatEstimate(lot: AuctionLot): string {
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
  };
  if (lot.estimateLow && lot.estimateHigh) {
    return `${fmt(lot.estimateLow)} — ${fmt(lot.estimateHigh)} ${lot.currency}`;
  }
  return 'Estimate on request';
}

/** Convert fraction characters (½, ¼, etc.) and mixed numbers to decimals */
function parseFrac(s: string): number {
  const fracs: Record<string, number> = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 0.333, '⅔': 0.667, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875 };
  let val = 0;
  // Match leading integer
  const intMatch = s.match(/^(\d+)/);
  if (intMatch) val += parseFloat(intMatch[1]);
  // Match trailing fraction character
  for (const [ch, n] of Object.entries(fracs)) {
    if (s.includes(ch)) { val += n; break; }
  }
  // If no fraction char, try decimal
  if (val === 0) val = parseFloat(s) || 0;
  return val;
}

/** Parse a dimension string into [height, width] or null.
 *  Handles: "24 x 18 in", "25¼ h × 20¾ w in", "63 × 52 cm", etc. */
function parseDims(dims: string | null): [number, number] | null {
  if (!dims) return null;
  // Prefer inches; fall back to cm
  const useIn = dims.toLowerCase().includes('in');
  // Extract numeric tokens separated by × or x
  const tokens = dims.split(/[x×]/i).map(t => t.trim());
  if (tokens.length < 2) return null;
  const h = parseFrac(tokens[0]);
  const w = parseFrac(tokens[1]);
  if (!h || !w) return null;
  // Normalize cm to inches for consistent comparison
  if (!useIn && dims.toLowerCase().includes('cm')) {
    return [h / 2.54, w / 2.54];
  }
  return [h, w];
}

function parseArea(dims: string | null): number | null {
  const hw = parseDims(dims);
  return hw ? hw[0] * hw[1] : null;
}

/** Parse a year string like "2000" or "circa 2000" into a number */
function parseYear(y: string | null): number | null {
  if (!y) return null;
  const m = y.match(/(\d{4})/);
  return m ? parseInt(m[1]) : null;
}

/** Simple word overlap score between two medium strings (0-1) */
function mediumSimilarity(a: string | null, b: string | null): number {
  if (!a || !b) return 0;
  const wordsA = new Set(a.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let overlap = 0;
  Array.from(wordsA).forEach(w => { if (wordsB.has(w)) overlap++; });
  return overlap / Math.max(wordsA.size, wordsB.size);
}

function scoreComparable(upcoming: AuctionLot, sold: AuctionLot): number {
  let score = 0;

  // Category match (weight: 30) — must be same type of work
  if (upcoming.category !== 'unknown' && sold.category !== 'unknown') {
    if (upcoming.category === sold.category) score += 30;
  }

  // Dimensions similarity (weight: 35) — most important comparable factor
  // When both have dimensions, this dominates. A small drawing is not
  // comparable to a large canvas regardless of other factors.
  const areaA = parseArea(upcoming.dimensions);
  const areaB = parseArea(sold.dimensions);
  if (areaA && areaB) {
    const ratio = Math.min(areaA, areaB) / Math.max(areaA, areaB);
    score += ratio * 35;
  }

  // Estimate proximity (weight: 20) — good proxy for size/importance
  // when dimensions are missing
  const estMid = upcoming.estimateLow && upcoming.estimateHigh
    ? (upcoming.estimateLow + upcoming.estimateHigh) / 2
    : null;
  if (estMid && sold.priceUsd) {
    const ratio = Math.min(estMid, sold.priceUsd) / Math.max(estMid, sold.priceUsd);
    score += ratio * 20;
  }

  // Medium similarity (weight: 10)
  score += mediumSimilarity(upcoming.medium, sold.medium) * 10;

  // Year proximity (weight: 5)
  const yearA = parseYear(upcoming.year);
  const yearB = parseYear(sold.year);
  if (yearA && yearB) {
    const diff = Math.abs(yearA - yearB);
    score += Math.max(0, 1 - diff / 30) * 5; // 30-year window
  }

  return score;
}

const MAX_COMPARABLES = 15;

export default function ComparableModal({
  lot,
  allLots,
  onClose,
}: {
  lot: AuctionLot;
  allLots: AuctionLot[];
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const comparables = useMemo(() => {
    const sold = allLots.filter(l =>
      l.artist === lot.artist &&
      l.status === 'sold' &&
      l.priceUsd &&
      l.id !== lot.id
    );

    const scored = sold.map(s => ({
      lot: s,
      score: scoreComparable(lot, s),
    }));

    // Sort by score desc, then by most recent sale date as tiebreaker
    scored.sort((a, b) => {
      if (Math.abs(a.score - b.score) > 0.01) return b.score - a.score;
      return new Date(b.lot.saleDate).getTime() - new Date(a.lot.saleDate).getTime();
    });

    return scored.slice(0, MAX_COMPARABLES);
  }, [lot, allLots]);

  const houseColor = houseColors[lot.auctionHouse] || '#96B8D4';
  const catLabel = categoryLabels[lot.category] || null;
  const catColor = categoryColors[lot.category] || '#888';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 680,
          maxHeight: 'calc(100vh - 40px)',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <style>{`
          .comp-modal-row:hover { background: var(--color-bg-card) !important; }
          .comp-modal-close:hover { color: var(--color-fg) !important; }
          @media (max-width: 768px) {
            .comp-modal-header { flex-direction: column !important; }
            .comp-modal-img { width: 100% !important; height: 200px !important; }
          }
        `}</style>

        {/* Close button */}
        <button
          className="comp-modal-close"
          onClick={onClose}
          style={{
            position: 'sticky',
            top: 16,
            float: 'right',
            marginRight: 16,
            marginTop: 16,
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 100,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-ghost)',
            fontSize: 16,
            zIndex: 2,
            transition: 'color 0.15s',
          }}
        >
          &times;
        </button>

        {/* Header: image + lot info */}
        <div className="comp-modal-header" style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div className="comp-modal-img" style={{
            width: 220,
            minHeight: 200,
            flexShrink: 0,
            background: `linear-gradient(135deg, var(--color-bg-card) 0%, var(--color-bg) 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '20px 0 0 0',
          }}>
            {lot.imageUrl ? (
              <img
                src={lot.imageUrl}
                alt={lot.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 56,
                fontWeight: 300,
                color: 'var(--color-text-ghost)',
                opacity: 0.3,
                fontStyle: 'italic',
              }}>
                {lot.title.charAt(0)}
              </div>
            )}
          </div>

          <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{
                fontSize: 9,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: houseColor,
                fontWeight: 600,
              }}>
                {lot.auctionHouse}
              </span>
              {catLabel && lot.category !== 'unknown' && (
                <>
                  <span style={{ color: 'var(--color-text-ghost)', fontSize: 9 }}>&middot;</span>
                  <span style={{
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: catColor,
                    fontWeight: 600,
                  }}>
                    {catLabel}
                  </span>
                </>
              )}
            </div>

            <div style={{
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-label)',
              fontWeight: 600,
              marginBottom: 4,
            }}>
              {ARTIST_LABEL[lot.artist] || lot.artist}
            </div>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              fontWeight: 400,
              lineHeight: 1.25,
              marginBottom: 4,
            }}>
              {lot.title}
            </h2>

            {lot.year && (
              <div style={{ fontSize: 11, color: 'var(--color-text-ghost)', marginBottom: 12 }}>
                {lot.year}{lot.medium ? ` · ${lot.medium}` : ''}
              </div>
            )}

            <div style={{ fontSize: 16, color: 'var(--color-accent-blue)', fontWeight: 500, marginBottom: 4 }}>
              {formatEstimate(lot)}
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-ghost)' }}>
              {new Date(lot.saleDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {lot.saleName ? ` · ${lot.saleName}` : ''}
            </div>

            <a
              href={lot.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 16,
                padding: '8px 20px',
                borderRadius: 100,
                background: 'var(--color-accent-blue)',
                color: '#060606',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
            >
              View Lot &#8599;
            </a>
          </div>
        </div>

        {/* Comparables */}
        <div style={{ padding: '20px 24px 28px' }}>
          <div style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-label)',
            fontWeight: 600,
            marginBottom: 14,
          }}>
            Comparable Sales ({comparables.length})
          </div>

          {comparables.length === 0 ? (
            <div style={{
              padding: '40px 0',
              textAlign: 'center',
              color: 'var(--color-text-ghost)',
              fontSize: 13,
            }}>
              No comparable sold lots found for this artist.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {comparables.map(({ lot: comp, score }, i) => {
                const compHouseColor = houseColors[comp.auctionHouse] || '#96B8D4';
                const estMid = lot.estimateLow && lot.estimateHigh
                  ? (lot.estimateLow + lot.estimateHigh) / 2
                  : null;
                const ratio = estMid && comp.priceUsd
                  ? comp.priceUsd / estMid
                  : null;

                return (
                  <a
                    key={comp.id}
                    href={comp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="comp-modal-row"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 14px',
                      borderRadius: 12,
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Rank */}
                    <span style={{
                      fontSize: 10,
                      color: 'var(--color-text-ghost)',
                      fontWeight: 500,
                      width: 18,
                      textAlign: 'right',
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>

                    {/* Thumbnail */}
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'var(--color-bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {comp.imageUrl ? (
                        <img src={comp.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 18,
                          color: 'var(--color-text-ghost)',
                          opacity: 0.3,
                          fontStyle: 'italic',
                        }}>
                          {comp.title.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13,
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: 2,
                      }}>
                        {comp.title}
                      </div>
                      <div style={{
                        fontSize: 10,
                        color: 'var(--color-text-ghost)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        alignItems: 'center',
                      }}>
                        <span style={{ color: compHouseColor, fontWeight: 600 }}>{comp.auctionHouse}</span>
                        <span>&middot;</span>
                        <span>{new Date(comp.saleDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        {comp.medium && (
                          <>
                            <span>&middot;</span>
                            <span style={{
                              maxWidth: 150,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>{comp.medium}</span>
                          </>
                        )}
                        {comp.dimensions && (
                          <>
                            <span>&middot;</span>
                            <span>{comp.dimensions}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price + ratio */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--color-fg)',
                      }}>
                        {formatPrice(comp.priceUsd!)}
                      </div>
                      {ratio !== null && (
                        <div style={{
                          fontSize: 10,
                          color: ratio >= 1 ? '#8BC48A' : '#D49696',
                          fontWeight: 500,
                        }}>
                          {ratio >= 1 ? '+' : ''}{((ratio - 1) * 100).toFixed(0)}% est.
                        </div>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
