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
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Main Content */}
      <div 
        className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-20 sm:justify-center sm:pt-0 px-4 sm:px-6"
      >
        <div
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            className="flex justify-center items-center mb-6 sm:mb-10"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(128,0,32,0.1))',
            }}
          >
            <div className="relative w-[160px] sm:w-[400px] md:w-[600px] h-[48px] sm:h-[120px] md:h-[180px] overflow-hidden">
              <Image
                src="/images/mobi-logo.png"
                alt="mobi."
                width={800}
                height={320}
                className="absolute top-[-5%] w-full h-[110%] object-cover opacity-90"
                priority
                quality={100}
              />
            </div>
          </motion.div>

          <p className="text-base sm:text-lg md:text-xl text-zinc-500 font-normal tracking-tight mb-6 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            where design transcends boundaries, creating experiences that shape the future of human interaction
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 px-2">
            <div className="group relative">
              <Link href="/physical" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 md:hover:border-zinc-800 transition-all duration-300 md:hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-medium text-zinc-400 absolute left-6">physical projects</div>
                    <motion.div 
                      className="w-2 h-2 bg-[#4a0011] rounded-full md:relative absolute right-6 md:right-auto"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-medium text-zinc-600 text-center hidden md:block md:group-hover:text-zinc-400 transition-colors">physical projects</h3>
              </Link>
            </div>

            <div className="group relative">
              <Link href="/digital" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 md:hover:border-zinc-800 transition-all duration-300 md:hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-bl from-zinc-950/90 to-black/60" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-medium text-zinc-400 absolute left-6">digital projects</div>
                    <motion.div 
                      className="w-2 h-2 bg-[#4a0011] rounded-full md:relative absolute right-6 md:right-auto"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-medium text-zinc-600 text-center hidden md:block md:group-hover:text-zinc-400 transition-colors">digital projects</h3>
              </Link>
            </div>

            <div className="group relative">
              <Link href="/social" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 md:hover:border-zinc-800 transition-all duration-300 md:hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/90 to-black/60" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-medium text-zinc-400 absolute left-6">social spaces</div>
                    <motion.div 
                      className="w-2 h-2 bg-[#4a0011] rounded-full md:relative absolute right-6 md:right-auto"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-medium text-zinc-600 text-center hidden md:block md:group-hover:text-zinc-400 transition-colors">social spaces</h3>
              </Link>
            </div>

            <div className="group relative">
              <Link href="/shop" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 md:hover:border-zinc-800 transition-all duration-300 md:hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-tl from-zinc-950/90 to-black/60" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-medium text-zinc-400 absolute left-6">shop</div>
                    <motion.div 
                      className="w-2 h-2 bg-[#4a0011] rounded-full md:relative absolute right-6 md:right-auto"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-medium text-zinc-600 text-center hidden md:block md:group-hover:text-zinc-400 transition-colors">shop</h3>
              </Link>
            </div>

            <div className="group relative">
              <Link href="/about" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 md:hover:border-zinc-800 transition-all duration-300 md:hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-tl from-zinc-950/90 to-black/60" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-medium text-zinc-400 absolute left-6">about us</div>
                    <motion.div 
                      className="w-2 h-2 bg-[#4a0011] rounded-full md:relative absolute right-6 md:right-auto"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-medium text-zinc-600 text-center hidden md:block md:group-hover:text-zinc-400 transition-colors">about us</h3>
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
      <section className="relative z-10 min-h-screen bg-black py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-300 mb-4">
              Featured Work
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 font-normal max-w-2xl mx-auto leading-relaxed">
              explore our latest projects that push the boundaries of design and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:gap-12">
            <div className="group relative">
              <Link href="/digital/screech">
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 md:hover:border-zinc-800 transition-all duration-300 md:hover:scale-[1.01]">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 via-black/80 to-zinc-950/60" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <motion.div 
                    className="absolute top-4 right-4 w-2 h-2 bg-[#4a0011] rounded-full"
                    whileHover={{ scale: [null, 1.5] }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  />
                  <div className="absolute inset-0 p-6 sm:p-8 md:group-hover:translate-y-[-2px] transition-transform duration-300">
                    <span className="text-xs text-zinc-600 font-medium tracking-wider uppercase mb-2 block md:group-hover:text-zinc-500 transition-colors">
                      featured project
                    </span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-zinc-400 mb-4 md:group-hover:text-zinc-300 transition-colors">
                      Screech
                    </h3>
                    <p className="text-base sm:text-lg text-zinc-600 max-w-2xl md:group-hover:text-zinc-500 transition-colors">
                      Stay in the Know, Powered by AI – Your Smart Guide to Local Events!
                    </p>
                    <motion.div 
                      className="mt-6 inline-flex items-center text-zinc-600 md:hover:text-zinc-400 transition-colors group/arrow"
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
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="absolute top-4 right-4">
                    <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                  </div>
                  <div className="absolute inset-0 p-6 sm:p-8">
                    <span className="text-xs text-zinc-600 font-medium tracking-wider uppercase mb-2">
                      featured project
                    </span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-zinc-500 mb-4">
                      project title {item}
                    </h3>
                    <p className="text-base sm:text-lg text-zinc-600 max-w-2xl">
                      a brief description of the project and its impact
                    </p>
                    <motion.div 
                      className="mt-6 inline-flex items-center text-zinc-600 hover:text-zinc-400 transition-colors group"
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