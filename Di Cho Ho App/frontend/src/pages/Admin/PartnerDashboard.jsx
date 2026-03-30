import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MOCK_DELIVERIES = [
  { id: '#DH001', customer: 'Nguyễn Văn An', address: '123 Lê Lợi, Q.1, TP.HCM', items: 3, bonus: 18000, status: 'current', distance: '1.2 km' },
  { id: '#DH004', customer: 'Phạm Thị Dung', address: '45 Trần Hưng Đạo, Q.5, TP.HCM', items: 2, bonus: 14000, status: 'pending', distance: '2.5 km' },
  { id: '#DH007', customer: 'Lê Văn Giang', address: '78 Nguyễn Trãi, Q.1, TP.HCM', items: 4, bonus: 22000, status: 'pending', distance: '3.1 km' },
];

const MOCK_HISTORY = [
  { id: '#DH002', customer: 'Trần Thị Bé', bonus: 12000, date: '28/03', time: '09:15' },
  { id: '#DH003', customer: 'Lê Văn Cường', bonus: 28000, date: '27/03', time: '14:30' },
  { id: '#DH005', customer: 'Hoàng Văn Em', bonus: 16000, date: '27/03', time: '11:00' },
  { id: '#DH006', customer: 'Vũ Thị Phương', bonus: 20000, date: '26/03', time: '16:45' },
];

const NAV_ITEMS = [
  { id: 'overview',  label: 'Tổng quan',        icon: '📊' },
  { id: 'deliveries', label: 'Đơn hàng hôm nay', icon: '🚚' },
  { id: 'history',   label: 'Lịch sử giao',     icon: '📋' },
  { id: 'earnings',  label: 'Thu nhập',          icon: '💵' },
];

const statusConfig = {
  current: { label: 'Đang giao', bg: '#DBEAFE', color: '#1E3A8A', icon: '🔵' },
  pending: { label: 'Chờ giao',  bg: '#FEF3C7', color: '#92400E', icon: '⏳' },
  done:    { label: 'Đã giao',   bg: '#D1FAE5', color: '#065F46', icon: '✅' },
};

