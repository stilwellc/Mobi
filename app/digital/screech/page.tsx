'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function ScreechProject() {
  const [darkMode, setDarkMode] = useState(false);
  const [streak, setStreak] = useState(0);
  const [newsFeed, setNewsFeed] = useState<string[]>([]);

  useEffect(() => {
    // Load dark mode preference
    const darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting === 'enabled') {
      setDarkMode(true);
    }

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
          setNewsFeed(data.cleanData.reverse());
        }
      } catch (error) {
        console.error('Error loading news feed:', error);
      }
    };

    loadNewsFeed();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode ? 'enabled' : 'disabled');
  };

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
        backgroundImage: `radial-gradient(circle at 1rem 1rem, rgba(75, 75, 75, 0.1) 0.15rem, transparent 0.15rem)`,
        backgroundSize: '2rem 2rem'
      }} />

      {/* Hero Section */}
      <section className="relative h-[250px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-gray-900 pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(75,75,75,0.05)_0%,transparent_100%)]" />
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full bg-gray-900/20 blur-[120px]"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              top: "-20%",
              left: "-20%",
            }}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 px-4 max-w-4xl mx-auto"
        >
          <motion.div
            className="relative mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-14 h-14 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C8 2 4 6 4 10c0 4 4 8 8 8s8-4 8-8c0-4-4-8-8-8z" />
                  <path d="M12 6c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" />
                  <path d="M12 14c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                  <path d="M8 8c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                  <path d="M16 8c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8"
              style={{
                textShadow: '0 0 80px rgba(255,255,255,0.1)',
                letterSpacing: '-0.05em',
              }}
            >
              Screech
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
              Stay in the Know, Powered by AI – Your Smart Guide to Local Events!
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Streak Tracker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gray-900/50 text-white rounded-lg p-4 text-center font-semibold">
          Current Streak: {streak} days
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
              className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 shadow-lg"
            >
              <div className="text-sm text-gray-500 mb-2">
                {new Date().toLocaleDateString()}
              </div>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-white text-2xl font-bold mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-white text-xl font-semibold mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-white text-lg font-medium mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-white mb-4">{children}</p>,
                    ul: ({ children }) => <ul className="text-white list-disc pl-6 mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="text-white list-decimal pl-6 mb-4">{children}</ol>,
                    li: ({ children }) => <li className="text-white mb-2">{children}</li>,
                    a: ({ href, children }) => (
                      <a href={href} className="text-gray-400 hover:text-gray-300 underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    code: ({ children }) => <code className="text-white bg-gray-900 px-2 py-1 rounded">{children}</code>,
                    pre: ({ children }) => <pre className="text-white bg-gray-900 p-4 rounded-lg mb-4 overflow-x-auto">{children}</pre>,
                    blockquote: ({ children }) => <blockquote className="text-white border-l-4 border-gray-700 pl-4 italic mb-4">{children}</blockquote>,
                    hr: () => <hr className="border-gray-800 my-4" />,
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full text-white border-collapse border border-gray-800">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => <th className="border border-gray-800 px-4 py-2 bg-gray-900">{children}</th>,
                    td: ({ children }) => <td className="border border-gray-800 px-4 py-2">{children}</td>,
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
            className="inline-flex items-center text-white/90 hover:text-white transition-colors"
            whileHover={{ x: 5 }}
          >
            <span className="mr-2 text-lg">Back to Digital Projects</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </motion.div>
        </Link>
      </div>
    </div>
  );
} 