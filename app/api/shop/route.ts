import { NextResponse } from 'next/server';

// Mock data since we can't read files directly in Vercel's serverless environment
const shopItems = [
  {
    id: '1980s-herman-miller-shell-chairs',
    title: '1980s Herman Miller Shell Chairs',
    imagePath: '/images/items/1980s-Herman-Miller-Shell-Chairs.jpg'
  },
  {
    id: 'pace-collection-scaffold-chairs',
    title: 'Pace Collection Scaffold Chairs',
    imagePath: '/images/items/Pace-Collection-Scaffold-Chairs.jpg'
  }
];

export async function GET() {
  try {
    return NextResponse.json({ items: shopItems });
  } catch (error) {
    console.error('Error in shop API:', error);
    return NextResponse.json({ items: [] });
  }
} 