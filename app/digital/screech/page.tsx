'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function ScreechProject() {
  const [streak, setStreak] = useState(0);
  const [newsFeed, setNewsFeed] = useState<string[]>([]);

  useEffect(() => {
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
    let lines = text.split('\n');
    lines = lines.map(line => {
      if (line.match(/^[^•-].*?[🎁✨|🍽️🍹|👨‍👩‍👧‍👦|🏡|🌿🚴|🎶🎭|🎉|🎨|🎭|🎪|🎯|🎮|💻|📚|🎓|🏆|🎪|🎨|🎭]/) && !line.startsWith('•')) {
        const cleanLine = line.replace(/^#+\s*/, '');
        return `### ${cleanLine}`;
      }
      if (line.match(/^[-•]\s*\*\*(.*?)\*\*(.*)/)) {
        return line.replace(/^[-•]\s*\*\*(.*?)\*\*(.*)/, '• **$1**$2');
      }
      if (line.match(/^[-•]\s*.*/)) {
        return line.replace(/^[-•]\s*(.*)/, '• $1');
      }
      return line;
    });
    let formatted = lines.join('\n');
    formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');
    formatted = formatted.replace(/[•-]\s*[•-]\s*/g, '• ');
    return formatted;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060606', color: '#F0EDE8', fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        .screech-prose h3 { color: #D4B896; font-size: 18px; font-weight: 600; margin: 24px 0 12px; font-family: 'Cormorant Garamond', serif; font-style: italic; }
        .screech-prose h3:first-child { margin-top: 0; }
        .screech-prose p { color: #555; margin: 12px 0; line-height: 1.7; font-size: 14px; }
        .screech-prose strong { color: #888; font-weight: 500; }
        .screech-prose a { color: #888; text-decoration: none; transition: color 0.3s; }
        .screech-prose a:hover { color: #D4B896; text-decoration: underline; }
        .screech-prose ul { list-style: none; padding: 0; margin: 12px 0; }
        .screech-prose li { position: relative; padding-left: 20px; color: #555; line-height: 1.7; margin: 8px 0; font-size: 14px; }
        .screech-prose li::before { content: '•'; position: absolute; left: 0; color: #3a3a3a; }
      `}</style>

      {/* Nav */}
      <nav style={{
        padding: '24px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(6,6,6,0.85)', backdropFilter: 'blur(30px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#F0EDE8', fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em' }}>
          mobi<span style={{ color: '#D4B896' }}>.</span>
        </Link>
        <Link href="/" style={{
          textDecoration: 'none', fontSize: 12, color: '#444', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          &#8592; Back
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ padding: '60px 56px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#96B8D4', opacity: 0.6 }} />
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3a3a3a', fontWeight: 600 }}>
            Digital &mdash; Newsletter
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95,
          marginBottom: 16,
        }}>
          <span style={{ fontStyle: 'italic', color: '#96B8D4' }}>Screech</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#555', fontWeight: 400, maxWidth: 520 }}>
          Stay in the Know, Powered by AI — Your Smart Guide to Local Events!
        </p>
      </section>

      {/* Streak */}
      <section style={{ padding: '0 56px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          padding: '28px 36px', borderRadius: 20, background: '#0c0c0c',
          border: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, marginBottom: 4 }}>
              Current Streak
            </h2>
            <p style={{ fontSize: 14, color: '#555', fontWeight: 400 }}>
              {streak} days of continuous updates
            </p>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#96B8D4', opacity: 0.5 }} />
        </div>
      </section>

      {/* News Feed */}
      <section style={{ padding: '0 56px 120px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[...newsFeed].reverse().map((item, index) => (
            <div key={index} style={{
              padding: '28px 36px', borderRadius: 20, background: '#0c0c0c',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <time style={{ fontSize: 12, color: '#3a3a3a', fontWeight: 500 }}>
                  {new Date().toLocaleDateString()}
                </time>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#96B8D4', opacity: 0.4 }} />
              </div>
              <div className="screech-prose">
                <ReactMarkdown>{formatMarkdown(item)}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
