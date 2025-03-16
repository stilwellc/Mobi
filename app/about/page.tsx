'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  const sections = [
    {
      title: "About Mobi",
      content: "Mobi draws inspiration from the Mobius strip, a symbol of infinity and seamless continuity. Just as the Mobius strip weaves unexpected elements into a continuous flow, Mobi integrates diverse design principles—modern aesthetics, sustainable practices, and cutting-edge technology—into a harmonious, fluid experience that augments life, not just living spaces.\n\nWe believe design goes beyond the home. It is about enhancing the way we live, work, and interact with the world around us. Our goal is to create design that flows effortlessly through all aspects of life—whether in the home, the workplace, or beyond—creating seamless, innovative experiences that elevate your daily life.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      )
    },
    {
      title: "What We Do",
      content: "At Mobi, we blend technology, sustainability, and design to create environments that amplify human potential. Our designs, inspired by the infinite flow of the Mobius strip, continuously adapt to the needs of individuals, communities, and organizations. We offer solutions that not only meet today's demands but anticipate tomorrow's possibilities.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    }
  ];

  const approaches = [
    {
      title: "Modern Design",
      content: "We blend cutting-edge design with timeless elegance, focusing on spaces and experiences that are both contemporary and enduring, just like the Mobius strip that loops endlessly and beautifully.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    {
      title: "Optimized Experiences",
      content: "Whether it's your living room, office, or public space, Mobi's designs optimize functionality, comfort, and aesthetics. We use advanced technology to create spaces that maximize efficiency while enhancing the human experience—everything flows naturally, seamlessly.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Balanced Innovation",
      content: "We approach design with balance—integrating smart technology, sustainable practices, and timeless aesthetics into a harmonious whole. Mobi's innovation augments your life, enhancing well-being, productivity, and connectivity.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    }
  ];

  const services = [
    {
      title: "Augmenting Everyday Life",
      content: "Mobi creates designs that amplify human potential. From smart homes to collaborative workspaces, our design solutions support and enhance the way you live, work, and connect with others.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Sustainable Innovation",
      content: "Drawing from the Mobius strip's seamless integration, our sustainable design solutions seamlessly incorporate eco-friendly materials and energy-efficient technologies into all spaces, reducing your environmental footprint without compromising style or comfort.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Smart Integration",
      content: "Just as the Mobius strip is a continuous loop, we integrate technology in a way that enhances your lifestyle without disrupting it. From automated systems that enhance comfort to innovative tools that make life easier, our design flows with you.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Community and Connectivity",
      content: "Mobi believes design should foster connection. We design spaces that bring people together, whether it's at home, in the office, or in public spaces, fostering collaboration, creativity, and community.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Personalized Design Solutions",
      content: "Every space, and every life, is unique. Mobi leverages technology to create customized design solutions that adapt to your needs and evolve with you, bringing life to your vision.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.015) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        <div className="relative z-10 pt-16 pb-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center space-x-4 mb-4">
              <motion.div 
                className="w-2 h-2 bg-[#4a0011] rounded-full"
                whileHover={{ scale: [null, 1.5] }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-300">
                About Us
              </h1>
            </div>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed">
              Modern, Optimized, Balanced Innovation
            </p>
            <div className="mt-6">
              <Link href="/" className="inline-flex items-center text-zinc-600 hover:text-zinc-400 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm">Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Introduction Sections */}
          {sections.map((section, index) => (
            <div key={section.title} className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-8 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
              <div className="absolute inset-0" style={{ 
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                backgroundSize: '16px 16px'
              }} />
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div 
                    className="text-zinc-400"
                    whileHover={{ scale: [null, 1.2] }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {section.icon}
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-medium text-zinc-300">
                    {section.title}
                  </h2>
                </div>
                <div className="prose prose-invert prose-zinc max-w-none">
                  {section.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-zinc-400 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Our Approach */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-medium text-zinc-300">Our Approach</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {approaches.map((approach, index) => (
                <div key={approach.title} className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="relative">
                    <div className="text-zinc-400 mb-4">
                      {approach.icon}
                    </div>
                    <h3 className="text-lg font-medium text-zinc-300 mb-2">
                      {approach.title}
                    </h3>
                    <p className="text-zinc-500">
                      {approach.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How We Help */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-medium text-zinc-300">How We Help</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div key={service.title} className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }} />
                  <div className="relative">
                    <div className="text-zinc-400 mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-medium text-zinc-300 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-zinc-500">
                      {service.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Section */}
          <div className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
              backgroundSize: '16px 16px'
            }} />
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <motion.div 
                  className="w-2 h-2 bg-[#4a0011] rounded-full"
                  whileHover={{ scale: [null, 1.5] }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
                <h2 className="text-xl sm:text-2xl font-medium text-zinc-300">
                  Our Vision
                </h2>
              </div>
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-400 leading-relaxed">
                  To redefine the way we experience design by weaving together sustainability, modern aesthetics, and cutting-edge technology in a way that enhances life at every level. Like the Mobius strip, our designs aim to create a seamless, continuous flow, augmenting the spaces where we live, work, and play.
                </p>
                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <p className="text-zinc-400 leading-relaxed">
                    Mobi is about creating design that goes beyond buildings or homes. It's about augmenting life through spaces that are not only functional but inspiring, sustainable, and technologically advanced. Just as the Mobius strip connects two sides into one, Mobi designs seamless, innovative environments that continuously evolve to enhance your experience of life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 