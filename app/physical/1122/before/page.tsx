'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const roomGroups = {
  kitchen: [
    { src: '/images/1122/before/kitchen1.webp', alt: 'Kitchen 1 Before' },
    { src: '/images/1122/before/kitchen2.webp', alt: 'Kitchen 2 Before' },
    { src: '/images/1122/before/kitchen3.webp', alt: 'Kitchen 3 Before' },
    { src: '/images/1122/before/kitchen4.webp', alt: 'Kitchen 4 Before' },
  ],
  dining: [
    { src: '/images/1122/before/diningroom1.webp', alt: 'Dining Room 1 Before' },
    { src: '/images/1122/before/diningroom2.webp', alt: 'Dining Room 2 Before' },
    { src: '/images/1122/before/diningroom3.webp', alt: 'Dining Room 3 Before' },
  ],
  living: [
    { src: '/images/1122/before/Livingroom1.webp', alt: 'Living Room 1 Before' },
    { src: '/images/1122/before/livingroom2.webp', alt: 'Living Room 2 Before' },
    { src: '/images/1122/before/livingroom3.webp', alt: 'Living Room 3 Before' },
    { src: '/images/1122/before/livingroom4.webp', alt: 'Living Room 4 Before' },
  ],
  bedroom: [
    { src: '/images/1122/before/bedroom1.webp', alt: 'Bedroom 1 Before' },
    { src: '/images/1122/before/bedroom2.webp', alt: 'Bedroom 2 Before' },
    { src: '/images/1122/before/bedroom3.webp', alt: 'Bedroom 3 Before' },
    { src: '/images/1122/before/bedroom4.webp', alt: 'Bedroom 4 Before' },
  ],
  office: [
    { src: '/images/1122/before/office1.webp', alt: 'Office 1 Before' },
    { src: '/images/1122/before/office2.webp', alt: 'Office 2 Before' },
    { src: '/images/1122/before/office3.webp', alt: 'Office 3 Before' },
  ],
  bathroom: [
    { src: '/images/1122/before/bathroom1.webp', alt: 'Bathroom Before' },
  ],
};

const roomTitles: Record<string, string> = {
  kitchen: 'Kitchen',
  dining: 'Dining Room',
  living: 'Living Room',
  bedroom: 'Bedroom',
  office: 'Office',
  bathroom: 'Bathroom',
};

export default function BeforeGallery() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({
    kitchen: 0, dining: 0, living: 0, bedroom: 0, office: 0, bathroom: 0,
  });

  const handlePrevious = (roomType: string) => {
    setCarouselIndices(prev => ({ ...prev, [roomType]: Math.max(0, prev[roomType] - 1) }));
  };

  const handleNext = (roomType: string, maxIndex: number) => {
    setCarouselIndices(prev => ({ ...prev, [roomType]: Math.min(maxIndex, prev[roomType] + 1) }));
  };

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
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D4B896', opacity: 0.6 }} />
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3a3a3a', fontWeight: 600 }}>
            Project 1122
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95,
          marginBottom: 16,
        }}>
          Before <span style={{ fontStyle: 'italic', color: '#D4B896' }}>Gallery</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#555', fontWeight: 400, maxWidth: 520 }}>
          Original state of the space before transformation
        </p>
      </section>

      {/* Gallery */}
      <section style={{ padding: '20px 56px 120px', maxWidth: 1200, margin: '0 auto' }}>
        {Object.entries(roomGroups).map(([roomType, photos]) => {
          const startIdx = carouselIndices[roomType];
          const visiblePhotos = photos.slice(startIdx, startIdx + 3);
          const maxIndex = Math.max(0, photos.length - 3);
          const showNavigation = photos.length > 3;

          return (
            <div key={roomType} style={{ marginBottom: 64 }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: '#D4B896',
                marginBottom: 24,
              }}>
                {roomTitles[roomType]}
              </h2>

              <div style={{ position: 'relative' }}>
                {/* Mobile: all photos */}
                <div className="block lg:hidden">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {photos.map((photo) => (
                      <div key={photo.src} onClick={() => setSelectedImage(photo)} style={{
                        position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#0c0c0c',
                        border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
                        transition: 'border-color 0.3s ease',
                      }}>
                        <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
                          <Image src={photo.src} alt={photo.alt} fill style={{ objectFit: 'contain', padding: 12, borderRadius: 16 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop: carousel */}
                <div className="hidden lg:block">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {visiblePhotos.map((photo) => (
                      <div key={photo.src} onClick={() => setSelectedImage(photo)} style={{
                        position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#0c0c0c',
                        border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
                        transition: 'border-color 0.3s ease',
                      }}>
                        <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
                          <Image src={photo.src} alt={photo.alt} fill style={{ objectFit: 'contain', padding: 12, borderRadius: 16 }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {showNavigation && (
                    <>
                      <button
                        onClick={() => handlePrevious(roomType)}
                        disabled={startIdx === 0}
                        style={{
                          position: 'absolute', left: -48, top: '50%', transform: 'translateY(-50%)',
                          width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(212,184,150,0.3)',
                          background: startIdx === 0 ? 'transparent' : 'rgba(212,184,150,0.06)',
                          color: '#D4B896', cursor: startIdx === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: startIdx === 0 ? 0.3 : 1, transition: 'all 0.3s ease',
                          fontSize: 18,
                        }}
                      >&#8249;</button>
                      <button
                        onClick={() => handleNext(roomType, maxIndex)}
                        disabled={startIdx >= maxIndex}
                        style={{
                          position: 'absolute', right: -48, top: '50%', transform: 'translateY(-50%)',
                          width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(212,184,150,0.3)',
                          background: startIdx >= maxIndex ? 'transparent' : 'rgba(212,184,150,0.06)',
                          color: '#D4B896', cursor: startIdx >= maxIndex ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: startIdx >= maxIndex ? 0.3 : 1, transition: 'all 0.3s ease',
                          fontSize: 18,
                        }}
                      >&#8250;</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(6,6,6,0.95)', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40, cursor: 'pointer',
          }}
        >
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute', top: 24, right: 24,
              background: 'none', border: 'none', color: '#555',
              fontSize: 24, cursor: 'pointer',
            }}
          >&#10005;</button>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: 900, width: '100%', aspectRatio: '4/3' }}>
            <Image src={selectedImage.src} alt={selectedImage.alt} fill style={{ objectFit: 'contain', borderRadius: 12 }} priority />
          </div>
        </div>
      )}
    </div>
  );
}
