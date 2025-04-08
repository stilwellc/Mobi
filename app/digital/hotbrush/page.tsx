'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ArtworkSale {
  title: string;
  price: number;
  date: string;
  venue: string;
}

interface Artist {
  name: string;
  trend: 'up' | 'down' | 'stable';
  priceRange: string;
  recentSales: ArtworkSale[];
  monthlyVolume: number;
  description: string;
  category: string;
  followers: number;
  monthlyRank?: number;
  artsyId?: string;
  imageUrl?: string;
  galleryRepresentation: string[];
  upcomingShows: string[];
  lastMonthRank?: number;
}

interface ArtsyArtist {
  id: string;
  name: string;
  biography: string;
  image: {
    url: string;
  };
}

interface ArtsyArtwork {
  title: string;
  price: string;
  date: string;
  partner: {
    name: string;
  };
}

export default function HotBrushProject() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '3m' | '6m'>('1m');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtsyData = async () => {
      try {
        setLoading(true);
        // Note: In a real implementation, you would need to:
        // 1. Set up proper API authentication
        // 2. Store API keys securely
        // 3. Create a backend API route to proxy these requests
        const ARTSY_API_KEY = process.env.NEXT_PUBLIC_ARTSY_API_KEY;
        const ARTSY_API_URL = 'https://api.artsy.net/api';

        // This is a mock of what the real implementation would look like
        const mockArtists: Artist[] = [
          {
            name: "Amoako Boafo",
            trend: "up",
            priceRange: "$50,000-250,000",
            recentSales: [
              {
                title: "Green Beret",
                price: 175000,
                date: "2024-03-15",
                venue: "Phillips London"
              },
              {
                title: "Self Portrait",
                price: 220000,
                date: "2024-03-01",
                venue: "Christie's New York"
              }
            ],
            monthlyVolume: 890000,
            description: "Ghanaian artist known for his vibrant portraits. Recent auction performance shows strong market momentum with consistent price appreciation.",
            category: "Contemporary",
            followers: 125000,
            monthlyRank: 1,
            lastMonthRank: 3,
            galleryRepresentation: ["Roberts Projects", "Mariane Ibrahim"],
            upcomingShows: ["Solo Exhibition at Roberts Projects, LA (May 2024)"]
          },
          {
            name: "Flora Yukhnovich",
            trend: "up",
            priceRange: "$100,000-500,000",
            recentSales: [
              {
                title: "Rococo Study",
                price: 320000,
                date: "2024-03-10",
                venue: "Sotheby's London"
              }
            ],
            monthlyVolume: 750000,
            description: "Rising star known for her contemporary interpretations of Rococo aesthetics. Strong institutional support and growing collector base.",
            category: "Contemporary",
            followers: 98000,
            monthlyRank: 2,
            lastMonthRank: 5,
            galleryRepresentation: ["Victoria Miro", "Parafin"],
            upcomingShows: ["Group Show at Victoria Miro (June 2024)"]
          },
          {
            name: "Anna Weyant",
            trend: "stable",
            priceRange: "$150,000-800,000",
            recentSales: [
              {
                title: "Evening Study",
                price: 450000,
                date: "2024-02-28",
                venue: "Gagosian New York"
              }
            ],
            monthlyVolume: 680000,
            description: "Contemporary figurative painter represented by Gagosian. Market showing strong stability after meteoric rise.",
            category: "Contemporary",
            followers: 145000,
            monthlyRank: 3,
            lastMonthRank: 1,
            galleryRepresentation: ["Gagosian"],
            upcomingShows: ["Solo Exhibition at Gagosian London (July 2024)"]
          }
        ];

        setArtists(mockArtists);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch artist data');
        setLoading(false);
      }
    };

    fetchArtsyData();
  }, [selectedTimeframe]);

  const categories = ['all', ...Array.from(new Set(artists.map(artist => artist.category)))];

  const filteredArtists = selectedCategory === 'all' 
    ? artists 
    : artists.filter(artist => artist.category === selectedCategory);

  const timeframes = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' }
  ];

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
              Real-time tracking of the hottest artists in the market. Updated monthly with comprehensive performance metrics.
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

      {/* Filters */}
      <section className="relative z-10 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Category Filter */}
            <div className="flex space-x-4 overflow-x-auto pb-4 sm:pb-0">
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

            {/* Timeframe Filter */}
            <div className="flex space-x-4">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe.value}
                  onClick={() => setSelectedTimeframe(timeframe.value as '1m' | '3m' | '6m')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTimeframe === timeframe.value
                      ? 'bg-[#800020] text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {timeframe.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artist Cards */}
      <section className="relative z-10 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-[#800020] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-zinc-500">Loading artist data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
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
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm px-2 py-1 rounded ${
                            artist.trend === 'up' 
                              ? 'bg-green-900/20 text-green-400'
                              : artist.trend === 'down'
                              ? 'bg-red-900/20 text-red-400'
                              : 'bg-yellow-900/20 text-yellow-400'
                          }`}>
                            Rank #{artist.monthlyRank}
                            {artist.lastMonthRank && (
                              <span className="ml-1 text-xs">
                                {artist.monthlyRank! < artist.lastMonthRank ? '↑' : '↓'}
                                {Math.abs(artist.monthlyRank! - artist.lastMonthRank)}
                              </span>
                            )}
                          </span>
                          <span className="text-sm px-2 py-1 rounded bg-zinc-900/50 text-zinc-400">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              notation: 'compact',
                              maximumFractionDigits: 1
                            }).format(artist.monthlyVolume)} volume
                          </span>
                        </div>
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
                        <span className="px-2 py-1 rounded bg-zinc-900/50">
                          {artist.followers.toLocaleString()} followers
                        </span>
                      </div>
                      <p className="text-zinc-500 leading-relaxed">
                        {artist.description}
                      </p>
                      
                      {/* Recent Sales */}
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-zinc-400 mb-3">Recent Sales</h3>
                        <div className="space-y-2">
                          {artist.recentSales.map((sale, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-zinc-500">{sale.title}</span>
                              <div className="flex items-center space-x-3">
                                <span className="text-zinc-400">
                                  {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    notation: 'compact',
                                    maximumFractionDigits: 1
                                  }).format(sale.price)}
                                </span>
                                <span className="text-zinc-600">{new Date(sale.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gallery Representation */}
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-zinc-400 mb-2">Gallery Representation</h3>
                        <div className="flex flex-wrap gap-2">
                          {artist.galleryRepresentation.map((gallery, i) => (
                            <span key={i} className="text-sm px-2 py-1 rounded bg-zinc-900/50 text-zinc-500">
                              {gallery}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Upcoming Shows */}
                      {artist.upcomingShows.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-zinc-400 mb-2">Upcoming Shows</h3>
                          <div className="space-y-1">
                            {artist.upcomingShows.map((show, i) => (
                              <p key={i} className="text-sm text-zinc-500">{show}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 