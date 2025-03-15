'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const projects = [
  {
    title: "Screech",
    description: "An automated newsletter that curates the best local events and activities in your city",
    category: "Newsletter",
    image: "/images/screech.jpg",
    href: "/digital/screech"
  },
  {
    title: "Digital Platform",
    description: "An immersive digital platform that redefines user experience",
    category: "Web",
    image: "/images/digital-platform.jpg"
  },
  {
    title: "Mobile App",
    description: "A revolutionary mobile application that transforms daily life",
    category: "Mobile",
    image: "/images/mobile-app.jpg"
  },
  {
    title: "Interactive Experience",
    description: "Engaging interactive experiences that captivate and inspire",
    category: "Interactive",
    image: "/images/interactive.jpg"
  }
];

export default function DigitalProjects() {
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
                Digital Projects
              </h1>
              <p className="text-lg text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed">
                Where innovation meets imagination in the digital realm
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link href={project.href || '#'}>
                  <div className="relative rounded-lg overflow-hidden bg-zinc-900 p-6 sm:p-8 group hover:scale-[1.01] transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-black/10 to-zinc-900/30 opacity-50" />
                    <div className="absolute inset-0" style={{ 
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }} />
                    <div className="absolute top-4 right-4">
                      {project.title === "Screech" ? (
                        <div className="w-2 h-2 bg-mobi-burgundy rounded-full" />
                      ) : (
                        <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                      )}
                    </div>
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-base text-zinc-400 max-w-xl">
                        {project.description}
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
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 