export default function PartnerDashboard() {
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
        background: 'linear-gradient(180deg, #431407 0%, #7C2D12 60%, #9A3412 100%)',
        transition: 'width 0.3s ease',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, overflow: 'hidden', flexShrink: 0,
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#FB923C', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🚚</div>
          {sidebarOpen && <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '15px' }}>Đi Chợ Hộ</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Cổng Shipper</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 12px', borderRadius: '10px', border: 'none',
              background: activeTab === item.id ? 'rgba(251,146,60,0.2)' : 'transparent',
              color: activeTab === item.id ? '#FB923C' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === item.id ? 700 : 500,
              transition: 'all 0.2s ease', fontFamily: 'var(--font-base)', textAlign: 'left',
              borderLeft: activeTab === item.id ? '3px solid #FB923C' : '3px solid transparent',
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
            <div style={{ width: '32px', height: '32px', background: 'rgba(251,146,60,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{user?.avatar}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.displayName}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Shipper</div>
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
          width: '28px', height: '28px', background: '#FB923C',
          color: '#7C2D12', borderRadius: '50%', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 10,
        }}>
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>
              {activeTab === 'overview'   && '📊 Tổng Quan Shipper'}
              {activeTab === 'deliveries' && '🚚 Đơn Hàng Hôm Nay'}
              {activeTab === 'history'    && '📋 Lịch Sử Giao Hàng'}
              {activeTab === 'earnings'   && '💵 Thu Nhập'}
            </h1>
            <p style={{ color: 'var(--color-text-3)', fontSize: '14px' }}>
              Xin chào, <strong>{user?.displayName}</strong> · {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          {/* Online Status Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '10px 18px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#16A34A' }}>Đang hoạt động</span>
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {[
                { icon: '📦', label: 'Đơn hôm nay', value: '3' },
                { icon: '✅', label: 'Đã giao', value: '2' },
                { icon: '💵', label: 'Thu nhập hôm nay', value: '76.000₫' },
                { icon: '⭐', label: 'Đánh giá TB', value: '4.8/5' },
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
                  <div style={{ fontSize: s.label === 'Thu nhập hôm nay' ? '21px' : '26px', fontWeight: 800, marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-3)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Current delivery */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>🔵 Đơn Đang Giao</h3>
              {MOCK_DELIVERIES.filter(d => d.status === 'current').map(d => (
                <div key={d.id} style={{ background: '#FFFBEB', borderRadius: '12px', padding: '20px', border: '1px solid #FDE68A' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{d.id} · {d.customer}</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>📍 {d.address}</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginTop: '4px' }}>🗺️ {d.distance} · {d.items} sản phẩm</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#92400E' }}>+{d.bonus.toLocaleString('vi-VN')}₫</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>Thù lao giao hàng</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ flex: 1, padding: '10px', background: '#166534', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-base)' }}>
                      ✅ Xác nhận đã giao
                    </button>
                    <button style={{ padding: '10px 16px', background: '#EFF6FF', color: '#1D4ED8', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-base)' }}>
                      📍 Bản đồ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending deliveries */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>⏳ Đơn Chờ Giao</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {MOCK_DELIVERIES.filter(d => d.status === 'pending').map(d => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{d.id} · {d.customer}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginTop: '4px' }}>📍 {d.address} · {d.distance}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 700, color: '#92400E' }}>+{d.bonus.toLocaleString('vi-VN')}₫</span>
                      <button style={{ padding: '7px 14px', background: '#7C2D12', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-base)' }}>
                        Nhận đơn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DELIVERIES TAB */}
        {activeTab === 'deliveries' && (
          <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MOCK_DELIVERIES.map(d => (
              <div key={d.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{d.id} · {d.customer}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>📍 {d.address}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginTop: '4px' }}>📦 {d.items} sản phẩm · 🗺️ {d.distance}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, background: statusConfig[d.status]?.bg, color: statusConfig[d.status]?.color }}>
                      {statusConfig[d.status]?.icon} {statusConfig[d.status]?.label}
                    </span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#7C2D12', marginTop: '8px' }}>+{d.bonus.toLocaleString('vi-VN')}₫</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {d.status !== 'done' && <button style={{ padding: '9px 18px', background: d.status === 'current' ? '#166534' : '#7C2D12', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: '13px' }}>
                    {d.status === 'current' ? '✅ Đã giao' : '🚚 Nhận đơn'}
                  </button>}
                  <button style={{ padding: '9px 18px', background: '#F1F5F9', color: 'var(--color-text-2)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: '13px' }}>
                    📍 Xem bản đồ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div style={{ animation: 'fadeIn 0.3s ease', background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    {['Mã đơn', 'Khách hàng', 'Ngày giao', 'Giờ', 'Thu nhập', 'Đánh giá'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_HISTORY.map(h => (
                    <tr key={h.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px', fontWeight: 700, color: '#7C2D12', fontSize: '13px' }}>{h.id}</td>
                      <td style={{ padding: '14px', fontSize: '14px' }}>{h.customer}</td>
                      <td style={{ padding: '14px', fontSize: '13px', color: 'var(--color-text-2)' }}>{h.date}/2026</td>
                      <td style={{ padding: '14px', fontSize: '13px', color: 'var(--color-text-2)' }}>{h.time}</td>
                      <td style={{ padding: '14px', fontSize: '14px', fontWeight: 700, color: '#166534' }}>+{h.bonus.toLocaleString('vi-VN')}₫</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ color: '#FBBF24', fontSize: '16px' }}>★★★★★</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EARNINGS TAB */}
        {activeTab === 'earnings' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: 'linear-gradient(135deg, #431407, #C2410C)', borderRadius: '20px', padding: '32px', marginBottom: '24px', color: 'white' }}>
              <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '8px' }}>Thu nhập tháng này</div>
              <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '8px' }}>3.240.000₫</div>
              <div style={{ display: 'flex', gap: '32px', marginTop: '20px' }}>
                <div><div style={{ opacity: 0.7, fontSize: '12px' }}>Chuyến giao</div><div style={{ fontWeight: 700, fontSize: '18px' }}>82</div></div>
                <div><div style={{ opacity: 0.7, fontSize: '12px' }}>TB/chuyến</div><div style={{ fontWeight: 700, fontSize: '18px' }}>39.500₫</div></div>
                <div><div style={{ opacity: 0.7, fontSize: '12px' }}>Đánh giá</div><div style={{ fontWeight: 700, fontSize: '18px' }}>⭐ 4.8</div></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Hôm nay', value: '76.000₫', count: '3 chuyến' },
                { label: 'Tuần này', value: '540.000₫', count: '21 chuyến' },
                { label: 'Tháng trước', value: '2.980.000₫', count: '75 chuyến' },
                { label: 'Tiền thưởng', value: '200.000₫', count: 'Hoàn thành KPI' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '8px' }}>{item.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#7C2D12', marginBottom: '4px' }}>{item.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
