'use client';

import React from 'react';
import { motion } from 'framer-motion';

const products = [
  {
    title: "Design Objects",
    description: "Curated pieces that blend form and function",
    category: "Objects",
    price: "$299",
    image: "/images/design-objects.jpg"
  },
  {
    title: "Limited Editions",
    description: "Exclusive pieces for the discerning collector",
    category: "Limited",
    price: "$499",
    image: "/images/limited-editions.jpg"
  },
  {
    title: "Collaborations",
    description: "Unique pieces created with leading artists",
    category: "Collaboration",
    price: "$799",
    image: "/images/collaborations.jpg"
  }
];

export default function Store() {
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
                Design Store
              </h1>
              <p className="text-xl sm:text-2xl text-[#EDE8D0]/80 font-light tracking-tight max-w-2xl mx-auto leading-relaxed">
                Discover our curated collection of design objects
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
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
                      {product.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-mobi-burgundy mb-2">
                      {product.title}
                    </h3>
                    <p className="text-base text-mobi-burgundy/90 max-w-xl">
                      {product.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-2xl font-bold text-mobi-burgundy">{product.price}</span>
                      <motion.button 
                        className="relative px-6 py-2 bg-transparent text-mobi-burgundy rounded-full text-sm font-medium overflow-hidden border border-mobi-burgundy/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10">Add to Cart</span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-mobi-burgundy/20 to-mobi-burgundy/10"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </div>
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