'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PricePoint, AuctionLot } from '../types';
import type { LotCategory } from '../types';
import { formatPrice, categoryLabels, categoryColors } from '../utils';

type CategoryFilter = 'all' | LotCategory;

interface CategoryPricing {
  category: string;
  count: number;
  avgPrice: number;
  recordPrice: number;
}

function formatAxis(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

const tooltipColors: Record<string, string> = { avgPrice: '#96B8D4', highPrice: '#D4B896', trendline: '#A8D4A0' };
const tooltipLabels: Record<string, string> = { avgPrice: 'Avg', highPrice: 'High', trendline: 'Trend' };

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 10,
      padding: '10px 14px',
      fontFamily: "'Syne', sans-serif",
    }}>
      <div style={{ fontSize: 10, color: 'var(--color-text-label)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      {payload.filter(e => e.value != null).map((entry) => (
        <div key={entry.dataKey} style={{ fontSize: 13, color: tooltipColors[entry.dataKey] || '#96B8D4', marginBottom: 1, fontWeight: 500 }}>
          {tooltipLabels[entry.dataKey] || entry.dataKey}: {formatAxis(entry.value)}
        </div>
      ))}
    </div>
  );
}

function computePriceHistory(lots: AuctionLot[]): PricePoint[] {
  const sold = lots.filter(l => l.status === 'sold' && l.priceUsd);
  if (sold.length === 0) return [];

  const quarters: Record<string, number[]> = {};
  for (const lot of sold) {
    const d = new Date(lot.saleDate);
    if (isNaN(d.getTime())) continue;
    const q = Math.floor(d.getMonth() / 3) + 1;
    const key = `${d.getFullYear()} Q${q}`;
    if (!quarters[key]) quarters[key] = [];
    quarters[key].push(lot.priceUsd!);
  }

  return Object.entries(quarters)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, prices]) => ({
      date,
      avgPrice: prices.reduce((s, p) => s + p, 0) / prices.length,
      medianPrice: prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)],
      totalSales: prices.length,
      highPrice: Math.max(...prices),
    }));
}

interface Props {
  lots: AuctionLot[];
  allLots?: AuctionLot[];
  categoryFilter?: CategoryFilter;
  onCategoryChange?: (cat: CategoryFilter) => void;
  fallbackData?: PricePoint[];
}

