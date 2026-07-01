import { useNavigate } from 'react-router-dom';
import { Plus, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Stars from './Stars';

export default function ProductCard({ p }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const handleCardClick = () => {
    navigate(`/product/${p.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(p.id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(p, 1, 'Default');
  };

  const isWishlisted = isInWishlist(p.id);

  return (
    <div className="pcard" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        {p.tag ? (
          <span className={`tag ${p.tag === 'NEW' ? 'tag-n' : 'tag-s'}`}>{p.tag}</span>
        ) : <span />}
        
        <button 
          onClick={handleWishlistClick}
          style={{ 
            width: 32, 
            height: 32, 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.85)', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'var(--sh-sm)',
            color: isWishlisted ? 'var(--accent-warm)' : 'var(--text-2)',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Heart size={15} style={{ fill: isWishlisted ? 'var(--accent-warm)' : 'none' }} />
        </button>
      </div>

      <div className="pcard-img" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 5 }}>
          {p.category}
        </div>
        <h3 
          onClick={handleCardClick} 
          style={{ 
            fontSize: 14, 
            fontWeight: 700, 
            color: 'var(--text)', 
            lineHeight: 1.4, 
            cursor: 'pointer', 
            marginBottom: 8, 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            flexGrow: 1
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
        >
          {p.name}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Stars rating={p.rating} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{p.rating}</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>({p.reviews})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContext: 'space-between', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>${p.price.toFixed(2)}</span>
            {p.originalPrice && (
              <span style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'line-through', marginLeft: 6 }}>
                ${p.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button 
            onClick={handleAddToCart} 
            className="qadd btn" 
            style={{ 
              background: 'var(--accent-bg)', 
              color: 'var(--accent)', 
              padding: '8px 14px', 
              fontSize: 12, 
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.color = 'var(--accent)'; }}
          >
            <Plus size={13} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
