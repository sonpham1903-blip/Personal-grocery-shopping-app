import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginUser = () => {
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
    await new Promise((r) => setTimeout(r, 600));
    const result = login(username, password, 'user');
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
      background: 'linear-gradient(135deg, #0F2454 0%, #1E3A8A 40%, #2563EB 80%, #1d4ed8 100%)',
    }}>
      {/* Left Branding Panel */}
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
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'rgba(96,165,250,0.1)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'rgba(96,165,250,0.07)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>🛒</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
            Tài Khoản Khách Hàng
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', maxWidth: '300px', lineHeight: 1.7 }}>
            Mua sắm tiện lợi, theo dõi đơn hàng và nhận nhiều ưu đãi hấp dẫn.
          </p>

          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '🎁', text: 'Ưu đãi và điểm thưởng độc quyền' },
              { icon: '📍', text: 'Theo dõi đơn hàng theo thời gian thực' },
              { icon: '💳', text: 'Thanh toán an toàn, nhanh chóng' },
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

      {/* Right Form Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 24px',
        background: 'white',
        position: 'relative',
      }}>
        <Link to="/" style={{
          position: 'absolute', top: '24px', left: '24px',
          display: 'flex', alignItems: 'center', gap: '6px',
          color: 'var(--color-text-2)', fontSize: '14px',
          transition: 'color var(--transition-fast)',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#1E3A8A'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-2)'}
        >
          ← Về trang chủ
        </Link>

        <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeIn 0.5s ease both' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '64px', height: '64px',
              background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
              borderRadius: '18px', display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '28px', marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(30,58,138,0.3)',
            }}>
              🛒
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '6px' }}>
              Đăng Nhập Khách Hàng
            </h2>
            <p style={{ color: 'var(--color-text-3)', fontSize: '14px' }}>
              Cổng dành cho khách hàng mua sắm
            </p>
          </div>

          {/* Hint */}
          <div style={{
            background: '#EFF6FF', border: '1px solid #BFDBFE',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
            fontSize: '13px', color: '#1D4ED8',
          }}>
            💡 Tài khoản demo: <strong>user</strong> / Mật khẩu: <strong>1234</strong>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-1)', marginBottom: '8px' }}>
                Tên đăng nhập
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', pointerEvents: 'none' }}>👤</span>
                <input
                  id="user-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  required
                  style={{
                    width: '100%', padding: '13px 14px 13px 44px',
                    border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
                    borderRadius: '10px', fontSize: '15px',
                    fontFamily: 'var(--font-base)', outline: 'none',
                    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                    background: 'var(--color-bg)',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#1E3A8A'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-1)', marginBottom: '8px' }}>
                Mật khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', pointerEvents: 'none' }}>🔒</span>
                <input
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  style={{
                    width: '100%', padding: '13px 44px 13px 44px',
                    border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
                    borderRadius: '10px', fontSize: '15px',
                    fontFamily: 'var(--font-base)', outline: 'none',
                    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                    background: 'var(--color-bg)',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#1E3A8A'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--color-text-3)' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px', animation: 'fadeIn 0.2s ease' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              id="user-login-btn"
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '14px',
                background: isLoading ? 'var(--color-text-3)' : 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '16px', fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-base)',
                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(30,58,138,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontFamily: 'var(--font-base)',
              }}
              onMouseEnter={e => { if (!isLoading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(30,58,138,0.45)'; }}}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(30,58,138,0.35)'; }}
            >
              {isLoading ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Đang đăng nhập...</> : '🛒 Đăng Nhập Khách Hàng'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-3)', fontSize: '13px', marginBottom: '12px' }}>Đăng nhập với vai trò khác</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/login/shop" style={{ padding: '8px 16px', borderRadius: '8px', background: '#F0FDF4', color: '#1B4332', fontSize: '13px', fontWeight: 600 }}>🏪 Người Bán</Link>
              <Link to="/login/partner" style={{ padding: '8px 16px', borderRadius: '8px', background: '#FFF7ED', color: '#7C2D12', fontSize: '13px', fontWeight: 600 }}>🚚 Shipper</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .left-panel { display: flex !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
};

export default LoginUser;
