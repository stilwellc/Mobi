'use client';

import { useState, useEffect } from 'react';
import { AuctionLot, MarketStats } from '../types';

interface RayData {
  statsByArtist: Record<string, MarketStats>;
  allLots: AuctionLot[];
  lastCrawl: string;
  loading: boolean;
}

export function useRayData(): RayData {
  const [statsByArtist, setStatsByArtist] = useState<Record<string, MarketStats>>({});
  const [allLots, setAllLots] = useState<AuctionLot[]>([]);
  const [lastCrawl, setLastCrawl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/ray/stats.json').then(r => r.json()),
      fetch('/data/ray/lots.json').then(r => r.json()),
      fetch('/data/ray/meta.json').then(r => r.json()),
    ]).then(([statsData, lotsData, metaData]) => {
      if (statsData.lastUpdated) {
        setStatsByArtist({ 'george-condo': statsData });
      } else {
        setStatsByArtist(statsData);
      }
      setAllLots(lotsData);
      setLastCrawl(metaData.lastCrawl);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { statsByArtist, allLots, lastCrawl, loading };
}
