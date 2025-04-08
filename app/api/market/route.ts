import { NextResponse } from 'next/server';

const SOTHEBYS_API_KEY = process.env.SOTHEBYS_API_KEY;
const CHRISTIES_API_KEY = process.env.CHRISTIES_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('artistId');
    const timeframe = searchParams.get('timeframe') || '1m';

    if (!artistId) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
    }

    // Fetch auction results from Sotheby's
    const sothebysResponse = await fetch(
      `https://api.sothebys.com/v2/auctions/results?artist_id=${artistId}&timeframe=${timeframe}`,
      {
        headers: {
          'Authorization': `Bearer ${SOTHEBYS_API_KEY}`,
        },
      }
    );

    if (!sothebysResponse.ok) {
      throw new Error('Failed to fetch Sotheby\'s data');
    }

    const sothebysData = await sothebysResponse.json();

    // Fetch auction results from Christie's
    const christiesResponse = await fetch(
      `https://api.christies.com/v1/auctions/results?artist_id=${artistId}&timeframe=${timeframe}`,
      {
        headers: {
          'Authorization': `Bearer ${CHRISTIES_API_KEY}`,
        },
      }
    );

    if (!christiesResponse.ok) {
      throw new Error('Failed to fetch Christie\'s data');
    }

    const christiesData = await christiesResponse.json();

    // Combine and process the data
    const combinedResults = [
      ...sothebysData.results.map((result: any) => ({
        ...result,
        auctionHouse: 'Sotheby\'s',
      })),
      ...christiesData.results.map((result: any) => ({
        ...result,
        auctionHouse: 'Christie\'s',
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate market metrics
    const totalSales = combinedResults.length;
    const totalValue = combinedResults.reduce((sum, result) => sum + result.price, 0);
    const averagePrice = totalValue / totalSales;
    const highestPrice = Math.max(...combinedResults.map((result) => result.price));
    const lowestPrice = Math.min(...combinedResults.map((result) => result.price));

    return NextResponse.json({
      results: combinedResults,
      metrics: {
        totalSales,
        totalValue,
        averagePrice,
        highestPrice,
        lowestPrice,
      },
    });
  } catch (error) {
    console.error('Market API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
} 