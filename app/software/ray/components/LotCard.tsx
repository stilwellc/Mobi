'use client';

import { useState, useMemo } from 'react';
import { AuctionLot, MarketStats } from '../types';
import { ARTIST_LABEL } from '../constants';
import { houseColors, categoryLabels, categoryColors, formatDate, makeAuctionIcs } from '../utils';
import ComparableModal from './ComparableModal';

function formatEstimate(lot: AuctionLot): string {
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
  };
  if (lot.estimateLow && lot.estimateHigh) {
    return `${fmt(lot.estimateLow)} — ${fmt(lot.estimateHigh)} ${lot.currency}`;
  }
  return 'Estimate on request';
}

/** Compute a quick buy signal: median comp price vs estimate midpoint */
function computeBuySignal(lot: AuctionLot, allLots: AuctionLot[]): { label: string; color: string; pct: number } | null {
  if (!lot.estimateLow || !lot.estimateHigh) return null;
  const estMid = (lot.estimateLow + lot.estimateHigh) / 2;
  // Get same-artist sold lots in same category
  const comps = allLots.filter(l =>
    l.artist === lot.artist &&
    l.status === 'sold' &&
    l.priceUsd &&
    l.id !== lot.id &&
    (lot.category === 'unknown' || l.category === 'unknown' || l.category === lot.category)
  );
  if (comps.length < 3) return null;
  const prices = comps.map(l => l.priceUsd!).sort((a, b) => a - b);
  const median = prices.length % 2 === 0
    ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
    : prices[Math.floor(prices.length / 2)];
  const ratio = median / estMid;
  // Only show signal when there's a meaningful gap
  if (ratio >= 1.2) return { label: 'Below Market', color: 'var(--color-accent-gold)', pct: Math.round((ratio - 1) * 100) };
  if (ratio <= 0.75) return { label: 'Above Market', color: 'var(--color-accent-coral)', pct: Math.round((1 - ratio) * 100) };
  return null;
}

