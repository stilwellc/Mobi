'use client';

import { useMemo } from 'react';
import { MarketStats, AuctionLot } from '../../types';
import { formatPrice } from '../../utils';
import { ARTISTS } from '../../constants';

interface Props {
  statsByArtist: Record<string, MarketStats>;
  allLots: AuctionLot[];
}

export default function PortfolioHeader({ statsByArtist, allLots }: Props) {
  const cards = useMemo(() => {
    const stats = Object.values(statsByArtist);
    const totalRevenue = stats.reduce((sum, s) => sum + (s.totalAuctionRevenue || 0), 0);

    const weightedAppreciation = totalRevenue > 0
      ? stats.reduce((sum, s) =>
          sum + (s.appreciationRate || 0) * (s.totalAuctionRevenue || 0), 0) / totalRevenue
      : 0;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const recentSold = allLots.filter(l =>
      l.status === 'sold' && l.priceUsd && new Date(l.saleDate) >= oneYearAgo
    );
    const avgPrice12mo = recentSold.length
      ? recentSold.reduce((s, l) => s + (l.priceUsd || 0), 0) / recentSold.length
      : 0;

    const lotsWithEstimate = allLots.filter(l =>
      l.status === 'sold' && l.priceUsd && l.estimateHigh && l.estimateHigh > 0
    );
    const avgOverEstimate = lotsWithEstimate.length
      ? lotsWithEstimate.reduce((s, l) =>
          s + ((l.priceUsd! - l.estimateHigh!) / l.estimateHigh!) * 100, 0) / lotsWithEstimate.length
      : 0;

    return [
      { label: 'Total Sales Value', value: formatPrice(totalRevenue), sub: 'aggregate realized prices, all artists' },
      { label: 'Total Lots', value: allLots.length.toLocaleString(), sub: `${ARTISTS.length} artists tracked` },
      { label: 'Appreciation', value: `${weightedAppreciation >= 0 ? '+' : ''}${weightedAppreciation.toFixed(1)}%`, sub: 'sales-weighted avg across artists' },
      { label: 'Avg. % Over Estimate', value: `${avgOverEstimate >= 0 ? '+' : ''}${avgOverEstimate.toFixed(1)}%`, sub: `${lotsWithEstimate.length.toLocaleString()} lots with estimates` },
    ];
  }, [statsByArtist, allLots]);

  return (
    <section className="ray-portfolio-header" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        .ray-portfolio-header { padding: 40px 56px; }
        .ray-portfolio-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--color-border);
          border-radius: 16px;
          overflow: hidden;
        }
        .ray-portfolio-card {
          background: var(--color-bg-elevated);
          padding: 28px 24px;
        }
        @media (max-width: 768px) {
          .ray-portfolio-header { padding: 32px 20px; }
          .ray-portfolio-grid { grid-template-columns: 1fr 1fr; }
          .ray-portfolio-card { padding: 20px 18px; }
        }
      `}</style>

      <div className="ray-portfolio-grid">
        {cards.map((card) => (
          <div key={card.label} className="ray-portfolio-card">
            <div style={{
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              marginBottom: 14,
            }}>
              {card.label}
            </div>
            <div style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: 34,
              fontWeight: 300,
              color: 'var(--color-accent-gold)',
              lineHeight: 1,
              marginBottom: 8,
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: 12,
              color: 'var(--color-text-muted)',
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
