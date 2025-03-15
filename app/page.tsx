'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0.8]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-hidden">
      {/* Geometric Background */}
      <div className="absolute inset-0">
        {/* Dot Grid */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Main Content */}
      <div 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6"
      >
        <div
          className="text-center max-w-5xl mx-auto -mt-20 sm:-mt-32"
        >
          <motion.div
            className="flex justify-center items-center mb-12"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.05))',
            }}
          >
            <div className="relative w-[280px] sm:w-[480px] md:w-[800px] h-[84px] sm:h-[144px] md:h-[240px] overflow-hidden">
              <Image
                src="/images/mobi-logo.png"
                alt="mobi."
                width={800}
                height={320}
                className="absolute top-[-5%] w-full h-[110%] object-cover"
                priority
                quality={100}
              />
            </div>
          </motion.div>

          <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 font-normal tracking-tight mb-16 max-w-3xl mx-auto leading-relaxed px-4">
            where design transcends boundaries, creating experiences that shape the future of human interaction
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 px-2">
            <div className="group relative">
              <Link href="/physical" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 md:hover:border-zinc-700 transition-all duration-300 md:hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 to-black/40" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-medium text-white absolute left-6">physical projects</div>
                    <motion.div 
                      className="w-2 h-2 bg-mobi-burgundy rounded-full md:relative absolute right-6 md:right-auto"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-medium text-zinc-400 text-center hidden md:block md:group-hover:text-white transition-colors">physical projects</h3>
              </Link>
            </div>

            <div className="group relative">
              <Link href="/digital" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 md:hover:border-zinc-700 transition-all duration-300 md:hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-bl from-zinc-900/80 to-black/40" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-medium text-white absolute left-6">digital projects</div>
                    <motion.div 
                      className="w-2 h-2 bg-mobi-burgundy rounded-full md:relative absolute right-6 md:right-auto"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-medium text-zinc-400 text-center hidden md:block md:group-hover:text-white transition-colors">digital projects</h3>
              </Link>
            </div>

            <div className="group relative">
              <Link href="/social" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 md:hover:border-zinc-700 transition-all duration-300 md:hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/80 to-black/40" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-medium text-white absolute left-6">social spaces</div>
                    <motion.div 
                      className="w-2 h-2 bg-mobi-burgundy rounded-full md:relative absolute right-6 md:right-auto"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-medium text-zinc-400 text-center hidden md:block md:group-hover:text-white transition-colors">social spaces</h3>
              </Link>
            </div>

            <div className="group relative">
              <Link href="/store" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 md:hover:border-zinc-700 transition-all duration-300 md:hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-tl from-zinc-900/80 to-black/40" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-medium text-white absolute left-6">design store</div>
                    <motion.div 
                      className="w-2 h-2 bg-mobi-burgundy rounded-full md:relative absolute right-6 md:right-auto"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-medium text-zinc-400 text-center hidden md:block md:group-hover:text-white transition-colors">design store</h3>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-2 h-2 bg-zinc-700 rounded-full" />
        </div>
      </div>

      {/* Featured Section */}
      <section className="relative z-10 min-h-screen bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-6">
              Featured Work
            </h2>
            <p className="text-lg text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed">
              explore our latest projects that push the boundaries of design and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16">
            <div className="group relative">
              <Link href="/digital/screech">
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 md:hover:border-zinc-700 transition-all duration-300 md:hover:scale-[1.01]">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 via-black/60 to-zinc-900/40" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <motion.div 
                    className="absolute top-4 right-4 w-2 h-2 bg-mobi-burgundy rounded-full"
                    whileHover={{ scale: [null, 1.5] }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  />
                  <div className="absolute inset-0 p-8 sm:p-12 md:group-hover:translate-y-[-2px] transition-transform duration-300">
                    <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-2 block md:group-hover:text-zinc-400 transition-colors">
                      featured project
                    </span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4 md:group-hover:text-[#EDE8D0] transition-colors">
                      Screech
                    </h3>
                    <p className="text-base sm:text-lg text-zinc-400 max-w-2xl md:group-hover:text-zinc-300 transition-colors">
                      Stay in the Know, Powered by AI – Your Smart Guide to Local Events!
                    </p>
                    <motion.div 
                      className="mt-6 inline-flex items-center text-zinc-400 md:hover:text-[#EDE8D0] transition-colors group/arrow"
                      whileHover={{ x: [null, 5] }}
                    >
                      <span className="mr-2 text-sm">View Details</span>
                      <svg className="w-4 h-4 md:group-hover/arrow:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </div>

            {[1, 2].map((item, index) => (
              <div
                key={item}
                className="group relative"
              >
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute top-4 right-4">
                    <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                  </div>
                  <div className="absolute inset-0 p-8 sm:p-12">
                    <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-2">
                      featured project
                    </span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4">
                      project title {item}
                    </h3>
                    <p className="text-base sm:text-lg text-zinc-400 max-w-2xl">
                      a brief description of the project and its impact
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 