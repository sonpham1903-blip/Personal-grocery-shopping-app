import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// ─── Mock data ───────────────────────────────
const MOCK_PRODUCTS = [
  { id: 1, name: 'Táo tươi', category: 'Trái cây', price: 25000, stock: 150, status: 'active', sold: 320 },
  { id: 2, name: 'Chuối sứ', category: 'Trái cây', price: 15000, stock: 80, status: 'active', sold: 210 },
  { id: 3, name: 'Sữa tươi Vinamilk', category: 'Thức uống', price: 32000, stock: 60, status: 'active', sold: 180 },
  { id: 4, name: 'Bánh mì sandwich', category: 'Thực phẩm', price: 12000, stock: 0, status: 'out', sold: 95 },
  { id: 5, name: 'Nước cam vắt', category: 'Thức uống', price: 45000, stock: 40, status: 'active', sold: 75 },
  { id: 6, name: 'Trứng gà ta', category: 'Thực phẩm', price: 5000, stock: 200, status: 'active', sold: 450 },
];

const MOCK_ORDERS = [
  { id: '#DH001', customer: 'Nguyễn Văn An', items: 3, total: 125000, status: 'pending', time: '10 phút trước' },
  { id: '#DH002', customer: 'Trần Thị Bé', items: 1, total: 32000, status: 'shipping', time: '25 phút trước' },
  { id: '#DH003', customer: 'Lê Văn Cường', items: 5, total: 285000, status: 'done', time: '1 giờ trước' },
  { id: '#DH004', customer: 'Phạm Thị Dung', items: 2, total: 70000, status: 'done', time: '2 giờ trước' },
  { id: '#DH005', customer: 'Hoàng Văn Em', items: 4, total: 156000, status: 'cancelled', time: '3 giờ trước' },
];

const STATS = [
  { label: 'Doanh thu hôm nay', value: '2.850.000₫', icon: '💰', change: '+12%', positive: true },
  { label: 'Đơn hàng mới', value: '24', icon: '📦', change: '+5%', positive: true },
  { label: 'Sản phẩm đang bán', value: '38', icon: '🏷️', change: '-2%', positive: false },
  { label: 'Khách hàng mới', value: '8', icon: '👥', change: '+18%', positive: true },
];

const statusConfig = {
  pending:   { label: 'Chờ xử lý',  bg: '#FEF3C7', color: '#92400E' },
  shipping:  { label: 'Đang giao',  bg: '#DBEAFE', color: '#1E3A8A' },
  done:      { label: 'Hoàn thành', bg: '#D1FAE5', color: '#065F46' },
  cancelled: { label: 'Đã huỷ',    bg: '#FEE2E2', color: '#991B1B' },
  active:    { label: 'Đang bán',   bg: '#D1FAE5', color: '#065F46' },
  out:       { label: 'Hết hàng',   bg: '#FEE2E2', color: '#991B1B' },
};

// ─── Sidebar ──────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',  label: 'Tổng quan',    icon: '📊' },
  { id: 'products',  label: 'Sản phẩm',     icon: '📦' },
  { id: 'orders',    label: 'Đơn hàng',     icon: '🧾' },
  { id: 'revenue',   label: 'Doanh thu',    icon: '💰' },
];

