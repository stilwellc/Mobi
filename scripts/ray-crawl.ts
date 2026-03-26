import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

// ── Types (mirrored from app/digital/ray/types.ts to avoid import issues in standalone script) ──

type AuctionHouse = 'Phillips' | "Sotheby's" | "Christie's" | 'Rago';
type LotStatus = 'upcoming' | 'sold' | 'bought_in' | 'withdrawn';
type Currency = 'USD' | 'GBP' | 'EUR' | 'HKD' | 'CNY';

interface AuctionLot {
  id: string;
  title: string;
  year: string | null;
  medium: string | null;
  dimensions: string | null;
  imageUrl: string | null;
  auctionHouse: AuctionHouse;
  saleName: string;
  saleDate: string;
  lotNumber: number | null;
  estimateLow: number | null;
  estimateHigh: number | null;
  currency: Currency;
  hammerPrice: number | null;
  premiumPrice: number | null;
  priceUsd: number | null;
  status: LotStatus;
  url: string;
}

interface PricePoint {
  date: string;
  avgPrice: number;
  medianPrice: number;
  totalSales: number;
  highPrice: number;
}

interface HouseCount {
  house: AuctionHouse;
  count: number;
  totalValue: number;
}

interface MarketStats {
  lastUpdated: string;
  totalLotsTracked: number;
  avgPriceLast12Months: number;
  medianPriceLast12Months: number;
  recordPrice: number;
  recordTitle: string;
  recordDate: string;
  recordHouse: AuctionHouse;
  appreciationRate: number;
  totalAuctionRevenue: number;
  priceHistory: PricePoint[];
  houseDistribution: HouseCount[];
}

const DATA_DIR = path.join(process.cwd(), 'public', 'data', 'ray');
const DELAY_MS = 1500;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Phillips Crawler ──
// Phillips embeds lot data as a JSON string inside React hydration props.

async function crawlPhillips(): Promise<AuctionLot[]> {
  const lots: AuctionLot[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `https://www.phillips.com/artist/10606/george-condo?page=${page}`;
    console.log(`  [Phillips] Fetching page ${page}...`);

    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) {
        console.log(`  [Phillips] HTTP ${res.status}, stopping pagination.`);
        break;
      }
      const html = await res.text();
      const $ = cheerio.load(html);

      // Phillips injects data via ReactDOM.hydrate with a maker prop containing JSON
      const scripts = $('script').toArray();
      let lotData: any[] = [];

      for (const script of scripts) {
        const text = $(script).html() || '';
        // Look for the React hydration call with ArtistLanding
        if (text.includes('ArtistLanding') || text.includes('pastLots')) {
          // Extract JSON from the maker prop
          const makerMatch = text.match(/"maker"\s*:\s*"((?:\\"|[^"])*)"/);
          if (makerMatch) {
            try {
              const makerJson = JSON.parse(makerMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
              const parsed = typeof makerJson === 'string' ? JSON.parse(makerJson) : makerJson;
              if (parsed.pastLots?.results) {
                lotData = parsed.pastLots.results;
              }
            } catch {
              // Try alternative parsing
            }
          }
        }
      }

      // Also check for __NEXT_DATA__
      if (lotData.length === 0) {
        const nextScript = $('#__NEXT_DATA__').html();
        if (nextScript) {
          try {
            const nextData = JSON.parse(nextScript);
            const artistData = nextData?.props?.pageProps;
            if (artistData?.pastLots?.results) {
              lotData = artistData.pastLots.results;
            } else if (artistData?.lots) {
              lotData = artistData.lots;
            }
          } catch {
            console.log('  [Phillips] Could not parse __NEXT_DATA__');
          }
        }
      }

      if (lotData.length === 0) {
        // Fallback: parse lot cards from HTML
        $('[class*="lot-card"], [class*="LotCard"], .lot-item, a[href*="/detail/"]').each((_, el) => {
          const $el = $(el);
          const title = $el.find('[class*="title"], h3, h4').first().text().trim();
          const href = $el.attr('href') || $el.find('a').first().attr('href') || '';
          const img = $el.find('img').first().attr('src') || null;
          const estText = $el.find('[class*="estimate"], [class*="Estimate"]').text().trim();
          const priceText = $el.find('[class*="price"], [class*="Price"], [class*="hammer"]').text().trim();

          if (title) {
            const estMatch = estText.match(/([\d,]+)\s*[-–]\s*([\d,]+)/);
            const priceMatch = priceText.match(/([\d,]+)/);
            const currency = detectCurrency(estText || priceText);

            lots.push({
              id: `phillips-${href.split('/').pop() || `p${page}-${lots.length}`}`,
              title,
              year: null,
              medium: null,
              dimensions: null,
              imageUrl: img ? (img.startsWith('http') ? img : `https://www.phillips.com${img}`) : null,
              auctionHouse: 'Phillips',
              saleName: '',
              saleDate: '',
              lotNumber: null,
              estimateLow: estMatch ? parseInt(estMatch[1].replace(/,/g, '')) : null,
              estimateHigh: estMatch ? parseInt(estMatch[2].replace(/,/g, '')) : null,
              currency,
              hammerPrice: priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null,
              premiumPrice: null,
              priceUsd: priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null,
              status: priceMatch ? 'sold' : 'upcoming',
              url: href.startsWith('http') ? href : `https://www.phillips.com${href}`,
            });
          }
        });

        hasMore = false;
      } else {
        // Parse structured lot data
        for (const lot of lotData) {
          const title = lot.title || lot.lotTitle || lot.description || 'Untitled';
          const lotUrl = lot.url || lot.detailUrl || `/detail/${lot.saleNumber || ''}/${lot.lotNumber || ''}`;
          const currency = detectCurrency(lot.currencySign || lot.currency || 'USD');
          const hammerPrice = lot.hammerPrice ?? lot.hammerPlusCommission ?? null;
          const isSold = hammerPrice != null && hammerPrice > 0;

          lots.push({
            id: `phillips-${lot.saleNumber || ''}-${lot.lotNumber || lot.id || lots.length}`,
            title,
            year: lot.dates || lot.year || null,
            medium: lot.medium || null,
            dimensions: lot.dimensions || null,
            imageUrl: lot.imagePath
              ? `https://assets.phillips.com/image/upload/t_Website_LotDetailMainImage/v${lot.cloudinaryVersion || '1'}/${lot.imagePath}`
              : null,
            auctionHouse: 'Phillips',
            saleName: lot.saleTitle || lot.saleName || '',
            saleDate: lot.saleDate || lot.auctionDate || '',
            lotNumber: lot.lotNumber ? parseInt(lot.lotNumber) : null,
            estimateLow: lot.lowEstimate ?? lot.estimateLow ?? null,
            estimateHigh: lot.highEstimate ?? lot.estimateHigh ?? null,
            currency,
            hammerPrice,
            premiumPrice: lot.hammerPlusCommission ?? null,
            priceUsd: lot.hammerPlusCommission ?? hammerPrice ?? null,
            status: lot.isSold === false || lot.status === 'Bought In' ? 'bought_in'
              : isSold ? 'sold'
              : 'upcoming',
            url: lotUrl.startsWith('http') ? lotUrl : `https://www.phillips.com${lotUrl}`,
          });
        }

        hasMore = lotData.length >= 24;
        page++;
      }
    } catch (err) {
      console.error(`  [Phillips] Error on page ${page}:`, err);
      hasMore = false;
    }

    if (hasMore) await sleep(DELAY_MS);
  }

  return lots;
}

