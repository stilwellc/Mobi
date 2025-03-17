'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ShopItem {
  id: string;
  title: string;
  imagePath: string;
  description: string;
  details: {
    designer?: string;
    artist?: string;
    period: string;
    condition?: string;
    materials?: string[];
    dimensions: string;
    medium?: string;
  };
}

export default function ShopItemPage() {
  const params = useParams();
  const [item, setItem] = useState<ShopItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await fetch('/api/shop');
        const data = await response.json();
        const foundItem = data.items.find((i: ShopItem) => i.id === params.id);
        setItem(foundItem || null);
      } catch (error) {
        console.error('Error fetching shop item:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="w-2 h-2 bg-[#4a0011] rounded-full animate-ping" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-2xl text-zinc-300">Item not found</h1>
          <Link href="/shop" className="text-zinc-500 hover:text-zinc-400 mt-4 inline-block">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.015) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        <div className="relative z-10 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-8">
              <Link href="/shop" className="inline-flex items-center text-zinc-600 hover:text-zinc-400 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm">Back to Shop</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-square"
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <Image
                    src={item.imagePath}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 right-4">
                    <div className="px-2 py-1 bg-[#4a0011]/90 backdrop-blur-sm rounded text-xs font-medium tracking-wider text-zinc-200">
                      SOLD
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col justify-center"
              >
                <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-300 mb-6">
                  {item.title}
                </h1>
                
                <div className="prose prose-invert prose-zinc max-w-none mb-8">
                  <p className="text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {item.details.designer && (
                    <div>
                      <dt className="text-sm font-medium text-zinc-500">Designer</dt>
                      <dd className="mt-1 text-zinc-300">{item.details.designer}</dd>
                    </div>
                  )}
                  
                  {item.details.artist && (
                    <div>
                      <dt className="text-sm font-medium text-zinc-500">Artist</dt>
                      <dd className="mt-1 text-zinc-300">{item.details.artist}</dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-medium text-zinc-500">Period</dt>
                    <dd className="mt-1 text-zinc-300">{item.details.period}</dd>
                  </div>

                  {item.details.condition && (
                    <div>
                      <dt className="text-sm font-medium text-zinc-500">Condition</dt>
                      <dd className="mt-1 text-zinc-300">{item.details.condition}</dd>
                    </div>
                  )}

                  {item.details.materials && (
                    <div>
                      <dt className="text-sm font-medium text-zinc-500">Materials</dt>
                      <dd className="mt-1 text-zinc-300">{item.details.materials.join(', ')}</dd>
                    </div>
                  )}

                  {item.details.medium && (
                    <div>
                      <dt className="text-sm font-medium text-zinc-500">Medium</dt>
                      <dd className="mt-1 text-zinc-300">{item.details.medium}</dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-medium text-zinc-500">Dimensions</dt>
                    <dd className="mt-1 text-zinc-300">{item.details.dimensions}</dd>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 