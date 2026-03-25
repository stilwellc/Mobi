'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ShopItem {
  id: string;
  title: string;
  imagePath: string;
}

export default function ShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch('/api/shop');
        const data = await response.json();
        setItems(data.items);
      } catch (error) {
        console.error('Error fetching shop items:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

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
      <section style={{ padding: '60px 56px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#B8D496', opacity: 0.6 }} />
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3a3a3a', fontWeight: 600 }}>
            Curated Objects
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95,
          marginBottom: 16,
        }}>
          <span style={{ fontStyle: 'italic', color: '#B8D496' }}>Shop</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#555', fontWeight: 400, maxWidth: 520 }}>
          Discover our curated collection of design pieces
        </p>
      </section>

      {/* Grid */}
      <section style={{ padding: '20px 56px 120px', maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#B8D496', opacity: 0.5 }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {items.map((item) => (
              <Link key={item.id} href={`/shop/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#0c0c0c',
                  border: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.4s ease',
                  cursor: 'pointer',
                }}>
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                    <Image src={item.imagePath} alt={item.title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />
                    <div style={{
                      position: 'absolute', bottom: 12, right: 12,
                      padding: '4px 12px', borderRadius: 100,
                      background: 'rgba(212,184,150,0.1)', border: '1px solid rgba(212,184,150,0.2)',
                      fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                      color: '#D4B896', fontWeight: 600,
                    }}>SOLD</div>
                  </div>
                  <div style={{ padding: '16px 20px 20px' }}>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 20, fontWeight: 300, marginBottom: 4,
                    }}>{item.title}</h3>
                    <span style={{ fontSize: 11, color: '#3a3a3a', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      View Details &#8594;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