// ── Sotheby's Crawler ──

async function crawlSothebys(): Promise<AuctionLot[]> {
  const lots: AuctionLot[] = [];
  const url = 'https://www.sothebys.com/en/artists/george-condo';
  console.log('  [Sothebys] Fetching artist page...');

  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(`  [Sothebys] HTTP ${res.status}`);
      return lots;
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // Try to find embedded JSON data first
    $('script').each((_, script) => {
      const text = $(script).html() || '';
      if (text.includes('__NEXT_DATA__') || text.includes('"lots"') || text.includes('"auctionResults"')) {
        try {
          const jsonMatch = text.match(new RegExp('\\{[\\s\\S]*"lots"[\\s\\S]*\\}')) || text.match(new RegExp('\\{[\\s\\S]*"auctionResults"[\\s\\S]*\\}'));
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            // Navigate to lot data
            const lotArray = data.lots || data.auctionResults || [];
            for (const lot of lotArray) {
              lots.push(parseSothebysLot(lot));
            }
          }
        } catch { /* continue */ }
      }
    });

    // Also try __NEXT_DATA__
    if (lots.length === 0) {
      const nextScript = $('#__NEXT_DATA__').html();
      if (nextScript) {
        try {
          const nextData = JSON.parse(nextScript);
          const pageData = nextData?.props?.pageProps;
          const lotArrays = [
            pageData?.upcomingLots,
            pageData?.pastLots,
            pageData?.lots,
            pageData?.artist?.lots,
          ].filter(Boolean);

          for (const arr of lotArrays) {
            for (const lot of (Array.isArray(arr) ? arr : [])) {
              lots.push(parseSothebysLot(lot));
            }
          }
        } catch {
          console.log('  [Sothebys] Could not parse __NEXT_DATA__');
        }
      }
    }

    // Fallback: parse HTML lot cards
    if (lots.length === 0) {
      const selectors = [
        '[data-testid="lot-card"]',
        '[class*="LotCard"]',
        '[class*="lot-card"]',
        '.SearchModule-results a',
        'a[href*="/buy/auction/"]',
      ];

      for (const selector of selectors) {
        $(selector).each((_, el) => {
          const $el = $(el);
          const title = $el.find('h3, h4, [class*="title"], [class*="Title"]').first().text().trim();
          const href = $el.attr('href') || $el.find('a').first().attr('href') || '';
          const img = $el.find('img').first().attr('src') || null;
          const estText = $el.find('[class*="estimate"], [class*="Estimate"]').text().trim();
          const dateText = $el.find('[class*="date"], time, [class*="Date"]').text().trim();

          if (title && title.length > 1) {
            const estMatch = estText.match(/([\d,]+)\s*[-–]\s*([\d,]+)/);
            const currency = detectCurrency(estText);

            lots.push({
              id: `sothebys-${href.split('/').pop() || `lot-${lots.length}`}`,
              title,
              year: null,
              medium: null,
              dimensions: null,
              imageUrl: img,
              auctionHouse: "Sotheby's",
              saleName: '',
              saleDate: dateText || '',
              lotNumber: null,
              estimateLow: estMatch ? parseInt(estMatch[1].replace(/,/g, '')) : null,
              estimateHigh: estMatch ? parseInt(estMatch[2].replace(/,/g, '')) : null,
              currency,
              hammerPrice: null,
              premiumPrice: null,
              priceUsd: null,
              status: 'upcoming',
              url: href.startsWith('http') ? href : `https://www.sothebys.com${href}`,
            });
          }
        });

        if (lots.length > 0) break;
      }
    }
  } catch (err) {
    console.error('  [Sothebys] Error:', err);
  }

  return lots;
}

