'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.015) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-2 h-2 bg-[#4a0011] rounded-full mx-auto" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-zinc-300 mb-6">
            About Me
          </h1>
          <Link href="/" className="inline-flex items-center text-zinc-600 hover:text-zinc-400 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative z-10 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
              backgroundSize: '16px 16px'
            }} />
            <div className="relative space-y-6">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-2 h-2 bg-[#4a0011] rounded-full"
                  whileHover={{ scale: [null, 1.5] }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
                <h2 className="text-xl sm:text-2xl font-medium text-zinc-300">
                  Hello, I'm Collin
                </h2>
              </div>
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-400 leading-relaxed">
                  I'm a passionate developer and designer based in the heart of innovation. With a keen eye for detail and a love for clean, efficient code, I create digital experiences that leave a lasting impression.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  My journey in technology has been driven by curiosity and a desire to build solutions that make a difference. From physical computing projects to digital innovations, I'm constantly exploring new ways to push the boundaries of what's possible.
                </p>
                <h3 className="text-lg font-medium text-zinc-300 mt-8 mb-4">Skills & Expertise</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li>Full-stack Development</li>
                  <li>UI/UX Design</li>
                  <li>Physical Computing</li>
                  <li>Creative Technology</li>
                  <li>Project Architecture</li>
                </ul>
                <h3 className="text-lg font-medium text-zinc-300 mt-8 mb-4">Current Focus</h3>
                <p className="text-zinc-400 leading-relaxed">
                  I'm currently exploring the intersection of physical and digital experiences, creating innovative solutions that bridge the gap between hardware and software. My work spans from interactive installations to web applications, always with a focus on user experience and technical excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 