import { NextResponse } from 'next/server';

const ARTSY_API_URL = 'https://api.artsy.net/api';
const ARTSY_CLIENT_ID = process.env.ARTSY_CLIENT_ID;
const ARTSY_CLIENT_SECRET = process.env.ARTSY_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAccessToken(): Promise<string> {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  if (!ARTSY_CLIENT_ID || !ARTSY_CLIENT_SECRET) {
    throw new Error('Artsy API credentials not configured');
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

export async function GET() {
  try {
    const token = await getAccessToken();
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Artsy Token Error:', error);
    return NextResponse.json(
      { error: 'Failed to get Artsy token' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('artistId');
    const timeframe = searchParams.get('timeframe') || '1m';

    if (!artistId) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
    }

    const token = await getAccessToken();

    // Fetch artist details
    const artistResponse = await fetch(`${ARTSY_API_URL}/artists/${artistId}`, {
      headers: {
        'X-XAPP-Token': token,
      },
    });

    if (!artistResponse.ok) {
      throw new Error('Failed to fetch artist details');
    }

    const artistData = await artistResponse.json();

    // Fetch artist artworks
    const artworksResponse = await fetch(`${ARTSY_API_URL}/artworks?artist_id=${artistId}&size=10`, {
      headers: {
        'X-XAPP-Token': token,
      },
    });

    if (!artworksResponse.ok) {
      throw new Error('Failed to fetch artist artworks');
    }

    const artworksData = await artworksResponse.json();

    // Fetch artist shows
    const showsResponse = await fetch(`${ARTSY_API_URL}/shows?artist_id=${artistId}`, {
      headers: {
        'X-XAPP-Token': token,
      },
    });

    if (!showsResponse.ok) {
      throw new Error('Failed to fetch artist shows');
    }

    const showsData = await showsResponse.json();

    return NextResponse.json({
      artist: artistData,
      artworks: artworksData._embedded.artworks,
      shows: showsData._embedded.shows,
    });
  } catch (error) {
    console.error('Artsy API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist data' },
      { status: 500 }
    );
  }
} 