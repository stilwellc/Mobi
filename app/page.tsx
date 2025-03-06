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
        
        {/* Large Geometric Shapes */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-mobi-burgundy/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
        
        {/* Decorative Lines */}
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-white/10" />

        {/* Minimal Logos */}
        <div className="absolute top-8 left-8 w-12 h-12 border-2 border-white/10 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/10 rounded-full" />
        </div>
        <div className="absolute top-8 right-8 w-12 h-12 border-2 border-white/10 rotate-45" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-2 border-white/10 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/10 rounded-full" />
        </div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-white/10 rotate-45" />
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6"
        style={{ y, opacity, scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            className="relative mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 border-2 border-white/10 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/10 rounded-full" />
              </div>
            </div>
            <h1 className="text-8xl sm:text-[12rem] md:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-mobi-burgundy to-white"
              style={{
                textShadow: '0 0 80px rgba(255,255,255,0.1)',
                letterSpacing: '-0.05em',
              }}
            >
              mobi.
            </h1>
          </motion.div>

          <p className="text-xl sm:text-2xl md:text-3xl text-white/80 font-light mb-16 max-w-3xl mx-auto leading-relaxed">
            where design transcends boundaries, creating experiences that shape the future of human interaction
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative"
            >
              <Link href="/physical" className="block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-mobi-cream/40">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(90,0,40,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-mobi-burgundy/40 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-mobi-burgundy/60 rounded-full" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-white text-center">physical</h3>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative"
            >
              <Link href="/digital" className="block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-mobi-cream/40">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(90,0,40,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-mobi-burgundy/40 rotate-45 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-mobi-burgundy/60 rotate-45" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-white text-center">digital</h3>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group relative"
            >
              <Link href="/social" className="block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-mobi-cream/40">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(90,0,40,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-mobi-burgundy/40 rounded-[30%] flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-mobi-burgundy/60 rounded-[30%]" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-white text-center">social</h3>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group relative"
            >
              <Link href="/store" className="block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-mobi-cream/40">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(90,0,40,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-mobi-burgundy/40 rounded-[60%] flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-mobi-burgundy/60 rounded-[60%]" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-white text-center">store</h3>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-8 h-8 border-2 border-white/10 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white/10 rounded-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Featured Section */}
      <section className="relative z-10 min-h-screen bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
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
          </motion.div>

          <div className="grid grid-cols-1 gap-16">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
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
                  <div className="absolute inset-0 p-12 flex flex-col justify-end">
                    <span className="text-sm text-white/90 font-medium tracking-wider uppercase mb-4">
                      featured project
                    </span>
                    <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                      project title {item}
                    </h3>
                    <p className="text-xl text-white/90 max-w-2xl">
                      a brief description of the project and its impact
                    </p>
                    <motion.div 
                      className="mt-8 inline-flex items-center text-white/90 hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <span className="mr-2 text-lg">explore project</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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