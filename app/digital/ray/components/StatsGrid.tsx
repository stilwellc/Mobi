'use client';

import { useMemo } from 'react';
import { MarketStats, AuctionLot } from '../types';
import type { LotCategory } from '../types';
import { formatPrice, categoryLabels, categoryColors } from '../utils';

type CategoryFilter = 'all' | LotCategory;

interface CategoryPricing {
  category: string;
  count: number;
  avgPrice: number;
  recordPrice: number;
}

interface Props {
  stats: MarketStats;
  lots?: AuctionLot[];
  categoryFilter?: CategoryFilter;
  onCategoryChange?: (cat: CategoryFilter) => void;
}

export default function StatsGrid({ stats, lots, categoryFilter = 'all', onCategoryChange }: Props) {
  // Compute per-category pricing from sold lots
  const catPricing = useMemo(() => {
    const catData: Record<string, { prices: number[]; count: number }> = {};
    if (lots) {
      for (const lot of lots) {
        const cat = lot.category || 'unknown';
        if (cat === 'unknown') continue;
        if (!catData[cat]) catData[cat] = { prices: [], count: 0 };
        catData[cat].count++;
        if (lot.priceUsd && lot.status === 'sold') catData[cat].prices.push(lot.priceUsd);
      }
    }
    return Object.entries(catData)
      .map(([cat, d]): CategoryPricing => ({
        category: cat,
        count: d.count,
        avgPrice: d.prices.length ? d.prices.reduce((s, p) => s + p, 0) / d.prices.length : 0,
        recordPrice: d.prices.length ? Math.max(...d.prices) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [lots]);

  // Recompute top-level stats when a category is selected
  const filteredStats = useMemo(() => {
    if (categoryFilter === 'all' || !lots) {
      return {
        avgPrice: stats.avgPriceLast12Months,
        recordPrice: stats.recordPrice,
        recordTitle: stats.recordTitle,
        recordYear: new Date(stats.recordDate).getFullYear(),
        lotsTracked: stats.totalLotsTracked,
      };
    }
    const filtered = lots.filter(l => l.category === categoryFilter);
    const sold = filtered.filter(l => l.status === 'sold' && l.priceUsd);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const recent = sold.filter(l => new Date(l.saleDate) >= oneYearAgo);
    const avgPrice = recent.length
      ? recent.reduce((s, l) => s + (l.priceUsd || 0), 0) / recent.length
      : 0;
    const record = sold.length ? sold.reduce((best, l) => (l.priceUsd || 0) > (best.priceUsd || 0) ? l : best) : null;
    const recordTitle = record?.title || '—';
    return {
      avgPrice,
      recordPrice: record?.priceUsd || 0,
      recordTitle: recordTitle.length > 60 ? recordTitle.substring(0, 57) + '...' : recordTitle,
      recordYear: record ? new Date(record.saleDate).getFullYear() : 0,
      lotsTracked: filtered.length,
    };
  }, [categoryFilter, lots, stats]);

  const cards = [
    {
      label: categoryFilter !== 'all' ? `Avg. Price — ${categoryLabels[categoryFilter]}` : 'Avg. Price (12mo)',
      value: formatPrice(filteredStats.avgPrice),
      sub: `across ${filteredStats.lotsTracked.toLocaleString()}+ lots tracked`,
    },
    {
      label: categoryFilter !== 'all' ? `Record — ${categoryLabels[categoryFilter]}` : 'Record Sale',
      value: formatPrice(filteredStats.recordPrice),
      sub: filteredStats.recordYear ? `${filteredStats.recordTitle}, ${filteredStats.recordYear}` : '—',
    },
    {
      label: 'Auction Houses',
      value: `${stats.houseDistribution?.length || 0}`,
      sub: stats.houseDistribution?.map(h => h.house).join(', ') || '—',
    },
  ];

  return (
    <section className="ray-stats" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        .ray-stats { padding: 40px 56px; }
        .ray-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .ray-cat-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          transition: background 0.2s;
          cursor: pointer;
        }
        .ray-cat-row:hover { background: var(--color-hover-item); }
        @media (max-width: 768px) {
          .ray-stats { padding: 32px 20px; }
          .ray-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .ray-stat-card { padding: 20px 16px !important; }
          .ray-stat-value { font-size: 28px !important; }
          .ray-cat-row {
            grid-template-columns: 1fr auto;
            gap: 8px;
            padding: 12px 16px;
          }
          .ray-cat-record { display: none; }
        }
      `}</style>
      <div className="ray-stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="ray-stat-card" style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 16,
            padding: '28px 24px',
          }}>
            <div style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-text-label)',
              fontWeight: 600,
              marginBottom: 12,
            }}>
              {card.label}
            </div>
            <div className="ray-stat-value" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36,
              fontWeight: 300,
              color: 'var(--color-accent-blue)',
              lineHeight: 1,
              marginBottom: 8,
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: 12,
              color: 'var(--color-text-subtle)',
              fontWeight: 400,
            }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {catPricing.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24,
            fontWeight: 300,
            marginBottom: 16,
          }}>
            Pricing by <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>Medium</span>
          </h3>
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {onCategoryChange && (
              <div
                className="ray-cat-row"
                onClick={() => onCategoryChange('all')}
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  background: categoryFilter === 'all' ? 'var(--color-hover-item)' : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    padding: '3px 10px',
                    borderRadius: 100,
                    background: categoryFilter === 'all' ? 'var(--color-accent-blue)' : 'transparent',
                    border: `1px solid var(--color-border)`,
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: categoryFilter === 'all' ? '#060606' : 'var(--color-text-muted)',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    All
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
                    {lots?.length || 0} lots
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-accent-blue)' }}>
                    {formatPrice(stats.avgPriceLast12Months)}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--color-text-ghost)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Avg</div>
                </div>
                <div className="ray-cat-record" style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-fg)' }}>
                    {formatPrice(stats.recordPrice)}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--color-text-ghost)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Record</div>
                </div>
              </div>
            )}
            {catPricing.map((cat, i) => {
              const color = categoryColors[cat.category] || '#888';
              const isActive = categoryFilter === cat.category;
              return (
                <div
                  key={cat.category}
                  className="ray-cat-row"
                  onClick={() => onCategoryChange?.(cat.category as CategoryFilter)}
                  style={{
                    borderBottom: i < catPricing.length - 1 ? '1px solid var(--color-border)' : 'none',
                    background: isActive ? 'var(--color-hover-item)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      padding: '3px 10px',
                      borderRadius: 100,
                      background: isActive ? color : `${color}15`,
                      border: `1px solid ${isActive ? color : `${color}30`}`,
                      fontSize: 9,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActive ? '#060606' : color,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>
                      {categoryLabels[cat.category] || cat.category}
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
                      {cat.count} lot{cat.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: 'var(--color-accent-blue)',
                    }}>
                      {cat.avgPrice > 0 ? formatPrice(cat.avgPrice) : '—'}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--color-text-ghost)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Avg
                    </div>
                  </div>
                  <div className="ray-cat-record" style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: 'var(--color-fg)',
                    }}>
                      {cat.recordPrice > 0 ? formatPrice(cat.recordPrice) : '—'}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--color-text-ghost)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Record
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
