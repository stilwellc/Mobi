'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Artist {
  name: string;
  trend: 'up' | 'down' | 'stable';
  priceRange: string;
  recentSales: string;
  description: string;
  category: string;
}

export default function HotBrushProject() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const artists: Artist[] = [
    {
      name: "Sarah Anderson",
      trend: "up",
      priceRange: "$500-2,000",
      recentSales: "+45% in last 30 days",
      description: "Rising star known for vibrant digital illustrations and character design. Growing social media presence with strong collector engagement.",
      category: "Digital Art"
    },
    {
      name: "Marcus Chen",
      trend: "up",
      priceRange: "$1,000-5,000",
      recentSales: "+65% in last 30 days",
      description: "Contemporary oil painter focusing on urban landscapes. Recent gallery features in NYC and LA have sparked significant interest.",
      category: "Traditional"
    },
    {
      name: "Elena Rodriguez",
      trend: "stable",
      priceRange: "$3,000-8,000",
      recentSales: "+15% in last 30 days",
      description: "Established mixed media artist with consistent market performance. Known for unique combinations of photography and painting.",
      category: "Mixed Media"
    }
  ];

  const categories = ['all', ...Array.from(new Set(artists.map(artist => artist.category)))];

  const filteredArtists = selectedCategory === 'all' 
    ? artists 
    : artists.filter(artist => artist.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.015) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        <div className="relative z-10 pt-16 pb-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center space-x-4 mb-4">
              <motion.div 
                className="w-2 h-2 bg-[#4a0011] rounded-full"
                whileHover={{ scale: [null, 1.5] }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-300">
                Hot Brush
              </h1>
            </div>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed">
              Track and discover emerging artists with high investment potential in the art market.
            </p>
            <div className="mt-6">
              <Link href="/" className="inline-flex items-center text-zinc-600 hover:text-zinc-400 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm">Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <section className="relative z-10 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#800020] text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Cards */}
      <section className="relative z-10 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid gap-6">
            {filteredArtists.map((artist, index) => (
              <div 
                key={index}
                className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-8 group md:hover:scale-[1.01] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                  backgroundSize: '16px 16px'
                }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-medium text-zinc-300">{artist.name}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        artist.trend === 'up' 
                          ? 'bg-green-900/20 text-green-400'
                          : artist.trend === 'down'
                          ? 'bg-red-900/20 text-red-400'
                          : 'bg-yellow-900/20 text-yellow-400'
                      }`}>
                        {artist.recentSales}
                      </span>
                    </div>
                    <motion.div 
                      className="w-2 h-2 bg-[#4a0011] rounded-full"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-zinc-500">
                      <span className="px-2 py-1 rounded bg-zinc-900">{artist.category}</span>
                      <span>{artist.priceRange}</span>
                    </div>
                    <p className="text-zinc-500 leading-relaxed">
                      {artist.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 