function parseSothebysLot(lot: any): AuctionLot {
  const title = lot.title || lot.lotTitle || lot.objectTitle || 'Untitled';
  const href = lot.url || lot.lotUrl || lot.permalink || '';
  const currency = detectCurrency(lot.currency || lot.currencyCode || 'USD');
  const hammerPrice = lot.hammerPrice ?? lot.premiumLotPrice ?? null;

  return {
    id: `sothebys-${lot.lotId || lot.id || lot.objectId || Math.random().toString(36).slice(2)}`,
    title,
    year: lot.year || lot.circa || lot.dateText || null,
    medium: lot.medium || lot.materials || null,
    dimensions: lot.dimensions || lot.size || null,
    imageUrl: lot.image?.url || lot.imageUrl || lot.primaryImage || null,
    auctionHouse: "Sotheby's",
    saleName: lot.saleName || lot.saleTitle || lot.auctionTitle || '',
    saleDate: lot.saleDate || lot.auctionDate || lot.startDate || '',
    lotNumber: lot.lotNumber ? parseInt(lot.lotNumber) : null,
    estimateLow: lot.estimateLow ?? lot.lowEstimate ?? null,
    estimateHigh: lot.estimateHigh ?? lot.highEstimate ?? null,
    currency,
    hammerPrice,
    premiumPrice: lot.premiumLotPrice ?? null,
    priceUsd: lot.premiumLotPrice ?? hammerPrice ?? null,
    status: hammerPrice ? 'sold' : 'upcoming',
    url: href.startsWith('http') ? href : `https://www.sothebys.com${href}`,
  };
}

// ── Helpers ──

function detectCurrency(text: string): Currency {
  if (!text) return 'USD';
  if (text.includes('GBP') || text.includes('£')) return 'GBP';
  if (text.includes('EUR') || text.includes('€')) return 'EUR';
  if (text.includes('HKD') || text.includes('HK$')) return 'HKD';
  if (text.includes('CNY') || text.includes('¥')) return 'CNY';
  return 'USD';
}

// ── Stats Computation ──

