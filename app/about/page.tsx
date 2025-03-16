'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  const features = [
    {
      title: "Modern Design",
      description: "Blending cutting-edge aesthetics with timeless elegance, creating spaces that are both contemporary and enduring.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    {
      title: "Optimized Experiences",
      description: "Creating spaces that maximize efficiency while enhancing the human experience—everything flows naturally, seamlessly.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Balanced Innovation",
      description: "Integrating smart technology, sustainable practices, and timeless aesthetics into a harmonious whole.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    }
  ];

  const services = [
    {
      title: "Augmenting Everyday Life",
      description: "Creating designs that amplify human potential through smart homes and collaborative workspaces.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Sustainable Innovation",
      description: "Incorporating eco-friendly materials and energy-efficient technologies seamlessly into all spaces.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Smart Integration",
      description: "Integrating technology that enhances lifestyle without disrupting it, creating a continuous flow.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

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
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-12">
            Modern, Optimized, Balanced Innovation
          </p>
          <Link href="/" className="inline-flex items-center text-zinc-600 hover:text-zinc-400 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Introduction */}
          <div className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-8 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
              backgroundSize: '16px 16px'
            }} />
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <motion.div 
                  className="w-2 h-2 bg-[#4a0011] rounded-full"
                  whileHover={{ scale: [null, 1.5] }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
                <h2 className="text-xl sm:text-2xl font-medium text-zinc-300">
                  Our Story
                </h2>
              </div>
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-400 leading-relaxed">
                  Mobi draws inspiration from the Mobius strip, a symbol of infinity and seamless continuity. Just as the Mobius strip weaves unexpected elements into a continuous flow, Mobi integrates diverse design principles—modern aesthetics, sustainable practices, and cutting-edge technology—into a harmonious, fluid experience that augments life, not just living spaces.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                  backgroundSize: '16px 16px'
                }} />
                <div className="relative">
                  <div className="text-zinc-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-zinc-300 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={service.title} className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                  backgroundSize: '16px 16px'
                }} />
                <div className="relative">
                  <div className="text-zinc-400 mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-medium text-zinc-300 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-zinc-500">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Vision Section */}
          <div className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-8 mt-8">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
              backgroundSize: '16px 16px'
            }} />
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <motion.div 
                  className="w-2 h-2 bg-[#4a0011] rounded-full"
                  whileHover={{ scale: [null, 1.5] }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
                <h2 className="text-xl sm:text-2xl font-medium text-zinc-300">
                  Our Vision
                </h2>
              </div>
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-400 leading-relaxed">
                  To redefine the way we experience design by weaving together sustainability, modern aesthetics, and cutting-edge technology in a way that enhances life at every level. Like the Mobius strip, our designs aim to create a seamless, continuous flow, augmenting the spaces where we live, work, and play.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 