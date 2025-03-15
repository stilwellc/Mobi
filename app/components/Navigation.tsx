'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'physical', href: '/physical', shape: 'rounded-full' },
  { name: 'digital', href: '/digital', shape: 'rotate-45' },
  { name: 'social', href: '/social', shape: 'rounded-[30%]' },
  { name: 'store', href: '/store', shape: 'rounded-[60%]' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-zinc-900/60 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center overflow-hidden"
            >
              <div className="relative h-8 w-[100px]">
                <Image
                  src="/images/mobi-logo.png"
                  alt="mobi."
                  width={100}
                  height={40}
                  className="absolute top-[-5%] w-full h-[110%] object-cover"
                  priority
                  quality={100}
                />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3"
                >
                  <div className={`w-3 h-3 border-2 border-zinc-600/50 ${item.shape}`} />
                  <span className="text-white/50 group-hover:text-white transition-colors text-sm">
                    {item.name}
                  </span>
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-px bg-zinc-600/30"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-full h-px bg-zinc-600/50 block"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-px bg-zinc-600/50 block"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-full h-px bg-zinc-600/50 block"
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900/80 backdrop-blur-sm"
          >
            <div className="px-4 py-6 space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center space-x-4 py-2"
                  >
                    <div className={`w-4 h-4 border-2 border-zinc-600/50 ${item.shape}`} />
                    <span className="text-white/50 hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 