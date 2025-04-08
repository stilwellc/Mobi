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
    // First, split the text into lines
    let lines = text.split('\n');
    
    // Process each line
    lines = lines.map(line => {
      // Check if this is a category header (contains emojis and no bullet points)
      if (line.match(/^[^•-].*?[🎁✨|🍽️🍹|👨‍👩‍👧‍👦|🏡|🌿🚴|🎶🎭|🎉|🎨|🎭|🎪|🎯|🎮|💻|📚|🎓|🏆|🎪|🎨|🎭]/) && !line.startsWith('•')) {
        return `<span class="category-header">${line}</span>`;
      }
      
      // Convert bullet points with bold text
      if (line.match(/^[-•]\s*\*\*(.*?)\*\*(.*)/)) {
        return line.replace(/^[-•]\s*\*\*(.*?)\*\*(.*)/, '• **$1**$2');
      }
      
      // Convert remaining bullet points
      if (line.match(/^[-•]\s*.*/)) {
        return line.replace(/^[-•]\s*(.*)/, '• $1');
      }
      
      return line;
    });
    
    // Join lines back together
    let formatted = lines.join('\n');
    
    // Convert URLs to markdown links
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '[$1]($1)'
    );
    
    // Clean up any duplicate bullet points
    formatted = formatted.replace(/[•-]\s*[•-]\s*/g, '• ');
    
    return formatted;
  };

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
                Screech
              </h1>
            </div>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed">
              Stay in the Know, Powered by AI – Your Smart Guide to Local Events!
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

      {/* Streak Tracker */}
      <section className="relative z-10 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-8 group md:hover:scale-[1.01] transition-all duration-300">
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
                <p className="text-base text-zinc-500 md:group-hover:text-zinc-400 transition-colors">
                  {streak} days of continuous updates
                </p>
              </div>
              <motion.div 
                className="w-2 h-2 bg-[#4a0011] rounded-full"
                whileHover={{ scale: [null, 1.5] }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Feed */}
      <section className="relative z-10 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid gap-6">
            {[...newsFeed].reverse().map((item, index) => (
              <div 
                key={index}
                className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-900 p-6 sm:p-8 group md:hover:scale-[1.01] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 to-black/60" />
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(128,0,32,0.03) 1px, transparent 0)`,
                  backgroundSize: '16px 16px'
                }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <time className="text-sm text-zinc-500 md:group-hover:text-zinc-400 transition-colors">
                      {new Date().toLocaleDateString()}
                    </time>
                    <motion.div 
                      className="w-2 h-2 bg-[#4a0011] rounded-full"
                      whileHover={{ scale: [null, 1.5] }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </div>
                  <div className="prose prose-invert prose-zinc max-w-none md:group-hover:translate-y-[-1px] transition-transform">
                    <div className="
                      prose-p:text-zinc-500 prose-p:my-3 prose-p:leading-relaxed
                      prose-strong:text-zinc-400 prose-strong:font-medium
                      prose-a:text-zinc-400 hover:prose-a:text-zinc-300 prose-a:no-underline hover:prose-a:underline
                      prose-ul:my-6 prose-ul:space-y-3 prose-ul:list-none
                      [&_li]:relative [&_li]:pl-6 [&_li]:text-zinc-500 [&_li]:leading-relaxed
                      [&_li]:before:content-['•'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-zinc-600
                      [&_li]:before:top-0 [&_li]:before:text-lg
                      [&_.category-header]:text-[#800020] [&_.category-header]:text-xl [&_.category-header]:font-bold 
                      [&_.category-header]:block [&_.category-header]:mb-6 [&_.category-header]:mt-8 
                      [&_.category-header:first-child]:mt-0
                      space-y-6
                    ">
                      <ReactMarkdown components={{
                        // Override the default paragraph component to preserve our HTML
                        p: ({ children }) => <p dangerouslySetInnerHTML={{ __html: children as string }} />
                      }}>{formatMarkdown(item)}</ReactMarkdown>
                    </div>
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