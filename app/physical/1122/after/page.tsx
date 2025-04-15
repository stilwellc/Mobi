import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'After Gallery | Project 1122 | Stilwell',
  description: 'After photos of the historic home renovation.',
}

const photos = [
  {
    src: '/images/1122/after/1.jpg',
    alt: 'After - Front Exterior',
  },
  {
    src: '/images/1122/after/2.jpg',
    alt: 'After - Living Room',
  },
  {
    src: '/images/1122/after/3.jpg',
    alt: 'After - Kitchen',
  },
  {
    src: '/images/1122/after/4.jpg',
    alt: 'After - Bathroom',
  },
  {
    src: '/images/1122/after/5.jpg',
    alt: 'After - Bedroom',
  },
  {
    src: '/images/1122/after/6.jpg',
    alt: 'After - Backyard',
  },
]

export default function AfterGallery() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/physical/1122"
            className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project 1122
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">After Gallery</h1>
            <p className="text-xl text-zinc-400 mb-8">
              Transformed spaces after the renovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-black"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 