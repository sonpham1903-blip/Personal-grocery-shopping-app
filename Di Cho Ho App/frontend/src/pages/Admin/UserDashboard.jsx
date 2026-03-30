import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MOCK_ORDERS = [
  { id: '#DH001', shop: 'Cửa hàng Minh Hòa', items: ['Táo tươi x2', 'Sữa Vinamilk x1'], total: 82000, status: 'shipping', eta: '15-20 phút', date: '28/03/2026' },
  { id: '#DH002', shop: 'Siêu thị Mini Phúc', items: ['Trứng gà x10'], total: 50000, status: 'done', eta: '–', date: '27/03/2026' },
  { id: '#DH003', shop: 'Cửa hàng Lan Anh', items: ['Bánh mì x3', 'Nước cam x1'], total: 81000, status: 'done', eta: '–', date: '26/03/2026' },
  { id: '#DH004', shop: 'Cửa hàng Minh Hòa', items: ['Chuối sứ x5', 'Nước cam x2'], total: 165000, status: 'pending', eta: '30-40 phút', date: '28/03/2026' },
];

const statusConfig = {
  pending:  { label: 'Đang chuẩn bị', bg: '#FEF3C7', color: '#92400E', icon: '⏳' },
  shipping: { label: 'Đang giao',     bg: '#DBEAFE', color: '#1E3A8A', icon: '🚚' },
  done:     { label: 'Đã nhận',       bg: '#D1FAE5', color: '#065F46', icon: '✅' },
};

