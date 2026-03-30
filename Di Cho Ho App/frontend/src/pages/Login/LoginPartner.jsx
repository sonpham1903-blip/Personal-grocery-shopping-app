import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPartner = () => {
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
    const result = login(username, password, 'partner');
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
      background: 'linear-gradient(135deg, #431407 0%, #7C2D12 40%, #C2410C 80%, #b45309 100%)',
    }}>
      {/* Left Branding */}
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
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(251,146,60,0.1)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(251,146,60,0.07)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>🚚</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
            Cổng Shipper
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', maxWidth: '300px', lineHeight: 1.7 }}>
            Quản lý đơn giao hàng, theo dõi thu nhập và cập nhật trạng thái giao hàng.
          </p>

          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '🗺️', text: 'Bản đồ điều hướng thông minh' },
              { icon: '💰', text: 'Theo dõi thu nhập hàng ngày' },
              { icon: '⚡', text: 'Nhận đơn và xác nhận tức thì' },
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
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '40px 24px', background: 'white', position: 'relative',
      }}>
        <Link to="/" style={{
          position: 'absolute', top: '24px', left: '24px',
          display: 'flex', alignItems: 'center', gap: '6px',
          color: 'var(--color-text-2)', fontSize: '14px',
          transition: 'color var(--transition-fast)',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#7C2D12'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-2)'}
        >
          ← Về trang chủ
        </Link>

        <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeIn 0.5s ease both' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '64px', height: '64px',
              background: 'linear-gradient(135deg, #7C2D12, #C2410C)',
              borderRadius: '18px', display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '28px', marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(124,45,18,0.35)',
            }}>
              🚚
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '6px' }}>
              Đăng Nhập Shipper
            </h2>
            <p style={{ color: 'var(--color-text-3)', fontSize: '14px' }}>
              Cổng dành cho đối tác giao hàng
            </p>
          </div>

          {/* Hint */}
          <div style={{
            background: '#FFF7ED', border: '1px solid #FED7AA',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
            fontSize: '13px', color: '#92400E',
          }}>
            💡 Tài khoản demo: <strong>partner</strong> / Mật khẩu: <strong>1234</strong>
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
                  id="partner-username"
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
                    transition: 'border-color var(--transition-fast)',
                    background: 'var(--color-bg)',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#7C2D12'; e.target.style.boxShadow = '0 0 0 3px rgba(124,45,18,0.1)'; }}
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
                  id="partner-password"
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
                    background: 'var(--color-bg)',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#7C2D12'; e.target.style.boxShadow = '0 0 0 3px rgba(124,45,18,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--color-text-3)' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              id="partner-login-btn"
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '14px',
                background: isLoading ? 'var(--color-text-3)' : 'linear-gradient(135deg, #7C2D12 0%, #C2410C 100%)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '16px', fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-base)',
                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(124,45,18,0.40)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontFamily: 'var(--font-base)',
              }}
              onMouseEnter={e => { if (!isLoading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(124,45,18,0.5)'; }}}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(124,45,18,0.40)'; }}
            >
              {isLoading ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Đang đăng nhập...</> : '🚚 Đăng Nhập Shipper'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-3)', fontSize: '13px', marginBottom: '12px' }}>Đăng nhập với vai trò khác</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/login/shop" style={{ padding: '8px 16px', borderRadius: '8px', background: '#F0FDF4', color: '#1B4332', fontSize: '13px', fontWeight: 600 }}>🏪 Người Bán</Link>
              <Link to="/login/user" style={{ padding: '8px 16px', borderRadius: '8px', background: '#EFF6FF', color: '#1E3A8A', fontSize: '13px', fontWeight: 600 }}>👤 Khách Hàng</Link>
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

export default LoginPartner;
