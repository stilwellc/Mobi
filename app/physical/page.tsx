'use client';

import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    title: "Urban Furniture Collection",
    description: "A series of modular furniture pieces that adapt to urban living spaces",
    category: "Furniture",
    image: "/images/urban-furniture.jpg"
  },
  {
    title: "Sustainable Architecture",
    description: "Eco-friendly building designs that harmonize with nature",
    category: "Architecture",
    image: "/images/sustainable-architecture.jpg"
  },
  {
    title: "Product Design",
    description: "Innovative product designs that blend aesthetics with functionality",
    category: "Products",
    image: "/images/product-design.jpg"
  }
];

export default function PhysicalProjects() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
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
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-[#EDE8D0] mb-8">
                Physical Projects
              </h1>
              <p className="text-xl sm:text-2xl text-[#EDE8D0]/80 font-light tracking-tight max-w-2xl mx-auto leading-relaxed">
                Where form meets function in the physical world
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
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-mobi-cream/80">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(90,0,40,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 border-2 border-white/10 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-white/10 rounded-full" />
                    </div>
                  </div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <span className="text-xs text-mobi-burgundy/70 font-medium tracking-wider uppercase mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-mobi-burgundy mb-2">
                      {project.title}
                    </h3>
                    <p className="text-base text-mobi-burgundy/90 max-w-xl">
                      {project.description}
                    </p>
                    <motion.div 
                      className="mt-6 inline-flex items-center text-mobi-burgundy/90 hover:text-mobi-burgundy transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <span className="mr-2 text-sm">Explore Project</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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