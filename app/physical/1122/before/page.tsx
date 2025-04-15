'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const roomGroups = {
  bathroom: [
    { src: '/images/1122/before/bathroom1.webp', alt: 'Bathroom Before' }
  ],
  bedroom: [
    { src: '/images/1122/before/bedroom1.webp', alt: 'Bedroom 1 Before' },
    { src: '/images/1122/before/bedroom2.webp', alt: 'Bedroom 2 Before' },
    { src: '/images/1122/before/bedroom3.webp', alt: 'Bedroom 3 Before' },
    { src: '/images/1122/before/bedroom4.webp', alt: 'Bedroom 4 Before' }
  ],
  dining: [
    { src: '/images/1122/before/diningroom1.webp', alt: 'Dining Room 1 Before' },
    { src: '/images/1122/before/diningroom2.webp', alt: 'Dining Room 2 Before' },
    { src: '/images/1122/before/diningroom3.webp', alt: 'Dining Room 3 Before' }
  ],
  kitchen: [
    { src: '/images/1122/before/kitchen1.webp', alt: 'Kitchen 1 Before' },
    { src: '/images/1122/before/kitchen2.webp', alt: 'Kitchen 2 Before' },
    { src: '/images/1122/before/kitchen3.webp', alt: 'Kitchen 3 Before' },
    { src: '/images/1122/before/kitchen4.webp', alt: 'Kitchen 4 Before' }
  ],
  living: [
    { src: '/images/1122/before/Livingroom1.webp', alt: 'Living Room 1 Before' },
    { src: '/images/1122/before/livingroom2.webp', alt: 'Living Room 2 Before' },
    { src: '/images/1122/before/livingroom3.webp', alt: 'Living Room 3 Before' },
    { src: '/images/1122/before/livingroom4.webp', alt: 'Living Room 4 Before' }
  ],
  office: [
    { src: '/images/1122/before/office1.webp', alt: 'Office 1 Before' },
    { src: '/images/1122/before/office2.webp', alt: 'Office 2 Before' },
    { src: '/images/1122/before/office3.webp', alt: 'Office 3 Before' }
  ]
};

const roomTitles = {
  bathroom: 'Bathroom',
  bedroom: 'Bedroom',
  dining: 'Dining Room',
  kitchen: 'Kitchen',
  living: 'Living Room',
  office: 'Office'
};

export default function BeforeGallery() {
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
                Before Gallery
              </h1>
            </div>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed">
              Original state of the space before transformation
            </p>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(roomGroups).map(([roomType, photos], groupIndex) => (
            <div key={roomType} className="mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                viewport={{ once: true }}
                className="text-2xl font-medium text-zinc-300 mb-6"
              >
                {roomTitles[roomType as keyof typeof roomTitles]}
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.src}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (groupIndex * 0.1) + (index * 0.05) }}
                    viewport={{ once: true }}
                    className="relative rounded-lg overflow-hidden bg-black border border-zinc-900 hover:border-zinc-800 transition-all duration-300"
                  >
                    <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8">
            <Link 
              href="/physical/1122"
              className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project 1122
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 