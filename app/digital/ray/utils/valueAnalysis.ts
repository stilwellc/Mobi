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

  // Extract dimensions and metadata for similarity filtering
  const lotSize = extractSize(lot.dimensions);
  const lotMaterial = extractMaterial(lot.medium);
  const lotYear = extractYear(lot.year);

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

  // Score comparables by similarity (better matches get higher weight)
  const scoredComparables = comparables.map(comp => {
    let similarityScore = 1.0;

    // Size similarity (if both have dimensions)
    const compSize = extractSize(comp.dimensions);
    if (lotSize && compSize) {
      const sizeRatio = Math.min(lotSize, compSize) / Math.max(lotSize, compSize);
      // Penalize if size differs by >50%
      if (sizeRatio < 0.5) {
        similarityScore *= 0.3;
      } else if (sizeRatio < 0.75) {
        similarityScore *= 0.7;
      }
    }

    // Material/technique similarity
    const compMaterial = extractMaterial(comp.medium);
    if (lotMaterial && compMaterial && lotMaterial !== compMaterial) {
      // Different materials/techniques (e.g., lithograph vs screenprint)
      similarityScore *= 0.5;
    }

    // Year/period similarity (if both have years)
    const compYear = extractYear(comp.year);
    if (lotYear && compYear) {
      const yearDiff = Math.abs(lotYear - compYear);
      // Penalize if years differ by >10 years (different periods/styles)
      if (yearDiff > 20) {
        similarityScore *= 0.4;
      } else if (yearDiff > 10) {
        similarityScore *= 0.7;
      }
    }

    return { lot: comp, score: similarityScore, price: comp.priceUsd! };
  });

  // Filter to keep only reasonably similar lots (score > 0.4)
  const similarComparables = scoredComparables.filter(c => c.score > 0.4);

  // If the lot has no medium/dimensions, we need MANY more comparables to be reliable
  // (since we can't distinguish between different types of works)
  const minRequired = (lotMaterial || lotSize) ? 5 : 30;

  if (similarComparables.length < minRequired) {
    // Not enough similar lots for reliable analysis
    return null;
  }

  // Sort by price and filter outliers using IQR method
  const prices = similarComparables.map(c => c.price).sort((a, b) => a - b);

  // Additional filtering: if we don't have material/size data, only compare to lots
  // in a similar price range (within 1 order of magnitude of the estimate)
  let filteredByRange = prices;
  if (!lotMaterial && !lotSize) {
    const estimateOrder = Math.log10(estimateMid);
    filteredByRange = prices.filter(p => {
      const priceOrder = Math.log10(p);
      return Math.abs(priceOrder - estimateOrder) < 1; // within 1 order of magnitude
    });

    if (filteredByRange.length < minRequired) {
      // Not enough comparables in similar price range
      return null;
    }
  }
  const q1 = filteredByRange[Math.floor(filteredByRange.length * 0.25)];
  const q3 = filteredByRange[Math.floor(filteredByRange.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  // Filter out outliers
  const filteredPrices = filteredByRange.filter(p => p >= lowerBound && p <= upperBound);

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

/**
 * Extract approximate size in square inches from dimension string
 * Handles formats like: "24 × 18 in", "60 x 45 cm", etc.
 */
function extractSize(dimensions: string | null): number | null {
  if (!dimensions) return null;

  // Try to extract width × height in inches or cm
  const inchMatch = dimensions.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*in/i);
  if (inchMatch) {
    const w = parseFloat(inchMatch[1]);
    const h = parseFloat(inchMatch[2]);
    return w * h;
  }

  const cmMatch = dimensions.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*cm/i);
  if (cmMatch) {
    const w = parseFloat(cmMatch[1]) / 2.54; // convert to inches
    const h = parseFloat(cmMatch[2]) / 2.54;
    return w * h;
  }

  return null;
}

/**
 * Extract primary material/technique from medium string
 * Groups similar techniques together (e.g., all screenprints together)
 */
function extractMaterial(medium: string | null): string | null {
  if (!medium) return null;

  const m = medium.toLowerCase();

  // Print techniques
  if (/screenprint|silkscreen|serigraph/i.test(m)) return 'screenprint';
  if (/lithograph|litho/i.test(m)) return 'lithograph';
  if (/etching/i.test(m)) return 'etching';
  if (/woodcut|woodblock/i.test(m)) return 'woodcut';
  if (/linocut|linoleum/i.test(m)) return 'linocut';
  if (/monotype|monoprint/i.test(m)) return 'monotype';
  if (/offset|poster/i.test(m)) return 'offset';
  if (/gicl[eé]e|digital print|inkjet/i.test(m)) return 'giclee';

  // Photo techniques
  if (/gelatin silver|silver gelatin/i.test(m)) return 'gelatin-silver';
  if (/c-print|chromogenic/i.test(m)) return 'c-print';
  if (/pigment print/i.test(m)) return 'pigment';

  // Painting techniques
  if (/oil on|oil and/i.test(m)) return 'oil';
  if (/acrylic on|acrylic and/i.test(m)) return 'acrylic';
  if (/watercolor|watercolour/i.test(m)) return 'watercolor';
  if (/gouache/i.test(m)) return 'gouache';
  if (/spray paint|aerosol/i.test(m)) return 'spray-paint';

  // Sculpture materials
  if (/bronze/i.test(m)) return 'bronze';
  if (/ceramic|porcelain/i.test(m)) return 'ceramic';
  if (/resin/i.test(m)) return 'resin';

  return null;
}

/**
 * Extract numeric year from year string
 * Handles formats like: "1985", "circa 1985", "c. 1985", "1985-1986"
 */
function extractYear(year: string | null): number | null {
  if (!year) return null;

  // Extract first 4-digit year
  const match = year.match(/\d{4}/);
  if (match) {
    const y = parseInt(match[0]);
    // Sanity check: between 1900 and current year + 5
    if (y >= 1900 && y <= new Date().getFullYear() + 5) {
      return y;
    }
  }

  return null;
}