export default function LotCard({
  lot,
  showArtist = false,
  allLots = [],
  stats,
  saved = false,
  onToggleSave,
}: {
  lot: AuctionLot;
  showArtist?: boolean;
  allLots?: AuctionLot[];
  stats?: MarketStats;
  saved?: boolean;
  onToggleSave?: (lotId: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const color = houseColors[lot.auctionHouse] || 'var(--color-accent-ocean)';

  function handleAddToCalendar(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const ics = makeAuctionIcs(lot);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    // window.open preserves the user-gesture context on iOS Safari so the
    // system intercepts the .ics MIME type and offers to add it to Calendar.
    const opened = window.open(url, '_blank');
    if (!opened) {
      // Popup blocked (desktop) — fall back to hidden anchor
      const a = document.createElement('a');
      a.href = url;
      a.download = `auction-${lot.id}.ics`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const catColor = categoryColors[lot.category] || 'var(--color-text-faint)';
  const catLabel = categoryLabels[lot.category] || null;
  const isUpcoming = lot.status === 'upcoming';

  const buySignal = useMemo(() => {
    if (!isUpcoming || !allLots.length) return null;
    return computeBuySignal(lot, allLots);
  }, [lot, allLots, isUpcoming]);

  const cardContent = (
    <div className="ray-lot-card" style={{
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden',
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-border)',
      transition: 'border-color var(--duration-fast) var(--ease-signature)',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        .ray-lot-card:hover { border-color: var(--color-accent-ocean) !important; }
        .ray-lot-img { height: 200px; }
        .ray-remind-btn:hover { opacity: 0.85; }
        .ray-save-btn { transition: background var(--duration-fast) var(--ease-signature); }
        .ray-save-btn:hover { opacity: 0.85; }
        @media (max-width: 768px) {
          .ray-lot-img { height: 170px; }
        }
      `}</style>
      {/* Stretched primary action — keeps save/remind as sibling controls, not descendants */}
      {isUpcoming ? (
        <button
          onClick={() => setModalOpen(true)}
          aria-label={`View comparable sales for ${lot.title}`}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            borderRadius: 16,
          }}
        />
      ) : (
        <a
          href={lot.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${lot.title} at ${lot.auctionHouse}`}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            borderRadius: 16,
          }}
        />
      )}
      <div className="ray-lot-img" style={{
        position: 'relative',
        width: '100%',
        background: `linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {lot.imageUrl ? (
          <img
            src={lot.imageUrl}
            alt={lot.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: 42,
            fontWeight: 300,
            color: 'var(--color-text-faint)',
            opacity: 0.3,
            fontStyle: 'italic',
          }}>
            {lot.title.charAt(0)}
          </div>
        )}
        {isUpcoming && (
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            padding: '3px 10px',
            borderRadius: 100,
            background: 'var(--color-accent-ocean)',
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#060606',
            fontWeight: 600,
          }}>
            Live
          </div>
        )}
        {buySignal && (
          <div style={{
            position: 'absolute',
            top: 10,
            right: onToggleSave ? 46 : 10,
            padding: '3px 9px',
            borderRadius: 100,
            background: buySignal.color,
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#060606',
            fontWeight: 600,
          }}>
            {buySignal.label}
          </div>
        )}
        {onToggleSave && (
          <button
            className="ray-save-btn"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(lot.id); }}
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: saved ? 'var(--color-accent-ocean)' : 'rgba(0,0,0,0.45)',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              padding: 0,
              zIndex: 2,
            }}
            aria-label={saved ? 'Remove from saved' : 'Save lot'}
          >
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <path
                d="M1 1.5C1 1.22386 1.22386 1 1.5 1H10.5C10.7761 1 11 1.22386 11 1.5V12.5C11 12.6894 10.8862 12.8625 10.7096 12.9472C10.533 13.0319 10.3239 13.0136 10.1646 12.8994L6 9.91421L1.83541 12.8994C1.67614 13.0136 1.46698 13.0319 1.29037 12.9472C1.11377 12.8625 1 12.6894 1 12.5V1.5Z"
                fill={saved ? '#060606' : '#F0EDE8'}
                stroke={saved ? '#060606' : '#F0EDE8'}
                strokeWidth="0.8"
              />
            </svg>
          </button>
        )}
      </div>

      <div style={{ padding: '14px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: color,
            fontWeight: 600,
          }}>
            {lot.auctionHouse}
          </span>
          {catLabel && lot.category !== 'unknown' && (
            <>
              <span style={{ color: 'var(--color-text-faint)', fontSize: 12 }}>&middot;</span>
              <span style={{
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: catColor,
                fontWeight: 600,
              }}>
                {catLabel}
              </span>
            </>
          )}
        </div>

        {showArtist && lot.artist && (
          <div style={{
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
            marginBottom: 4,
          }}>
            {ARTIST_LABEL[lot.artist] || lot.artist}
          </div>
        )}
        <h3 style={{
          fontFamily: "var(--font-serif), serif",
          fontSize: 19,
          fontWeight: 400,
          marginBottom: 4,
          lineHeight: 1.25,
          flex: 1,
        }}>
          {lot.title}
        </h3>
        {lot.year && (
          <div style={{ fontSize: 12, color: 'var(--color-text-faint)', marginBottom: 10 }}>
            {lot.year}{lot.medium ? ` · ${lot.medium}` : ''}
          </div>
        )}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 8,
          marginTop: 'auto',
        }}>
          <span style={{
            fontSize: 14,
            color: 'var(--color-accent-ocean)',
            fontWeight: 500,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {formatEstimate(lot)}
          </span>
          <span style={{
            fontSize: 12,
            color: 'var(--color-text-faint)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>
            {formatDate(lot.saleDate)}
          </span>
        </div>

        {isUpcoming && (
          <button
            onClick={handleAddToCalendar}
            className="ray-remind-btn"
            aria-label={`Add ${lot.title} auction to calendar`}
            style={{
              marginTop: 10,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 0',
              borderRadius: 8,
              border: 'none',
              background: 'var(--color-accent-ocean)',
              color: '#060606',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'opacity var(--duration-fast) var(--ease-signature)',
              fontFamily: "var(--font-sans), sans-serif",
              position: 'relative',
              zIndex: 2,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.25" fill="none"/>
              <line x1="4" y1="1" x2="4" y2="4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              <line x1="1" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1.25"/>
            </svg>
            Remind Me
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {cardContent}
      {modalOpen && (
        <ComparableModal
          lot={lot}
          allLots={allLots}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
