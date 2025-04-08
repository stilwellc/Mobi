import { NextResponse } from 'next/server';

const ARTSY_API_URL = 'https://api.artsy.net/api';
const ARTSY_CLIENT_ID = process.env.ARTSY_CLIENT_ID;
const ARTSY_CLIENT_SECRET = process.env.ARTSY_CLIENT_SECRET;

let accessToken: string = '';
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