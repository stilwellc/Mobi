'use client';

import { useState, useMemo, useEffect } from 'react';
import { AuctionLot } from '../types';
import type { LotCategory } from '../types';
import { ARTIST_LABEL } from '../constants';
import { houseColors, formatPrice, categoryLabels, categoryColors } from '../utils';

type SortMode = 'date' | 'price';
type CategoryFilter = 'all' | LotCategory;

interface Props {
  lots: AuctionLot[];
  showArtist?: boolean;
  categoryFilter?: CategoryFilter;
  onCategoryChange?: (cat: CategoryFilter) => void;
}

export default function PastResults({ lots, showArtist = false, categoryFilter: externalFilter, onCategoryChange }: Props) {
  const [visible, setVisible] = useState(20);
  const [sortBy, setSortBy] = useState<SortMode>('date');
  const [internalFilter, setInternalFilter] = useState<CategoryFilter>('all');

  const categoryFilter = externalFilter ?? internalFilter;
  const setCategoryFilter = (cat: CategoryFilter) => {
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      setInternalFilter(cat);
    }
    setVisible(20);
  };

  useEffect(() => {
    if (externalFilter !== undefined) setVisible(20);
  }, [externalFilter]);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const lot of lots) {
      if (lot.category && lot.category !== 'unknown') cats.add(lot.category);
    }
    return Array.from(cats).sort();
  }, [lots]);

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return lots;
    return lots.filter(l => l.category === categoryFilter);
  }, [lots, categoryFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sortBy === 'price') {
      copy.sort((a, b) => (b.priceUsd || 0) - (a.priceUsd || 0));
    } else {
      copy.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
    }
    return copy;
  }, [filtered, sortBy]);

  const shown = sorted.slice(0, visible);

  return (
    <section className="ray-results" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        .ray-results { padding: 40px 56px 120px; }
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
        .ray-sort-pill {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ray-sort-pill:hover {
          border-color: var(--color-accent-blue);
          color: var(--color-accent-blue);
        }
        .ray-sort-pill[data-active="true"] {
          background: var(--color-accent-blue);
          border-color: var(--color-accent-blue);
          color: #060606;
        }
        @media (max-width: 768px) {
          .ray-results { padding: 32px 20px 80px; }
          .ray-result-row {
            grid-template-columns: 1fr auto;
            gap: 8px;
            padding: 14px 16px;
          }
          .ray-result-badges { display: none; }
        }
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
              fontWeight: 300,
              letterSpacing: '-0.02em',
            }}>
              Recent <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>Results</span>
            </h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', fontWeight: 400, marginTop: 6 }}>
              {filtered.length.toLocaleString()} sold lots
              {categoryFilter !== 'all' && ` · ${categoryLabels[categoryFilter]}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="ray-sort-pill"
              data-active={sortBy === 'date' ? 'true' : 'false'}
              onClick={() => { setSortBy('date'); setVisible(20); }}
            >
              Date
            </button>
            <button
              className="ray-sort-pill"
              data-active={sortBy === 'price' ? 'true' : 'false'}
              onClick={() => { setSortBy('price'); setVisible(20); }}
            >
              Price
            </button>
          </div>
        </div>

        {availableCategories.length > 1 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            <button
              className="ray-sort-pill"
              data-active={categoryFilter === 'all' ? 'true' : 'false'}
              onClick={() => setCategoryFilter('all')}
            >
              All
            </button>
            {availableCategories.map(cat => (
              <button
                key={cat}
                className="ray-sort-pill"
                data-active={categoryFilter === cat ? 'true' : 'false'}
                onClick={() => setCategoryFilter(cat as CategoryFilter)}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        {shown.map((lot, i) => {
          const color = houseColors[lot.auctionHouse] || '#96B8D4';
          const catColor = (lot.category && lot.category !== 'unknown') ? categoryColors[lot.category] : null;
          return (
            <a
              key={lot.id}
              href={lot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ray-result-row"
              style={{
                borderBottom: i < shown.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div style={{ minWidth: 0 }}>
                {showArtist && lot.artist && (
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
                )}
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
              </div>

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
            </a>
          );
        })}
      </div>

      {visible < sorted.length && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <button
            onClick={() => setVisible((v) => v + 20)}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 100,
              padding: '10px 32px',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-subtle)',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Syne', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            Show More
          </button>
        </div>
      )}
    </section>
  );
}
