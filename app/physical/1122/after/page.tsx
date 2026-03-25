'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const photos = [
  { src: '/images/1122/after/1.jpg', alt: 'After - Front Exterior' },
  { src: '/images/1122/after/2.jpg', alt: 'After - Living Room' },
  { src: '/images/1122/after/3.jpg', alt: 'After - Kitchen' },
  { src: '/images/1122/after/4.jpg', alt: 'After - Bathroom' },
  { src: '/images/1122/after/5.jpg', alt: 'After - Bedroom' },
  { src: '/images/1122/after/6.jpg', alt: 'After - Backyard' },
];

export default function AfterGallery() {
  return (
    <div style={{ minHeight: '100vh', background: '#060606', color: '#F0EDE8', fontFamily: "'Syne', sans-serif" }}>
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
        <Link href="/physical/1122" style={{
          textDecoration: 'none', fontSize: 12, color: '#444', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          &#8592; Back to Project 1122
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ padding: '60px 56px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#96B8D4', opacity: 0.6 }} />
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3a3a3a', fontWeight: 600 }}>
            Project 1122
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95,
          marginBottom: 16,
        }}>
          After <span style={{ fontStyle: 'italic', color: '#96B8D4' }}>Gallery</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#555', fontWeight: 400, maxWidth: 520 }}>
          Transformed spaces after the renovation
        </p>
      </section>

      {/* Gallery Grid */}
      <section style={{ padding: '20px 56px 120px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {photos.map((photo, index) => (
            <div key={index} style={{
              position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#0c0c0c',
              border: '1px solid rgba(255,255,255,0.04)',
              transition: 'all 0.4s ease',
            }}>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                <Image src={photo.src} alt={photo.alt} fill style={{ objectFit: 'cover', borderRadius: 16 }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
