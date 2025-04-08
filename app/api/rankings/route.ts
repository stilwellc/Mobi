import { NextResponse } from 'next/server';
import { getAccessToken } from '../artsy/token';

interface Artist {
  id: string;
  name: string;
  category: string;
  trend: 'up' | 'down' | 'stable';
  priceRange: string;
  recentSales: {
    title: string;
    price: number;
    date: string;
    venue: string;
  }[];
  monthlyVolume: number;
  description: string;
  followers: number;
  monthlyRank: number;
  lastMonthRank: number;
  galleryRepresentation: string[];
  upcomingShows: string[];
  marketScore: number;
}

// Artsy API integration
async function fetchArtsyArtists(token: string, category?: string) {
  const response = await fetch(
    `https://api.artsy.net/api/artists?size=15${category ? `&category=${category}` : ''}`,
    {
      headers: {
        'X-XAPP-Token': token,
        'Accept': 'application/vnd.artsy-v2+json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch Artsy artists');
  }
  
  const data = await response.json();
  return data._embedded.artists.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    category: artist.category || 'Contemporary',
    trend: 'up',
    priceRange: '$10,000 - $100,000',
    recentSales: [],
    monthlyVolume: 0,
    description: artist.biography || '',
    followers: artist.followers_count || 0,
    monthlyRank: 0,
    lastMonthRank: 0,
    galleryRepresentation: [],
    upcomingShows: [],
    marketScore: 0
  }));
}

// Sotheby's API integration
async function fetchSothebysArtists() {
  // Note: Sotheby's API requires authentication and proper setup
  // This is a mock implementation for now
  return [
    {
      id: 'sothebys-1',
      name: 'Artist One',
      category: 'Contemporary',
      trend: 'up',
      priceRange: '$50,000 - $200,000',
      recentSales: [],
      monthlyVolume: 0,
      description: 'Emerging contemporary artist',
      followers: 0,
      monthlyRank: 0,
      lastMonthRank: 0,
      galleryRepresentation: [],
      upcomingShows: [],
      marketScore: 0
    },
    // Add more mock artists...
  ];
}

// Christie's API integration
async function fetchChristiesArtists() {
  // Note: Christie's API requires authentication and proper setup
  // This is a mock implementation for now
  return [
    {
      id: 'christies-1',
      name: 'Artist Two',
      category: 'Modern',
      trend: 'stable',
      priceRange: '$30,000 - $150,000',
      recentSales: [],
      monthlyVolume: 0,
      description: 'Modern art specialist',
      followers: 0,
      monthlyRank: 0,
      lastMonthRank: 0,
      galleryRepresentation: [],
      upcomingShows: [],
      marketScore: 0
    },
    // Add more mock artists...
  ];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const timeframe = searchParams.get('timeframe') || '1m';

    // Get Artsy token
    const token = await getAccessToken();

    // Fetch artists from all sources
    const [artsyArtists, sothebysArtists, christiesArtists] = await Promise.all([
      fetchArtsyArtists(token, category || undefined),
      fetchSothebysArtists(),
      fetchChristiesArtists()
    ]);

    // Combine all artists
    const allArtists = [...artsyArtists, ...sothebysArtists, ...christiesArtists];

    // Sort by market score and take top 15
    const sortedArtists = allArtists
      .sort((a, b) => b.marketScore - a.marketScore)
      .slice(0, 15);

    // Assign ranks
    sortedArtists.forEach((artist, index) => {
      artist.monthlyRank = index + 1;
      // Mock last month's rank for now
      artist.lastMonthRank = Math.max(1, index + Math.floor(Math.random() * 3) - 1);
    });

    return NextResponse.json({ artists: sortedArtists });
  } catch (error) {
    console.error('Rankings API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist rankings' },
      { status: 500 }
    );
  }
} 