const NAV_ITEMS = [
  { id: 'overview', label: 'Tổng quan',         icon: '🏠' },
  { id: 'orders',   label: 'Đơn hàng của tôi',  icon: '🧾' },
  { id: 'profile',  label: 'Thông tin cá nhân', icon: '👤' },
  { id: 'rewards',  label: 'Điểm thưởng',       icon: '🎁' },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-base)', background: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '72px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0F2454 0%, #1E3A8A 100%)',
        transition: 'width 0.3s ease',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, overflow: 'hidden', flexShrink: 0,
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#60A5FA', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🛒</div>
          {sidebarOpen && <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '15px' }}>Đi Chợ Hộ</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Khu vực Khách Hàng</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 12px', borderRadius: '10px', border: 'none',
              background: activeTab === item.id ? 'rgba(96,165,250,0.2)' : 'transparent',
              color: activeTab === item.id ? '#93C5FD' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === item.id ? 700 : 500,
              transition: 'all 0.2s ease', fontFamily: 'var(--font-base)', textAlign: 'left',
              borderLeft: activeTab === item.id ? '3px solid #60A5FA' : '3px solid transparent',
            }}
              onMouseEnter={e => { if (activeTab !== item.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}}
              onMouseLeave={e => { if (activeTab !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}}
            >
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {sidebarOpen && <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'rgba(96,165,250,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{user?.avatar}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.displayName}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Khách Hàng</div>
            </div>
          </div>}
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px 12px', background: 'rgba(239,68,68,0.15)',
            color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px', cursor: 'pointer', fontSize: '13px',
            fontWeight: 600, fontFamily: 'var(--font-base)',
            display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: '8px',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          >
            <span>🚪</span>{sidebarOpen && 'Đăng xuất'}
          </button>
        </div>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
          position: 'absolute', bottom: '80px', right: '-14px',
          width: '28px', height: '28px', background: '#60A5FA',
          color: '#1E3A8A', borderRadius: '50%', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 10,
        }}>
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>
              {activeTab === 'overview' && '🏠 Tổng Quan'}
              {activeTab === 'orders'   && '🧾 Đơn Hàng Của Tôi'}
              {activeTab === 'profile'  && '👤 Thông Tin Cá Nhân'}
              {activeTab === 'rewards'  && '🎁 Điểm Thưởng'}
            </h1>
            <p style={{ color: 'var(--color-text-3)', fontSize: '14px' }}>
              Xin chào, <strong>{user?.displayName}</strong>!
            </p>
          </div>
          <Link to="/products" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 18px', background: '#1E3A8A', borderRadius: '10px',
            color: 'white', fontSize: '13px', fontWeight: 600,
            boxShadow: '0 4px 12px rgba(30,58,138,0.3)',
          }}>
            🛍️ Mua sắm tiếp
          </Link>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {[
                { icon: '🧾', label: 'Tổng đơn hàng', value: '12' },
                { icon: '🚚', label: 'Đang giao',      value: '1' },
                { icon: '✅', label: 'Hoàn thành',     value: '10' },
                { icon: '🎁', label: 'Điểm thưởng',   value: '1.250' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: '16px', padding: '24px',
                  boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{s.icon}</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-3)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Current order tracking */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>🚚 Theo Dõi Đơn Hàng Hiện Tại</h3>
              <div style={{ background: '#EFF6FF', borderRadius: '12px', padding: '20px', border: '1px solid #BFDBFE' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#1E3A8A', marginBottom: '4px' }}>#DH001 - Cửa hàng Minh Hòa</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>Táo tươi x2, Sữa Vinamilk x1</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: '#DBEAFE', color: '#1E3A8A', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>🚚 Đang giao</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginTop: '4px' }}>Dự kiến: 15–20 phút</div>
                  </div>
                </div>
                {/* Progress */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    {['Đặt hàng', 'Đang chuẩn bị', 'Đang giao', 'Đã nhận'].map((step, i) => (
                      <div key={i} style={{ fontSize: '11px', color: i <= 2 ? '#1E3A8A' : 'var(--color-text-3)', fontWeight: i <= 2 ? 700 : 400, textAlign: 'center', flex: 1 }}>{step}</div>
                    ))}
                  </div>
                  <div style={{ height: '6px', background: '#DBEAFE', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #1E3A8A, #3B82F6)', borderRadius: '3px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent orders */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>🧾 Đơn Hàng Gần Đây</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {MOCK_ORDERS.slice(0, 3).map(order => (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{order.id} · {order.shop}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>{order.items.join(', ')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 700, color: '#1E3A8A' }}>{order.total.toLocaleString('vi-VN')}₫</span>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: statusConfig[order.status]?.bg, color: statusConfig[order.status]?.color }}>
                        {statusConfig[order.status]?.icon} {statusConfig[order.status]?.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MOCK_ORDERS.map(order => (
              <div key={order.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{order.id}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-3)' }}>{order.shop} · {order.date}</div>
                  </div>
                  <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, background: statusConfig[order.status]?.bg, color: statusConfig[order.status]?.color }}>
                    {statusConfig[order.status]?.icon} {statusConfig[order.status]?.label}
                  </span>
                </div>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ fontSize: '14px', color: 'var(--color-text-2)', padding: '4px 0', borderBottom: i < order.items.length - 1 ? '1px dashed var(--color-border)' : 'none' }}>
                      📦 {item}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '18px', color: '#1E3A8A' }}>Tổng: {order.total.toLocaleString('vi-VN')}₫</div>
                  {order.status === 'done' && (
                    <button style={{ padding: '8px 16px', background: '#EFF6FF', color: '#1D4ED8', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-base)' }}>
                      ⭐ Đánh giá
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{ animation: 'fadeIn 0.3s ease', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>{user?.avatar}</div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800 }}>{user?.displayName}</div>
                <div style={{ color: 'var(--color-text-3)', fontSize: '14px' }}>{user?.email}</div>
              </div>
            </div>
            {[
              { label: 'Tên đăng nhập', value: user?.username },
              { label: 'Email', value: user?.email },
              { label: 'Vai trò', value: 'Khách Hàng' },
              { label: 'Tham gia', value: new Date(user?.loginAt).toLocaleDateString('vi-VN') },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-3)', fontSize: '14px' }}>{item.label}</span>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* REWARDS TAB */}
        {activeTab === 'rewards' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: '20px', padding: '32px', marginBottom: '24px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎁</div>
              <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Điểm thưởng hiện tại</div>
              <div style={{ fontSize: '56px', fontWeight: 900 }}>1.250</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>pts ≈ 12.500₫</div>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Lịch sử điểm thưởng</h3>
              {[
                { desc: 'Mua hàng #DH003', pts: '+250', date: '26/03', positive: true },
                { desc: 'Mua hàng #DH002', pts: '+100', date: '27/03', positive: true },
                { desc: 'Đổi điểm giảm giá', pts: '-500', date: '25/03', positive: false },
                { desc: 'Mua hàng #DH001', pts: '+165', date: '28/03', positive: true },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.desc}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>{item.date}/2026</div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '16px', color: item.positive ? '#16A34A' : '#DC2626' }}>{item.pts} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
