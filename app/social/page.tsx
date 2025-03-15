'use client';

import React from 'react';
import { motion } from 'framer-motion';

const spaces = [
  {
    title: "Community Hub",
    description: "A vibrant space that brings people together",
    category: "Hub",
    image: "/images/community-hub.jpg"
  },
  {
    title: "Creative Workshop",
    description: "A collaborative space for innovation and creation",
    category: "Workshop",
    image: "/images/creative-workshop.jpg"
  },
  {
    title: "Social Lounge",
    description: "A comfortable space for connection and conversation",
    category: "Lounge",
    image: "/images/social-lounge.jpg"
  }
];

export default function SocialSpaces() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-4 max-w-4xl mx-auto py-20"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-6">
                Social Spaces
              </h1>
              <p className="text-lg text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed">
                Where connections flourish and communities thrive
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Spaces Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spaces.map((space, index) => (
              <motion.div
                key={space.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute top-4 right-4">
                    <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                  </div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-2">
                      {space.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">
                      {space.title}
                    </h3>
                    <p className="text-base text-zinc-400 max-w-xl">
                      {space.description}
                    </p>
                    <motion.div 
                      className="mt-6 inline-flex items-center text-zinc-400 hover:text-[#EDE8D0] transition-colors group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="mr-2 text-sm">View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 