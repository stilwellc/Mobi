import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

// ── Types (mirrored from app/digital/ray/types.ts to avoid import issues in standalone script) ──

type AuctionHouse = 'Phillips' | "Sotheby's" | "Christie's" | 'Wright' | 'Rago' | 'Heritage';
type LotStatus = 'upcoming' | 'sold' | 'bought_in' | 'withdrawn';
type Currency = 'USD' | 'GBP' | 'EUR' | 'HKD' | 'CNY';

interface AuctionLot {
  id: string;
  artist: string;
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

// ── Artist Configuration ──

interface ArtistConfig {
  slug: string;
  displayName: string;
  phillips?: { id: string; slug: string };
  sothebys?: string;
  christies?: string;
  wright?: string;
}

const ARTISTS: ArtistConfig[] = [
  {
    slug: 'george-condo',
    displayName: 'George Condo',
    phillips: { id: '10606', slug: 'george-condo' },
    sothebys: 'george-condo',
    christies: 'george-condo',
    wright: 'george-condo',
  },
  {
    slug: 'futura-2000',
    displayName: 'Futura 2000',
    phillips: { id: '4001', slug: 'futura-2000' },
    christies: 'futura',
    // No Sotheby's or Wright artist page for Futura
  },
];

const DATA_DIR = path.join(process.cwd(), 'public', 'data', 'ray');
const DELAY_MS = 1500;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Phillips Crawler ──
// Phillips embeds lot data as a JSON string in ReactDOM.hydrate props for ArtistLanding.
// The "maker" prop contains a JSON-encoded string with pastLots.data[].

async function crawlPhillips(artist: ArtistConfig): Promise<AuctionLot[]> {
  if (!artist.phillips) return [];
  const lots: AuctionLot[] = [];
  const url = `https://www.phillips.com/artist/${artist.phillips.id}/${artist.phillips.slug}`;
  console.log(`  [Phillips] Fetching ${artist.displayName}...`);

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
      const makerMatch = text.match(/"maker":"([^"]*)"/);
      if (makerMatch) {
        try {
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

      let auctionInPast = false;
      if (lot.auctionStartDateTimeOffset) {
        const aDate = new Date(lot.auctionStartDateTimeOffset);
        auctionInPast = !isNaN(aDate.getTime()) && aDate < new Date();
      }

      let imageUrl: string | null = null;
      if (lot.imagePath) {
        const ver = lot.cloudinaryVersion || '1';
        imageUrl = `https://assets.phillips.com/image/upload/t_Website_LotDetailMainImage/v${ver}/${lot.imagePath}`;
      }

      let saleDate = '';
      if (lot.auctionStartDateTimeOffset) {
        saleDate = lot.auctionStartDateTimeOffset.split('T')[0];
      } else if (lot.saleDate) {
        saleDate = lot.saleDate;
      }

      lots.push({
        id: `phillips-${saleNum}-${lotNum}`,
        artist: artist.slug,
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
        priceUsd: toUsd(soldPrice, currency),
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
// Parses lot links from the artist page HTML.

async function crawlSothebys(artist: ArtistConfig): Promise<AuctionLot[]> {
  if (!artist.sothebys) return [];
  const lots: AuctionLot[] = [];
  const url = `https://www.sothebys.com/en/artists/${artist.sothebys}`;
  console.log(`  [Sothebys] Fetching ${artist.displayName}...`);

  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(`  [Sothebys] HTTP ${res.status}`);
      return lots;
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    const allLinks = $('a[href*="/buy/auction/"]').toArray();
    console.log(`  [Sothebys] Found ${allLinks.length} raw lot links`);

    const now = new Date();
    const seen = new Set<string>();
    // Build regex to strip artist name prefix from slugs
    const artistSlugParts = artist.sothebys.split('-');
    const stripPrefix = new RegExp(`^${artistSlugParts.join('-?')}-?`, 'i');

    for (const el of allLinks) {
      const $el = $(el);
      const href = $el.attr('href') || '';

      const slug = href.split('/').pop() || '';
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);

      // Strip artist name prefix and any co-artist prefixes
      let titleSlug = slug.replace(stripPrefix, '');
      // Also strip common Sotheby's co-artist prefixes
      titleSlug = titleSlug.replace(/^qiao-zhi?-?kang-duo-?/i, '');

      if (!titleSlug || titleSlug.length < 2) continue;
      const title = titleSlug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const yearMatch = href.match(/\/auction\/(\d{4})\//);
      const auctionYear = yearMatch ? parseInt(yearMatch[1]) : null;

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
        artist: artist.slug,
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

// ── Christie's Crawler ──
// Christie's embeds lot data as JSON in window.chrComponents.configurableSearch.

async function crawlChristies(artist: ArtistConfig): Promise<AuctionLot[]> {
  if (!artist.christies) return [];
  const url = `https://www.christies.com/en/artists/${artist.christies}?lotavailability=All&sortby=relevance`;
  console.log(`  [Christie's] Fetching ${artist.displayName}...`);

  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(`  [Christie's] HTTP ${res.status}`);
      return [];
    }
    const html = await res.text();

    const searchMatch = html.match(/window\.chrComponents\s*=\s*window\.chrComponents\s*\|\|\s*\{\};\s*window\.chrComponents\.configurableSearch\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
    if (!searchMatch) {
      const altMatch = html.match(/configurableSearch\s*=\s*(\{[\s\S]*?\});\s*(?:window\.|<\/script>)/);
      if (!altMatch) {
        console.log("  [Christie's] Could not find configurableSearch JSON");
        return [];
      }
      return parseChristiesJson(altMatch[1], artist.slug);
    }
    return parseChristiesJson(searchMatch[1], artist.slug);
  } catch (err) {
    console.error("  [Christie's] Error:", err);
  }

  return [];
}

function parseChristiesJson(jsonStr: string, artistSlug: string): AuctionLot[] {
  const lots: AuctionLot[] = [];
  try {
    const data = JSON.parse(jsonStr);
    const lotData = data?.data?.lots || data?.lots || [];
    console.log(`  [Christie's] Found ${lotData.length} lots`);

    for (const lot of lotData) {
      const titleSecondary = lot.title_secondary_txt || '';
      const title = titleSecondary || lot.title_primary_txt || 'Untitled';
      const lotId = lot.object_id || lot.lot_id_txt || '';
      const lotUrl = lot.url || `https://www.christies.com/en/lot/lot-${lotId}`;

      const estimateStr = lot.estimate_txt || '';
      const currency = detectCurrency(estimateStr);
      let estimateLow: number | null = null;
      let estimateHigh: number | null = null;
      const estMatch = estimateStr.match(/([\d,]+)\s*[-–]\s*([\d,]+)/);
      if (estMatch) {
        estimateLow = parseInt(estMatch[1].replace(/,/g, ''));
        estimateHigh = parseInt(estMatch[2].replace(/,/g, ''));
      }

      const priceStr = lot.price_realised_txt || '';
      let priceRealized: number | null = null;
      const priceMatch = priceStr.match(/([\d,]+)/);
      if (priceMatch) {
        priceRealized = parseInt(priceMatch[0].replace(/,/g, ''));
      }

      const saleDate = lot.start_date ? lot.start_date.split('T')[0] : '';
      const auctionInPast = saleDate ? new Date(saleDate) < new Date() : false;
      const isSold = priceRealized != null && priceRealized > 0;
      const imageUrl = lot.image?.image_src || null;
      const saleNum = lot.sale?.number || '';
      const lotNum = lot.lot_id_txt || '';

      lots.push({
        id: `christies-${lotId}`,
        artist: artistSlug,
        title: title.replace(/<[^>]*>/g, ''),
        year: null,
        medium: null,
        dimensions: null,
        imageUrl,
        auctionHouse: "Christie's",
        saleName: lot.sale?.location ? `${lot.sale.location} Sale ${saleNum}` : '',
        saleDate,
        lotNumber: lotNum ? parseInt(lotNum) : null,
        estimateLow,
        estimateHigh,
        currency,
        hammerPrice: null,
        premiumPrice: priceRealized,
        priceUsd: toUsd(priceRealized, currency),
        status: isSold ? 'sold' : auctionInPast ? 'bought_in' : 'upcoming',
        url: lotUrl.startsWith('http') ? lotUrl : `https://www.christies.com${lotUrl}`,
      });
    }
  } catch (e) {
    console.log("  [Christie's] JSON parse error:", (e as Error).message?.substring(0, 100));
  }
  return lots;
}

// ── Wright/Rago Crawler ──
// Wright uses Inertia.js (Laravel + Vue). All lot data is in the #app div's data-page attribute.

async function crawlWright(artist: ArtistConfig): Promise<AuctionLot[]> {
  if (!artist.wright) return [];
  const lots: AuctionLot[] = [];
  const url = `https://www.wright20.com/artists/${artist.wright}`;
  console.log(`  [Wright] Fetching ${artist.displayName}...`);

  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(`  [Wright] HTTP ${res.status}`);
      return lots;
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    const dataPage = $('#app').attr('data-page');
    if (!dataPage) {
      console.log('  [Wright] No data-page attribute found on #app');
      return lots;
    }

    const pageData = JSON.parse(dataPage);
    const resultsGrouped = pageData?.props?.results_grouped;
    if (!resultsGrouped || !Array.isArray(resultsGrouped) || resultsGrouped.length === 0) {
      console.log('  [Wright] No results_grouped in page data');
      return lots;
    }

    let totalItems = 0;
    for (const group of resultsGrouped) {
      const sessions = group.sessions || {};
      for (const sessionKey of Object.keys(sessions)) {
        const session = sessions[sessionKey];
        const items = session.items || [];
        for (const item of items) {
          totalItems++;
          const title = item.name || 'Untitled';
          const lotNum = item.lot_number || null;
          const house = (item.house || 'Wright') as string;

          const result = item.result || null;
          const resultSansPremium = item.result_sans_premium || null;

          const estStr = item.estimate_formatted || '';
          let estimateLow: number | null = null;
          let estimateHigh: number | null = null;
          const estMatch = estStr.match(/([\d,]+)\s*[–\-]\s*([\d,]+)/);
          if (estMatch) {
            estimateLow = parseInt(estMatch[1].replace(/,/g, ''));
            estimateHigh = parseInt(estMatch[2].replace(/,/g, ''));
          }

          const sessionDate = session.date || item.session?.date || '';
          let saleDate = '';
          if (sessionDate) {
            try {
              const d = new Date(sessionDate);
              if (!isNaN(d.getTime())) {
                saleDate = d.toISOString().split('T')[0];
              }
            } catch { /* skip */ }
          }

          const auctionInPast = saleDate ? new Date(saleDate) < new Date() : false;
          const isSold = result != null && result > 0;
          const imageUrl = item.primary_index_image || null;

          let lotUrl = item.alias || '';
          if (lotUrl.startsWith('//')) lotUrl = 'https:' + lotUrl;
          else if (!lotUrl.startsWith('http') && lotUrl) lotUrl = 'https://www.wright20.com' + lotUrl;

          const auctionHouse: AuctionHouse = house.toLowerCase().includes('rago') ? 'Rago' : 'Wright';
          const dims = item.formatted_dimensions || null;

          lots.push({
            id: `wright-${item.fd_key || `${lotNum}-${sessionKey}`}`,
            artist: artist.slug,
            title,
            year: null,
            medium: null,
            dimensions: dims ? dims.replace(/&times;/g, '×').replace(/&ndash;/g, '–') : null,
            imageUrl,
            auctionHouse,
            saleName: session.title || '',
            saleDate,
            lotNumber: lotNum,
            estimateLow,
            estimateHigh,
            currency: 'USD',
            hammerPrice: resultSansPremium,
            premiumPrice: result,
            priceUsd: result,
            status: isSold ? 'sold' : auctionInPast ? 'bought_in' : 'upcoming',
            url: lotUrl,
          });
        }
      }
    }

    console.log(`  [Wright] Parsed ${totalItems} lots`);
  } catch (err) {
    console.error('  [Wright] Error:', err);
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

// Rough static conversion to USD for stats/charts (avoids API dependency)
const USD_RATES: Record<Currency, number> = {
  USD: 1,
  GBP: 1.27,
  EUR: 1.08,
  HKD: 0.128,
  CNY: 0.138,
};

function toUsd(amount: number | null, currency: Currency): number | null {
  if (amount == null) return null;
  return Math.round(amount * (USD_RATES[currency] || 1));
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
    appreciationRate: existingStats?.appreciationRate || 0,
    totalAuctionRevenue: sold.reduce((sum, l) => sum + (l.priceUsd || 0), 0),
    priceHistory: priceHistory.length > 0 ? priceHistory : existingStats?.priceHistory || [],
    houseDistribution: houseDistribution.length > 0 ? houseDistribution : existingStats?.houseDistribution || [],
  };
}

// ── Crawl a single artist across all houses ──

async function crawlArtist(artist: ArtistConfig): Promise<AuctionLot[]> {
  const allLots: AuctionLot[] = [];

  console.log(`\n[Ray] === ${artist.displayName} ===`);

  console.log(`[Ray] Crawling Phillips...`);
  const phillipsLots = await crawlPhillips(artist);
  console.log(`[Ray] Phillips: ${phillipsLots.length} lots`);
  allLots.push(...phillipsLots);

  await sleep(DELAY_MS);

  console.log(`[Ray] Crawling Sothebys...`);
  const sothebysLots = await crawlSothebys(artist);
  console.log(`[Ray] Sothebys: ${sothebysLots.length} lots`);
  allLots.push(...sothebysLots);

  await sleep(DELAY_MS);

  console.log(`[Ray] Crawling Christie's...`);
  const christiesLots = await crawlChristies(artist);
  console.log(`[Ray] Christie's: ${christiesLots.length} lots`);
  allLots.push(...christiesLots);

  await sleep(DELAY_MS);

  console.log(`[Ray] Crawling Wright/Rago...`);
  const wrightLots = await crawlWright(artist);
  console.log(`[Ray] Wright/Rago: ${wrightLots.length} lots`);
  allLots.push(...wrightLots);

  return allLots;
}

// ── Main ──

async function main() {
  console.log('[Ray] Starting auction crawl...');
  console.log(`[Ray] Data directory: ${DATA_DIR}`);
  console.log(`[Ray] Artists: ${ARTISTS.map(a => a.displayName).join(', ')}`);

  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Load existing data
  let existingLots: AuctionLot[] = [];
  const existingStatsByArtist: Record<string, MarketStats> = {};
  const lotsPath = path.join(DATA_DIR, 'lots.json');
  const statsPath = path.join(DATA_DIR, 'stats.json');

  if (fs.existsSync(lotsPath)) {
    try {
      existingLots = JSON.parse(fs.readFileSync(lotsPath, 'utf-8'));
      // Backfill artist field for legacy lots without one
      for (const lot of existingLots) {
        if (!lot.artist) lot.artist = 'george-condo';
      }
      console.log(`[Ray] Loaded ${existingLots.length} existing lots.`);
    } catch { console.log('[Ray] Could not parse existing lots.json'); }
  }
  if (fs.existsSync(statsPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
      // Handle both old format (single MarketStats) and new format (keyed by artist)
      if (raw.lastUpdated) {
        // Old format — assign to george-condo
        existingStatsByArtist['george-condo'] = raw;
      } else {
        Object.assign(existingStatsByArtist, raw);
      }
    } catch { /* ignore */ }
  }

  // Crawl all artists
  const freshLots: AuctionLot[] = [];
  for (const artist of ARTISTS) {
    const lots = await crawlArtist(artist);
    freshLots.push(...lots);
    if (artist !== ARTISTS[ARTISTS.length - 1]) await sleep(DELAY_MS);
  }

  // Merge: new data overwrites existing by ID
  const lotMap = new Map<string, AuctionLot>();
  for (const lot of existingLots) lotMap.set(lot.id, lot);
  for (const lot of freshLots) lotMap.set(lot.id, lot);

  // Clean up stale/bad entries
  const badIds = new Set<string>();
  for (const [id, lot] of Array.from(lotMap.entries())) {
    if (lot.title.match(/^Lot\.\d+/i)) badIds.add(id);
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

  // Compute per-artist stats
  const statsByArtist: Record<string, MarketStats> = {};
  for (const artist of ARTISTS) {
    const artistLots = allLots.filter(l => l.artist === artist.slug);
    statsByArtist[artist.slug] = computeStats(artistLots, existingStatsByArtist[artist.slug] || null);
    console.log(`[Ray] ${artist.displayName}: ${artistLots.length} lots, ${artistLots.filter(l => l.status === 'sold').length} sold`);
  }

  // Write output
  fs.writeFileSync(lotsPath, JSON.stringify(allLots, null, 2));
  fs.writeFileSync(statsPath, JSON.stringify(statsByArtist, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'meta.json'), JSON.stringify({
    lastCrawl: new Date().toISOString(),
    artists: ARTISTS.map(a => ({ slug: a.slug, displayName: a.displayName })),
    sources: ['Phillips', "Sotheby's", "Christie's", 'Wright/Rago'],
    version: 2,
  }, null, 2));

  console.log(`\n[Ray] Done. ${allLots.length} total lots written.`);
}

main().catch(err => {
  console.error('[Ray] Fatal error:', err);
  process.exit(1);
});
