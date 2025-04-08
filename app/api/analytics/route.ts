import { NextResponse } from 'next/server';
import { getAccessToken } from '../artsy/route';

interface MarketMetrics {
  priceAppreciation: number;
  liquidityScore: number;
  institutionalSupport: number;
  socialMomentum: number;
  riskScore: number;
  investmentPotential: number;
}

interface HistoricalData {
  date: string;
  price: number;
  volume: number;
  auctionHouses: string[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('artistId');
    const timeframe = searchParams.get('timeframe') || '1y';

    if (!artistId) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
    }

    const token = await getAccessToken();
    if (!token) {
      throw new Error('Failed to get access token');
    }

    // Fetch comprehensive artist data
    const [artistData, auctionData, galleryData, socialData] = await Promise.all([
      fetchArtistData(artistId, token),
      fetchAuctionData(artistId, token, timeframe),
      fetchGalleryData(artistId, token),
      fetchSocialData(artistId, token)
    ]);

    // Calculate advanced metrics
    const metrics = calculateMetrics(artistData, auctionData, galleryData, socialData);

    // Generate investment insights
    const insights = generateInsights(metrics, auctionData.historical);

    return NextResponse.json({
      metrics,
      insights,
      historicalData: auctionData.historical,
      galleryRepresentation: galleryData,
      socialMetrics: socialData
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

async function fetchArtistData(artistId: string, token: string) {
  const response = await fetch(
    `https://api.artsy.net/api/artists/${artistId}`,
    { headers: { 'X-XAPP-Token': token } }
  );
  return response.json();
}

async function fetchAuctionData(artistId: string, token: string, timeframe: string) {
  // Fetch auction results from multiple sources
  const [artsyAuctions, sothebysAuctions, christiesAuctions] = await Promise.all([
    fetchArtsyAuctions(artistId, token, timeframe),
    fetchSothebysAuctions(artistId, timeframe),
    fetchChristiesAuctions(artistId, timeframe)
  ]);

  // Combine and process auction data
  const historical: HistoricalData[] = processAuctionData([
    ...artsyAuctions,
    ...sothebysAuctions,
    ...christiesAuctions
  ]);

  return { historical };
}

async function fetchGalleryData(artistId: string, token: string) {
  const response = await fetch(
    `https://api.artsy.net/api/artists/${artistId}/shows`,
    { headers: { 'X-XAPP-Token': token } }
  );
  const data = await response.json();
  return {
    currentGalleries: data._embedded.shows
      .filter((show: any) => new Date(show.end_at) > new Date())
      .map((show: any) => show.partner.name),
    exhibitionHistory: data._embedded.shows.length
  };
}

async function fetchSocialData(artistId: string, token: string) {
  const [followers, mentions, engagement] = await Promise.all([
    fetchFollowers(artistId, token),
    fetchMentions(artistId),
    fetchEngagement(artistId)
  ]);

  return {
    followers,
    mentions,
    engagement
  };
}

function calculateMetrics(
  artistData: any,
  auctionData: any,
  galleryData: any,
  socialData: any
): MarketMetrics {
  const historical = auctionData.historical;
  const priceAppreciation = calculatePriceAppreciation(historical);
  const liquidityScore = calculateLiquidityScore(historical);
  const institutionalSupport = calculateInstitutionalSupport(galleryData);
  const socialMomentum = calculateSocialMomentum(socialData);
  const riskScore = calculateRiskScore(priceAppreciation, liquidityScore);
  
  return {
    priceAppreciation,
    liquidityScore,
    institutionalSupport,
    socialMomentum,
    riskScore,
    investmentPotential: calculateInvestmentPotential(
      priceAppreciation,
      liquidityScore,
      institutionalSupport,
      socialMomentum,
      riskScore
    )
  };
}

function calculatePriceAppreciation(historical: HistoricalData[]): number {
  if (historical.length < 2) return 0;
  const oldest = historical[historical.length - 1];
  const newest = historical[0];
  return ((newest.price - oldest.price) / oldest.price) * 100;
}

function calculateLiquidityScore(historical: HistoricalData[]): number {
  const totalVolume = historical.reduce((sum, data) => sum + data.volume, 0);
  const uniqueAuctionHouses = new Set(
    historical.flatMap(data => data.auctionHouses)
  ).size;
  return (totalVolume * uniqueAuctionHouses) / 1000;
}

function calculateInstitutionalSupport(galleryData: any): number {
  const galleryScore = galleryData.currentGalleries.length * 20;
  const exhibitionScore = galleryData.exhibitionHistory * 5;
  return galleryScore + exhibitionScore;
}

function calculateSocialMomentum(socialData: any): number {
  const followerScore = Math.log10(socialData.followers + 1) * 20;
  const mentionScore = Math.log10(socialData.mentions + 1) * 15;
  const engagementScore = socialData.engagement * 10;
  return followerScore + mentionScore + engagementScore;
}

function calculateRiskScore(
  priceAppreciation: number,
  liquidityScore: number
): number {
  const volatility = Math.abs(priceAppreciation) / 10;
  const liquidityRisk = 100 - (liquidityScore / 10);
  return (volatility + liquidityRisk) / 2;
}

function calculateInvestmentPotential(
  priceAppreciation: number,
  liquidityScore: number,
  institutionalSupport: number,
  socialMomentum: number,
  riskScore: number
): number {
  return (
    (priceAppreciation * 0.3) +
    (liquidityScore * 0.2) +
    (institutionalSupport * 0.2) +
    (socialMomentum * 0.2) -
    (riskScore * 0.1)
  );
}

function generateInsights(metrics: MarketMetrics, historical: HistoricalData[]) {
  const insights = [];

  // Price trend insights
  if (metrics.priceAppreciation > 20) {
    insights.push({
      type: 'price',
      message: 'Strong price appreciation trend',
      confidence: 'high'
    });
  } else if (metrics.priceAppreciation < -10) {
    insights.push({
      type: 'price',
      message: 'Price correction in progress',
      confidence: 'medium'
    });
  }

  // Liquidity insights
  if (metrics.liquidityScore > 50) {
    insights.push({
      type: 'liquidity',
      message: 'High market liquidity',
      confidence: 'high'
    });
  }

  // Institutional support insights
  if (metrics.institutionalSupport > 60) {
    insights.push({
      type: 'institutional',
      message: 'Strong institutional backing',
      confidence: 'high'
    });
  }

  // Social momentum insights
  if (metrics.socialMomentum > 70) {
    insights.push({
      type: 'social',
      message: 'Growing social presence',
      confidence: 'medium'
    });
  }

  // Risk assessment
  if (metrics.riskScore > 70) {
    insights.push({
      type: 'risk',
      message: 'Higher risk profile',
      confidence: 'high'
    });
  }

  // Investment recommendation
  const recommendation = metrics.investmentPotential > 60
    ? 'Strong investment potential'
    : metrics.investmentPotential > 40
    ? 'Moderate investment potential'
    : 'Consider alternative options';

  insights.push({
    type: 'recommendation',
    message: recommendation,
    confidence: 'high'
  });

  return insights;
}

function processAuctionData(auctions: any[]): HistoricalData[] {
  return auctions
    .map(auction => ({
      date: auction.date,
      price: auction.price,
      volume: auction.volume || 1,
      auctionHouses: [auction.venue]
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
} 