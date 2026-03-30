import { Link } from 'react-router-dom';
import NaviBar from '../components/NaviBar';
import Footer from '../components/Footer';

const Cart = ({ cart, onRemoveFromCart, onUpdateQuantity }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const formatPrice = (price) =>
    price ? Number(price).toLocaleString('vi-VN') + '₫' : '0₫';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <NaviBar />
      
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px', flexGrow: 1 }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '32px' }}>
          Giỏ hàng của bạn <span style={{ fontWeight: 400, color: 'var(--color-text-3)', fontSize: '20px' }}>({cart.length} sản phẩm)</span>
        </h1>

        {cart.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: '24px', padding: '64px 24px',
            textAlign: 'center', boxShadow: 'var(--shadow-sm)', display: 'flex',
            flexDirection: 'column', alignItems: 'center'
          }}>
            <div style={{ fontSize: '100px', marginBottom: '24px' }}>🛒</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '12px' }}>
              Giỏ hàng trống
            </h2>
            <p style={{ color: 'var(--color-text-3)', marginBottom: '32px', maxWidth: '400px' }}>
              Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy quay lại trang chủ để chọn những sản phẩm tốt nhất nhé!
            </p>
            <Link to="/" style={{
              padding: '16px 32px', background: 'var(--color-primary)', color: 'white',
              borderRadius: '14px', fontWeight: 700, textDecoration: 'none',
              boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} style={{
                  background: 'white', borderRadius: '20px', padding: '20px',
                  display: 'flex', gap: '20px', boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)', position: 'relative'
                }}>
                  {/* Item Image */}
                  <div style={{
                    width: '100px', height: '100px', background: '#f8fafc',
                    borderRadius: '12px', overflow: 'hidden', flexShrink: 0,
                    border: '1px solid var(--color-border)'
                  }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>

                  {/* Item Details */}
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Link to={`/product/${item.id}`} style={{
                          fontSize: '16px', fontWeight: 700, color: 'var(--color-text-1)',
                          textDecoration: 'none', lineHeight: 1.4, maxWidth: '300px',
                          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>
                          {item.name}
                        </Link>
                        <button
                          onClick={() => onRemoveFromCart(index)}
                          style={{
                            background: 'none', border: 'none', color: '#EF4444',
                            cursor: 'pointer', fontSize: '18px', padding: '4px'
                          }}
                          title="Xóa sản phẩm"
                        >
                          ✕
                        </button>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginTop: '4px' }}>
                        {item.brand || item.category}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          style={{ width: '32px', height: '32px', background: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                        >-</button>
                        <div style={{ width: '40px', textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>{item.quantity}</div>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          style={{ width: '32px', height: '32px', background: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                        >+</button>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-3)', marginBottom: '2px' }}>
                          {formatPrice(item.price)}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div style={{
              background: 'white', borderRadius: '24px', padding: '24px',
              boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
              position: 'sticky', top: '100px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '20px' }}>
                Tổng cộng
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-2)', fontSize: '15px' }}>
                  <span>Tạm tính</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-2)', fontSize: '15px' }}>
                  <span>Phí vận chuyển</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(shippingFee)}</span>
                </div>
                <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-1)' }}>Tổng tiền</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-primary)' }}>{formatPrice(total)}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-3)', fontStyle: 'italic' }}>(Đã bao gồm VAT)</div>
                  </div>
                </div>
              </div>

              {/* Promo code area */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-2)', marginBottom: '8px' }}>Mã giảm giá</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Nhập mã..."
                    style={{
                      flexGrow: 1, padding: '10px 12px', border: '1px solid var(--color-border)',
                      borderRadius: '10px', fontSize: '14px', outline: 'none'
                    }}
                  />
                  <button style={{
                    padding: '10px 16px', borderRadius: '10px', border: 'none',
                    background: '#f1f5f9', color: 'var(--color-text-1)', fontWeight: 700,
                    fontSize: '14px', cursor: 'pointer'
                  }}>Áp dụng</button>
                </div>
              </div>

              <button
                style={{
                  width: '100%', height: '56px', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
                  color: 'white', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 16px rgba(27,67,50,0.25)', transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => alert('Chức năng thanh toán đang được phát triển!')}
              >
                Tiếp tục thanh toán
              </button>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/" style={{ color: 'var(--color-text-3)', fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;