export default function PriceChart({ lots, allLots, categoryFilter = 'all', onCategoryChange, fallbackData }: Props) {
  const data = useMemo(() => {
    const filtered = categoryFilter === 'all' ? lots : lots.filter(l => l.category === categoryFilter);
    const computed = computePriceHistory(filtered);
    const points = computed.length >= 2 ? computed : (categoryFilter === 'all' && fallbackData?.length ? fallbackData : computed);
    // Add 3-quarter moving average trendline
    const window = 3;
    return points.map((p, i) => {
      if (i < window - 1) return { ...p, trendline: undefined };
      const slice = points.slice(i - window + 1, i + 1);
      const avg = slice.reduce((s, q) => s + q.avgPrice, 0) / window;
      return { ...p, trendline: avg };
    });
  }, [lots, categoryFilter, fallbackData]);

  const catPricing = useMemo(() => {
    const source = allLots || lots;
    const catData: Record<string, { prices: number[]; count: number }> = {};
    for (const lot of source) {
      const cat = lot.category || 'unknown';
      if (cat === 'unknown') continue;
      if (!catData[cat]) catData[cat] = { prices: [], count: 0 };
      catData[cat].count++;
      if (lot.priceUsd && lot.status === 'sold') catData[cat].prices.push(lot.priceUsd);
    }
    return Object.entries(catData)
      .map(([cat, d]): CategoryPricing => ({
        category: cat,
        count: d.count,
        avgPrice: d.prices.length ? d.prices.reduce((s, p) => s + p, 0) / d.prices.length : 0,
        recordPrice: d.prices.length ? Math.max(...d.prices) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [allLots, lots]);

  const hasChart = data.length >= 2;
  const hasCategories = catPricing.length > 1;

  if (!hasChart && !hasCategories) return null;

  const filterLabel = categoryFilter !== 'all' ? ` — ${categoryLabels[categoryFilter]}` : '';
  const totalLots = (allLots || lots).length;

  return (
    <section className="ray-market" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        .ray-market { padding: 40px 56px 48px; }
        .ray-market-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          overflow: hidden;
        }
        .ray-chart-container { height: 300px; }
        .ray-cat-tr {
          cursor: pointer;
          transition: background 0.15s;
        }
        .ray-cat-tr:hover { background: var(--color-hover-item); }
        .ray-cat-td {
          padding: 11px 20px;
          font-size: 13px;
        }
        .ray-cat-td-right { text-align: right; }
        .ray-cat-divider {
          height: 1px;
          background: var(--color-border);
          margin: 0 20px;
        }
        @media (max-width: 768px) {
          .ray-market { padding: 32px 20px 32px; }
          .ray-chart-container { height: 200px; }
          .ray-cat-record-col { display: none; }
          .ray-cat-td { padding: 10px 16px; font-size: 12px; }
          .ray-cat-divider { margin: 0 16px; }
        }
      `}</style>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: '-0.02em',
        }}>
          Price <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>History</span>
          {filterLabel && (
            <span style={{ fontSize: 18, color: 'var(--color-text-muted)', fontStyle: 'normal', marginLeft: 8 }}>{filterLabel}</span>
          )}
        </h2>
      </div>

      <div className="ray-market-card">
        {/* Chart */}
        {hasChart && (
          <div style={{ padding: '20px 8px 0 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px 12px', }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#96B8D4', flexShrink: 0 }} />
                <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-ghost)', fontWeight: 600 }}>
                  Avg
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4B896', flexShrink: 0 }} />
                <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-ghost)', fontWeight: 600 }}>
                  High
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 2, background: '#A8D4A0', borderRadius: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-ghost)', fontWeight: 600 }}>
                  Trend
                </span>
              </div>
            </div>
            <div className="ray-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#96B8D4" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#96B8D4" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4B896" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#D4B896" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: 'var(--color-text-ghost)', fontFamily: "'Syne', sans-serif" }}
                    axisLine={{ stroke: 'var(--color-border)' }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickFormatter={formatAxis}
                    tick={{ fontSize: 10, fill: 'var(--color-text-ghost)', fontFamily: "'Syne', sans-serif" }}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="highPrice"
                    stroke="#D4B896"
                    strokeWidth={1}
                    fill="url(#goldGrad)"
                    strokeOpacity={0.35}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgPrice"
                    stroke="#96B8D4"
                    strokeWidth={2}
                    fill="url(#blueGrad)"
                    dot={false}
                    activeDot={{ r: 3, fill: '#96B8D4', stroke: 'var(--color-bg)', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="trendline"
                    stroke="#A8D4A0"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={false}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category pricing table */}
        {hasCategories && onCategoryChange && (
          <div>
            {hasChart && (
              <div style={{
                height: 1,
                background: 'var(--color-border)',
                margin: hasChart ? '16px 0 0' : '0',
              }} />
            )}
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-ghost)',
                    fontWeight: 600,
                    padding: '12px 20px 8px',
                    textAlign: 'left',
                  }}>
                    Medium
                  </th>
                  <th style={{
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-ghost)',
                    fontWeight: 600,
                    padding: '12px 20px 8px',
                    textAlign: 'right',
                  }}>
                    Lots
                  </th>
                  <th style={{
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-ghost)',
                    fontWeight: 600,
                    padding: '12px 20px 8px',
                    textAlign: 'right',
                  }}>
                    Avg
                  </th>
                  <th className="ray-cat-record-col" style={{
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-ghost)',
                    fontWeight: 600,
                    padding: '12px 20px 8px',
                    textAlign: 'right',
                  }}>
                    Record
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ padding: 0 }}>
                    <div className="ray-cat-divider" />
                  </td>
                </tr>
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
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: categoryFilter === 'all' ? 'var(--color-accent-blue)' : 'var(--color-text-ghost)',
                      marginRight: 10,
                      verticalAlign: 'middle',
                      opacity: categoryFilter === 'all' ? 1 : 0.35,
                      transition: 'all 0.2s',
                    }} />
                    <span style={{
                      fontWeight: categoryFilter === 'all' ? 600 : 400,
                      color: categoryFilter === 'all' ? 'var(--color-accent-blue)' : 'var(--color-fg)',
                      transition: 'color 0.15s',
                    }}>
                      All
                    </span>
                  </td>
                  <td className="ray-cat-td ray-cat-td-right" style={{ color: 'var(--color-text-muted)' }}>
                    {totalLots}
                  </td>
                  <td className="ray-cat-td ray-cat-td-right" style={{ fontWeight: 500, color: 'var(--color-accent-blue)' }}>
                    —
                  </td>
                  <td className="ray-cat-td ray-cat-td-right ray-cat-record-col" style={{ fontWeight: 500 }}>
                    —
                  </td>
                </tr>
                {catPricing.map((cat) => {
                  const color = categoryColors[cat.category] || '#888';
                  const isActive = categoryFilter === cat.category;
                  return (
                    <tr
                      key={cat.category}
                      className="ray-cat-tr"
                      onClick={() => onCategoryChange(cat.category as CategoryFilter)}
                      style={{
                        background: isActive ? 'var(--color-hover-item)' : undefined,
                      }}
                    >
                      <td className="ray-cat-td">
                        <span style={{
                          display: 'inline-block',
                          width: 7,
                          height: 7,
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
                          transition: 'color 0.15s',
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
        )}
      </div>
    </section>
  );
}
