'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function ScreechProject() {
  const [streak, setStreak] = useState(0);
  const [newsFeed, setNewsFeed] = useState<string[]>([]);

  useEffect(() => {
    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const lastVisit = localStorage.getItem('lastVisit') || '';
    const currentStreak = parseInt(localStorage.getItem('streak') || '0', 10);

    if (lastVisit === today) {
      setStreak(currentStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toISOString().split('T')[0];

      if (lastVisit === yesterdayDate) {
        const newStreak = currentStreak + 1;
        localStorage.setItem('streak', newStreak.toString());
        setStreak(newStreak);
      } else {
        localStorage.setItem('streak', '1');
        setStreak(1);
      }
      localStorage.setItem('lastVisit', today);
    }

    // Load news feed
    const loadNewsFeed = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyWcDyElkuQ44d2AIv9zx4dGLRTOJydzJCNLlu2L8aWVbjoggOHd_HXz9Qh675fIYi3mw/exec');
        const data = await response.json();
        if (data && data.cleanData) {
          setNewsFeed(data.cleanData);
        }
      } catch (error) {
        console.error('Error loading news feed:', error);
      }
    };

    loadNewsFeed();
  }, []);

  const formatMarkdown = (text: string) => {
    // Convert emoji headers to markdown headers
    let formatted = text.replace(/^(🛡️|☁️|📦|🔗|🤖)\s*(.*)$/gm, '## $2');
    
    // Convert URLs to markdown links
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '[$1]($1)'
    );
    
    // Convert bullet points
    formatted = formatted.replace(/^[-•]\s*(.*)$/gm, '- $1');
    
    return formatted;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Geometric Background */}
      <div className="absolute inset-0">
        {/* Dot Grid */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.015) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-2 h-2 bg-[#4a0011] rounded-full mx-auto" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-zinc-300 mb-6">
            Screech
          </h1>
          <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-12">
            Stay in the Know, Powered by AI – Your Smart Guide to Local Events!
          </p>
          <Link href="/" className="inline-flex items-center text-zinc-600 hover:text-zinc-400 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </section>

      {/* Streak Tracker */}
      <section className="relative z-10 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-8 group hover:scale-[1.01] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
              backgroundSize: '16px 16px'
            }} />
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-medium text-zinc-300 mb-2 group-hover:translate-y-[-1px] transition-transform">
                  Current Streak
                </h2>
                <p className="text-base text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {streak} days of continuous updates
                </p>
              </div>
              <motion.div 
                className="w-2 h-2 bg-[#4a0011] rounded-full"
                whileHover={{ scale: 1.5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Feed */}
      <section className="relative z-10 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid gap-6">
            {newsFeed.map((item, index) => (
              <div 
                key={index}
                className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-8 group hover:scale-[1.01] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                  backgroundSize: '16px 16px'
                }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <time className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      {new Date().toLocaleDateString()}
                    </time>
                    <motion.div 
                      className="w-2 h-2 bg-[#4a0011] rounded-full"
                      whileHover={{ scale: 1.5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                  <div className="prose prose-invert prose-zinc max-w-none group-hover:translate-y-[-1px] transition-transform">
                    <ReactMarkdown>{formatMarkdown(item)}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 