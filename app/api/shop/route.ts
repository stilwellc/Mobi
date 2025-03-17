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
  },
  {
    id: '1960s-herman-miller-dkr-chairs-2x',
    title: '1960s Herman Miller DKR Chairs (2x)',
    imagePath: '/images/items/1960s-Herman-Miller-DKR-Chairs-(2x).jpg'
  },
  {
    id: 'castelli-dsc-106-chairs-4x',
    title: 'Castelli DSC 106 Chairs (4x)',
    imagePath: '/images/items/Castelli-DSC-106-Chairs-(4x).jpg'
  },
  {
    id: 'ikea-enetri-shelf',
    title: 'Ikea Enetri Shelf',
    imagePath: '/images/items/Ikea-Enetri-Shelf.jpg'
  },
  {
    id: 'replica-wassily-chairs-2x',
    title: 'Replica Wassily Chairs (2x)',
    imagePath: '/images/items/Replica-Wassily-Chairs-(2x).jpg'
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