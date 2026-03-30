import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLE_CONFIG } from '../contexts/AuthContext';

const NaviBar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const roleConfig = user ? ROLE_CONFIG[user.role] : null;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
      position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 2px 20px rgba(0,0,0,0.15)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          color: 'white', fontWeight: 800, fontSize: '20px',
          textDecoration: 'none',
          transition: 'opacity var(--transition-fast)',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <span style={{ fontSize: '26px' }}>🛒</span>
          <span>Đi Chợ Hộ</span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          {[
            { to: '/products', label: 'Sản phẩm', icon: '🏷️' },
            { to: '/cart',     label: 'Giỏ hàng', icon: '🛒' },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'rgba(255,255,255,0.85)', padding: '8px 14px',
              borderRadius: '8px', fontSize: '14px', fontWeight: 500,
              transition: 'all var(--transition-fast)', textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
            >
              <span>{link.icon}</span>{link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isLoggedIn ? (
            /* User Menu Dropdown */
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                id="user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px', padding: '7px 14px',
                  cursor: 'pointer', color: 'white',
                  transition: 'all var(--transition-fast)',
                  fontFamily: 'var(--font-base)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              >
                <span style={{ fontSize: '18px' }}>{user.avatar}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: '1.3' }}>{user.displayName}</div>
                  <div style={{ fontSize: '10px', opacity: 0.7, lineHeight: '1.3' }}>{roleConfig?.label}</div>
                </div>
                <span style={{ fontSize: '10px', opacity: 0.7, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'white', borderRadius: '14px',
                  boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)',
                  minWidth: '200px', overflow: 'hidden',
                  animation: 'fadeIn 0.15s ease',
                  zIndex: 100,
                }}>
                  {/* User info header */}
                  <div style={{ padding: '14px 16px', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)' }}>{user.displayName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginTop: '2px' }}>{user.email}</div>
                    <span style={{
                      display: 'inline-block', marginTop: '6px',
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                      background: roleConfig?.lightColor, color: roleConfig?.color,
                    }}>
                      {roleConfig?.icon} {roleConfig?.label}
                    </span>
                  </div>

                  {/* Dashboard link */}
                  <Link
                    to={roleConfig?.dashboardPath}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 16px', fontSize: '14px', color: 'var(--color-text-1)',
                      textDecoration: 'none', transition: 'background var(--transition-fast)',
                      fontWeight: 600,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>📊</span>Trang Quản Trị
                  </Link>

                  {/* Logout */}
                  <button
                    id="navbar-logout-btn"
                    onClick={handleLogout}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 16px', fontSize: '14px', color: '#DC2626',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-base)', fontWeight: 600,
                      borderTop: '1px solid var(--color-border)',
                      transition: 'background var(--transition-fast)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>🚪</span>Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login Buttons (not logged in) */
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Link to="/login/user" style={{
                padding: '8px 16px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', fontSize: '13px', fontWeight: 600,
                textDecoration: 'none', transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              >
                👤 Đăng nhập
              </Link>
              <Link to="/login/shop" style={{
                padding: '8px 16px', borderRadius: '8px',
                background: 'var(--color-accent)',
                color: '#1B4332', fontSize: '13px', fontWeight: 700,
                textDecoration: 'none', transition: 'all var(--transition-fast)',
                boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-light)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                🏪 Bán hàng
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 600px) { .desktop-nav { display: none !important; } }
      `}</style>
    </nav>
  );
};

export default NaviBar;