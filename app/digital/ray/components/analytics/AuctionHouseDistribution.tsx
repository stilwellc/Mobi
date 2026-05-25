'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { MarketStats } from '../../types';
import { formatPrice, houseColors } from '../../utils';

interface Props {
  statsByArtist: Record<string, MarketStats>;
}

function formatAxis(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function HouseTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { house: string; totalValue: number; count: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 10,
      padding: '10px 14px',
      fontFamily: "'Syne', sans-serif",
    }}>
      <div style={{ fontSize: 10, color: 'var(--color-text-label)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
        {d.house}
      </div>
      <div style={{ fontSize: 13, color: houseColors[d.house] || '#96B8D4', fontWeight: 500, marginBottom: 1 }}>
        Value: {formatPrice(d.totalValue)}
      </div>
      <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
        {d.count.toLocaleString()} lots
      </div>
    </div>
  );
}

export default function AuctionHouseDistribution({ statsByArtist }: Props) {
  const houseData = useMemo(() => {
    const houseMap: Record<string, { count: number; totalValue: number }> = {};
    for (const stats of Object.values(statsByArtist)) {
      for (const hd of stats.houseDistribution || []) {
        if (!houseMap[hd.house]) houseMap[hd.house] = { count: 0, totalValue: 0 };
        houseMap[hd.house].count += hd.count;
        houseMap[hd.house].totalValue += hd.totalValue;
      }
    }
    return Object.entries(houseMap)
      .map(([house, d]) => ({
        house,
        count: d.count,
        totalValue: d.totalValue,
        fill: houseColors[house] || '#96B8D4',
      }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [statsByArtist]);

  if (houseData.length === 0) return null;

  return (
    <section className="ray-house-dist" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        .ray-house-dist { padding: 40px 56px 48px; }
        .ray-house-chart { height: 300px; }
        @media (max-width: 768px) {
          .ray-house-dist { padding: 32px 20px 32px; }
          .ray-house-chart { height: 220px; }
        }
      `}</style>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: '-0.02em',
        }}>
          Auction House <span style={{ fontStyle: 'italic', color: 'var(--color-accent-green)' }}>Distribution</span>
        </h2>
      </div>

      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 8px 0 0' }}>
          <div className="ray-house-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={houseData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="house"
                  tick={{ fontSize: 10, fill: 'var(--color-text-ghost)', fontFamily: "'Syne', sans-serif" }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  tickFormatter={formatAxis}
                  tick={{ fontSize: 10, fill: 'var(--color-text-ghost)', fontFamily: "'Syne', sans-serif" }}
                  axisLine={false}
                  tickLine={false}
                  width={55}
                />
                <Tooltip content={<HouseTooltip />} cursor={{ fill: 'var(--color-hover-item)' }} />
                <Bar dataKey="totalValue" radius={[4, 4, 0, 0]}>
                  {houseData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--color-border)' }} />

        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{
                fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--color-text-ghost)', fontWeight: 600,
                padding: '12px 20px 8px', textAlign: 'left',
              }}>
                House
              </th>
              <th style={{
                fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--color-text-ghost)', fontWeight: 600,
                padding: '12px 20px 8px', textAlign: 'right',
              }}>
                Lots
              </th>
              <th style={{
                fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--color-text-ghost)', fontWeight: 600,
                padding: '12px 20px 8px', textAlign: 'right',
              }}>
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {houseData.map((h) => (
              <tr key={h.house} style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '11px 20px', fontSize: 13 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 7, height: 7, borderRadius: '50%',
                    background: h.fill, opacity: 0.7,
                    marginRight: 10, verticalAlign: 'middle',
                  }} />
                  {h.house}
                </td>
                <td style={{ padding: '11px 20px', fontSize: 13, textAlign: 'right', color: 'var(--color-text-muted)' }}>
                  {h.count.toLocaleString()}
                </td>
                <td style={{ padding: '11px 20px', fontSize: 13, textAlign: 'right', fontWeight: 500, color: 'var(--color-accent-blue)' }}>
                  {formatPrice(h.totalValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
