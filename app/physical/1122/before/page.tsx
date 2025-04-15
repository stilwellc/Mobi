'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react'

const roomGroups = {
  kitchen: [
    { src: '/images/1122/before/kitchen1.webp', alt: 'Kitchen 1 Before' },
    { src: '/images/1122/before/kitchen2.webp', alt: 'Kitchen 2 Before' },
    { src: '/images/1122/before/kitchen3.webp', alt: 'Kitchen 3 Before' },
    { src: '/images/1122/before/kitchen4.webp', alt: 'Kitchen 4 Before' }
  ],
  dining: [
    { src: '/images/1122/before/diningroom1.webp', alt: 'Dining Room 1 Before' },
    { src: '/images/1122/before/diningroom2.webp', alt: 'Dining Room 2 Before' },
    { src: '/images/1122/before/diningroom3.webp', alt: 'Dining Room 3 Before' }
  ],
  living: [
    { src: '/images/1122/before/Livingroom1.webp', alt: 'Living Room 1 Before' },
    { src: '/images/1122/before/livingroom2.webp', alt: 'Living Room 2 Before' },
    { src: '/images/1122/before/livingroom3.webp', alt: 'Living Room 3 Before' },
    { src: '/images/1122/before/livingroom4.webp', alt: 'Living Room 4 Before' }
  ],
  bedroom: [
    { src: '/images/1122/before/bedroom1.webp', alt: 'Bedroom 1 Before' },
    { src: '/images/1122/before/bedroom2.webp', alt: 'Bedroom 2 Before' },
    { src: '/images/1122/before/bedroom3.webp', alt: 'Bedroom 3 Before' },
    { src: '/images/1122/before/bedroom4.webp', alt: 'Bedroom 4 Before' }
  ],
  office: [
    { src: '/images/1122/before/office1.webp', alt: 'Office 1 Before' },
    { src: '/images/1122/before/office2.webp', alt: 'Office 2 Before' },
    { src: '/images/1122/before/office3.webp', alt: 'Office 3 Before' }
  ],
  bathroom: [
    { src: '/images/1122/before/bathroom1.webp', alt: 'Bathroom Before' }
  ]
};

const roomTitles = {
  kitchen: 'Kitchen',
  dining: 'Dining Room',
  living: 'Living Room',
  bedroom: 'Bedroom',
  office: 'Office',
  bathroom: 'Bathroom'
};

export default function BeforeGallery() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({
    kitchen: 0,
    dining: 0,
    living: 0,
    bedroom: 0,
    office: 0,
    bathroom: 0,
  });

  const handlePrevious = (roomType: string) => {
    setCarouselIndices(prev => ({
      ...prev,
      [roomType]: Math.max(0, prev[roomType] - 1)
    }));
  };

  const handleNext = (roomType: string, maxIndex: number) => {
    setCarouselIndices(prev => ({
      ...prev,
      [roomType]: Math.min(maxIndex, prev[roomType] + 1)
    }));
  };

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
          {Object.entries(roomGroups).map(([roomType, photos], groupIndex) => {
            const startIdx = carouselIndices[roomType];
            const visiblePhotos = photos.slice(startIdx, startIdx + 3);
            const maxIndex = Math.max(0, photos.length - 3);
            const showNavigation = photos.length > 3;

            return (
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
                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {visiblePhotos.map((photo, index) => (
                        <motion.div
                          key={photo.src}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="relative rounded-lg overflow-hidden bg-black border border-zinc-900 hover:border-zinc-800 transition-all duration-300 cursor-pointer"
                          onClick={() => setSelectedImage(photo)}
                        >
                          <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              className="object-contain p-4 rounded-lg"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  {showNavigation && (
                    <>
                      <button
                        onClick={() => handlePrevious(roomType)}
                        className={`absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-900/50 hover:bg-zinc-900 transition-colors ${
                          startIdx === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                        }`}
                        disabled={startIdx === 0}
                      >
                        <ChevronLeft className="w-6 h-6 text-zinc-300" />
                      </button>
                      <button
                        onClick={() => handleNext(roomType, maxIndex)}
                        className={`absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-900/50 hover:bg-zinc-900 transition-colors ${
                          startIdx >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                        }`}
                        disabled={startIdx >= maxIndex}
                      >
                        <ChevronRight className="w-6 h-6 text-zinc-300" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

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

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 