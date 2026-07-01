import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Header() {
  const { cartCount, wishlist } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [scrolled, setScrolled] = useState(false);
  const searchVal = searchParams.get('search') || '';

  // Scrolled header background effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.currentTarget.elements.q.value.trim();
    if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/shop');
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <header style={{
      position: 'sticky', 
      top: 0, 
      zIndex: 100,
      background: scrolled ? 'rgba(255, 255, 255, 0.96)' : '#fff',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: scrolled ? 'var(--sh-sm)' : 'none',
      transition: 'all .3s ease',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', height: 70, display: 'flex', alignItems: 'center', gap: 28 }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ 
            width: 38, 
            height: 38, 
            background: 'var(--accent)', 
            borderRadius: 11, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 4px 12px rgba(36,85,232,.3)' 
          }}>
            <span className="ff" style={{ color: '#fff', fontWeight: 900, fontSize: 21 }}>M</span>
          </div>
          <div>
            <div className="ff" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>MobileHub</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>Nepal</div>
          </div>
        </Link>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
          <button 
            type="submit" 
            style={{ 
              position: 'absolute', 
              left: 13, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-3)', 
              cursor: 'pointer',
              display: 'flex',
              padding: 0
            }}
          >
            <Search size={14} />
          </button>
          <input
            key={searchVal}
            type="text"
            name="q"
            defaultValue={searchVal}
            placeholder="Search cases, chargers, earbuds…"
            className="finp"
            style={{ paddingLeft: 38, fontSize: 13 }}
          />
        </form>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {[
            ['/', 'Home'], 
            ['/shop', 'Shop'], 
            ['/categories', 'Categories']
          ].map(([to, label]) => {
            const isActive = location.pathname === to;
            return (
              <Link 
                key={label} 
                to={to} 
                className="nl"
                style={{ 
                  fontSize: 14, 
                  fontWeight: 600, 
                  color: isActive ? 'var(--accent)' : 'var(--text-2)', 
                  transition: 'color .2s' 
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link 
            to="/shop?tag=SALE" 
            className="nl"
            style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: 'var(--text-2)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 5, 
              transition: 'color .2s' 
            }}
          >
            Deals
            <span style={{ 
              background: 'var(--accent-warm)', 
              color: '#fff', 
              fontSize: 9, 
              fontWeight: 800, 
              padding: '2px 6px', 
              borderRadius: 5, 
              letterSpacing: '.05em' 
            }}>HOT</span>
          </Link>
        </nav>

        {/* Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          
          <Link 
            to="/account" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: 40, 
              height: 40, 
              borderRadius: 11, 
              color: location.pathname === '/account' ? 'var(--accent)' : 'var(--text-2)', 
              transition: 'all .15s ease',
              background: location.pathname === '/account' ? 'var(--accent-bg)' : 'transparent'
            }}
            onMouseEnter={e => { if (location.pathname !== '/account') e.currentTarget.style.background = '#F5F4F0'; }}
            onMouseLeave={e => { if (location.pathname !== '/account') e.currentTarget.style.background = 'transparent'; }}
          >
            <User size={19} />
          </Link>

          <Link 
            to="/account?tab=wishlist"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: 40, 
              height: 40, 
              borderRadius: 11, 
              color: 'var(--text-2)', 
              position: 'relative', 
              transition: 'all .15s ease' 
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F5F4F0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: 3, 
                right: 3, 
                width: 17, 
                height: 17, 
                background: 'var(--accent-warm)', 
                color: '#fff', 
                fontSize: 10, 
                fontWeight: 800, 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: '2px solid #fff' 
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link 
            to="/checkout"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: 40, 
              height: 40, 
              borderRadius: 11, 
              color: location.pathname === '/checkout' ? 'var(--accent)' : 'var(--text-2)', 
              position: 'relative', 
              transition: 'all .15s ease',
              background: location.pathname === '/checkout' ? 'var(--accent-bg)' : 'transparent'
            }}
            onMouseEnter={e => { if (location.pathname !== '/checkout') e.currentTarget.style.background = '#F5F4F0'; }}
            onMouseLeave={e => { if (location.pathname !== '/checkout') e.currentTarget.style.background = 'transparent'; }}
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: 3, 
                right: 3, 
                width: 17, 
                height: 17, 
                background: 'var(--accent)', 
                color: '#fff', 
                fontSize: 10, 
                fontWeight: 800, 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: '2px solid #fff' 
              }}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
