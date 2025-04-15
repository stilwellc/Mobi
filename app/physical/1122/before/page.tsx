import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Before Gallery | Project 1122 | Stilwell',
  description: 'Before photos of the historic home renovation.',
}

const photos = [
  {
    src: '/images/1122/before/1.jpg',
    alt: 'Before - Front Exterior',
  },
  {
    src: '/images/1122/before/2.jpg',
    alt: 'Before - Living Room',
  },
  {
    src: '/images/1122/before/3.jpg',
    alt: 'Before - Kitchen',
  },
  {
    src: '/images/1122/before/4.jpg',
    alt: 'Before - Bathroom',
  },
  {
    src: '/images/1122/before/5.jpg',
    alt: 'Before - Bedroom',
  },
  {
    src: '/images/1122/before/6.jpg',
    alt: 'Before - Backyard',
  },
]

export default function BeforeGallery() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Before Gallery</h1>
            <p className="text-xl text-zinc-400 mb-8">
              Original state of the property before renovation
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