'use client';

import { useState, useEffect } from 'react';
import { AuctionLot, MarketStats } from '../types';

interface RayData {
  statsByArtist: Record<string, MarketStats>;
  allLots: AuctionLot[];
  lastCrawl: string;
  sources: string[];
  loading: boolean;
}

export function useRayData(): RayData {
  const [statsByArtist, setStatsByArtist] = useState<Record<string, MarketStats>>({});
  const [allLots, setAllLots] = useState<AuctionLot[]>([]);
  const [lastCrawl, setLastCrawl] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetch('/data/ray/stats.json').then(r => r.json()),
      fetch('/data/ray/lots.json').then(r => r.json()),
      fetch('/data/ray/meta.json').then(r => r.json()),
    ]).then(([statsResult, lotsResult, metaResult]) => {
      const statsData = statsResult.status === 'fulfilled' ? statsResult.value : null;
      const lotsData: AuctionLot[] = lotsResult.status === 'fulfilled' ? lotsResult.value : [];
      const metaData = metaResult.status === 'fulfilled' ? metaResult.value : {};

      setAllLots(lotsData);
      setLastCrawl(metaData.lastCrawl || '');
      setSources(metaData.sources || []);

      if (statsData) {
        if (statsData.lastUpdated) {
          // Old single-artist format — derive slug from lot data rather than hardcoding
          const artistSlug = lotsData[0]?.artist;
          setStatsByArtist(artistSlug ? { [artistSlug]: statsData } : {});
        } else {
          setStatsByArtist(statsData);
        }
      }
    }).finally(() => setLoading(false));
  }, []);

  return { statsByArtist, allLots, lastCrawl, sources, loading };
}
