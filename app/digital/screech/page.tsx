'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ScreechProject() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[192px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full bg-mobi-burgundy/20 blur-[120px]"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              top: "-20%",
              left: "-20%",
            }}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 px-4 max-w-4xl mx-auto"
        >
          <motion.div
            className="relative mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-14 h-14 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C8 2 4 6 4 10c0 4 4 8 8 8s8-4 8-8c0-4-4-8-8-8z" />
                  <path d="M12 6c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" />
                  <path d="M12 14c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                  <path d="M8 8c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                  <path d="M16 8c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8"
              style={{
                textShadow: '0 0 80px rgba(255,255,255,0.1)',
                letterSpacing: '-0.05em',
              }}
            >
              Screech
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
              Your personalized guide to local events and activities
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Project Details */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Overview */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Overview</h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Screech is an automated newsletter service that curates and delivers the best local events and activities directly to your inbox. Using advanced algorithms and local data sources, Screech personalizes recommendations based on your interests, location, and schedule.
              </p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Key Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 border-2 border-mobi-burgundy/40 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-3 h-3 border-2 border-mobi-burgundy/60 rounded-full" />
                  </div>
                  <p className="text-lg text-white/80">Personalized event recommendations based on your interests and preferences</p>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 border-2 border-mobi-burgundy/40 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-3 h-3 border-2 border-mobi-burgundy/60 rounded-full" />
                  </div>
                  <p className="text-lg text-white/80">Smart scheduling that considers your calendar and availability</p>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 border-2 border-mobi-burgundy/40 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-3 h-3 border-2 border-mobi-burgundy/60 rounded-full" />
                  </div>
                  <p className="text-lg text-white/80">Integration with popular event platforms and local listings</p>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 border-2 border-mobi-burgundy/40 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-3 h-3 border-2 border-mobi-burgundy/60 rounded-full" />
                  </div>
                  <p className="text-lg text-white/80">Customizable delivery frequency and content preferences</p>
                </li>
              </ul>
            </div>

            {/* Technology */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Technology</h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Built with modern web technologies and AI-powered recommendation engines, Screech processes vast amounts of local event data to deliver relevant and timely suggestions. The platform uses natural language processing to understand event descriptions and match them with user preferences.
              </p>
            </div>

            {/* Back Button */}
            <div className="pt-8">
              <Link href="/digital">
                <motion.div 
                  className="inline-flex items-center text-white/90 hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <span className="mr-2 text-lg">Back to Digital Projects</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 