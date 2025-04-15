'use client';

import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    title: "Project 1122",
    description: "A groundbreaking exploration of form and function in physical space",
    category: "Installation",
    images: {
      before: "/images/1122/before.jpg",
      after: "/images/1122/after.jpg"
    }
  }
];

export default function PhysicalProjects() {
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
                Physical Projects
              </h1>
            </div>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed">
              Exploring the intersection of design and physical space
            </p>
          </div>
        </div>
      </div>

      {/* Project 1122 */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {projects.map((project) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Image */}
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all duration-300">
                    <img 
                      src={project.images.before} 
                      alt="Before blueprint"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60">
                      <span className="text-sm text-zinc-300">Before</span>
                    </div>
                  </div>
                  
                  {/* After Image */}
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all duration-300">
                    <img 
                      src={project.images.after} 
                      alt="After blueprint"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60">
                      <span className="text-sm text-zinc-300">After</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-medium text-zinc-300 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-base text-zinc-500 max-w-xl">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 