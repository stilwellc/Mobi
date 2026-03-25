'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Project1122() {
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
        <Link href="/" style={{
          textDecoration: 'none', fontSize: 12, color: '#444', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          &#8592; Back
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 56px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D4B896', opacity: 0.6 }} />
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3a3a3a', fontWeight: 600 }}>
            Physical &mdash; Installation
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(48px, 8vw, 90px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95,
          marginBottom: 24,
        }}>
          Project <span style={{ fontStyle: 'italic', color: '#D4B896' }}>1122</span>
        </h1>

        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#555', fontWeight: 400, maxWidth: 520, marginBottom: 48 }}>
          A groundbreaking exploration of form and function in physical space — the Stilwell residence reimagined from blueprint to lived experience.
        </p>

        <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent 80%)' }} />
      </section>

      {/* Blueprints */}
      <section style={{ padding: '40px 56px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Link href="/physical/1122/before" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#0c0c0c',
              border: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.4s ease', cursor: 'pointer',
            }}>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '66%' }}>
                <Image src="/images/1122/1122beforeBP.png" alt="Before blueprint" fill style={{ objectFit: 'contain', padding: 16 }} />
              </div>
              <div style={{ padding: '16px 24px 24px' }}>
                <span style={{
                  fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#D4B896', fontWeight: 600, background: 'rgba(212,184,150,0.06)',
                  padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(212,184,150,0.1)',
                }}>Before Gallery</span>
              </div>
            </div>
          </Link>

          <Link href="/physical/1122/after" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#0c0c0c',
              border: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.4s ease', cursor: 'pointer',
            }}>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '66%' }}>
                <Image src="/images/1122/1122afterBP.png" alt="After blueprint" fill style={{ objectFit: 'contain', padding: 16 }} />
              </div>
              <div style={{ padding: '16px 24px 24px' }}>
                <span style={{
                  fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#96B8D4', fontWeight: 600, background: 'rgba(150,184,212,0.06)',
                  padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(150,184,212,0.1)',
                }}>After Gallery</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Project Details */}
      <section style={{ padding: '0 56px 120px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ width: '100%', height: 1, marginBottom: 48, background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent 80%)' }} />

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 42, fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 36,
        }}>
          Room <span style={{ fontStyle: 'italic', color: '#D4B896' }}>Details</span>
        </h2>

        {[
          { title: 'Bedroom', text: 'The bedroom features a spacious layout with carefully considered proportions, maximizing natural light while maintaining privacy. The design incorporates built-in storage solutions and a dedicated workspace area.' },
          { title: 'Kitchen', text: 'A modern, functional kitchen with an open concept design. The space includes high-end appliances, ample counter space, and a central island that serves as both a preparation area and casual dining space.' },
          { title: 'Living Room', text: 'The living room is designed for both comfort and entertainment, featuring a flexible layout that can accommodate various furniture arrangements. Large windows provide natural light and views of the surrounding area.' },
          { title: 'Bathroom', text: 'A luxurious bathroom with a spa-like atmosphere. The design includes a walk-in shower, freestanding tub, and double vanity. Premium materials and fixtures create a sophisticated yet functional space.' },
          { title: 'Office', text: 'A dedicated workspace designed for productivity and comfort. The office features built-in shelving, ample desk space, and strategic lighting to create an optimal working environment.' },
        ].map((room, i) => (
          <div key={i} style={{
            marginBottom: 32,
            display: 'grid', gridTemplateColumns: '180px 1fr', gap: 40,
          }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22, fontWeight: 400, fontStyle: 'italic', color: '#D4B896', lineHeight: 1.3,
            }}>{room.title}</h3>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: '#444', fontWeight: 400 }}>
              {room.text}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
