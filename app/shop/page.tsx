'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface ShopItem {
  id: string;
  title: string;
  imagePath: string;
}

export default function ShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch('/api/shop');
        const data = await response.json();
        setItems(data.items);
      } catch (error) {
        console.error('Error fetching shop items:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center space-x-4 mb-4">
              <motion.div 
                className="w-2 h-2 bg-[#4a0011] rounded-full"
                whileHover={{ scale: [null, 1.5] }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-300">
                Shop
              </h1>
            </div>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed">
              Discover our curated collection of design pieces
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

      {/* Shop Grid */}
      <section className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="w-2 h-2 bg-[#4a0011] rounded-full animate-ping" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 md:hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                    <div className="absolute inset-0" style={{ 
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }} />
                    <Image
                      src={item.imagePath}
                      alt={item.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute bottom-4 left-4">
                      <div className="px-2 py-1 bg-[#4a0011]/90 backdrop-blur-sm rounded text-xs font-medium tracking-wider text-zinc-200">
                        SOLD
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <motion.div 
                        className="w-2 h-2 bg-[#4a0011] rounded-full"
                        whileHover={{ scale: [null, 1.5] }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-medium text-zinc-300 group-hover:text-zinc-200 transition-colors">
                      {item.title}
                    </h3>
                    <motion.div 
                      className="inline-flex items-center text-zinc-500 group-hover:text-zinc-400 transition-colors"
                      whileHover={{ x: [null, 5] }}
                    >
                      <span className="mr-2 text-sm">View Details</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 