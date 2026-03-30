// ─────────────────────────────────────────────────────────────
// Lazada API (RapidAPI)
// Host: lazada-api.p.rapidapi.com
// Site: 'vn' cho Vietnam
// ─────────────────────────────────────────────────────────────

const RAPIDAPI_KEY =
  import.meta.env.VITE_RAPIDAPI_KEY ||
  '35810f6cbdmsh6e09dc6947b8c88p178d88jsndc3237c92570';

const RAPIDAPI_HOST = 'lazada-api.p.rapidapi.com';
const BASE_URL      = 'https://lazada-api.p.rapidapi.com';

const DEFAULT_HEADERS = {
  'x-rapidapi-key':  RAPIDAPI_KEY,
  'x-rapidapi-host': RAPIDAPI_HOST,
  'Content-Type':    'application/json',
};

// ─── Helpers ──────────────────────────────────────────────────

/** Parse price từ các format khác nhau Lazada trả về */
function parsePrice(raw) {
  if (!raw && raw !== 0) return 0;
  if (typeof raw === 'number') return raw;
  // Remove currency symbols, dots as thousand separators, etc.
  const cleaned = String(raw).replace(/[^0-9.]/g, '');
  return cleaned ? parseFloat(cleaned) : 0;
}

/** Map category keyword → nhãn tiếng Việt */
function mapCategory(keyword = '') {
  const lc = keyword.toLowerCase();
  if (lc.includes('thực phẩm') || lc.includes('food'))         return 'Thực phẩm';
  if (lc.includes('rau') || lc.includes('củ') || lc.includes('trái') || lc.includes('fruit') || lc.includes('vegetable')) return 'Rau củ quả';
  if (lc.includes('sữa') || lc.includes('milk') || lc.includes('dairy')) return 'Sữa & Bơ phô mai';
  if (lc.includes('uống') || lc.includes('drink') || lc.includes('beverage') || lc.includes('nước')) return 'Đồ uống';
  if (lc.includes('thịt') || lc.includes('meat') || lc.includes('hải sản') || lc.includes('seafood')) return 'Thịt & Hải sản';
  if (lc.includes('bánh') || lc.includes('snack') || lc.includes('kẹo'))  return 'Bánh kẹo & Snack';
  if (lc.includes('gia vị') || lc.includes('sauce') || lc.includes('condiment')) return 'Gia vị';
  if (lc.includes('mì') || lc.includes('gạo') || lc.includes('rice') || lc.includes('noodle'))   return 'Gạo & Mì';
  if (lc.includes('hữu cơ') || lc.includes('organic'))         return 'Thực phẩm hữu cơ';
  if (lc.includes('baby') || lc.includes('bé'))                return 'Mẹ & Bé';
  if (lc.includes('pet') || lc.includes('thú cưng'))           return 'Thú cưng';
  return 'Thực phẩm';
}

/**
 * Map một item từ Lazada API → Product shape của app
 * Lazada trả về item với các field: itemId, name, image, price,
 * originalPrice, discount, ratingScore, review, itemUrl, brandName, sellerName
 */
function mapLazadaProduct(item, idx, searchKeyword = '') {
  if (!item) return null;

  const price = parsePrice(item.price) || parsePrice(item.originalPrice) || 0;
  const originalPrice = parsePrice(item.originalPrice) || null;

  // Lazada có thể trả image dưới nhiều field
  const image =
    item.image ||
    item.productImage ||
    item.mainImage ||
    (Array.isArray(item.images) ? item.images[0] : null) ||
    `https://placehold.co/400x400/e8f5e9/1B4332?text=${encodeURIComponent((item.name || 'SP').slice(0, 12))}`;

  return {
    id:            String(item.itemId || item.id || `laz-${idx}`),
    name:          item.name || item.title || 'Sản phẩm Lazada',
    description:   item.description || item.brandName
                     ? `${item.brandName ? item.brandName + ' – ' : ''}${item.sellerName || ''}`
                     : item.name || 'Mô tả chưa có',
    price,
    originalPrice: originalPrice !== price ? originalPrice : null,
    discount:      item.discount || null,
    image,
    category:      mapCategory(searchKeyword),
    rating:        parseFloat(item.ratingScore) || null,
    ratingCount:   parseInt(item.review) || null,
    badge:         item.sellerName || null,
    url:           item.itemUrl || null,
    brand:         item.brandName || null,
  };
}

// ─── API Functions ─────────────────────────────────────────────

/**
 * Tìm sản phẩm theo từ khoá trên Lazada Vietnam.
 * @param {string} keywords - ví dụ: 'thực phẩm', 'sữa', 'rau củ'
 * @param {number} [page=1]
 * @param {'pop'|'price_asc'|'price_desc'|'rating'} [sort='pop']
 * @returns {Promise<object[]>}
 */
export async function searchProducts(keywords, page = 1, sort = 'pop') {
  const params = new URLSearchParams({
    keywords,
    site: 'vn',        // Vietnam site
    page: String(page),
    sort,
  });

  const response = await fetch(`${BASE_URL}/lazada/search/items?${params}`, {
    method:  'GET',
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Lazada API ${response.status}: ${text}`);
  }

  const data = await response.json();

  // Lazada API response: { data: { items: [...] } } hoặc { items: [...] }
  const items =
    data?.data?.items ||
    data?.items        ||
    data?.result?.items ||
    [];

  return items
    .map((item, idx) => mapLazadaProduct(item, idx, keywords))
    .filter(Boolean);
}

/**
 * Tìm sản phẩm theo từ khoá (alias để tương thích với ProductStore cũ)
 */
export async function searchProductByBarcode(keyword) {
  try {
    return await searchProducts(keyword || 'thực phẩm');
  } catch {
    return [];
  }
}

export { mapLazadaProduct, mapCategory };
