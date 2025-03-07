'use client';

import React, { useEffect, useRef } from 'react';
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
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Main Content */}
      <div 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6"
      >
        <div
          className="text-center max-w-5xl mx-auto -mt-20 sm:-mt-32"
        >
          <div
            className="relative mb-8 sm:mb-12"
          >
            <div className="absolute -top-16 sm:-top-24 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-white/10 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/10 rounded-full" />
              </div>
            </div>
            <h1 className="text-7xl sm:text-[12rem] md:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-mobi-burgundy to-white flex items-center justify-center gap-4"
              style={{
                textShadow: '0 0 80px rgba(255,255,255,0.1)',
                letterSpacing: '-0.05em',
              }}
            >
              mobi.
            </h1>
          </div>

          <p className="text-lg sm:text-2xl md:text-3xl text-white/80 font-light mb-12 sm:mb-16 max-w-3xl mx-auto leading-relaxed px-4">
            where design transcends boundaries, creating experiences that shape the future of human interaction
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 px-2">
            <div className="group relative">
              <Link href="/physical" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-mobi-cream/40">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(90,0,40,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-bold text-black absolute left-6">physical</div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-mobi-burgundy/40 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-mobi-burgundy/60 rounded-full" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-white text-center hidden md:block">physical</h3>
              </Link>
            </div>

            <div className="group relative">
              <Link href="/digital" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-mobi-cream/40">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(90,0,40,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-bold text-black absolute left-6">digital</div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-mobi-burgundy/40 rotate-45 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-mobi-burgundy/60 rotate-45" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-white text-center hidden md:block">digital</h3>
              </Link>
            </div>

            <div className="group relative">
              <Link href="/social" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-mobi-cream/40">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(90,0,40,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-bold text-black absolute left-6">social</div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-mobi-burgundy/40 rounded-[30%] flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-mobi-burgundy/60 rounded-[30%]" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-white text-center hidden md:block">social</h3>
              </Link>
            </div>

            <div className="group relative">
              <Link href="/store" className="block">
                <div className="relative aspect-[6/1] md:aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-mobi-cream/40">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(90,0,40,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                    <div className="text-xl md:hidden font-bold text-black absolute left-6">store</div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-mobi-burgundy/40 rounded-[60%] flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-mobi-burgundy/60 rounded-[60%]" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-white text-center hidden md:block">store</h3>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/10 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <section className="relative z-10 min-h-screen bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-20"
          >
            <div className="relative inline-block mb-8">
              <div className="w-12 h-12 border-2 border-white/10 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/10 rounded-full" />
              </div>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-mobi-burgundy mb-8">
              featured work
            </h2>
            <p className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto">
              explore our latest projects that push the boundaries of design and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16">
            <div className="group relative">
              <Link href="/digital/screech">
                <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-black/80" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2C8 2 4 6 4 10c0 4 4 8 8 8s8-4 8-8c0-4-4-8-8-8z" />
                        <path d="M12 6c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" />
                        <path d="M12 14c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                        <path d="M8 8c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                        <path d="M16 8c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute inset-0 p-12 sm:p-12 p-6">
                    <span className="text-xs sm:text-sm text-white/90 font-medium tracking-wider uppercase mb-2 sm:mb-4">
                      featured project
                    </span>
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
                      Screech
                    </h3>
                    <p className="text-base sm:text-xl text-white/90 max-w-2xl">
                      Stay in the Know, Powered by AI – Your Smart Guide to Local Events!
                    </p>
                    <div 
                      className="mt-4 sm:mt-8 inline-flex items-center text-white/90 hover:text-white transition-colors"
                    >
                      <span className="mr-2 text-base sm:text-lg">explore project</span>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {[1, 2].map((item, index) => (
              <div
                key={item}
                className="group relative"
              >
                <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-mobi-burgundy/20 to-black/80" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 border-2 border-white/10 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/10 rounded-full" />
                    </div>
                  </div>
                  <div className="absolute inset-0 p-12 sm:p-12 p-6">
                    <span className="text-xs sm:text-sm text-white/90 font-medium tracking-wider uppercase mb-2 sm:mb-4">
                      featured project
                    </span>
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
                      project title {item}
                    </h3>
                    <p className="text-base sm:text-xl text-white/90 max-w-2xl">
                      a brief description of the project and its impact
                    </p>
                    <div 
                      className="mt-4 sm:mt-8 inline-flex items-center text-white/90 hover:text-white transition-colors"
                    >
                      <span className="mr-2 text-base sm:text-lg">explore project</span>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
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