import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item, onAddToCart }) => {
  const navigate = useNavigate();

  const handleCardClick = () => navigate(`/product/${item.id}`);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(item);
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '—';
    return Number(price).toLocaleString('vi-VN') + '₫';
  };

  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  const discountPct = hasDiscount
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : (item.discount ? parseInt(item.discount) : null);

  return (
    <div
      onClick={handleCardClick}
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        width: '200px',
        flexShrink: 0,
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Discount Badge */}
      {discountPct && discountPct > 0 && (
        <div style={{
          position: 'absolute', top: '10px', left: '10px', zIndex: 2,
          background: 'var(--color-error)', color: 'white',
          fontSize: '11px', fontWeight: 800,
          padding: '3px 8px', borderRadius: '20px',
          letterSpacing: '0.03em',
        }}>
          -{discountPct}%
        </div>
      )}

      {/* Lazada badge (e.g. "MallSeller", "1K+ sold") */}
      {item.badge && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 2,
          background: 'rgba(27,67,50,0.85)', color: 'white',
          fontSize: '10px', fontWeight: 600,
          padding: '2px 7px', borderRadius: '20px',
          maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.badge}
        </div>
      )}

      {/* Product Image */}
      <div style={{ width: '100%', height: '160px', overflow: 'hidden', background: '#F8FAFC' }}>
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x400/e8f5e9/1B4332?text=${encodeURIComponent(item.name?.slice(0, 8) || 'SP')}`;
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Brand */}
        {item.brand && (
          <div style={{ fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {item.brand}
          </div>
        )}

        {/* Name */}
        <h3 style={{
          fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)',
          lineHeight: 1.4, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.name}
        </h3>

        {/* Rating */}
        {item.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#FBBF24', fontSize: '12px' }}>★</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-2)' }}>{item.rating}</span>
            {item.ratingCount && (
              <span style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>
                ({item.ratingCount.toLocaleString('vi-VN')})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div style={{ marginTop: 'auto' }}>
          {hasDiscount && (
            <div style={{ fontSize: '11px', color: 'var(--color-text-3)', textDecoration: 'line-through' }}>
              {formatPrice(item.originalPrice)}
            </div>
          )}
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)' }}>
            {formatPrice(item.price)}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          style={{
            marginTop: '8px',
            padding: '8px 0',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--font-base)',
            transition: 'all var(--transition-fast)',
            width: '100%',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'}
        >
          🛒 Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ItemCard;