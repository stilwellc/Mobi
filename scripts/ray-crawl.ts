import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

// ── Types (mirrored from app/digital/ray/types.ts to avoid import issues in standalone script) ──

type AuctionHouse = 'Phillips' | "Sotheby's" | "Christie's" | 'Wright' | 'Rago' | 'Heritage' | 'Bonhams' | 'Hindman';
type LotStatus = 'upcoming' | 'sold' | 'bought_in' | 'withdrawn';
type Currency = 'USD' | 'GBP' | 'EUR' | 'HKD' | 'CNY' | 'AUD' | 'CHF';
type LotCategory = 'original' | 'print' | 'photograph' | 'sculpture' | 'design' | 'unknown';

interface AuctionLot {
  id: string;
  artist: string;
  title: string;
  year: string | null;
  medium: string | null;
  dimensions: string | null;
  category: LotCategory;
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

// ── Lot Classification ──
// Classifies a lot as original, print, photograph, sculpture, design, or unknown
// based on medium, title, sale name, URL, and artist context.

const DESIGN_ARTISTS = new Set(['george-nakashima', 'charles-eames']);
// Fine artists whose unclassified lots default to 'print' (edition-heavy output)
const EDITION_DEFAULT_ARTISTS = new Set(['andy-warhol', 'keith-haring', 'ed-ruscha', 'henri-matisse', 'pablo-picasso']);
// Fine artists whose unclassified lots default to 'original' (painting/drawing-heavy output)
const ORIGINAL_DEFAULT_ARTISTS = new Set([
  'george-condo', 'kaws', 'raymond-pettibon', 'peter-saul',
  'tom-sachs', 'barry-mcgee', 'futura-2000', 'r-crumb', 'fab-5-freddy',
]);

const PRINT_PATTERNS = /\b(screenprint|silkscreen|serigraph|lithograph|etching|woodcut|woodblock|linocut|engraving|aquatint|monotype|monoprint|offset|poster|gicl[eé]e|print(?:ed)?|edition of|numbered.*\/|signed.*numbered|multiple|chromolithograph|intaglio)\b/i;
const PHOTO_PATTERNS = /\b(photograph|gelatin silver|c-print|chromogenic|daguerreotype|platinum print|pigment print|inkjet print|archival pigment|digital print|cibachrome|polaroid|albumen)\b/i;
const SCULPTURE_PATTERNS = /\b(sculpture|bronze|ceramic|porcelain|cast iron|resin|fibreglass|fiberglass|stainless steel|patinated|figure|figurine|plaster cast)\b/i;
const DESIGN_PATTERNS = /\b(lounge chair|dining chair|side chair|armchair|cabinet|desk|table|bookcase|shelf|shelving|headboard|bench|settee|sofa|credenza|dresser|nightstand|lamp|chandelier|sconce|light fixture|ottoman|stool|rocker|rocking chair|walnut|rosewood|teak|plywood|upholster|enameled|molded|fiberglass shell)\b/i;
const ORIGINAL_PATTERNS = /\b(oil on|acrylic on|tempera on|gouache on|watercolor on|watercolour on|mixed media on|ink on|charcoal on|pastel on|enamel on|spray paint on|oil and|acrylic and|encaustic|collage on|canvas|linen|panel|board|paper(?! print))\b/i;

// Title patterns that signal editions: "from [Series]", "plate(s)", known series formats
const TITLE_EDITION_PATTERNS = /\b(plates?\s*,?\s*from\b|,\s*from\s+[A-Z]|\bfrom\s+the\s+portfolio\b|\bfrom\s+(?:Myths|Ads|Flowers|Marilyn|Mao|Campbell|Electric Chair|Endangered Species|Cowboys and Indians|Ladies and Gentlemen|Flash|Martha Graham|Hans Christian Andersen|Wild Raspberries|In the Bottom|Ten Portraits|Space Fruit|Sunset|Ingrid Bergman|Reigning Queens))\b/i;

function classifyLot(lot: AuctionLot): LotCategory {
  // Combine all text signals
  const medium = (lot.medium || '').toLowerCase();
  const title = (lot.title || '').toLowerCase();
  const saleName = (lot.saleName || '').toLowerCase();
  const url = (lot.url || '').toLowerCase();
  const text = `${medium} ${title}`;

  // Design artists default to "design" unless clearly something else
  const isDesignArtist = DESIGN_ARTISTS.has(lot.artist);

  // 1. Check medium field first (most reliable when populated)
  // Photo checked before print since "c-print", "Polaroid print" etc. are photographs
  if (medium) {
    if (PHOTO_PATTERNS.test(medium)) return 'photograph';
    if (PRINT_PATTERNS.test(medium)) return 'print';
    if (SCULPTURE_PATTERNS.test(medium)) return 'sculpture';
    if (DESIGN_PATTERNS.test(medium)) return 'design';
    if (ORIGINAL_PATTERNS.test(medium)) return 'original';
  }

  // 2. Check title for explicit medium patterns
  if (PHOTO_PATTERNS.test(title)) return 'photograph';
  if (PRINT_PATTERNS.test(title)) return 'print';
  if (SCULPTURE_PATTERNS.test(title)) return 'sculpture';
  if (DESIGN_PATTERNS.test(title)) return 'design';

  // 3. Title patterns that strongly signal editions: "X plate(s), from Y", "from [Known Series]"
  if (TITLE_EDITION_PATTERNS.test(lot.title)) return 'print';

  // 4. Check sale name for category clues
  if (/prints?\s*[&+]\s*multiples?/i.test(saleName) || /prints?\s+unlimited/i.test(saleName)) return 'print';
  if (/photograph/i.test(saleName)) return 'photograph';
  if (/design/i.test(saleName) || /furniture/i.test(saleName)) return 'design';

  // 5. Check URL path
  if (/\/prints?\b/i.test(url)) return 'print';
  if (/\/photograph/i.test(url)) return 'photograph';
  if (/\/design/i.test(url)) return 'design';

  // 6. Artist-level defaults
  if (isDesignArtist) return 'design';
  if (EDITION_DEFAULT_ARTISTS.has(lot.artist)) return 'print';
  if (ORIGINAL_DEFAULT_ARTISTS.has(lot.artist)) return 'original';

  // 7. If we have a medium field but nothing matched the patterns, likely original
  if (medium && ORIGINAL_PATTERNS.test(text)) return 'original';

  return 'unknown';
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
  bonhams?: string;
  hindman?: string;
}

const ARTISTS: ArtistConfig[] = [
  {
    slug: 'george-condo',
    displayName: 'George Condo',
    phillips: { id: '10606', slug: 'george-condo' },
    sothebys: 'george-condo',
    christies: 'george-condo',
    wright: 'george-condo',
    bonhams: 'George Condo',
  },
  {
    slug: 'futura-2000',
    displayName: 'Futura 2000',
    phillips: { id: '4001', slug: 'futura-2000' },
    christies: 'futura',
    wright: 'futura-lenny-mcgurr',
    bonhams: 'Futura 2000',
  },
  {
    slug: 'kaws',
    displayName: 'KAWS',
    phillips: { id: '4271', slug: 'kaws' },
    sothebys: 'kaws',
    christies: 'kaws',
    wright: 'kaws-brian-donnelly',
    bonhams: 'KAWS',
  },
  {
    slug: 'george-nakashima',
    displayName: 'George Nakashima',
    phillips: { id: '379', slug: 'george-nakashima' },
    sothebys: 'george-nakashima',
    christies: 'george-nakashima',
    wright: 'george-nakashima',
    bonhams: 'George Nakashima',
  },
  {
    slug: 'charles-eames',
    displayName: 'Charles & Ray Eames',
    phillips: { id: '10514', slug: 'charles-eames-and-ray-eames' },
    wright: 'charles-and-ray-eames',
    bonhams: 'Charles Eames',
  },
  {
    slug: 'andy-warhol',
    displayName: 'Andy Warhol',
    phillips: { id: '10449', slug: 'andy-warhol' },
    sothebys: 'andy-warhol',
    christies: 'andy-warhol',
    wright: 'andy-warhol',
    bonhams: 'Andy Warhol',
  },
  {
    slug: 'tom-sachs',
    displayName: 'Tom Sachs',
    phillips: { id: '7698', slug: 'tom-sachs' },
    sothebys: 'tom-sachs',
    christies: 'tom-sachs',
    wright: 'tom-sachs',
    bonhams: 'Tom Sachs',
  },
  {
    slug: 'barry-mcgee',
    displayName: 'Barry McGee',
    phillips: { id: '3470', slug: 'barry-mcgee' },
    christies: 'barry-mcgee',
    wright: 'barry-mcgee',
    bonhams: 'Barry McGee',
  },
  {
    slug: 'keith-haring',
    displayName: 'Keith Haring',
    phillips: { id: '11032', slug: 'keith-haring' },
    sothebys: 'keith-haring',
    christies: 'keith-haring',
    wright: 'keith-haring',
    bonhams: 'Keith Haring',
  },
  {
    slug: 'peter-saul',
    displayName: 'Peter Saul',
    phillips: { id: '8398', slug: 'peter-saul' },
    christies: 'peter-saul',
    wright: 'peter-saul',
    bonhams: 'Peter Saul',
  },
  {
    slug: 'ed-ruscha',
    displayName: 'Ed Ruscha',
    phillips: { id: '11024', slug: 'ed-ruscha' },
    sothebys: 'ed-ruscha',
    christies: 'ed-ruscha',
    wright: 'ed-ruscha',
    bonhams: 'Ed Ruscha',
  },
  {
    slug: 'r-crumb',
    displayName: 'R. Crumb',
    phillips: { id: '7549', slug: 'robert-crumb' },
    wright: 'robert-crumb',
    bonhams: 'Robert Crumb',
  },
  {
    slug: 'raymond-pettibon',
    displayName: 'Raymond Pettibon',
    phillips: { id: '10831', slug: 'raymond-pettibon' },
    sothebys: 'raymond-pettibon',
    christies: 'raymond-pettibon',
    wright: 'raymond-pettibon',
    bonhams: 'Raymond Pettibon',
  },
  {
    slug: 'henri-matisse',
    displayName: 'Henri Matisse',
    phillips: { id: '10638', slug: 'henri-matisse' },
    sothebys: 'henri-matisse',
    christies: 'henri-matisse',
    wright: 'henri-matisse',
    bonhams: 'Henri Matisse',
  },
  {
    slug: 'pablo-picasso',
    displayName: 'Pablo Picasso',
    phillips: { id: '10800', slug: 'pablo-picasso' },
    sothebys: 'pablo-picasso',
    christies: 'pablo-picasso',
    wright: 'pablo-picasso',
    bonhams: 'Pablo Picasso',
  },
  {
    slug: 'fab-5-freddy',
    displayName: 'Fab 5 Freddy',
    phillips: { id: '10358', slug: 'fred-brathwaite-aka-fab-5-freddy' },
    bonhams: 'Fab 5 Freddy',
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
        category: 'unknown' as LotCategory,
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

    const now = new Date();
    const seen = new Set<string>();
    const artistSlugParts = artist.sothebys!.split('-');
    const stripPrefix = new RegExp(`^${artistSlugParts.join('-?')}-?`, 'i');

    // Parse from Card elements (richer data: images, estimates, lot numbers)
    const cards = $('.Card.data-type-lot').toArray();
    console.log(`  [Sothebys] Found ${cards.length} lot cards`);

    for (const cardEl of cards) {
      const card = $(cardEl);
      const href = card.find('a[href*="/buy/auction/"]').first().attr('href') || '';
      if (!href) continue;

      const slug = href.split('/').pop() || '';
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);

      // Image from data-src (lazy loaded), fallback to src
      const img = card.find('img');
      const imageUrl = img.attr('data-src') || img.attr('src') || null;
      // Filter out SVG placeholders
      const finalImageUrl = imageUrl && imageUrl.startsWith('data:image/svg') ? null : imageUrl;

      // Lot number
      const lotNumText = card.find('.Card-lotNumber').text().trim();
      const lotNumber = lotNumText ? parseInt(lotNumText) || null : null;

      // Title from card info text — extract the actual work title
      const infoText = card.find('.Card-info-container').text().trim();
      // Info typically has: "Type: lot Category: Lot ArtistName ArtistName Title Estimate: ..."
      // Extract title by looking for text between duplicated artist name and "Estimate:"
      let title = '';
      const estimateIdx = infoText.indexOf('Estimate:');
      const relevantText = estimateIdx > 0 ? infoText.substring(0, estimateIdx) : infoText;
      // Find the display name repeated (Sotheby's shows it twice)
      const displayParts = artist.displayName.split(' ');
      const lastName = displayParts[displayParts.length - 1];
      const lastNameIdx = relevantText.lastIndexOf(lastName);
      if (lastNameIdx >= 0) {
        title = relevantText.substring(lastNameIdx + lastName.length).trim();
        // Clean up any Chinese characters or extra whitespace
        title = title.replace(/[\u4e00-\u9fff\u00b7\u2013\u2014|]+/g, ' ').replace(/\s+/g, ' ').trim();
        // Strip artist name if it appears at the start (ALL CAPS variant)
        const nameUpper = artist.displayName.toUpperCase();
        if (title.startsWith(nameUpper)) {
          title = title.substring(nameUpper.length).trim();
        }
      }
      if (!title || title.length < 2) {
        // Fallback to slug-based title
        let titleSlug = slug.replace(stripPrefix, '');
        titleSlug = titleSlug.replace(/^qiao-zhi?-?kang-duo-?/i, '');
        if (!titleSlug || titleSlug.length < 2) continue;
        title = titleSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }

      // Estimate parsing: "Estimate: 800,000 – 1,200,000 USD"
      const estText = card.find('.Card-estimate').text().trim();
      let estimateLow: number | null = null;
      let estimateHigh: number | null = null;
      let currency: Currency = 'USD';
      const estMatch = estText.match(/Estimate:\s*([\d,]+)\s*[–—-]\s*([\d,]+)\s*(\w+)/);
      if (estMatch) {
        estimateLow = parseInt(estMatch[1].replace(/,/g, ''));
        estimateHigh = parseInt(estMatch[2].replace(/,/g, ''));
        const cur = estMatch[3].toUpperCase();
        if (['USD', 'GBP', 'EUR', 'HKD', 'CNY', 'AUD', 'CHF'].includes(cur)) {
          currency = cur as Currency;
        }
      }

      // Sale name and year from href: /buy/auction/YYYY/sale-name/slug
      const hrefParts = href.split('/');
      const auctionIdx = hrefParts.indexOf('auction');
      const auctionYear = auctionIdx >= 0 && hrefParts[auctionIdx + 1] ? parseInt(hrefParts[auctionIdx + 1]) || null : null;
      const saleName = auctionIdx >= 0 && hrefParts[auctionIdx + 2]
        ? hrefParts[auctionIdx + 2].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : '';

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
        category: 'unknown' as LotCategory,
        imageUrl: finalImageUrl,
        auctionHouse: "Sotheby's",
        saleName,
        saleDate,
        lotNumber,
        estimateLow,
        estimateHigh,
        currency,
        hammerPrice: null,
        premiumPrice: null,
        priceUsd: null,
        status,
        url: fullUrl,
      });
    }

    // Also pick up any additional lot links not in Card containers
    const allLinks = $('a[href*="/buy/auction/"]').toArray();
    for (const el of allLinks) {
      const href = $(el).attr('href') || '';
      const slug = href.split('/').pop() || '';
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);

      let titleSlug = slug.replace(stripPrefix, '');
      titleSlug = titleSlug.replace(/^qiao-zhi?-?kang-duo-?/i, '');
      if (!titleSlug || titleSlug.length < 2) continue;
      const title = titleSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      const yearMatch = href.match(/\/auction\/(\d{4})\//);
      const auctionYear = yearMatch ? parseInt(yearMatch[1]) : null;
      let status: LotStatus = 'sold';
      let saleDate = '';
      if (auctionYear) {
        saleDate = `${auctionYear}-06-01`;
        if (auctionYear >= now.getFullYear()) status = 'upcoming';
      }

      const fullUrl = href.startsWith('http') ? href : `https://www.sothebys.com${href}`;
      lots.push({
        id: `sothebys-${slug}`,
        artist: artist.slug,
        title,
        year: null,
        medium: null,
        dimensions: null,
        category: 'unknown' as LotCategory,
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

    const withImages = lots.filter(l => l.imageUrl).length;
    console.log(`  [Sothebys] Parsed ${lots.length} unique lots (${withImages} with images, ${lots.filter(l => l.status === 'upcoming').length} upcoming)`);
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

      // Try to extract medium from Christie's data — only use short medium_txt, not full description
      const rawMedium = lot.medium_txt || null;
      const christiesMedium = rawMedium && String(rawMedium).length < 150
        ? String(rawMedium).replace(/<[^>]*>/g, '')
        : null;

      lots.push({
        id: `christies-${lotId}`,
        artist: artistSlug,
        title: title.replace(/<[^>]*>/g, ''),
        year: lot.date_txt || null,
        medium: christiesMedium,
        dimensions: null,
        category: 'unknown' as LotCategory,
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
// Basic artist pages use results_grouped; advanced/custom pages use results.primary_results.paginator.

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

    // Try basic page format (results_grouped)
    if (resultsGrouped && Array.isArray(resultsGrouped) && resultsGrouped.length > 0) {
      let totalItems = 0;
      for (const group of resultsGrouped) {
        const sessions = group.sessions || {};
        for (const sessionKey of Object.keys(sessions)) {
          const session = sessions[sessionKey];
          const items = session.items || [];
          for (const item of items) {
            totalItems++;
            lots.push(parseWrightBasicItem(item, session, sessionKey, artist.slug));
          }
        }
      }
      console.log(`  [Wright] Parsed ${totalItems} lots (basic page)`);
      return lots;
    }

    // Try advanced/custom page format (paginator)
    const paginator = pageData?.props?.results?.primary_results?.paginator?.items
      || pageData?.props?.results?.primary_results?.sorted_items?.results;
    if (paginator?.data && Array.isArray(paginator.data)) {
      const items = paginator.data;
      console.log(`  [Wright] Found ${items.length} lots on page 1 of ${paginator.last_page || 1} (${paginator.total || items.length} total, advanced page)`);
      for (const item of items) {
        lots.push(parseWrightAdvancedItem(item, artist.slug));
      }
      return lots;
    }

    console.log('  [Wright] No lot data found in page data');
  } catch (err) {
    console.error('  [Wright] Error:', err);
  }

  return lots;
}

function parseWrightBasicItem(item: any, session: any, sessionKey: string, artistSlug: string): AuctionLot {
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
      if (!isNaN(d.getTime())) saleDate = d.toISOString().split('T')[0];
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

  return {
    id: `wright-${item.fd_key || `${lotNum}-${sessionKey}`}`,
    artist: artistSlug,
    title,
    year: null,
    medium: item.material || null,
    dimensions: dims ? dims.replace(/&times;/g, '×').replace(/&ndash;/g, '–') : null,
    category: 'unknown' as LotCategory,
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
  };
}

function parseWrightAdvancedItem(item: any, artistSlug: string): AuctionLot {
  const title = item.name || 'Untitled';
  const lotNum = item.lot_number || null;
  const result = item.result_premium_amount || null;
  const hammer = item.result_amount || null;
  const isSold = item.item_status === 'Sold' || (result != null && result > 0);

  let saleDate = '';
  if (item.session?.start_date) {
    saleDate = item.session.start_date.split('T')[0];
  }

  const auctionInPast = saleDate ? new Date(saleDate) < new Date() : false;

  // Build image URL
  let imageUrl: string | null = null;
  if (item.primary_index_image?.filename) {
    const img = item.primary_index_image;
    imageUrl = `https://www.wright20.com/items/index/220/${img.seo_filename || img.filename}`;
  }

  let lotUrl = item.alias || '';
  if (lotUrl.startsWith('//')) lotUrl = 'https:' + lotUrl;
  else if (!lotUrl.startsWith('http') && lotUrl) lotUrl = 'https://www.wright20.com/' + lotUrl;

  const houseName = item.session?.auction?.auction_house?.name || item.auction?.auction_house?.name || 'Wright';
  const auctionHouse: AuctionHouse = houseName.toLowerCase().includes('rago') ? 'Rago' : 'Wright';

  return {
    id: `wright-${item.fd_key || item.id || `${lotNum}`}`,
    artist: artistSlug,
    title,
    year: item.year_designed || null,
    medium: item.material || null,
    dimensions: null,
    category: 'unknown' as LotCategory,
    imageUrl,
    auctionHouse,
    saleName: item.session?.title || '',
    saleDate,
    lotNumber: lotNum,
    estimateLow: item.estimate_low || null,
    estimateHigh: item.estimate_high || null,
    currency: 'USD',
    hammerPrice: hammer,
    premiumPrice: result,
    priceUsd: result,
    status: isSold ? 'sold' : auctionInPast ? 'bought_in' : 'upcoming',
    url: lotUrl,
  };
}

// ── Bonhams Crawler ──
// Bonhams uses Typesense search with a public API key.
// We query the 'lots' collection for the artist name.

const BONHAMS_TYPESENSE_KEY = '7YZqOyG0twgst4ACc2VuCyZxpGAYzM0weFTLCC20FQY';
const BONHAMS_SEARCH_URL = 'https://api01.bonhams.com/search-proxy/collections/lots/documents/search';

async function crawlBonhams(artist: ArtistConfig): Promise<AuctionLot[]> {
  if (!artist.bonhams) return [];
  const lots: AuctionLot[] = [];
  const query = encodeURIComponent(artist.bonhams);
  console.log(`  [Bonhams] Fetching ${artist.displayName}...`);

  try {
    // Fetch up to 250 lots per artist (paginate if needed)
    let page = 1;
    let totalFetched = 0;
    let totalFound = 0;

    do {
      const url = `${BONHAMS_SEARCH_URL}?q=${query}&query_by=catalogDesc,title&per_page=250&page=${page}`;
      const res = await fetch(url, {
        headers: {
          'X-TYPESENSE-API-KEY': BONHAMS_TYPESENSE_KEY,
          'User-Agent': UA,
        },
      });

      if (!res.ok) {
        console.log(`  [Bonhams] HTTP ${res.status}`);
        break;
      }

      const data = await res.json() as any;
      totalFound = data.found || 0;
      const hits = data.hits || [];

      if (page === 1) {
        console.log(`  [Bonhams] Found ${totalFound} lots`);
      }

      for (const hit of hits) {
        const doc = hit.document;
        const lot = parseBonhamsLot(doc, artist.slug);
        if (lot) lots.push(lot);
      }

      totalFetched += hits.length;
      page++;

      if (totalFetched < totalFound && hits.length > 0) {
        await sleep(500);
      }
    } while (totalFetched < totalFound && page <= 10);

    console.log(`  [Bonhams] Parsed ${lots.length} lots (${lots.filter(l => l.status === 'sold').length} sold)`);
  } catch (err) {
    console.error('  [Bonhams] Error:', err);
  }

  return lots;
}

function parseBonhamsLot(doc: any, artistSlug: string): AuctionLot | null {
  const rawTitle = doc.title || '';
  // Extract a clean title from styledDescription if available
  let title = rawTitle;
  if (doc.styledDescription) {
    const lines: string[] = [];
    const lineMatches = doc.styledDescription.match(/<div class="[^"]*">(.*?)<\/div>/g) || [];
    for (const m of lineMatches) {
      const text = m.replace(/<[^>]*>/g, '').trim();
      if (text) lines.push(text);
    }
    // Filter out artist name and date lines, keep actual title/description
    const titleParts = lines.filter(l =>
      !l.match(/^\(?[bB](?:orn)?\.\s*\d{4}\)?$/) &&         // "(B. 1957)" or "(born 1957)"
      !l.match(/^\(\d{4}[-–]\d{4}\)$/) &&                    // "(1928-1987)"
      !l.match(/^\(?born \d{4}\)?$/i) &&                      // "(born 1974)"
      !l.match(/^\(?[A-Za-z]+,?\s+(?:born\s+)?\d{4}[-–]?\d{0,4}\)?$/) && // "(American, 1928-1987)"
      !l.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+$/) &&            // "George Condo"
      !l.match(/^[A-Z]{2,}$/)                                 // "KAWS"
    );
    if (titleParts.length > 0) {
      // Use the "otherLine" div if available (usually the artwork title), else first non-artist line
      const otherIdx = lineMatches.findIndex((m: string) => m.includes('otherLine'));
      if (otherIdx >= 0) {
        const otherText = lineMatches[otherIdx].replace(/<[^>]*>/g, '').trim();
        if (otherText) {
          title = otherText;
        } else {
          title = titleParts[0];
        }
      } else {
        title = titleParts[0];
      }
    }
  }
  // Strip HTML tags from title
  title = title.replace(/<[^>]*>/g, '').trim() || 'Untitled';

  // Extract medium from styledDescription lines
  // Bonhams structured descriptions often include medium info after the title line
  let medium: string | null = null;
  let dimensions: string | null = null;
  if (doc.styledDescription) {
    const descLines: string[] = [];
    const descMatches = doc.styledDescription.match(/<div class="[^"]*">(.*?)<\/div>/g) || [];
    for (const m of descMatches) {
      const text = m.replace(/<[^>]*>/g, '').trim();
      if (text) descLines.push(text);
    }
    // Look for medium-like lines (contains material keywords)
    for (const line of descLines) {
      if (line === title) continue; // skip the title itself
      if (/^\(?[bB](?:orn)?\.\s*\d{4}\)?$/.test(line)) continue;
      if (/^\(\d{4}[-–]\d{4}\)$/.test(line)) continue;
      if (/^\(?born \d{4}\)?$/i.test(line)) continue;
      if (/^[A-Z][a-z]+\s+[A-Z][a-z]+$/.test(line)) continue; // artist name
      if (/^[A-Z]{2,}$/.test(line)) continue; // "KAWS"
      if (/^\(?[A-Za-z]+,?\s+(?:born\s+)?\d{4}[-–]?\d{0,4}\)?$/.test(line)) continue; // "(American, 1928-1987)"
      // Dimension line (has cm or in measurements)
      if (/\d+\s*(?:×|x)\s*\d+|(?:cm|in)\b/.test(line) && !medium) {
        dimensions = line;
        continue;
      }
      // Medium line — contains material/technique keywords, but skip very long lines (full catalog entries)
      if (!medium && line.length < 150 && /(?:oil|acrylic|gouache|watercolor|ink|charcoal|pencil|pastel|spray|enamel|screenprint|silkscreen|lithograph|etching|woodcut|print|photograph|gelatin|silver|bronze|ceramic|porcelain|mixed media|collage|canvas|linen|paper|board|panel|synthetic polymer|offset|poster|gicl[eé]e|marker|crayon|felt[- ]?tip)/i.test(line)) {
        medium = line;
      }
    }
  }

  const currency = isoCurrencyToInternal(doc.currency?.iso_code || '');
  const hammerPrice = doc.price?.hammerPrice || null;
  const hammerPremium = doc.price?.hammerPremium || null;
  const soldPrice = hammerPremium || hammerPrice;
  const estimateLow = doc.price?.estimateLow || null;
  const estimateHigh = doc.price?.estimateHigh || null;

  let saleDate = '';
  const endDate = doc.hammerTime?.datetime || doc.auctionEndDate?.datetime || doc.biddableFrom?.datetime;
  if (endDate) {
    saleDate = endDate.split('T')[0];
  }

  const isSold = doc.status === 'SOLD';
  const isBoughtIn = doc.status === 'BI';
  const auctionEnded = doc.flags?.isAuctionEnded ?? (saleDate ? new Date(saleDate) < new Date() : false);

  let status: LotStatus = 'upcoming';
  if (isSold) status = 'sold';
  else if (isBoughtIn) status = 'bought_in';
  else if (auctionEnded) status = 'bought_in';

  const imageUrl = doc.image?.url || null;
  const lotUrl = `https://www.bonhams.com/auction/${doc.auctionId}/lot/${doc.lotId}`;

  return {
    id: `bonhams-${doc.auctionId}-${doc.lotId}`,
    artist: artistSlug,
    title,
    year: null,
    medium,
    dimensions,
    category: 'unknown' as LotCategory,
    imageUrl,
    auctionHouse: 'Bonhams',
    saleName: doc.heading || '',
    saleDate,
    lotNumber: doc.lotNo?.number || null,
    estimateLow,
    estimateHigh,
    currency,
    hammerPrice,
    premiumPrice: hammerPremium,
    priceUsd: toUsd(soldPrice, currency),
    status,
    url: lotUrl,
  };
}

// ── Helpers ──

function detectCurrency(text: string): Currency {
  if (!text) return 'USD';
  if (text.includes('GBP') || text.includes('£')) return 'GBP';
  if (text.includes('EUR') || text.includes('€')) return 'EUR';
  if (text.includes('HKD') || text.includes('HK$')) return 'HKD';
  if (text.includes('CNY') || text.includes('¥')) return 'CNY';
  if (text.includes('AUD') || text.includes('AU$')) return 'AUD';
  if (text.includes('CHF')) return 'CHF';
  return 'USD';
}

function isoCurrencyToInternal(iso: string): Currency {
  const map: Record<string, Currency> = {
    USD: 'USD', GBP: 'GBP', EUR: 'EUR', HKD: 'HKD', CNY: 'CNY', AUD: 'AUD', CHF: 'CHF',
  };
  return map[iso] || 'USD';
}

// Rough static conversion to USD for stats/charts (avoids API dependency)
const USD_RATES: Record<Currency, number> = {
  USD: 1,
  GBP: 1.27,
  EUR: 1.08,
  HKD: 0.128,
  CNY: 0.138,
  AUD: 0.63,
  CHF: 1.13,
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

  // Compute appreciation rate from price history
  // Compare avg price over recent 4 quarters vs 4 quarters from 3 years ago
  let appreciationRate = 0;
  if (priceHistory.length >= 8) {
    const recent4 = priceHistory.slice(-4);
    const older4 = priceHistory.slice(-12, -8);
    if (older4.length === 4) {
      const recentAvg = recent4.reduce((s, p) => s + p.avgPrice, 0) / 4;
      const olderAvg = older4.reduce((s, p) => s + p.avgPrice, 0) / 4;
      if (olderAvg > 0) {
        appreciationRate = Math.round(((recentAvg / olderAvg) ** (1 / 3) - 1) * 1000) / 10;
      }
    }
  }

  const recordTitle = record?.title || existingStats?.recordTitle || '';

  return {
    lastUpdated: now.toISOString(),
    totalLotsTracked: lots.length,
    avgPriceLast12Months: avg,
    medianPriceLast12Months: median,
    recordPrice: record?.priceUsd || existingStats?.recordPrice || 0,
    recordTitle: recordTitle.length > 60 ? recordTitle.substring(0, 57) + '...' : recordTitle,
    recordDate: record?.saleDate || existingStats?.recordDate || '',
    recordHouse: record?.auctionHouse || existingStats?.recordHouse || 'Phillips',
    appreciationRate,
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

  await sleep(DELAY_MS);

  console.log(`[Ray] Crawling Bonhams...`);
  const bonhamsLots = await crawlBonhams(artist);
  console.log(`[Ray] Bonhams: ${bonhamsLots.length} lots`);
  allLots.push(...bonhamsLots);

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
      // Backfill fields for legacy lots
      for (const lot of existingLots) {
        if (!lot.artist) lot.artist = 'george-condo';
        if (!lot.category) lot.category = 'unknown' as LotCategory;
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

  // Classify every lot
  let categoryCounts: Record<string, number> = {};
  for (const lot of allLots) {
    lot.category = classifyLot(lot);
    categoryCounts[lot.category] = (categoryCounts[lot.category] || 0) + 1;
  }
  console.log(`[Ray] Category breakdown:`, categoryCounts);

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
    sources: ['Phillips', "Sotheby's", "Christie's", 'Wright/Rago', 'Bonhams'],
    version: 2,
  }, null, 2));

  console.log(`\n[Ray] Done. ${allLots.length} total lots written.`);
}

main().catch(err => {
  console.error('[Ray] Fatal error:', err);
  process.exit(1);
});
