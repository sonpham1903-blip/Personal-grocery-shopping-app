import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginShop = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600)); // simulate network

    const result = login(username, password, 'shop');
    setIsLoading(false);

    if (result.success) {
      navigate(result.user.redirectTo, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'var(--font-base)',
      background: 'linear-gradient(135deg, #0D2B1F 0%, #1B4332 40%, #2D6A4F 80%, #1a5c3a 100%)',
    }}>
      {/* Left Panel - Branding */}
      <div style={{
        flex: 1,
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }} className="left-panel">
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(245,158,11,0.08)', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'rgba(245,158,11,0.06)', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>🏪</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
            Cổng Người Bán
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', maxWidth: '300px', lineHeight: 1.7 }}>
            Quản lý cửa hàng, sản phẩm và đơn hàng của bạn một cách thông minh hơn.
          </p>

          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '📦', text: 'Quản lý kho hàng thời gian thực' },
              { icon: '📊', text: 'Báo cáo doanh thu chi tiết' },
              { icon: '🚀', text: 'Xử lý đơn hàng nhanh chóng' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(255,255,255,0.08)', borderRadius: '12px',
                padding: '12px 20px', textAlign: 'left',
              }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 24px',
        background: 'white',
        borderRadius: '0',
        position: 'relative',
      }}>
        {/* Back to home */}
        <Link to="/" style={{
          position: 'absolute', top: '24px', left: '24px',
          display: 'flex', alignItems: 'center', gap: '6px',
          color: 'var(--color-text-2)', fontSize: '14px',
          transition: 'color var(--transition-fast)',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-2)'}
        >
          ← Về trang chủ
        </Link>

        <div style={{
          width: '100%',
          maxWidth: '420px',
          animation: 'fadeIn 0.5s ease both',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '64px', height: '64px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              borderRadius: '18px', display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '28px', marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(27,67,50,0.25)',
            }}>
              🏪
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '6px' }}>
              Đăng Nhập Người Bán
            </h2>
            <p style={{ color: 'var(--color-text-3)', fontSize: '14px' }}>
              Cổng quản trị dành cho người bán hàng
            </p>
          </div>

          {/* Hint Box */}
          <div style={{
            background: '#F0FDF4', border: '1px solid #86EFAC',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
            fontSize: '13px', color: '#166534',
          }}>
            💡 Tài khoản demo: <strong>root</strong> hoặc <strong>shop</strong> / Mật khẩu: <strong>1234</strong>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '14px', fontWeight: 600,
                color: 'var(--color-text-1)', marginBottom: '8px',
              }}>
                Tên đăng nhập
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '18px', pointerEvents: 'none',
                }}>👤</span>
                <input
                  id="shop-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  required
                  style={{
                    width: '100%', padding: '13px 14px 13px 44px',
                    border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
                    borderRadius: '10px', fontSize: '15px',
                    fontFamily: 'var(--font-base)',
                    outline: 'none', transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                    background: 'var(--color-bg)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#1B4332';
                    e.target.style.boxShadow = '0 0 0 3px rgba(27,67,50,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '14px', fontWeight: 600,
                color: 'var(--color-text-1)', marginBottom: '8px',
              }}>
                Mật khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '18px', pointerEvents: 'none',
                }}>🔒</span>
                <input
                  id="shop-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  style={{
                    width: '100%', padding: '13px 44px 13px 44px',
                    border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
                    borderRadius: '10px', fontSize: '15px',
                    fontFamily: 'var(--font-base)',
                    outline: 'none', transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                    background: 'var(--color-bg)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#1B4332';
                    e.target.style.boxShadow = '0 0 0 3px rgba(27,67,50,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', fontSize: '18px',
                    color: 'var(--color-text-3)',
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                color: '#DC2626', borderRadius: '8px',
                padding: '10px 14px', fontSize: '13px',
                marginBottom: '16px', animation: 'fadeIn 0.2s ease',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="shop-login-btn"
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: isLoading
                  ? 'var(--color-text-3)'
                  : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-base)',
                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(27,67,50,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontFamily: 'var(--font-base)',
              }}
              onMouseEnter={e => { if (!isLoading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(27,67,50,0.45)'; }}}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(27,67,50,0.35)'; }}
            >
              {isLoading ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
                  Đang đăng nhập...
                </>
              ) : (
                '🏪 Đăng Nhập Người Bán'
              )}
            </button>
          </form>

          {/* Other login links */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-3)', fontSize: '13px', marginBottom: '12px' }}>
              Đăng nhập với vai trò khác
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/login/user" style={{
                padding: '8px 16px', borderRadius: '8px',
                background: '#EFF6FF', color: '#1E3A8A',
                fontSize: '13px', fontWeight: 600,
                transition: 'all var(--transition-fast)',
              }}>
                👤 Khách Hàng
              </Link>
              <Link to="/login/partner" style={{
                padding: '8px 16px', borderRadius: '8px',
                background: '#FFF7ED', color: '#7C2D12',
                fontSize: '13px', fontWeight: 600,
                transition: 'all var(--transition-fast)',
              }}>
                🚚 Shipper
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .left-panel { display: flex !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
};

export default LoginShop;
