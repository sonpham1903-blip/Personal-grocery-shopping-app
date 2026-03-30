import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { searchProducts } from '../api';

// ─── Fallback mock data (khi API bị rate-limit hoặc lỗi) ──────
const MOCK_PRODUCTS = [
  { id: 1,  name: 'Táo tươi Fuji',      description: 'Táo đỏ Fuji nhập khẩu tươi ngon', price: 45000,  image: 'https://placehold.co/400x400/ffebee/c62828?text=Táo', category: 'Rau củ quả' },
  { id: 2,  name: 'Chuối sứ Tiền Giang', description: 'Chuối sứ miền Tây ngọt mát',      price: 25000,  image: 'https://placehold.co/400x400/fff8e1/f57f17?text=Chuối', category: 'Rau củ quả' },
  { id: 3,  name: 'Cam Valencia',         description: 'Cam tươi nhiều nước, ngọt thanh',  price: 35000,  image: 'https://placehold.co/400x400/fff3e0/e65100?text=Cam', category: 'Rau củ quả' },
  { id: 4,  name: 'Nho Mỹ đỏ',           description: 'Nho đỏ không hạt nhập khẩu Mỹ',   price: 110000, image: 'https://placehold.co/400x400/f3e5f5/6a1b9a?text=Nho', category: 'Rau củ quả' },
  { id: 5,  name: 'Sữa tươi Vinamilk',   description: 'Sữa tươi thanh trùng 1L',          price: 32000,  image: 'https://placehold.co/400x400/e3f2fd/0d47a1?text=Sữa', category: 'Sữa & Bơ phô mai' },
  { id: 6,  name: 'Sữa TH True Milk',    description: 'Sữa tươi tiệt trùng 180ml hộp 48', price: 290000, image: 'https://placehold.co/400x400/e8f5e9/1b5e20?text=TH+Milk', category: 'Sữa & Bơ phô mai' },
  { id: 7,  name: 'Nước cam Tropicana',  description: 'Nước cam ép 900ml không đường',     price: 45000,  image: 'https://placehold.co/400x400/fff3e0/bf360c?text=Nước+cam', category: 'Đồ uống' },
  { id: 8,  name: 'Nước suối Vĩnh Hảo', description: 'Nước khoáng thiên nhiên 500ml',     price: 6000,   image: 'https://placehold.co/400x400/e1f5fe/0277bd?text=Nước', category: 'Đồ uống' },
  { id: 9,  name: 'Trứng gà Dalat Milk', description: 'Trứng gà sạch size L (10 quả)',    price: 48000,  image: 'https://placehold.co/400x400/fffde7/f9a825?text=Trứng', category: 'Thực phẩm' },
  { id: 10, name: 'Mì tôm Hảo Hảo',     description: 'Mì tôm chua cay thùng 30 gói',     price: 120000, image: 'https://placehold.co/400x400/fce4ec/880e4f?text=Mì+tôm', category: 'Gạo & Mì' },
  { id: 11, name: 'Gạo ST25',            description: 'Gạo thơm ST25 túi 5kg',            price: 185000, image: 'https://placehold.co/400x400/f9fbe7/33691e?text=Gạo+ST25', category: 'Gạo & Mì' },
  { id: 12, name: 'Bánh quy Oreo',       description: 'Bánh quy kem sô-cô-la 137g',       price: 28000,  image: 'https://placehold.co/400x400/e8eaf6/1a237e?text=Oreo', category: 'Bánh kẹo & Snack' },
];

// ─── Danh sách từ khoá tìm kiếm trên Lazada VN ────────────────
// Mỗi từ khoá → một nhóm sản phẩm riêng
const SEARCH_KEYWORDS = [
  'thực phẩm tươi sống',
  'sữa tươi',
  'rau củ quả sạch',
  'đồ uống nước ngọt',
  'bánh kẹo snack',
  'gạo nếp mì',
];

/** @typedef {{ id: string|number; name: string; description: string; price: number; image: string; category: string; rating?: number|null; ratingCount?: number|null; badge?: string|null; url?: string|null; brand?: string|null }} Product */

const initialState = {
  products: MOCK_PRODUCTS,
  isLoading: false,
  error: '',
  usingMockData: true,
  loadProducts:    async () => {},
  searchByKeyword: async () => {},
  getProductById:  () => undefined,
  setProducts:     () => {},
};

const ProductContext = createContext(initialState);

export const useProductStore = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProductStore must be used within ProductProvider');
  return ctx;
};

export const ProductProvider = ({ children }) => {
  const [products,     setProducts]     = useState(MOCK_PRODUCTS);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState('');
  const [usingMockData, setUsingMockData] = useState(true);

  /**
   * Tải sản phẩm từ Lazada API bằng nhiều từ khoá song song.
   */
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      // Gọi API cho từng từ khoá đồng thời
      const settled = await Promise.allSettled(
        SEARCH_KEYWORDS.map((kw) => searchProducts(kw, 1, 'pop'))
      );

      const allItems   = [];
      const seenIds    = new Set();
      let   anySuccess = false;

      for (const result of settled) {
        if (result.status === 'fulfilled' && Array.isArray(result.value) && result.value.length > 0) {
          anySuccess = true;
          for (const item of result.value) {
            if (item && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              allItems.push(item);
            }
          }
        }
      }

      if (anySuccess && allItems.length > 0) {
        setProducts(allItems);
        setUsingMockData(false);
        setError('');
        console.log(`[ProductStore] Đã tải ${allItems.length} sản phẩm từ Lazada API`);
      } else {
        throw new Error('Lazada API không trả về sản phẩm nào');
      }
    } catch (err) {
      console.warn('[ProductStore] Lazada API lỗi, dùng mock data:', err.message);
      setProducts(MOCK_PRODUCTS);
      setUsingMockData(true);

      if (err.message?.includes('429')) {
        setError('⚠️ API đang bị giới hạn (rate limit). Đang hiển thị dữ liệu mẫu.');
      } else {
        setError('⚠️ Không thể kết nối Lazada API. Đang hiển thị dữ liệu mẫu.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Tìm kiếm theo từ khoá (dùng cho thanh tìm kiếm).
   * @param {string} keyword
   */
  const searchByKeyword = useCallback(async (keyword) => {
    if (!keyword?.trim()) {
      // Reset về danh sách đầy đủ
      await loadProducts();
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const results = await searchProducts(keyword.trim(), 1, 'pop');
      if (results.length > 0) {
        setProducts(results);
        setUsingMockData(false);
      } else {
        setError(`Không tìm thấy sản phẩm cho "${keyword}"`);
      }
    } catch (err) {
      console.warn('[ProductStore] Search failed:', err.message);
      setError('Tìm kiếm thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [loadProducts]);

  // Tự động tải khi mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getProductById = useCallback(
    (id) => products.find((p) => String(p.id) === String(id)),
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        usingMockData,
        loadProducts,
        searchByKeyword,
        getProductById,
        setProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
