import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingBag, Heart, Truck, RotateCcw, Shield, Award, Check } from 'lucide-react';
import { api } from '../services/api';
import { useStore } from '../context/StoreContext';
import Stars from '../components/Stars';
import SectionHeader from '../components/SectionHeader';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(false);
      try {
        const data = await api.getProductById(id);
        setProduct(data);
        
        if (data.specs && data.specs['Color']) {
          setSelectedColor(data.specs['Color']);
        } else if (data.category === 'Phone Cases') {
          setSelectedColor('Midnight Blue');
        } else {
          setSelectedColor('Default');
        }
        
        setActiveImg(0);
        setQty(1);

        const allProducts = await api.getProducts({ categories: [data.category] });
        setSimilarProducts(allProducts.filter(p => p.id !== data.id).slice(0, 4));
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '120px 28px', textAlign: 'center', color: 'var(--text-3)' }}>
        <h3>Loading Product Details...</h3>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '120px 28px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Product Not Found</h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>The accessory you are looking for might have been sold out or moved.</p>
        <Link to="/shop" className="btn btn-p">Back to Shop</Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const colors = [
    { name: 'Midnight Black', hex: '#1a1a2e' },
    { name: 'Frost White', hex: '#f8f7f3' },
    { name: 'Electric Blue', hex: '#2455E8' }
  ];

  const handleAddToCart = () => {
    addToCart(product, qty, selectedColor);
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 28px' }}>
      
      {/* Breadcrumb navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>
        <Link to="/" style={{ color: 'var(--text-3)' }}>Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop" style={{ color: 'var(--text-3)' }}>Shop</Link>
        <ChevronRight size={13} />
        <span style={{ color: 'var(--text)' }}>{product.name}</span>
      </div>

      {/* Main product purchase block */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, marginBottom: 64 }}>
        
        {/* Left Side: Images Carousel */}
        <div>
          <div style={{ background: '#F1F0EC', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 14 }}>
            <img 
              src={product.images && product.images[activeImg] ? product.images[activeImg] : product.image} 
              alt="" 
              style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', transition: 'all .4s ease' }} 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {product.images && product.images.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setActiveImg(i)} 
                style={{ 
                  background: '#F1F0EC', 
                  borderRadius: 14, 
                  overflow: 'hidden', 
                  border: i === activeImg ? '2.5px solid var(--accent)' : '1.5px solid var(--border)', 
                  cursor: 'pointer', 
                  transition: 'all .2s ease' 
                }}
              >
                <img src={img} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Configuration & Actions */}
        <div style={{ paddingTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <Stars rating={product.rating} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
          <h1 className="ff" style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-.02em', lineHeight: 1.1, marginBottom: 10 }}>
            {product.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span style={{ fontSize: 16, color: 'var(--text-3)', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6 }}>
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 28 }}>{product.desc}</p>

          {/* Color Selection */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-2)', marginBottom: 12 }}>
              Color — <span style={{ color: 'var(--text)', textTransform: 'none', letterSpacing: 'normal' }}>{selectedColor}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {colors.map(color => (
                <button 
                  key={color.name} 
                  onClick={() => setSelectedColor(color.name)} 
                  style={{
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    background: color.hex, 
                    cursor: 'pointer',
                    border: selectedColor === color.name ? '3px solid var(--accent)' : '2px solid var(--border)',
                    boxShadow: selectedColor === color.name ? '0 0 0 2px #fff,0 0 0 4px var(--accent)' : 'none',
                    transition: 'all .2s ease', 
                    outline: 'none',
                  }} 
                />
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-2)', marginBottom: 12 }}>Quantity</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: '#F5F4F0', borderRadius: 12, border: '1.5px solid var(--border)', overflow: 'hidden' }}>
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))} 
                style={{ padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              >
                <Minus size={15} />
              </button>
              <span style={{ padding: '10px 18px', fontSize: 15, fontWeight: 700, minWidth: 48, textAlign: 'center' }}>{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)} 
                style={{ padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            <button 
              onClick={handleAddToCart} 
              className="btn btn-p" 
              style={{ flex: 1, justifyContent: 'center', padding: '15px 24px', fontSize: 15 }}
            >
              <ShoppingBag size={17} /> Add to Cart
            </button>
            <button 
              onClick={() => toggleWishlist(product.id)}
              className="btn btn-s" 
              style={{ 
                padding: '15px', 
                aspectRatio: '1',
                borderColor: isWishlisted ? 'var(--accent-warm)' : 'var(--border-md)',
                color: isWishlisted ? 'var(--accent-warm)' : 'var(--text)'
              }}
            >
              <Heart size={17} style={{ fill: isWishlisted ? 'var(--accent-warm)' : 'none' }} />
            </button>
          </div>

          {/* Static Perks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '20px', background: '#F8F7F3', borderRadius: 14 }}>
            {[
              [<Truck size={15} style={{ color: 'var(--accent)' }} />, 'Free Delivery over $50'],
              [<RotateCcw size={15} style={{ color: 'var(--accent)' }} />, '7-Day Return Policy'],
              [<Shield size={15} style={{ color: 'var(--accent)' }} />, '1-Year Warranty'],
              [<Award size={15} style={{ color: 'var(--accent)' }} />, 'Genuine Product'],
            ].map(([icon, text], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>
                {icon} {text}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Tabs Menu Section */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', gap: 32, borderBottom: '1.5px solid var(--border)', marginBottom: 28 }}>
          {[
            ['desc', 'Description'],
            ['spec', 'Specifications'],
            ['rev', `Reviews (${product.reviewsList ? product.reviewsList.length : product.reviews})`]
          ].map(([key, label]) => (
            <button 
              key={key} 
              onClick={() => setTab(key)} 
              className={`tabBtn ${tab === key ? 'on' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'desc' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 40, 
            alignItems: 'center', 
            background: 'var(--surface)', 
            borderRadius: 20, 
            border: '1px solid var(--border)', 
            padding: '36px' 
          }}>
            <div>
              <h3 className="ff" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 14, lineHeight: 1.2 }}>
                Quality Engineered.
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 20 }}>
                {product.desc} Every item passes multi-point stress testing before leaving the factory. Built to complement your everyday device loadout.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Premium Grade Materials', 'Stress Tested & Certified', 'Optimal Heat Dissipation', 'Ergonomic Slip-resistant Styling'].map(li => (
                  <li key={li} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-2)', fontWeight: 500 }}>
                    <div style={{ width: 20, height: 20, background: '#ECFDF5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={12} style={{ color: '#10B981' }} />
                    </div>
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            <img src={product.image} style={{ borderRadius: 18, width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} alt="" />
          </div>
        )}

        {tab === 'spec' && (
          <div style={{ 
            background: 'var(--surface)', 
            borderRadius: 20, 
            border: '1px solid var(--border)', 
            padding: '36px' 
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>Technical Specs</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {product.specs && Object.entries(product.specs).map(([key, value]) => (
                <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>{key}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'rev' && (
          <div style={{ 
            background: 'var(--surface)', 
            borderRadius: 20, 
            border: '1px solid var(--border)', 
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>Customer Reviews</h3>
            {product.reviewsList && product.reviewsList.length > 0 ? (
              product.reviewsList.map((review, i) => (
                <div key={i} style={{ borderBottom: i < product.reviewsList.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{review.author}</span>
                      <Stars rating={review.rating} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{review.date}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{review.comment}</p>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: '12px' }}>No written reviews yet. Be the first to review!</div>
            )}
          </div>
        )}
      </div>

      {/* Recommended "You May Also Like" Products */}
      {similarProducts.length > 0 && (
        <div>
          <SectionHeader label="Recommended" title="You May Also Like" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {similarProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => navigate(`/product/${p.id}`)} 
                style={{ 
                  background: 'var(--surface)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 18, 
                  overflow: 'hidden', 
                  cursor: 'pointer', 
                  transition: 'all .3s ease' 
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--sh-lg)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ overflow: 'hidden', background: '#F1F0EC', aspectRatio: '4/3' }}>
                  <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>
                    {p.category}
                  </div>
                  <h4 style={{ 
                    fontSize: 13, 
                    fontWeight: 700, 
                    color: 'var(--text)', 
                    marginBottom: 8, 
                    lineHeight: 1.4, 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                  }}>
                    {p.name}
                  </h4>
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>${p.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
