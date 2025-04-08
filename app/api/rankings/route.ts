import { NextResponse } from 'next/server';

const ARTSY_API_URL = 'https://api.artsy.net/api';
const ARTSY_CLIENT_ID = process.env.ARTSY_CLIENT_ID;
const ARTSY_CLIENT_SECRET = process.env.ARTSY_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch(`${ARTSY_API_URL}/tokens/xapp_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: ARTSY_CLIENT_ID,
      client_secret: ARTSY_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get Artsy access token');
  }

  const data = await response.json();
  accessToken = data.token;
  tokenExpiry = Date.now() + (data.expires_in * 1000);
  return accessToken;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '1m';
    const category = searchParams.get('category') || 'all';

    const token = await getAccessToken();
    if (!token) {
      throw new Error('Failed to get access token');
    }

    // Fetch trending artists from Artsy
    const response = await fetch(
      `${ARTSY_API_URL}/artists?sort=-trending&size=15`,
      {
        headers: {
          'X-XAPP-Token': token,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch trending artists');
    }

    const data = await response.json();
    let artists = data._embedded.artists;

    // Filter by category if specified
    if (category !== 'all') {
      artists = artists.filter((artist: any) => 
        artist.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Fetch additional metrics for each artist
    const enrichedArtists = await Promise.all(
      artists.map(async (artist: any) => {
        // Fetch artist's followers
        const followersResponse = await fetch(
          `${ARTSY_API_URL}/artists/${artist.id}/followers`,
          {
            headers: {
              'X-XAPP-Token': token,
            },
          }
        );

        const followersData = await followersResponse.json();
        const followers = followersData.total_count;

        // Fetch artist's shows
        const showsResponse = await fetch(
          `${ARTSY_API_URL}/shows?artist_id=${artist.id}`,
          {
            headers: {
              'X-XAPP-Token': token,
            },
          }
        );

        const showsData = await showsResponse.json();
        const upcomingShows = showsData._embedded.shows.filter(
          (show: any) => new Date(show.start_at) > new Date()
        );

        return {
          ...artist,
          followers,
          upcomingShows: upcomingShows.length,
          marketScore: calculateMarketScore(artist, followers, upcomingShows.length),
        };
      })
    );

    // Sort by market score
    enrichedArtists.sort((a: any, b: any) => b.marketScore - a.marketScore);

    return NextResponse.json({
      artists: enrichedArtists,
      timeframe,
      category,
    });
  } catch (error) {
    console.error('Rankings API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist rankings' },
      { status: 500 }
    );
  }
}

function calculateMarketScore(artist: any, followers: number, upcomingShows: number) {
  // Simple scoring algorithm - can be enhanced based on more metrics
  const baseScore = artist.trending_score || 0;
  const followersScore = Math.log10(followers + 1) * 10;
  const showsScore = upcomingShows * 5;
  
  return baseScore + followersScore + showsScore;
} 