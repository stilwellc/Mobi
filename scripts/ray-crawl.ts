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
// Phillips embeds lot data as a JSON string in ReactDOM.hydrate props for ArtistLanding.
// The "maker" prop contains a JSON-encoded string with pastLots.results[].

async function crawlPhillips(): Promise<AuctionLot[]> {
  const lots: AuctionLot[] = [];
  const url = 'https://www.phillips.com/artist/10606/george-condo';
  console.log('  [Phillips] Fetching artist page...');

  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(`  [Phillips] HTTP ${res.status}`);
      return lots;
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // Find the script containing ArtistLanding hydration with the maker prop
    let makerData: any = null;
    $('script').each((_, script) => {
      if (makerData) return;
      const text = $(script).html() || '';
      if (!text.includes('ArtistLanding')) return;

      // The maker prop uses \u0022 unicode escapes for quotes (not \")
      // Pattern: "maker":"\u0022pastLots\u0022:..."
      const makerMatch = text.match(/"maker":"([^"]*)"/);
      if (makerMatch) {
        try {
          // The value is a JSON string with \u0022 escapes — JSON.parse handles these natively
          const innerJson = JSON.parse('"' + makerMatch[1] + '"');
          makerData = JSON.parse(innerJson);
          console.log(`  [Phillips] Found maker data with ${makerData?.pastLots?.totalCount || 0} total lots`);
        } catch (e) {
          console.log('  [Phillips] Failed to parse maker prop:', (e as Error).message?.substring(0, 100));
        }
      }
    });

    if (!makerData?.pastLots?.data) {
      console.log('  [Phillips] No structured lot data found');
      return lots;
    }

    const lotData = makerData.pastLots.data;
    console.log(`  [Phillips] Parsing ${lotData.length} lots from page 1...`);

    for (const lot of lotData) {
      const title = lot.description || lot.title || lot.lotTitle || 'Untitled';
      const saleNum = lot.saleNumber || '';
      const lotNum = lot.lotNumber || '';
      const detailLink = lot.detailLink || lot.url || `/detail/${saleNum}/${lotNum}`;
      const currency = detectCurrency(lot.currencySign || '');
      const hammerBP = lot.hammerPlusBP ?? lot.hammerPlusCommission ?? null;
      const hammer = lot.hammerPrice ?? null;
      const soldPrice = hammerBP ?? hammer;
      const isSold = soldPrice != null && soldPrice > 0;

      // Determine if auction is in the past (unsold lots from past auctions = bought_in)
      let auctionInPast = false;
      if (lot.auctionStartDateTimeOffset) {
        const aDate = new Date(lot.auctionStartDateTimeOffset);
        auctionInPast = !isNaN(aDate.getTime()) && aDate < new Date();
      }

      // Build image URL from Phillips Cloudinary
      let imageUrl: string | null = null;
      if (lot.imagePath) {
        const ver = lot.cloudinaryVersion || '1';
        imageUrl = `https://assets.phillips.com/image/upload/t_Website_LotDetailMainImage/v${ver}/${lot.imagePath}`;
      }

      // Parse the auction date
      let saleDate = '';
      if (lot.auctionStartDateTimeOffset) {
        saleDate = lot.auctionStartDateTimeOffset.split('T')[0];
      } else if (lot.saleDate) {
        saleDate = lot.saleDate;
      }

      lots.push({
        id: `phillips-${saleNum}-${lotNum}`,
        title,
        year: lot.dates || lot.circa || null,
        medium: lot.medium || null,
        dimensions: lot.dimensions || null,
        imageUrl,
        auctionHouse: 'Phillips',
        saleName: lot.saleTitle || '',
        saleDate,
        lotNumber: lotNum ? parseInt(lotNum) : null,
        estimateLow: lot.lowEstimate ?? null,
        estimateHigh: lot.highEstimate ?? null,
        currency,
        hammerPrice: hammer,
        premiumPrice: hammerBP,
        priceUsd: soldPrice,
        status: isSold ? 'sold' : auctionInPast ? 'bought_in' : 'upcoming',
        url: detailLink.startsWith('http') ? detailLink : `https://www.phillips.com${detailLink}`,
      });
    }
  } catch (err) {
    console.error('  [Phillips] Error:', err);
  }

  return lots;
}

// ── Sotheby's Crawler ──
// The Sotheby's artist page has distinct "Upcoming Lots" and "Past Lots" sections.
// We parse lot cards from the HTML, using section context to determine status.
// Past lots whose sale date is in the past are marked as "sold".

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

    // Only look at /buy/auction/ links (skip old ecatalogue links which have unusable slugs like "lot.25.html")
    const allLinks = $('a[href*="/buy/auction/"]').toArray();
    console.log(`  [Sothebys] Found ${allLinks.length} raw lot links`);

    const now = new Date();
    const seen = new Set<string>();

    for (const el of allLinks) {
      const $el = $(el);
      const href = $el.attr('href') || '';

      // Extract the slug (last segment of the URL)
      const slug = href.split('/').pop() || '';
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);

      // Derive title from URL slug — convert slug to title case
      // e.g. "george-condo-qiao-zhikang-duo-the-boy-with-white" → "The Boy With White"
      let titleSlug = slug
        .replace(/^george-condo-qiao-zhi?-?kang-duo-?/i, '')
        .replace(/^george-condo-?/i, '');

      if (!titleSlug || titleSlug.length < 2) continue;
      const title = titleSlug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      // Get year from URL: /auction/YYYY/
      const yearMatch = href.match(/\/auction\/(\d{4})\//);
      const auctionYear = yearMatch ? parseInt(yearMatch[1]) : null;

      // Determine status: only current/future year lots are upcoming
      let status: LotStatus = 'sold';
      let saleDate = '';
      if (auctionYear) {
        saleDate = `${auctionYear}-06-01`;
        if (auctionYear >= now.getFullYear()) {
          status = 'upcoming';
        }
      }

      const fullUrl = href.startsWith('http') ? href : `https://www.sothebys.com${href}`;

      lots.push({
        id: `sothebys-${slug}`,
        title,
        year: null,
        medium: null,
        dimensions: null,
        imageUrl: null,
        auctionHouse: "Sotheby's",
        saleName: '',
        saleDate,
        lotNumber: null,
        estimateLow: null,
        estimateHigh: null,
        currency: 'USD',
        hammerPrice: null,
        premiumPrice: null,
        priceUsd: null,
        status,
        url: fullUrl,
      });
    }

    console.log(`  [Sothebys] Parsed ${lots.length} unique lots (${lots.filter(l => l.status === 'upcoming').length} upcoming, ${lots.filter(l => l.status === 'sold').length} past)`);
  } catch (err) {
    console.error('  [Sothebys] Error:', err);
  }

  return lots;
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

  // Clean up stale/bad entries
  const badIds = new Set<string>();
  for (const [id, lot] of Array.from(lotMap.entries())) {
    // Remove ecatalogue slug entries (e.g. "Lot.25.html")
    if (lot.title.match(/^Lot\.\d+/i)) badIds.add(id);
    // Remove the seed duplicate if we have a crawled version
    if (id === 'sothebys-upcoming-boy-white-hat' && lotMap.has('sothebys-george-condo-qiao-zhikang-duo-the-boy-with-white')) {
      badIds.add(id);
    }
  }
  for (const id of Array.from(badIds)) lotMap.delete(id);

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
