'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PricePoint, AuctionLot } from '../types';
import type { LotCategory } from '../types';
import { categoryLabels } from '../utils';

type CategoryFilter = 'all' | LotCategory;

function formatAxis(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      padding: '12px 16px',
      fontFamily: "'Syne', sans-serif",
    }}>
      <div style={{ fontSize: 11, color: 'var(--color-text-label)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ fontSize: 14, color: entry.dataKey === 'avgPrice' ? '#96B8D4' : 'var(--color-text-muted)', marginBottom: 2 }}>
          {entry.dataKey === 'avgPrice' ? 'Avg' : 'High'}: {formatAxis(entry.value)}
        </div>
      ))}
    </div>
  );
}

function computePriceHistory(lots: AuctionLot[]): PricePoint[] {
  const sold = lots.filter(l => l.status === 'sold' && l.priceUsd);
  if (sold.length === 0) return [];

  // Group by quarter
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
  categoryFilter?: CategoryFilter;
  fallbackData?: PricePoint[];
}

export default function PriceChart({ lots, categoryFilter = 'all', fallbackData }: Props) {
  const data = useMemo(() => {
    const filtered = categoryFilter === 'all' ? lots : lots.filter(l => l.category === categoryFilter);
    const computed = computePriceHistory(filtered);
    // Use computed if we have data, otherwise fall back to pre-baked stats
    return computed.length >= 2 ? computed : (categoryFilter === 'all' && fallbackData?.length ? fallbackData : computed);
  }, [lots, categoryFilter, fallbackData]);

  if (data.length < 2) return null;

  const filterLabel = categoryFilter !== 'all' ? ` — ${categoryLabels[categoryFilter]}` : '';

  return (
    <section className="ray-chart" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        .ray-chart { padding: 40px 56px 60px; }
        .ray-chart-container { height: 360px; }
        @media (max-width: 768px) {
          .ray-chart { padding: 32px 20px 40px; }
          .ray-chart-container { height: 240px; }
          .ray-chart-title { font-size: 26px !important; }
        }
      `}</style>
      <div style={{ marginBottom: 32 }}>
        <h2 className="ray-chart-title" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: '-0.02em',
          marginBottom: 8,
        }}>
          Price <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>History</span>
          {filterLabel && (
            <span style={{ fontSize: 18, color: 'var(--color-text-muted)', fontStyle: 'normal' }}>{filterLabel}</span>
          )}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#96B8D4', flexShrink: 0 }} />
            <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-label)', fontWeight: 600 }}>
              Avg Price
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4B896', flexShrink: 0 }} />
            <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-label)', fontWeight: 600 }}>
              High Price
            </span>
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 20,
        padding: '24px 8px 16px 0',
      }}>
        <div className="ray-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#96B8D4" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#96B8D4" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4B896" stopOpacity={0.15} />
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
                strokeOpacity={0.4}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="avgPrice"
                stroke="#96B8D4"
                strokeWidth={2}
                fill="url(#blueGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#96B8D4', stroke: 'var(--color-bg)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
