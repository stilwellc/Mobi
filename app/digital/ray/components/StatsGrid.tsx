'use client';

import { MarketStats, AuctionLot } from '../types';
import { formatPrice, categoryLabels, categoryColors } from '../utils';

export default function StatsGrid({ stats, lots }: { stats: MarketStats; lots?: AuctionLot[] }) {
  // Compute category breakdown from lots
  const catCounts: Record<string, number> = {};
  if (lots) {
    for (const lot of lots) {
      const cat = lot.category || 'unknown';
      if (cat !== 'unknown') catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
  }
  const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const classifiedCount = topCats.reduce((sum, [, n]) => sum + n, 0);
  const catSub = topCats.length > 0
    ? topCats.map(([cat, n]) => `${categoryLabels[cat]} ${n}`).join(', ')
    : '—';

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
    ...(topCats.length > 0 ? [{
      label: 'Medium Breakdown',
      value: `${classifiedCount}`,
      sub: catSub,
    }] : []),
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
        @media (max-width: 768px) {
          .ray-stats { padding: 32px 20px; }
          .ray-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .ray-stat-card { padding: 20px 16px !important; }
          .ray-stat-value { font-size: 28px !important; }
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
    </section>
  );
}
