'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ShopItem {
  id: string;
  title: string;
  imagePath: string;
  description: string;
  details: {
    designer?: string;
    artist?: string;
    period: string;
    condition?: string;
    materials?: string[];
    dimensions: string;
    medium?: string;
  };
}

export default function ShopItemPage() {
  const params = useParams();
  const [item, setItem] = useState<ShopItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await fetch('/api/shop');
        const data = await response.json();
        const foundItem = data.items.find((i: ShopItem) => i.id === params.id);
        setItem(foundItem || null);
      } catch (error) {
        console.error('Error fetching shop item:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4B896', opacity: 0.5 }} />
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', background: '#060606', color: '#F0EDE8', fontFamily: "'Syne', sans-serif", padding: 56 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300 }}>Item not found</h1>
        <Link href="/shop" style={{ color: '#555', fontSize: 14, marginTop: 16, display: 'inline-block' }}>
          &#8592; Back to Shop
        </Link>
      </div>
    );
  }

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
        <Link href="/shop" style={{
          textDecoration: 'none', fontSize: 12, color: '#444', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          &#8592; Back to Shop
        </Link>
      </nav>

      {/* Content */}
      <section style={{ padding: '60px 56px 120px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          {/* Image */}
          <div style={{
            position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#0c0c0c',
            border: '1px solid rgba(255,255,255,0.04)', aspectRatio: '1',
          }}>
            <Image src={item.imagePath} alt={item.title} fill style={{ objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              padding: '4px 12px', borderRadius: 100,
              background: 'rgba(212,184,150,0.1)', border: '1px solid rgba(212,184,150,0.2)',
              fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#D4B896', fontWeight: 600,
            }}>SOLD</div>
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em',
              marginBottom: 24,
            }}>{item.title}</h1>

            <p style={{ fontSize: 15, lineHeight: 1.85, color: '#555', fontWeight: 400, marginBottom: 36 }}>
              {item.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {item.details.designer && (
                <div>
                  <dt style={{ fontSize: 10, fontWeight: 600, color: '#3a3a3a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Designer</dt>
                  <dd style={{ fontSize: 15, color: '#888' }}>{item.details.designer}</dd>
                </div>
              )}
              {item.details.artist && (
                <div>
                  <dt style={{ fontSize: 10, fontWeight: 600, color: '#3a3a3a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Artist</dt>
                  <dd style={{ fontSize: 15, color: '#888' }}>{item.details.artist}</dd>
                </div>
              )}
              <div>
                <dt style={{ fontSize: 10, fontWeight: 600, color: '#3a3a3a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Period</dt>
                <dd style={{ fontSize: 15, color: '#888' }}>{item.details.period}</dd>
              </div>
              {item.details.condition && (
                <div>
                  <dt style={{ fontSize: 10, fontWeight: 600, color: '#3a3a3a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Condition</dt>
                  <dd style={{ fontSize: 15, color: '#888' }}>{item.details.condition}</dd>
                </div>
              )}
              {item.details.materials && (
                <div>
                  <dt style={{ fontSize: 10, fontWeight: 600, color: '#3a3a3a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Materials</dt>
                  <dd style={{ fontSize: 15, color: '#888' }}>{item.details.materials.join(', ')}</dd>
                </div>
              )}
              {item.details.medium && (
                <div>
                  <dt style={{ fontSize: 10, fontWeight: 600, color: '#3a3a3a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Medium</dt>
                  <dd style={{ fontSize: 15, color: '#888' }}>{item.details.medium}</dd>
                </div>
              )}
              <div>
                <dt style={{ fontSize: 10, fontWeight: 600, color: '#3a3a3a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Dimensions</dt>
                <dd style={{ fontSize: 15, color: '#888' }}>{item.details.dimensions}</dd>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
