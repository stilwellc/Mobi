'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

const icons = {
  'physical': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21V3h18v18M3 15h18M12 15v6M7 3v6m10-6v6" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  'digital': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12h18M12 3v18M15 3l-3 3-3-3m-3 18l3-3 3 3m6-6l-3 3 3 3M6 9l3 3-3 3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  'social': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8a3 3 0 100-6 3 3 0 000 6zM7 15a3 3 0 100-6 3 3 0 000 6zM17 22a3 3 0 100-6 3 3 0 000 6zM14 7l-4 4m0 2l4 4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  'shop': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h2l.6 3m0 0L7 15h10l2-6H5.6z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="16" cy="18" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  'about': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 11.5v5M12 7.51l.01-.011M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

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
          className="text-center max-w-[90rem] mx-auto"
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
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4 px-2">
            {[
              { href: '/physical', title: 'physical projects', icon: 'physical' },
              { href: '/digital', title: 'digital projects', icon: 'digital' },
              { href: '/social', title: 'social spaces', icon: 'social' },
              { href: '/shop', title: 'shop', icon: 'shop' },
              { href: '/about', title: 'about us', icon: 'about' }
            ].map((item) => (
              <div key={item.href} className="group relative">
                <Link href={item.href} className="block">
                  <div className="relative aspect-[6/1] md:aspect-square rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 md:hover:border-zinc-800 transition-all duration-300 md:hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                    <div className="absolute inset-0" style={{ 
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center px-6 md:px-0">
                      <div className="text-xl md:hidden font-medium text-zinc-400 absolute left-6">{item.title}</div>
                      <motion.div 
                        className="md:hidden w-2 h-2 bg-[#4a0011] rounded-full absolute right-6"
                        whileHover={{ scale: [null, 1.5] }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      />
                      <motion.div 
                        className="hidden md:flex text-zinc-500 group-hover:text-zinc-400 transition-colors"
                        whileHover={{ scale: [null, 1.2] }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {icons[item.icon as keyof typeof icons]}
                      </motion.div>
                    </div>
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-zinc-600 text-center hidden md:block md:group-hover:text-zinc-400 transition-colors">{item.title}</h3>
                </Link>
              </div>
            ))}
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
          </div>
        </div>
      </section>
    </div>
  );
} 