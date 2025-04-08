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
    title: "Hot Brush",
    description: "Track the hottest artists to invest in with real-time market data.",
    href: "/digital/hotbrush",
    icon: "🎨",
    color: "bg-[#800020]",
  }
];

const socialSpaces = [
  {
    platform: "TikTok",
    handle: "@mobi",
    mission: "Sharing curated vintage finds and design inspiration",
    followers: "10K",
    href: "https://tiktok.com/@mobi",
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.95 4.37 6.37 6.37 0 0 0 1.83-4.37V7.83a7.8 7.8 0 0 0 3.81.94V5.33a4.79 4.79 0 0 1-1.95-.47z"/>
      </svg>
    )
  },
  {
    platform: "Instagram",
    handle: "@mobi",
    mission: "Visual stories of exceptional vintage pieces",
    followers: "25K",
    href: "https://instagram.com/mobi",
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    platform: "X",
    handle: "@mobi",
    mission: "Latest updates and vintage market insights",
    followers: "15K",
    href: "https://x.com/mobi",
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
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
          <div className="max-w-3xl mx-auto space-y-16">
            {/* Screech Project */}
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link href={project.href}>
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 md:hover:border-zinc-800 transition-all duration-300 md:hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                    <div className="absolute inset-0" style={{ 
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }} />
                    <div className="absolute top-4 right-4">
                      <motion.div 
                        className="w-2 h-2 bg-[#4a0011] rounded-full"
                        whileHover={{ scale: [null, 1.5] }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      />
                    </div>
                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end md:group-hover:translate-y-[-2px] transition-transform duration-300">
                      <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-2 md:group-hover:text-zinc-400 transition-colors">
                        {project.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-medium text-zinc-300 mb-2 md:group-hover:text-zinc-200 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-base text-zinc-500 max-w-xl md:group-hover:text-zinc-400 transition-colors">
                        {project.description}
                      </p>
                      <motion.div 
                        className="mt-4 inline-flex items-center text-zinc-500 md:group-hover:text-zinc-300 transition-colors"
                        whileHover={{ x: [null, 5] }}
                      >
                        <span className="mr-2 text-sm">View Details</span>
                        <svg className="w-4 h-4 md:group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Social Spaces */}
            <div className="pt-8">
              <h2 className="text-2xl font-medium text-zinc-300 mb-8">Social Spaces</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {socialSpaces.map((social) => (
                  <motion.a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="group block"
                  >
                    <div className="relative p-6 rounded-lg bg-zinc-950 border border-zinc-900 md:hover:border-zinc-800 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <social.icon className="h-6 w-6 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">{social.followers}</span>
                          <span className="text-xs text-zinc-600">followers</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-zinc-300 mb-2 group-hover:text-zinc-200 transition-colors">
                        {social.platform}
                      </h3>
                      <p className="text-sm text-zinc-500 mb-4 group-hover:text-zinc-400 transition-colors">
                        {social.mission}
                      </p>
                      <div className="flex items-center text-zinc-500 text-sm group-hover:text-zinc-300 transition-colors">
                        <span>{social.handle}</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 