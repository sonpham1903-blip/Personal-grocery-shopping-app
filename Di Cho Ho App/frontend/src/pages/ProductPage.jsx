import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NaviBar from '../components/NaviBar';
import Footer from '../components/Footer';
import CategorySlider from '../components/CategorySlider';
import { useProductStore } from '../store/ProductStore';

const ProductPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, products, isLoading } = useProductStore();
  const item = getProductById(id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Related products (same category, excluding current)
  const relatedProducts = useMemo(() => {
    if (!item || !products) return [];
    return products
      .filter((p) => p.category === item.category && String(p.id) !== String(item.id))
      .slice(0, 8);
  }, [item, products]);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [id]);

  if (isLoading && !item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ fontSize: '48px', animation: 'spin 1.2s linear infinite' }}>⟳</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
        <NaviBar />
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔍</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-1)' }}>Không tìm thấy sản phẩm</h2>
          <p style={{ color: 'var(--color-text-3)', marginBottom: '24px' }}>Sản phẩm bạn đang tìm kiếm có thể đã bị gỡ bỏ hoặc không tồn tại.</p>
          <Link to="/" style={{
            padding: '12px 24px', background: 'var(--color-primary)', color: 'white',
            borderRadius: '12px', fontWeight: 700, textDecoration: 'none',
            boxShadow: 'var(--shadow-md)'
          }}>
            Quay lại trang chủ
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price) =>
    price ? Number(price).toLocaleString('vi-VN') + '₫' : '—';

  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  const discountPct = hasDiscount
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : (item.discount ? parseInt(item.discount) : null);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    // Subtle feedback can be added here
  };

  const handleBuyNow = () => {
    onAddToCart(item, quantity);
    navigate('/cart');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <NaviBar />

      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '24px' }}>
        {/* Breadcrumbs */}
        <nav style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '24px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{item.category}</span>
          <span>/</span>
          <span style={{ color: 'var(--color-text-2)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
        </nav>

        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: 'var(--shadow-sm)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Left: Image Container */}
          <div style={{ position: 'relative' }}>
            {discountPct > 0 && (
              <div style={{
                position: 'absolute', top: '16px', left: '16px', zIndex: 2,
                background: 'var(--color-error)', color: 'white',
                fontSize: '14px', fontWeight: 800,
                padding: '4px 12px', borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
              }}>
                -{discountPct}%
              </div>
            )}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#f8fafc',
              border: '1px solid var(--color-border)',
              aspectRatio: '1/1'
            }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {item.brand && (
              <div style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                {item.brand}
              </div>
            )}
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-1)', lineHeight: 1.2, marginBottom: '16px' }}>
              {item.name}
            </h1>

            {/* Rating Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} style={{ color: star <= (item.rating || 5) ? '#FBBF24' : '#E2E8F0', fontSize: '18px' }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-2)' }}>{item.rating || '5.0'}</span>
              <span style={{ width: '1px', height: '14px', background: '#E2E8F0' }}></span>
              <span style={{ fontSize: '14px', color: 'var(--color-text-3)' }}>{item.ratingCount || '100+'} Đánh giá</span>
            </div>

            {/* Price section */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '36px', fontWeight: 900, color: 'var(--color-primary)' }}>{formatPrice(item.price)}</span>
                {hasDiscount && (
                  <span style={{ fontSize: '18px', color: 'var(--color-text-3)', textDecoration: 'line-through' }}>{formatPrice(item.originalPrice)}</span>
                )}
              </div>
              {item.badge && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: 'var(--color-accent)', color: '#1B4332', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>{item.badge}</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-2)', display: 'block', marginBottom: '12px' }}>Số lượng:</label>
              <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: '12px', width: 'fit-content', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: '44px', height: '44px', background: 'white', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 600 }}
                >-</button>
                <div style={{ width: '60px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ width: '44px', height: '44px', background: 'white', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 600 }}
                >+</button>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1, height: '56px', borderRadius: '14px', border: '2px solid var(--color-primary)',
                  background: 'white', color: 'var(--color-primary)', fontWeight: 700, fontSize: '16px',
                  cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <span>🛒</span> Thêm Vào Giỏ
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  flex: 1, height: '56px', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
                  color: 'white', fontWeight: 700, fontSize: '16px',
                  cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: 'var(--shadow-md)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Mua Ngay
              </button>
            </div>
          </div>
        </div>

        {/* Description Tabs */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '48px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('description')}
              style={{
                padding: '12px 24px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: '16px', fontWeight: 700, color: activeTab === 'description' ? 'var(--color-primary)' : 'var(--color-text-3)',
                borderBottom: activeTab === 'description' ? '2px solid var(--color-primary)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Mô tả sản phẩm
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              style={{
                padding: '12px 24px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: '16px', fontWeight: 700, color: activeTab === 'shipping' ? 'var(--color-primary)' : 'var(--color-text-3)',
                borderBottom: activeTab === 'shipping' ? '2px solid var(--color-primary)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Vận chuyển
            </button>
          </div>
          <div style={{ lineHeight: 1.7, color: 'var(--color-text-2)', fontSize: '15px' }}>
            {activeTab === 'description' ? (
              <div>
                <p style={{ marginBottom: '16px' }}>{item.description}</p>
                <p>Sản phẩm chất lượng cao được tuyển chọn từ các nhà cung cấp uy tín trên Lazada. Quy trình bảo quản và vận chuyển nghiêm ngặt đảm bảo sản phẩm luôn trong tình trạng tốt nhất khi đến tay khách hàng.</p>
                <ul style={{ marginTop: '16px', listStyle: 'circle', paddingLeft: '20px' }}>
                  <li>Nguồn gốc xuất xứ rõ ràng</li>
                  <li>Sản phẩm đạt tiêu chuẩn an toàn thực phẩm</li>
                  <li>Hạn sử dụng xa</li>
                  <li>Đóng gói cẩn thận</li>
                </ul>
              </div>
            ) : (
              <div>
                <p><strong>Giao hàng nhanh:</strong> Giao ngay trong 2 giờ đối với khu vực nội thành.</p>
                <p style={{ marginTop: '12px' }}><strong>Phí vận chuyển:</strong> Miễn phí vận chuyển cho đơn hàng từ 500k.</p>
                <p style={{ marginTop: '12px' }}><strong>Chính sách đổi trả:</strong> Đổi trả linh hoạt trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc quá trình vận chuyển.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products slider */}
        {relatedProducts.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-1)' }}>Sản phẩm tương tự</h2>
              <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', fontSize: '14px' }}>Xem thêm</Link>
            </div>
            <CategorySlider
              category="related"
              items={relatedProducts}
              onAddToCart={onAddToCart}
              hideTitle={true}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
