import { useState, useCallback } from 'react';
import NaviBar from '../components/NaviBar';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import CategorySlider from '../components/CategorySlider';
import { useProductStore } from '../store/ProductStore';

const HomePage = ({ onAddToCart }) => {
  const { products, isLoading, error, usingMockData, searchByKeyword, loadProducts } = useProductStore();
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const safeProducts = products ?? [];
  const featured     = safeProducts.slice(0, 4);

  // Group products by category
  const categories = safeProducts.reduce((acc, product) => {
    const cat = product.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      await loadProducts();
      return;
    }
    setIsSearching(true);
    await searchByKeyword(searchInput.trim());
    setIsSearching(false);
  }, [searchInput, searchByKeyword, loadProducts]);

  const handleClearSearch = async () => {
    setSearchInput('');
    await loadProducts();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <NaviBar />

      {/* Hero / Search Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, var(--color-primary-light) 100%)',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 42px)',
          fontWeight: 900, color: 'white', marginBottom: '12px', lineHeight: 1.2,
        }}>
          🛒 Đi Chợ Hộ
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '28px' }}>
          Mua sắm thực phẩm tươi sống từ Lazada — tiện lợi, nhanh chóng
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{
          maxWidth: '560px', margin: '0 auto',
          display: 'flex', gap: '0', borderRadius: '14px',
          overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        }}>
          <input
            id="product-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm sản phẩm... (vd: sữa, rau củ, thịt heo)"
            style={{
              flex: 1, padding: '15px 20px',
              fontSize: '15px', border: 'none', outline: 'none',
              fontFamily: 'var(--font-base)',
              background: 'white',
            }}
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                padding: '15px 14px', background: 'white',
                border: 'none', cursor: 'pointer', fontSize: '18px',
                color: 'var(--color-text-3)',
              }}
            >
              ✕
            </button>
          )}
          <button
            id="product-search-btn"
            type="submit"
            disabled={isSearching || isLoading}
            style={{
              padding: '15px 26px',
              background: 'var(--color-accent)',
              color: '#1B4332', border: 'none', cursor: 'pointer',
              fontSize: '15px', fontWeight: 800,
              fontFamily: 'var(--font-base)',
              transition: 'background var(--transition-fast)',
              minWidth: '100px',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}
          >
            {(isSearching || isLoading) ? '⟳' : '🔍 Tìm'}
          </button>
        </form>

        {/* Quick search tags */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['🥛 Sữa', '🥦 Rau củ', '🍖 Thịt', '🍜 Mì gạo', '🧃 Đồ uống', '🍪 Bánh kẹo'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                const kw = tag.replace(/^\S+\s/, ''); // strip emoji
                setSearchInput(kw);
                searchByKeyword(kw);
              }}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white', cursor: 'pointer', fontFamily: 'var(--font-base)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>

        {/* API Status Banner */}
        {usingMockData && !isLoading && (
          <div style={{
            background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px',
            padding: '10px 16px', marginBottom: '20px', fontSize: '13px', color: '#92400E',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span>📦</span>
            <span>
              {error || 'Đang hiển thị dữ liệu mẫu. '}
              <button
                onClick={loadProducts}
                style={{ background: 'none', border: 'none', color: '#B45309', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-base)', fontSize: '13px' }}
              >
                Thử tải lại từ Lazada
              </button>
            </span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: '48px', animation: 'spin 1.2s linear infinite', display: 'inline-block', marginBottom: '16px' }}>⟳</div>
            <p style={{ color: 'var(--color-text-3)', fontSize: '16px' }}>Đang tải sản phẩm từ Lazada...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Products count */}
        {!isLoading && safeProducts.length > 0 && (
          <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '20px' }}>
            Hiển thị <strong>{safeProducts.length}</strong> sản phẩm
            {!usingMockData && <span style={{ color: 'var(--color-success)', marginLeft: '8px', fontWeight: 600 }}>✓ Từ Lazada VN</span>}
          </div>
        )}

        {/* Carousel */}
        {!isLoading && featured.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <Carousel items={featured} />
          </div>
        )}

        {/* Category Sliders */}
        {!isLoading && Object.keys(categories).map((category) => (
          <CategorySlider
            key={category}
            category={category}
            items={categories[category]}
            onAddToCart={onAddToCart}
          />
        ))}

        {/* Empty state */}
        {!isLoading && safeProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Không tìm thấy sản phẩm</h3>
            <p style={{ color: 'var(--color-text-3)', marginBottom: '20px' }}>Thử từ khoá khác hoặc xem tất cả sản phẩm</p>
            <button onClick={handleClearSearch} style={{
              padding: '12px 24px', background: 'var(--color-primary)', color: 'white',
              border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-base)', fontSize: '14px',
            }}>
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;