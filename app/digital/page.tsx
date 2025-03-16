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
                Digital Projects
              </h1>
            </div>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed">
              Where innovation meets imagination in the digital realm
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 md:hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                    <div className="absolute inset-0" style={{ 
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }} />
                    <div className="absolute top-4 right-4">
                      {project.title === "Screech" ? (
                        <motion.div 
                          className="w-2 h-2 bg-[#4a0011] rounded-full"
                          whileHover={{ scale: [null, 1.5] }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        />
                      ) : (
                        <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                      )}
                    </div>
                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end group-hover:translate-y-[-2px] transition-transform duration-300">
                      <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-2 group-hover:text-zinc-400 transition-colors">
                        {project.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-medium text-zinc-300 mb-2 group-hover:text-zinc-200 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-base text-zinc-500 max-w-xl group-hover:text-zinc-400 transition-colors">
                        {project.description}
                      </p>
                      <motion.div 
                        className="mt-4 inline-flex items-center text-zinc-500 group-hover:text-zinc-300 transition-colors"
                        whileHover={{ x: [null, 5] }}
                      >
                        <span className="mr-2 text-sm">View Details</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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