export default function ShopDashboard() {
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
      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarOpen ? '260px' : '72px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: 'var(--color-accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🏪</div>
          {sidebarOpen && <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '15px' }}>Đi Chợ Hộ</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Cổng Người Bán</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 12px', borderRadius: '10px', border: 'none',
                background: activeTab === item.id ? 'rgba(245,158,11,0.2)' : 'transparent',
                color: activeTab === item.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === item.id ? 700 : 500,
                transition: 'all 0.2s ease', fontFamily: 'var(--font-base)',
                textAlign: 'left',
                borderLeft: activeTab === item.id ? '3px solid var(--color-accent)' : '3px solid transparent',
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
            <div style={{ width: '32px', height: '32px', background: 'rgba(245,158,11,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{user?.avatar}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.displayName}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Người Bán</div>
            </div>
          </div>}
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px 12px', background: 'rgba(239,68,68,0.15)',
              color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px', cursor: 'pointer', fontSize: '13px',
              fontWeight: 600, fontFamily: 'var(--font-base)',
              display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
          >
            <span>🚪</span>{sidebarOpen && 'Đăng xuất'}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute', bottom: '80px', right: '-14px',
            width: '28px', height: '28px',
            background: 'var(--color-accent)', color: '#1B4332',
            borderRadius: '50%', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 10,
          }}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: '32px', overflow: 'auto', animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>
              {activeTab === 'overview' && '📊 Tổng Quan'}
              {activeTab === 'products' && '📦 Quản Lý Sản Phẩm'}
              {activeTab === 'orders'   && '🧾 Quản Lý Đơn Hàng'}
              {activeTab === 'revenue'  && '💰 Báo Cáo Doanh Thu'}
            </h1>
            <p style={{ color: 'var(--color-text-3)', fontSize: '14px' }}>
              Xin chào, <strong>{user?.displayName}</strong> · {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 18px', background: 'white', borderRadius: '10px',
            border: '1px solid var(--color-border)', color: 'var(--color-text-2)',
            fontSize: '13px', fontWeight: 600, boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-fast)',
          }}>
            🏠 Trang chủ
          </Link>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {STATS.map((stat, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: '16px', padding: '24px',
                  boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                  cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ fontSize: '32px' }}>{stat.icon}</div>
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', background: stat.positive ? '#D1FAE5' : '#FEE2E2', color: stat.positive ? '#065F46' : '#991B1B' }}>
                      {stat.change}
                    </span>
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-3)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--color-text-1)' }}>🧾 Đơn Hàng Gần Đây</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                      {['Mã đơn', 'Khách hàng', 'Số SP', 'Tổng tiền', 'Trạng thái', 'Thời gian'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ORDERS.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px', fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>{order.id}</td>
                        <td style={{ padding: '14px', fontSize: '14px' }}>{order.customer}</td>
                        <td style={{ padding: '14px', fontSize: '14px', textAlign: 'center' }}>{order.items}</td>
                        <td style={{ padding: '14px', fontSize: '14px', fontWeight: 600 }}>{order.total.toLocaleString('vi-VN')}₫</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: statusConfig[order.status]?.bg, color: statusConfig[order.status]?.color }}>
                            {statusConfig[order.status]?.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px', fontSize: '12px', color: 'var(--color-text-3)' }}>{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button style={{
                padding: '11px 22px', background: 'var(--color-primary)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-base)', boxShadow: '0 4px 12px rgba(27,67,50,0.3)',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(27,67,50,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(27,67,50,0.3)'; }}
              >
                ➕ Thêm Sản Phẩm
              </button>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                      {['Sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Đã bán', 'Trạng thái', 'Hành động'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PRODUCTS.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px', fontSize: '14px', fontWeight: 600 }}>{p.name}</td>
                        <td style={{ padding: '14px', fontSize: '13px', color: 'var(--color-text-2)' }}>{p.category}</td>
                        <td style={{ padding: '14px', fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>{p.price.toLocaleString('vi-VN')}₫</td>
                        <td style={{ padding: '14px', fontSize: '14px', color: p.stock === 0 ? 'var(--color-error)' : 'inherit', fontWeight: p.stock === 0 ? 700 : 400 }}>{p.stock === 0 ? 'Hết hàng' : p.stock}</td>
                        <td style={{ padding: '14px', fontSize: '14px' }}>{p.sold}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color }}>
                            {statusConfig[p.status]?.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ padding: '6px 12px', background: '#EFF6FF', color: '#1D4ED8', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-base)' }}>✏️ Sửa</button>
                            <button style={{ padding: '6px 12px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-base)' }}>🗑️ Xoá</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div style={{ animation: 'fadeIn 0.3s ease', background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {['Tất cả', 'Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã huỷ'].map(f => (
                <button key={f} style={{
                  padding: '7px 16px', borderRadius: '20px', border: '1px solid var(--color-border)',
                  background: f === 'Tất cả' ? 'var(--color-primary)' : 'white',
                  color: f === 'Tất cả' ? 'white' : 'var(--color-text-2)',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-base)',
                }}>
                  {f}
                </button>
              ))}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    {['Mã đơn', 'Khách hàng', 'Số SP', 'Tổng tiền', 'Trạng thái', 'Thời gian', 'Thao tác'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ORDERS.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px', fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>{order.id}</td>
                      <td style={{ padding: '14px', fontSize: '14px' }}>{order.customer}</td>
                      <td style={{ padding: '14px', fontSize: '14px', textAlign: 'center' }}>{order.items}</td>
                      <td style={{ padding: '14px', fontSize: '14px', fontWeight: 600 }}>{order.total.toLocaleString('vi-VN')}₫</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: statusConfig[order.status]?.bg, color: statusConfig[order.status]?.color }}>
                          {statusConfig[order.status]?.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontSize: '12px', color: 'var(--color-text-3)' }}>{order.time}</td>
                      <td style={{ padding: '14px' }}>
                        <button style={{ padding: '6px 12px', background: '#F0FDF4', color: '#1B4332', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-base)' }}>Chi tiết</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── REVENUE TAB ── */}
        {activeTab === 'revenue' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {[
                { label: 'Hôm nay', value: '2.850.000₫', sub: '24 đơn hàng' },
                { label: 'Tuần này', value: '18.450.000₫', sub: '142 đơn hàng' },
                { label: 'Tháng này', value: '74.200.000₫', sub: '583 đơn hàng' },
                { label: 'Tổng cộng', value: '420.000.000₫', sub: 'Từ khi mở cửa hàng' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '8px' }}>{item.label}</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>{item.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Biểu đồ doanh thu</h3>
              <p style={{ color: 'var(--color-text-3)' }}>Tích hợp Chart.js hoặc Recharts để hiển thị biểu đồ thực tế</p>
            </div>
          </div>
        )}
      </main>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
