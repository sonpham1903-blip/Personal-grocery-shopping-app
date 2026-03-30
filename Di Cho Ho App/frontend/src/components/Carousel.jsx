import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Carousel = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [items]);

  if (!items || items.length === 0) return null;

  const prev = () => setActiveIndex((p) => (p - 1 + items.length) % items.length);
  const next = () => setActiveIndex((p) => (p + 1) % items.length);
  const activeItem = items[activeIndex];

  const formatPrice = (price) =>
    price ? Number(price).toLocaleString('vi-VN') + '₫' : '—';

  return (
    <div style={{ position: 'relative', marginBottom: '8px' }}>
      {/* Main slide */}
      <div
        onClick={() => navigate(`/product/${activeItem.id}`)}
        style={{
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)', cursor: 'pointer',
          background: 'white', display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '240px',
          animation: 'fadeIn 0.4s ease',
        }}
      >
        {/* Text side */}
        <div style={{
          padding: '36px 32px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        }}>
          {/* Category badge */}
          <div style={{
            display: 'inline-block', marginBottom: '12px',
            background: 'rgba(245,158,11,0.2)',
            color: 'var(--color-accent)', fontSize: '11px', fontWeight: 700,
            padding: '4px 10px', borderRadius: '20px', width: 'fit-content',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {activeItem.category}
          </div>

          <h2 style={{
            fontSize: 'clamp(16px, 2vw, 24px)', fontWeight: 800, color: 'white',
            marginBottom: '10px', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {activeItem.name}
          </h2>

          {activeItem.brand && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: 500 }}>
              {activeItem.brand}
            </p>
          )}

          {/* Rating */}
          {activeItem.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
              <span style={{ color: '#FBBF24' }}>★</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 600 }}>{activeItem.rating}</span>
              {activeItem.ratingCount && (
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                  ({activeItem.ratingCount.toLocaleString('vi-VN')} đánh giá)
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div style={{ marginTop: 'auto' }}>
            {activeItem.originalPrice && activeItem.originalPrice > activeItem.price && (
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through', marginBottom: '2px' }}>
                {formatPrice(activeItem.originalPrice)}
              </div>
            )}
            <div style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 900, color: 'var(--color-accent)' }}>
              {formatPrice(activeItem.price)}
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${activeItem.id}`); }}
            style={{
              marginTop: '16px', padding: '10px 20px',
              background: 'var(--color-accent)', color: '#1B4332',
              border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 800,
              cursor: 'pointer', fontFamily: 'var(--font-base)', width: 'fit-content',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}
          >
            Xem ngay →
          </button>
        </div>

        {/* Image side */}
        <div style={{ height: '280px', overflow: 'hidden', background: '#F0F4F0' }}>
          <img
            src={activeItem.image}
            alt={activeItem.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
            onError={e => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/600x400/e8f5e9/1B4332?text=${encodeURIComponent(activeItem.name?.slice(0, 10) || 'SP')}`;
            }}
          />
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        style={{
          position: 'absolute', left: '-16px', top: '50%', transform: 'translateY(-50%)',
          width: '36px', height: '36px',
          background: 'white', border: 'none', borderRadius: '50%',
          boxShadow: 'var(--shadow-md)', cursor: 'pointer',
          fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-primary)', fontWeight: 900,
          transition: 'all var(--transition-fast)',
          zIndex: 2,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--color-primary)'; }}
      >
        ‹
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        style={{
          position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)',
          width: '36px', height: '36px',
          background: 'white', border: 'none', borderRadius: '50%',
          boxShadow: 'var(--shadow-md)', cursor: 'pointer',
          fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-primary)', fontWeight: 900,
          transition: 'all var(--transition-fast)',
          zIndex: 2,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--color-primary)'; }}
      >
        ›
      </button>

      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: '14px', right: '20px', display: 'flex', gap: '6px', zIndex: 2 }}>
        {items.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
            style={{
              width: index === activeIndex ? '20px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: index === activeIndex ? 'var(--color-accent)' : 'rgba(255,255,255,0.5)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease', padding: 0,
            }}
          />
        ))}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

export default Carousel;