function computeStats(lots: AuctionLot[], existingStats: MarketStats | null): MarketStats {
  const sold = lots.filter(l => l.status === 'sold' && l.priceUsd);
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  const recentSold = sold.filter(l => {
    const d = new Date(l.saleDate);
    return !isNaN(d.getTime()) && d >= oneYearAgo;
  });

  const prices = recentSold.map(l => l.priceUsd!).sort((a, b) => a - b);
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : existingStats?.avgPriceLast12Months || 0;
  const median = prices.length ? prices[Math.floor(prices.length / 2)] : existingStats?.medianPriceLast12Months || 0;

  const record = sold.reduce((best, l) =>
    (l.priceUsd || 0) > (best?.priceUsd || 0) ? l : best, sold[0]);

  // Build quarterly price history
  const quarters = new Map<string, number[]>();
  for (const lot of sold) {
    const d = new Date(lot.saleDate);
    if (isNaN(d.getTime())) continue;
    const q = `${d.getFullYear()}-Q${Math.ceil((d.getMonth() + 1) / 3)}`;
    if (!quarters.has(q)) quarters.set(q, []);
    quarters.get(q)!.push(lot.priceUsd!);
  }

  const priceHistory: PricePoint[] = Array.from(quarters.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, pxs]) => ({
      date,
      avgPrice: Math.round(pxs.reduce((a, b) => a + b, 0) / pxs.length),
      medianPrice: pxs.sort((a, b) => a - b)[Math.floor(pxs.length / 2)],
      totalSales: pxs.length,
      highPrice: Math.max(...pxs),
    }));

  // House distribution
  const houseCounts = new Map<string, { count: number; totalValue: number }>();
  for (const lot of sold) {
    const h = lot.auctionHouse;
    const existing = houseCounts.get(h) || { count: 0, totalValue: 0 };
    existing.count++;
    existing.totalValue += lot.priceUsd || 0;
    houseCounts.set(h, existing);
  }

  const houseDistribution: HouseCount[] = Array.from(houseCounts.entries()).map(([house, data]) => ({
    house: house as AuctionHouse,
    count: data.count,
    totalValue: data.totalValue,
  }));

  // If we have fewer lots than the known total, preserve the existing total
  const totalLotsTracked = Math.max(lots.length, existingStats?.totalLotsTracked || 0);

  return {
    lastUpdated: now.toISOString(),
    totalLotsTracked,
    avgPriceLast12Months: avg,
    medianPriceLast12Months: median,
    recordPrice: record?.priceUsd || existingStats?.recordPrice || 0,
    recordTitle: record?.title || existingStats?.recordTitle || '',
    recordDate: record?.saleDate || existingStats?.recordDate || '',
    recordHouse: record?.auctionHouse || existingStats?.recordHouse || 'Phillips',
    appreciationRate: existingStats?.appreciationRate || 42.5,
    totalAuctionRevenue: sold.reduce((sum, l) => sum + (l.priceUsd || 0), 0),
    priceHistory: priceHistory.length > 0 ? priceHistory : existingStats?.priceHistory || [],
    houseDistribution: houseDistribution.length > 0 ? houseDistribution : existingStats?.houseDistribution || [],
  };
}

// ── Main ──

async function main() {
  console.log('[Ray] Starting auction crawl...');
  console.log(`[Ray] Data directory: ${DATA_DIR}`);

  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Load existing data
  let existingLots: AuctionLot[] = [];
  let existingStats: MarketStats | null = null;
  const lotsPath = path.join(DATA_DIR, 'lots.json');
  const statsPath = path.join(DATA_DIR, 'stats.json');

  if (fs.existsSync(lotsPath)) {
    try {
      existingLots = JSON.parse(fs.readFileSync(lotsPath, 'utf-8'));
      console.log(`[Ray] Loaded ${existingLots.length} existing lots.`);
    } catch { console.log('[Ray] Could not parse existing lots.json'); }
  }
  if (fs.existsSync(statsPath)) {
    try {
      existingStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
    } catch { /* ignore */ }
  }

  // Crawl sources
  console.log('[Ray] Crawling Phillips...');
  const phillipsLots = await crawlPhillips();
  console.log(`[Ray] Phillips: ${phillipsLots.length} lots`);

  await sleep(DELAY_MS);

  console.log('[Ray] Crawling Sothebys...');
  const sothebysLots = await crawlSothebys();
  console.log(`[Ray] Sothebys: ${sothebysLots.length} lots`);

  // Merge: new data overwrites existing by ID
  const lotMap = new Map<string, AuctionLot>();
  for (const lot of existingLots) lotMap.set(lot.id, lot);
  for (const lot of [...phillipsLots, ...sothebysLots]) lotMap.set(lot.id, lot);

  const allLots = Array.from(lotMap.values()).sort((a, b) => {
    const da = new Date(a.saleDate).getTime();
    const db = new Date(b.saleDate).getTime();
    if (isNaN(da) && isNaN(db)) return 0;
    if (isNaN(da)) return 1;
    if (isNaN(db)) return -1;
    return db - da;
  });

  // Compute stats
  const stats = computeStats(allLots, existingStats);

  // Write output
  fs.writeFileSync(lotsPath, JSON.stringify(allLots, null, 2));
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'meta.json'), JSON.stringify({
    lastCrawl: new Date().toISOString(),
    sources: ['Phillips', "Sotheby's"],
    version: 1,
  }, null, 2));

  console.log(`[Ray] Done. ${allLots.length} total lots written.`);
}

main().catch(err => {
  console.error('[Ray] Fatal error:', err);
  process.exit(1);
});
