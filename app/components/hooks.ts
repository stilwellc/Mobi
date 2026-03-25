'use client';

import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    h();
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}
