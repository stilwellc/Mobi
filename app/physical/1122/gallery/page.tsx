'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Gallery() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 to-zinc-950" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
            Project 1122 Gallery
          </h1>
        </div>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/physical/1122"
          className="inline-flex items-center text-zinc-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Project
        </Link>
      </div>

      {/* Gallery Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[2000px] mx-auto">
            <div className="flex flex-col gap-8">
              {/* Before Blueprint */}
              <div>
                <h2 className="text-2xl font-medium text-zinc-300 mb-6">Before Blueprint</h2>
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-black border border-zinc-900">
                  <img 
                    src="/images/1122/1122before.png"
                    alt="Before blueprint"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* After Blueprint */}
              <div>
                <h2 className="text-2xl font-medium text-zinc-300 mb-6">After Blueprint</h2>
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-black border border-zinc-900">
                  <img 
                    src="/images/1122/1122affter.png"
                    alt="After blueprint"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 