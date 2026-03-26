'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PricePoint } from '../types';

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

export default function PriceChart({ data }: { data: PricePoint[] }) {
  return (
    <section style={{ padding: '40px 56px 60px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: '-0.02em',
          marginBottom: 8,
        }}>
          Price <span style={{ fontStyle: 'italic', color: 'var(--color-accent-blue)' }}>History</span>
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-subtle)', fontWeight: 400 }}>
          Quarterly average sale price at auction
        </p>
      </div>

      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 20,
        padding: '24px 16px 16px 0',
      }}>
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
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
              width={60}
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
    </section>
  );
}
