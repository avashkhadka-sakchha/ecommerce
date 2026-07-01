import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';

const CATS = [
  { name: 'Phone Cases', count: 124, icon: '📱', desc: 'Rugged protection to ultra-slim silhouettes' },
  { name: 'Chargers', count: 45, icon: '⚡', desc: 'GaN technology & high-wattage adapters' },
  { name: 'Earphones', count: 32, icon: '🎧', desc: 'True wireless & active noise cancellation' },
  { name: 'Power Banks', count: 18, icon: '🔋', desc: 'High-capacity backup batteries for any trip' },
  { name: 'Protectors', count: 56, icon: '💎', desc: '9H tempered glass with edge-to-edge fit' },
  { name: 'Cables', count: 89, icon: '🔌', desc: 'Braided USB-C, Lightning, and multiport hubs' },
];

export default function CategoriesView() {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 28px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
          Everything You Need
        </div>
        <h1 className="ff" style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-.02em', lineHeight: 1.1 }}>
          Browse by Category
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-2)', marginTop: 14, maxWidth: 480, margin: '14px auto 0' }}>
          Curated collections of high-performance mobile accessories for every device.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {CATS.map(cat => (
          <Link 
            key={cat.name} 
            to={`/shop?category=${encodeURIComponent(cat.name)}`} 
            className="ccard" 
            style={{ padding: '28px', display: 'flex', gap: 18, alignItems: 'flex-start' }}
          >
            <div className="cicon" style={{ 
              width: 52, 
              height: 52, 
              background: '#F5F4F0', 
              borderRadius: 16, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 26, 
              flexShrink: 0, 
              transition: 'background .25s ease' 
            }}>{cat.icon}</div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{cat.name}</h3>
                <span style={{ background: '#F5F4F0', color: 'var(--text-3)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  {cat.count} items
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 12 }}>{cat.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                Explore <ChevronRight size={13} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recommendation Banner */}
      <div style={{ 
        marginTop: 48, 
        background: '#F1F0EC', 
        borderRadius: 24, 
        padding: '40px 48px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: 32, 
        flexWrap: 'wrap' 
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>
            Not sure what to get?
          </div>
          <h3 className="ff" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
            We'll help you find the perfect fit.
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-2)', maxWidth: 400, lineHeight: 1.7 }}>
            Tell us your device and use case, and we'll recommend the best accessories for you.
          </p>
        </div>
        <Link to="/shop" className="btn btn-p" style={{ fontSize: 15, padding: '14px 28px', flexShrink: 0 }}>
          Get Recommendations <ArrowRight size={16} />
        </Link>
      </div>

    </div>
  );
}
