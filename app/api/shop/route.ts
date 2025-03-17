import { NextResponse } from 'next/server';

// Mock data since we can't read files directly in Vercel's serverless environment
const shopItems = [
  {
    id: '1960s-herman-miller-dkr-chairs-2x',
    title: '1960s Herman Miller DKR Chairs (2x)',
    imagePath: '/images/items/1960s-Herman-Miller-DKR-Chairs-(2x).jpg'
  },
  {
    id: '1980s-herman-miller-shell-chairs',
    title: '1980s Herman Miller Shell Chairs',
    imagePath: '/images/items/1980s-Herman-Miller-Shell-Chairs.jpg'
  },
  {
    id: 'arthur-umanoff-bar-stools-4x',
    title: 'Arthur Umanoff Bar Stools (4x)',
    imagePath: '/images/items/Arthur-Umanoff-Bar-Stools-(4x).jpg'
  },
  {
    id: 'castelli-dsc-106-chairs-4x',
    title: 'Castelli DSC 106 Chairs (4x)',
    imagePath: '/images/items/Castelli-DSC-106-Chairs-(4x).jpg'
  },
  {
    id: 'herman-miller-ea335-chairs-2x',
    title: 'Herman Miller EA335 Chairs (2x)',
    imagePath: '/images/items/Herman-Miller-EA335-Chairs-(2x).jpg'
  },
  {
    id: 'ikea-enetri-shelf',
    title: 'Ikea Enetri Shelf',
    imagePath: '/images/items/Ikea-Enetri-Shelf.jpg'
  },
  {
    id: 'ikea-moments-desk',
    title: 'Ikea Moments Desk',
    imagePath: '/images/items/Ikea-Moments-Desk.jpg'
  },
  {
    id: 'pace-collection-scaffold-chairs',
    title: 'Pace Collection Scaffold Chairs',
    imagePath: '/images/items/Pace-Collection-Scaffold-Chairs.jpg'
  },
  {
    id: 'replica-barcelona-chairs-2x',
    title: 'Replica Barcelona Chairs (2x)',
    imagePath: '/images/items/Replica-Barcelona-Chairs-(2x).jpg'
  },
  {
    id: 'replica-wassily-chairs-2x',
    title: 'Replica Wassily Chairs (2x)',
    imagePath: '/images/items/Replica-Wassily-Chairs-(2x).jpg'
  },
  {
    id: 'roy-litchenstein-triptych-1',
    title: 'Roy Litchenstein Triptych 1',
    imagePath: '/images/items/Roy-Litchenstein-Triptych-1.jpg'
  },
  {
    id: 'roy-litchenstein-triptych-2',
    title: 'Roy Litchenstein Triptych 2',
    imagePath: '/images/items/Roy-Litchenstein-Triptych-2.jpg'
  },
  {
    id: 'roy-litchenstein-triptych-3',
    title: 'Roy Litchenstein Triptych 3',
    imagePath: '/images/items/Roy-Litchenstein-Triptych-3.jpg'
  },
  {
    id: 'shepard-fairey-lithograph',
    title: 'Shepard Fairey Lithograph',
    imagePath: '/images/items/Shepard-Fairey-Lithograph.png'
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