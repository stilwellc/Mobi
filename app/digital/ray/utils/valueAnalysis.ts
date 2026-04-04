import { AuctionLot, MarketStats } from '../types';

export interface ValueIndicator {
  score: number; // -1 to 1: negative = overpriced, positive = good deal
  label: string; // "Great Deal", "Fair Value", "Overpriced"
  color: string; // hex color
  estimatedFairValue: number | null; // USD
  confidenceLevel: 'low' | 'medium' | 'high';
  comparableCount: number;
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

  // Skip if category is unknown (can't make valid comparisons)
  if (lot.category === 'unknown') {
    return null;
  }

  const estimateMid = (lot.estimateLow + lot.estimateHigh) / 2;

  // Get comparable sold lots (same artist + category) from last 5 years
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

  const comparables = allLots.filter(l => {
    if (l.artist !== lot.artist || l.category !== lot.category) return false;
    if (l.status !== 'sold' || !l.priceUsd || l.priceUsd <= 0) return false;

    // Only use sales from last 5 years for relevance
    const saleDate = new Date(l.saleDate);
    if (isNaN(saleDate.getTime()) || saleDate < fiveYearsAgo) return false;

    return true;
  });

  if (comparables.length < 5) {
    // Not enough recent data for reliable analysis
    return null;
  }

  // Sort by price and filter outliers using IQR method
  const prices = comparables.map(l => l.priceUsd!).sort((a, b) => a - b);
  const q1 = prices[Math.floor(prices.length * 0.25)];
  const q3 = prices[Math.floor(prices.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  // Filter out outliers
  const filteredPrices = prices.filter(p => p >= lowerBound && p <= upperBound);

  if (filteredPrices.length < 5) {
    // After filtering outliers, not enough data
    return null;
  }

  // Calculate statistics on filtered data
  const median = filteredPrices[Math.floor(filteredPrices.length * 0.5)];
  const mean = filteredPrices.reduce((sum, p) => sum + p, 0) / filteredPrices.length;

  // Use median as fair value (more robust to remaining variance)
  const fairValue = median;

  // Calculate score based on estimate vs historical performance
  // Score ranges from -1 (very overpriced) to +1 (great deal)
  const estimateRatio = estimateMid / fairValue;

  let score: number;
  if (estimateRatio <= 0.6) {
    // Estimate is ≤ 60% of median: great deal (score 0.5 to 1.0)
    score = Math.min(1, 0.5 + (0.6 - estimateRatio) * 1.25);
  } else if (estimateRatio <= 0.85) {
    // 60-85%: good deal (score 0.2 to 0.5)
    score = 0.2 + (0.85 - estimateRatio) / 0.25 * 0.3;
  } else if (estimateRatio <= 1.15) {
    // 85-115%: fair value (score -0.2 to 0.2)
    score = (1.0 - estimateRatio) / 0.15 * 0.2;
  } else if (estimateRatio <= 1.5) {
    // 115-150%: above market (score -0.2 to -0.5)
    score = -0.2 - (estimateRatio - 1.15) / 0.35 * 0.3;
  } else {
    // > 150%: overpriced (score -0.5 to -1.0)
    score = Math.max(-1, -0.5 - (estimateRatio - 1.5) * 1.0);
  }

  // Determine label and color based on score
  let label: string;
  let color: string;
  if (score >= 0.5) {
    label = 'Great Deal';
    color = '#4ade80'; // green-400
  } else if (score >= 0.2) {
    label = 'Good Value';
    color = '#86efac'; // green-300
  } else if (score >= -0.2) {
    label = 'Fair Value';
    color = '#96B8D4'; // blue accent
  } else if (score >= -0.5) {
    label = 'Above Market';
    color = '#fbbf24'; // amber-400
  } else {
    label = 'Overpriced';
    color = '#f87171'; // red-400
  }

  // Confidence based on sample size and coefficient of variation
  const stdDev = Math.sqrt(filteredPrices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / filteredPrices.length);
  const cv = stdDev / mean; // coefficient of variation

  let confidenceLevel: 'low' | 'medium' | 'high';
  if (filteredPrices.length >= 20 && cv < 0.6) {
    confidenceLevel = 'high';
  } else if (filteredPrices.length >= 10 && cv < 1.0) {
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
    comparableCount: filteredPrices.length,
  };
}
