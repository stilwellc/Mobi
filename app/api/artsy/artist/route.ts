import { NextResponse } from 'next/server';
import { getAccessToken } from '../token';

const ARTSY_API_URL = 'https://api.artsy.net/api';

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