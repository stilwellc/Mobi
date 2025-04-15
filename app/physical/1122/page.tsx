'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Project1122() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        <div className="relative z-10 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 mb-4">
              <motion.div 
                className="w-2 h-2 bg-[#4a0011] rounded-full"
                whileHover={{ scale: [null, 1.5] }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-300">
                Project 1122
              </h1>
            </div>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed">
              A groundbreaking exploration of form and function in physical space
            </p>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[2000px] mx-auto">
            <div className="flex flex-col gap-8">
              {/* Before Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative w-full"
              >
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all duration-300">
                  <img 
                    src="/images/1122/1122before.png" 
                    alt="Before blueprint"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60">
                    <span className="text-sm text-zinc-300">Before</span>
                  </div>
                </div>
              </motion.div>
              
              {/* After Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative w-full"
              >
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all duration-300">
                  <img 
                    src="/images/1122/1122affter.png" 
                    alt="After blueprint"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60">
                    <span className="text-sm text-zinc-300">After</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
              <h2 className="text-2xl font-medium text-zinc-300 mb-4">Project Details</h2>
              <p className="text-base text-zinc-500 leading-relaxed">
                This project represents a significant transformation in physical space design, 
                showcasing the evolution from initial concept to final implementation. The 
                before and after blueprints demonstrate the thoughtful consideration of form, 
                function, and spatial relationships.
              </p>
            </div>

            <div className="mt-8 max-w-4xl mx-auto">
              <Link 
                href="/physical"
                className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Physical Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 