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

  const catLabel = categoryFilter !== 'all' ? categoryLabels[categoryFilter] : '';

  const cards = [
    {
      label: catLabel ? `Avg. Price — ${catLabel}` : 'Avg. Price (12mo)',
      value: formatPrice(filteredStats.avgPrice),
      sub: `${filteredStats.lotsTracked.toLocaleString()} lots tracked`,
    },
    {
      label: catLabel ? `Record — ${catLabel}` : 'Record Sale',
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
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--color-border);
          border-radius: 16px;
          overflow: hidden;
        }
        .ray-stat-card {
          background: var(--color-bg-card);
          padding: 28px 28px;
        }
        .ray-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px;
          font-weight: 300;
          line-height: 1;
          margin-bottom: 8;
        }
        .ray-cat-table {
          border-collapse: collapse;
          width: 100%;
        }
        .ray-cat-table th {
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-text-ghost);
          font-weight: 600;
          padding: 14px 20px 10px;
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }
        .ray-cat-table th:nth-child(2),
        .ray-cat-table th:nth-child(3),
        .ray-cat-table th:nth-child(4) { text-align: right; }
        .ray-cat-table td { padding: 0; }
        .ray-cat-tr {
          cursor: pointer;
          transition: background 0.15s;
        }
        .ray-cat-tr:hover { background: var(--color-hover-item); }
        .ray-cat-td {
          padding: 14px 20px;
          font-size: 13px;
          border-bottom: 1px solid var(--color-border);
        }
        .ray-cat-tr:last-child .ray-cat-td { border-bottom: none; }
        .ray-cat-td-right { text-align: right; }
        @media (max-width: 768px) {
          .ray-stats { padding: 32px 20px; }
          .ray-stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          .ray-stat-card { padding: 20px 18px; }
          .ray-stat-value { font-size: 26px; }
          .ray-stat-card:last-child {
            grid-column: 1 / -1;
          }
          .ray-cat-record-col { display: none; }
        }
      `}</style>

      <div className="ray-stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="ray-stat-card">
            <div style={{
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-text-label)',
              fontWeight: 600,
              marginBottom: 14,
            }}>
              {card.label}
            </div>
            <div className="ray-stat-value" style={{
              color: 'var(--color-accent-blue)',
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: 11,
              color: 'var(--color-text-subtle)',
              fontWeight: 400,
              lineHeight: 1.4,
            }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {catPricing.length > 0 && (
        <div style={{ marginTop: 32 }}>
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
            <table className="ray-cat-table">
              <thead>
                <tr>
                  <th>Medium</th>
                  <th>Lots</th>
                  <th>Avg. Price</th>
                  <th className="ray-cat-record-col">Record</th>
                </tr>
              </thead>
              <tbody>
                {onCategoryChange && (
                  <tr
                    className="ray-cat-tr"
                    onClick={() => onCategoryChange('all')}
                    style={{
                      background: categoryFilter === 'all' ? 'var(--color-hover-item)' : undefined,
                    }}
                  >
                    <td className="ray-cat-td">
                      <span style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: categoryFilter === 'all' ? 'var(--color-accent-blue)' : 'var(--color-text-ghost)',
                        marginRight: 10,
                        verticalAlign: 'middle',
                        opacity: categoryFilter === 'all' ? 1 : 0.4,
                        transition: 'all 0.2s',
                      }} />
                      <span style={{
                        fontWeight: categoryFilter === 'all' ? 600 : 400,
                        color: categoryFilter === 'all' ? 'var(--color-accent-blue)' : 'var(--color-fg)',
                        transition: 'color 0.2s',
                      }}>
                        All
                      </span>
                    </td>
                    <td className="ray-cat-td ray-cat-td-right" style={{ color: 'var(--color-text-muted)' }}>
                      {lots?.length || 0}
                    </td>
                    <td className="ray-cat-td ray-cat-td-right" style={{ fontWeight: 500, color: 'var(--color-accent-blue)' }}>
                      {formatPrice(stats.avgPriceLast12Months)}
                    </td>
                    <td className="ray-cat-td ray-cat-td-right ray-cat-record-col" style={{ fontWeight: 500 }}>
                      {formatPrice(stats.recordPrice)}
                    </td>
                  </tr>
                )}
                {catPricing.map((cat) => {
                  const color = categoryColors[cat.category] || '#888';
                  const isActive = categoryFilter === cat.category;
                  return (
                    <tr
                      key={cat.category}
                      className="ray-cat-tr"
                      onClick={() => onCategoryChange?.(cat.category as CategoryFilter)}
                      style={{
                        background: isActive ? 'var(--color-hover-item)' : undefined,
                      }}
                    >
                      <td className="ray-cat-td">
                        <span style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: color,
                          marginRight: 10,
                          verticalAlign: 'middle',
                          opacity: isActive ? 1 : 0.5,
                          transition: 'opacity 0.2s',
                        }} />
                        <span style={{
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? color : 'var(--color-fg)',
                          transition: 'color 0.2s',
                        }}>
                          {categoryLabels[cat.category] || cat.category}
                        </span>
                      </td>
                      <td className="ray-cat-td ray-cat-td-right" style={{ color: 'var(--color-text-muted)' }}>
                        {cat.count}
                      </td>
                      <td className="ray-cat-td ray-cat-td-right" style={{ fontWeight: 500, color: 'var(--color-accent-blue)' }}>
                        {cat.avgPrice > 0 ? formatPrice(cat.avgPrice) : '—'}
                      </td>
                      <td className="ray-cat-td ray-cat-td-right ray-cat-record-col" style={{ fontWeight: 500 }}>
                        {cat.recordPrice > 0 ? formatPrice(cat.recordPrice) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
