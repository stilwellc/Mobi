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
      {/* Background Dots */}
      <div className="fixed inset-0 z-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-mobi-burgundy/20 pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(237,232,208,0.03)_0%,transparent_100%)]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 px-4 max-w-4xl mx-auto"
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 border-2 border-[#EDE8D0]/10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#EDE8D0]/10 rounded-full" />
            </div>
          </div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#EDE8D0] mb-6"
              style={{
                textShadow: '0 0 80px rgba(255,255,255,0.1)',
              }}
            >
              Screech
            </h1>
            <p className="text-xl sm:text-2xl text-[#EDE8D0]/80 font-light tracking-tight max-w-2xl mx-auto leading-relaxed">
              Stay in the Know, Powered by AI – Your Smart Guide to Local Events!
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Streak Tracker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-mobi-burgundy/60 backdrop-blur-sm text-[#EDE8D0] rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-4 h-4 border-2 border-[#EDE8D0]/40 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 border-2 border-[#EDE8D0]/60 rounded-full" />
            </div>
            <span className="font-medium tracking-tight">Current Streak: {streak} days</span>
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {newsFeed.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-mobi-burgundy/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="text-sm text-[#EDE8D0]/60 mb-4 flex items-center space-x-2">
                <div className="w-3 h-3 border border-[#EDE8D0]/40 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 border border-[#EDE8D0]/60 rounded-full" />
                </div>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-[#EDE8D0] text-2xl font-semibold tracking-tight mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-[#EDE8D0] text-xl font-medium tracking-tight mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-[#EDE8D0] text-lg font-medium tracking-tight mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-[#EDE8D0]/90 mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="text-[#EDE8D0]/90 list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="text-[#EDE8D0]/90 list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                    li: ({ children }) => <li className="text-[#EDE8D0]/90">{children}</li>,
                    a: ({ href, children }) => (
                      <a href={href} className="text-[#EDE8D0]/80 hover:text-[#EDE8D0] underline transition-colors" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    code: ({ children }) => <code className="text-[#EDE8D0] bg-black/20 px-2 py-1 rounded">{children}</code>,
                    pre: ({ children }) => <pre className="text-[#EDE8D0] bg-black/20 p-4 rounded-lg mb-4 overflow-x-auto">{children}</pre>,
                    blockquote: ({ children }) => <blockquote className="text-[#EDE8D0]/90 border-l-4 border-[#EDE8D0]/20 pl-4 italic mb-4">{children}</blockquote>,
                    hr: () => <hr className="border-[#EDE8D0]/20 my-4" />,
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full text-[#EDE8D0] border-collapse border border-[#EDE8D0]/20">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => <th className="border border-[#EDE8D0]/20 px-4 py-2 bg-black/20">{children}</th>,
                    td: ({ children }) => <td className="border border-[#EDE8D0]/20 px-4 py-2">{children}</td>,
                  }}
                >
                  {formatMarkdown(entry)}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/digital">
          <motion.div 
            className="inline-flex items-center text-[#EDE8D0]/80 hover:text-[#EDE8D0] transition-colors group"
            whileHover={{ x: -5 }}
          >
            <svg className="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-lg font-medium tracking-tight">Back to Digital Projects</span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
} 