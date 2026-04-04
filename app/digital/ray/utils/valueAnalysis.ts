import { AuctionLot, MarketStats } from '../types';

export interface ValueIndicator {
  score: number; // -1 to 1: negative = overpriced, positive = good deal
  label: string; // "Great Deal", "Fair Value", "Overpriced"
  color: string; // hex color
  estimatedFairValue: number | null; // USD
  confidenceLevel: 'low' | 'medium' | 'high';
}

/**
 * Analyzes a lot and determines if it's a good deal based on historical data
 */
export function analyzeLotValue(
  lot: AuctionLot,
  allLots: AuctionLot[],
  stats: MarketStats | undefined
): ValueIndicator | null {
  // Only analyze upcoming lots with estimates
  if (lot.status !== 'upcoming' || !lot.estimateLow || !lot.estimateHigh) {
    return null;
  }

  const estimateMid = (lot.estimateLow + lot.estimateHigh) / 2;

  // Get comparable sold lots (same artist + category)
  const comparables = allLots.filter(l =>
    l.artist === lot.artist &&
    l.category === lot.category &&
    l.status === 'sold' &&
    l.priceUsd &&
    l.priceUsd > 0
  );

  if (comparables.length < 3) {
    // Not enough data
    return null;
  }

  // Calculate percentile distribution of sold prices
  const prices = comparables.map(l => l.priceUsd!).sort((a, b) => a - b);
  const p25 = prices[Math.floor(prices.length * 0.25)];
  const p50 = prices[Math.floor(prices.length * 0.50)]; // median
  const p75 = prices[Math.floor(prices.length * 0.75)];
  const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  // Use median as fair value (more robust to outliers)
  const fairValue = p50;

  // Calculate score based on estimate vs historical performance
  // Score ranges from -1 (very overpriced) to +1 (great deal)
  const estimateRatio = estimateMid / fairValue;

  let score: number;
  if (estimateRatio < 0.6) {
    // Estimate is < 60% of median: great deal
    score = Math.min(1, (0.6 - estimateRatio) / 0.4); // 0.5 to 1.0
  } else if (estimateRatio < 0.85) {
    // 60-85%: good deal
    score = 0.3 + (0.85 - estimateRatio) * 0.8; // 0.3 to 0.5
  } else if (estimateRatio < 1.15) {
    // 85-115%: fair value
    score = (1.15 - estimateRatio) / 0.3 * 0.3; // -0.3 to 0.3
  } else if (estimateRatio < 1.5) {
    // 115-150%: overpriced
    score = -0.3 - (estimateRatio - 1.15) / 0.35 * 0.4; // -0.3 to -0.7
  } else {
    // > 150%: very overpriced
    score = Math.max(-1, -0.7 - (estimateRatio - 1.5) / 0.5 * 0.3); // -0.7 to -1.0
  }

  // Determine label and color
  let label: string;
  let color: string;
  if (score > 0.5) {
    label = 'Great Deal';
    color = '#4ade80'; // green-400
  } else if (score > 0.2) {
    label = 'Good Value';
    color = '#86efac'; // green-300
  } else if (score > -0.2) {
    label = 'Fair Value';
    color = '#96B8D4'; // blue accent
  } else if (score > -0.5) {
    label = 'Above Market';
    color = '#fbbf24'; // amber-400
  } else {
    label = 'Overpriced';
    color = '#f87171'; // red-400
  }

  // Confidence based on sample size and variance
  const coefficient = Math.sqrt(prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length) / avg;
  let confidenceLevel: 'low' | 'medium' | 'high';
  if (comparables.length >= 20 && coefficient < 0.5) {
    confidenceLevel = 'high';
  } else if (comparables.length >= 10 && coefficient < 1.0) {
    confidenceLevel = 'medium';
  } else {
    confidenceLevel = 'low';
  }

  return {
    score,
    label,
    color,
    estimatedFairValue: fairValue,
    confidenceLevel,
  };
}
