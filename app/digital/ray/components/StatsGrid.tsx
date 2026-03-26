'use client';

import { MarketStats } from '../types';

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default function StatsGrid({ stats }: { stats: MarketStats }) {
  const cards = [
    {
      label: 'Avg. Price (12mo)',
      value: formatPrice(stats.avgPriceLast12Months),
      sub: `across ${stats.totalLotsTracked.toLocaleString()}+ lots tracked`,
    },
    {
      label: 'Record Sale',
      value: formatPrice(stats.recordPrice),
      sub: `${stats.recordTitle}, ${new Date(stats.recordDate).getFullYear()}`,
    },
    {
      label: 'Appreciation',
      value: `${stats.appreciationRate}%`,
      sub: 'annual since 2013',
    },
    {
      label: 'Institutions',
      value: '4+',
      sub: 'MoMA, LACMA, Tate, Guggenheim',
    },
  ];

  return (
    <section style={{ padding: '40px 56px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
      }}>
        {cards.map((card) => (
          <div key={card.label} style={{
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
            <div style={{
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
    </section>
  );
}
