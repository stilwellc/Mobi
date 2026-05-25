'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MarketStats, AuctionLot } from '../../types';
import { formatPrice } from '../../utils';
import { ARTISTS } from '../../constants';

interface Props {
  statsByArtist: Record<string, MarketStats>;
  allLots: AuctionLot[];
}

type SortKey = 'name' | 'totalRevenue' | 'avgPrice' | 'recordPrice' | 'appreciation' | 'overEstimate' | 'totalLots' | 'sellThrough';

interface ArtistRow {
  slug: string;
  label: string;
  totalRevenue: number;
  avgPrice: number;
  recordPrice: number;
  appreciation: number;
  overEstimate: number;
  totalLots: number;
  sellThrough: number;
}

export default function ArtistRankingsTable({ statsByArtist, allLots }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('totalRevenue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const rows = useMemo<ArtistRow[]>(() => {
    return ARTISTS.map(a => {
      const stats = statsByArtist[a.slug];
      const artistLots = allLots.filter(l => l.artist === a.slug);
      const concluded = artistLots.filter(l => l.status === 'sold' || l.status === 'bought_in');
      const soldCount = concluded.filter(l => l.status === 'sold').length;
      const sellThrough = concluded.length >= 5
        ? Math.round((soldCount / concluded.length) * 100)
        : -1;

      const withEstimate = artistLots.filter(l =>
        l.status === 'sold' && l.priceUsd && l.estimateHigh && l.estimateHigh > 0
      );
      const overEstimate = withEstimate.length >= 3
        ? withEstimate.reduce((s, l) =>
            s + ((l.priceUsd! - l.estimateHigh!) / l.estimateHigh!) * 100, 0) / withEstimate.length
        : -999;

      return {
        slug: a.slug,
        label: a.label,
        totalRevenue: stats?.totalAuctionRevenue || 0,
        avgPrice: stats?.avgPriceLast12Months || 0,
        recordPrice: stats?.recordPrice || 0,
        appreciation: stats?.appreciationRate || 0,
        overEstimate,
        totalLots: artistLots.length,
        sellThrough,
      };
    });
  }, [statsByArtist, allLots]);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      let cmp: number;
      if (sortKey === 'name') {
        cmp = a.label.localeCompare(b.label);
      } else {
        cmp = (a[sortKey] as number) - (b[sortKey] as number);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
  }

  const thStyle = (key: SortKey, align: 'left' | 'right' = 'right'): React.CSSProperties => ({
    fontSize: 9,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: sortKey === key ? 'var(--color-accent-green)' : 'var(--color-text-ghost)',
    fontWeight: 600,
    padding: '14px 16px 10px',
    textAlign: align,
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--color-border)',
  });

  return (
    <section className="ray-rankings" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        .ray-rankings { padding: 40px 56px 48px; }
        .ray-rankings-row {
          transition: background 0.15s;
        }
        .ray-rankings-row:hover {
          background: var(--color-hover-item);
        }
        .ray-rankings-td {
          padding: 12px 16px;
          font-size: 13px;
          border-bottom: 1px solid var(--color-border);
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .ray-rankings { padding: 32px 20px 32px; }
          .ray-rankings-hide-mobile { display: none; }
          .ray-rankings-td { padding: 10px 12px; font-size: 12px; }
        }
      `}</style>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: '-0.02em',
        }}>
          Artist <span style={{ fontStyle: 'italic', color: 'var(--color-accent-green)' }}>Rankings</span>
        </h2>
      </div>

      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        overflow: 'hidden',
        overflowX: 'auto',
      }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
          <thead>
            <tr>
              <th style={thStyle('name', 'left')} onClick={() => handleSort('name')}>
                Artist {sortKey === 'name' && (sortDir === 'asc' ? '\u25B2' : '\u25BC')}
              </th>
              <th className="ray-rankings-hide-mobile" style={thStyle('totalRevenue')} onClick={() => handleSort('totalRevenue')}>
                Revenue {sortKey === 'totalRevenue' && (sortDir === 'asc' ? '\u25B2' : '\u25BC')}
              </th>
              <th style={thStyle('avgPrice')} onClick={() => handleSort('avgPrice')}>
                Avg (12mo) {sortKey === 'avgPrice' && (sortDir === 'asc' ? '\u25B2' : '\u25BC')}
              </th>
              <th className="ray-rankings-hide-mobile" style={thStyle('recordPrice')} onClick={() => handleSort('recordPrice')}>
                Record {sortKey === 'recordPrice' && (sortDir === 'asc' ? '\u25B2' : '\u25BC')}
              </th>
              <th style={thStyle('appreciation')} onClick={() => handleSort('appreciation')}>
                Appr. {sortKey === 'appreciation' && (sortDir === 'asc' ? '\u25B2' : '\u25BC')}
              </th>
              <th style={thStyle('overEstimate')} onClick={() => handleSort('overEstimate')}>
                % Over Est. {sortKey === 'overEstimate' && (sortDir === 'asc' ? '\u25B2' : '\u25BC')}
              </th>
              <th style={thStyle('totalLots')} onClick={() => handleSort('totalLots')}>
                Lots {sortKey === 'totalLots' && (sortDir === 'asc' ? '\u25B2' : '\u25BC')}
              </th>
              <th className="ray-rankings-hide-mobile" style={thStyle('sellThrough')} onClick={() => handleSort('sellThrough')}>
                Sell-Through {sortKey === 'sellThrough' && (sortDir === 'asc' ? '\u25B2' : '\u25BC')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.slug} className="ray-rankings-row">
                <td className="ray-rankings-td" style={{ fontWeight: 500 }}>
                  <Link
                    href={`/digital/ray/${row.slug}`}
                    style={{
                      textDecoration: 'none',
                      color: 'var(--color-fg)',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-green)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg)')}
                  >
                    {row.label}
                  </Link>
                </td>
                <td className="ray-rankings-td ray-rankings-hide-mobile" style={{ textAlign: 'right', color: 'var(--color-accent-blue)' }}>
                  {formatPrice(row.totalRevenue)}
                </td>
                <td className="ray-rankings-td" style={{ textAlign: 'right', color: 'var(--color-accent-blue)' }}>
                  {row.avgPrice > 0 ? formatPrice(row.avgPrice) : '\u2014'}
                </td>
                <td className="ray-rankings-td ray-rankings-hide-mobile" style={{ textAlign: 'right' }}>
                  {row.recordPrice > 0 ? formatPrice(row.recordPrice) : '\u2014'}
                </td>
                <td className="ray-rankings-td" style={{
                  textAlign: 'right',
                  fontWeight: 500,
                  color: row.appreciation > 0
                    ? 'var(--color-accent-green)'
                    : row.appreciation < 0
                      ? 'var(--color-accent-pink)'
                      : 'var(--color-text-muted)',
                }}>
                  {row.appreciation > 0 && '\u25B2 +'}
                  {row.appreciation < 0 && '\u25BC '}
                  {row.appreciation === 0 ? '\u2014' : `${row.appreciation.toFixed(1)}%`}
                </td>
                <td className="ray-rankings-td" style={{
                  textAlign: 'right',
                  fontWeight: 500,
                  color: row.overEstimate > 0
                    ? 'var(--color-accent-green)'
                    : row.overEstimate < 0 && row.overEstimate > -999
                      ? 'var(--color-accent-pink)'
                      : 'var(--color-text-muted)',
                }}>
                  {row.overEstimate <= -999 ? '\u2014' : `${row.overEstimate >= 0 ? '+' : ''}${row.overEstimate.toFixed(1)}%`}
                </td>
                <td className="ray-rankings-td" style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>
                  {row.totalLots.toLocaleString()}
                </td>
                <td className="ray-rankings-td ray-rankings-hide-mobile" style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>
                  {row.sellThrough >= 0 ? `${row.sellThrough}%` : '\u2014'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
