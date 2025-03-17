import { NextResponse } from 'next/server';

// Mock data since we can't read files directly in Vercel's serverless environment
const shopItems = [
  {
    id: '1960s-herman-miller-dkr-chairs-2x',
    title: '1960s Herman Miller DKR Chairs (2x)',
    imagePath: '/images/items/1960s-Herman-Miller-DKR-Chairs-(2x).jpg',
    description: "A pair of authentic 1960s Herman Miller DKR wire chairs, designed by Charles and Ray Eames. These iconic pieces feature the distinctive 'Eiffel Tower' base and maintain their original structural integrity. The wire mesh design offers both durability and visual lightness, embodying the modernist principles of the era.",
    details: {
      designer: "Charles and Ray Eames",
      period: "1960s",
      condition: "Good vintage condition with natural patina",
      materials: ["Chrome-plated steel wire", "Original rubber shock mounts"],
      dimensions: "31.5\"H x 19\"W x 21\"D (each)"
    }
  },
  {
    id: '1980s-herman-miller-shell-chairs',
    title: '1980s Herman Miller Shell Chairs',
    imagePath: '/images/items/1980s-Herman-Miller-Shell-Chairs.jpg',
    description: "Classic Herman Miller shell chairs from the 1980s, featuring the timeless design pioneered by Charles and Ray Eames. These molded plastic seats showcase the perfect blend of comfort and style that made them a staple of modern design. The ergonomic shell form remains as relevant today as when first introduced.",
    details: {
      designer: "Charles and Ray Eames",
      period: "1980s",
      condition: "Excellent vintage condition",
      materials: ["Molded plastic", "Steel base"],
      dimensions: "31\"H x 18.5\"W x 22\"D"
    }
  },
  {
    id: 'arthur-umanoff-bar-stools-4x',
    title: 'Arthur Umanoff Bar Stools (4x)',
    imagePath: '/images/items/Arthur-Umanoff-Bar-Stools-(4x).jpg',
    description: "Set of four Arthur Umanoff bar stools, exemplifying his minimalist approach to mid-century design. These stools feature the characteristic combination of wrought iron and wood that Umanoff was known for. The clean lines and honest materials create a perfect balance between form and function.",
    details: {
      designer: "Arthur Umanoff",
      period: "Mid-century",
      condition: "Very good vintage condition",
      materials: ["Wrought iron", "Solid wood"],
      dimensions: "30\"H x 15\"W x 15\"D (each)"
    }
  },
  {
    id: 'castelli-dsc-106-chairs-4x',
    title: 'Castelli DSC 106 Chairs (4x)',
    imagePath: '/images/items/Castelli-DSC-106-Chairs-(4x).jpg',
    description: "A set of four Castelli DSC 106 chairs, representing Italian design excellence. These chairs showcase the sleek, minimalist aesthetic of 1970s Italian furniture design. Their stackable nature combines practicality with sophisticated style, making them perfect for both home and office settings.",
    details: {
      designer: "Giancarlo Piretti for Castelli",
      period: "1970s",
      condition: "Excellent vintage condition",
      materials: ["Chrome-plated steel", "Molded plastic"],
      dimensions: "30\"H x 18\"W x 20\"D (each)"
    }
  },
  {
    id: 'herman-miller-ea335-chairs-2x',
    title: 'Herman Miller EA335 Chairs (2x)',
    imagePath: '/images/items/Herman-Miller-EA335-Chairs-(2x).jpg',
    description: "Pair of Herman Miller EA335 lounge chairs designed by Charles and Ray Eames. These sophisticated pieces represent the pinnacle of mid-century modern office design. The aluminum group chairs feature a distinctive profile with clean lines and superior comfort, perfect for executive spaces or modern living rooms.",
    details: {
      designer: "Charles and Ray Eames",
      period: "Mid-century",
      condition: "Excellent condition",
      materials: ["Cast aluminum", "Premium leather"],
      dimensions: "32\"H x 23\"W x 24\"D (each)"
    }
  },
  {
    id: 'ikea-enetri-shelf',
    title: 'Ikea Enetri Shelf',
    imagePath: '/images/items/Ikea-Enetri-Shelf.jpg',
    description: "The Ikea Enetri shelf system represents Scandinavian design's democratic ideals. This versatile piece combines clean lines with practical storage solutions, demonstrating that good design can be both accessible and functional. Its modular nature allows for customization to suit various spaces.",
    details: {
      designer: "Ikea Design Team",
      period: "Contemporary",
      condition: "Good condition",
      materials: ["Powder-coated steel", "Particleboard"],
      dimensions: "71\"H x 31\"W x 14\"D"
    }
  },
  {
    id: 'ikea-moments-desk',
    title: 'Ikea Moments Desk',
    imagePath: '/images/items/Ikea-Moments-Desk.jpg',
    description: "The Ikea Moments desk embodies modern Scandinavian workspace design. With its minimalist aesthetic and thoughtful functionality, this desk creates an ideal environment for focused work or creative pursuits. The clean lines and practical design make it a versatile piece for any contemporary interior.",
    details: {
      designer: "Ikea Design Team",
      period: "Contemporary",
      condition: "Excellent condition",
      materials: ["Engineered wood", "Steel"],
      dimensions: "29\"H x 47\"W x 24\"D"
    }
  },
  {
    id: 'pace-collection-scaffold-chairs',
    title: 'Pace Collection Scaffold Chairs',
    imagePath: '/images/items/Pace-Collection-Scaffold-Chairs.jpg',
    description: "Pace Collection scaffold chairs, exemplifying the bold architectural aesthetic of 1970s design. These striking pieces feature an innovative structural design that transforms industrial inspiration into sophisticated seating. The geometric framework creates a dramatic visual statement while maintaining comfort and functionality.",
    details: {
      designer: "Pace Collection",
      period: "1970s",
      condition: "Very good vintage condition",
      materials: ["Chrome-plated steel", "Upholstered seat and back"],
      dimensions: "32\"H x 20\"W x 22\"D"
    }
  },
  {
    id: 'replica-barcelona-chairs-2x',
    title: 'Replica Barcelona Chairs (2x)',
    imagePath: '/images/items/Replica-Barcelona-Chairs-(2x).jpg',
    description: "Pair of Barcelona chair replicas, paying homage to Mies van der Rohe's iconic 1929 design. These pieces capture the essence of modernist furniture design with their clean lines and geometric forms. Perfect for creating a sophisticated modernist atmosphere in any space.",
    details: {
      designer: "Inspired by Mies van der Rohe",
      period: "Contemporary reproduction",
      condition: "Excellent condition",
      materials: ["Stainless steel", "Leather upholstery"],
      dimensions: "30\"H x 29.5\"W x 30\"D (each)"
    }
  },
  {
    id: 'replica-wassily-chairs-2x',
    title: 'Replica Wassily Chairs (2x)',
    imagePath: '/images/items/Replica-Wassily-Chairs-(2x).jpg',
    description: "Set of two Wassily chair replicas, based on Marcel Breuer's revolutionary 1925 design. These chairs showcase the Bauhaus principle of form following function, with their stripped-down aesthetic and innovative use of tubular steel. A perfect blend of artistic vision and industrial materials.",
    details: {
      designer: "Inspired by Marcel Breuer",
      period: "Contemporary reproduction",
      condition: "Excellent condition",
      materials: ["Chrome-plated tubular steel", "Leather straps"],
      dimensions: "29\"H x 31\"W x 27\"D (each)"
    }
  },
  {
    id: 'roy-litchenstein-triptych-1',
    title: 'Roy Litchenstein Triptych 1',
    imagePath: '/images/items/Roy-Litchenstein-Triptych-1.jpg',
    description: "Part one of a stunning Lichtenstein triptych, showcasing the artist's signature pop art style. This piece captures Lichtenstein's mastery of commercial printing techniques and his iconic use of Ben-Day dots. The bold colors and clean lines create a powerful visual impact characteristic of pop art.",
    details: {
      artist: "Roy Lichtenstein",
      period: "Contemporary reproduction",
      medium: "Print on high-quality paper",
      dimensions: "36\"H x 24\"W"
    }
  },
  {
    id: 'roy-litchenstein-triptych-2',
    title: 'Roy Litchenstein Triptych 2',
    imagePath: '/images/items/Roy-Litchenstein-Triptych-2.jpg',
    description: "The second piece of the Lichtenstein triptych continues the narrative with bold graphic elements and vibrant colors. This section demonstrates Lichtenstein's ability to transform comic book aesthetics into fine art, creating a dialogue between popular culture and high art.",
    details: {
      artist: "Roy Lichtenstein",
      period: "Contemporary reproduction",
      medium: "Print on high-quality paper",
      dimensions: "36\"H x 24\"W"
    }
  },
  {
    id: 'roy-litchenstein-triptych-3',
    title: 'Roy Litchenstein Triptych 3',
    imagePath: '/images/items/Roy-Litchenstein-Triptych-3.jpg',
    description: "The final piece of the Lichtenstein triptych completes the narrative sequence. This work exemplifies Lichtenstein's exploration of sequential art and his unique ability to elevate comic-style imagery to fine art status. The complete triptych creates a powerful statement in any modern interior.",
    details: {
      artist: "Roy Lichtenstein",
      period: "Contemporary reproduction",
      medium: "Print on high-quality paper",
      dimensions: "36\"H x 24\"W"
    }
  },
  {
    id: 'shepard-fairey-lithograph',
    title: 'Shepard Fairey Lithograph',
    imagePath: '/images/items/Shepard-Fairey-Lithograph.png',
    description: "A striking lithograph by Shepard Fairey, known for his thought-provoking street art and graphic design. This piece showcases Fairey's distinctive style, combining propaganda art aesthetics with contemporary social commentary. The bold composition and limited color palette create a powerful visual statement.",
    details: {
      artist: "Shepard Fairey",
      period: "Contemporary",
      medium: "Lithograph",
      dimensions: "24\"H x 18\"W"
    }
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