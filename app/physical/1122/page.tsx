'use client';

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function Project1122() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/physical"
            className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Physical Projects
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Project 1122</h1>
            <p className="text-xl text-zinc-400 mb-8">
              A complete renovation of a historic home in the heart of the city.
            </p>
            <div className="flex flex-col gap-8">
              <Link href="/physical/1122/before">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-full aspect-[3/2] overflow-hidden rounded-lg border border-zinc-800 bg-black"
                >
                  <Image
                    src="/images/1122/blueprint-before.jpg"
                    alt="Before Blueprint"
                    fill
                    className="object-contain p-4"
                  />
                  <div className="absolute bottom-4 left-4 bg-[#800020] text-white px-4 py-2 rounded-lg">
                    Before Gallery
                  </div>
                </motion.div>
              </Link>

              <Link href="/physical/1122/after">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-full aspect-[3/2] overflow-hidden rounded-lg border border-zinc-800 bg-black"
                >
                  <Image
                    src="/images/1122/blueprint-after.jpg"
                    alt="After Blueprint"
                    fill
                    className="object-contain p-4"
                  />
                  <div className="absolute bottom-4 left-4 bg-[#800020] text-white px-4 py-2 rounded-lg">
                    After Gallery
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Scope</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li>• Complete interior renovation</li>
                  <li>• Structural updates</li>
                  <li>• Modern amenities integration</li>
                  <li>• Energy efficiency improvements</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Timeline</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li>• Planning: 3 months</li>
                  <li>• Construction: 9 months</li>
                  <li>• Final touches: 1 month</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-semibold mb-4">Modern Design</h3>
                <p className="text-zinc-400">
                  Contemporary aesthetics while preserving historic character
                </p>
              </div>
              <div className="p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-semibold mb-4">Smart Home</h3>
                <p className="text-zinc-400">
                  Integrated technology for comfort and efficiency
                </p>
              </div>
              <div className="p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-semibold mb-4">Sustainable</h3>
                <p className="text-zinc-400">
                  Energy-efficient systems and materials
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 