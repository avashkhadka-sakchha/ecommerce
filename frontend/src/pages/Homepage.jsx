import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Truck, Shield, RotateCcw, Award, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import Wrap from '../components/Wrap';
import SectionHeader from '../components/SectionHeader';
import ProductCard from '../components/ProductCard';

export default function Homepage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const avatars = ['photo-1534528741775-53994a69daeb', 'photo-1507003211169-0a1dd7228f2d', 'photo-1494790108377-be9c29b29330', 'photo-1506794778202-cad84cf45f1d'];

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await api.getProducts();
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Marquee */}
      <div style={{ background: 'var(--accent)', overflow: 'hidden', padding: '10px 0' }}>
        <div className="marq">
          {[...Array(8)].map((_, i) => (
            <span key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 32, 
              color: 'rgba(255,255,255,.9)', 
              fontSize: 12, 
              fontWeight: 600, 
              letterSpacing: '.08em', 
              textTransform: 'uppercase', 
              padding: '0 32px', 
              whiteSpace: 'nowrap' 
            }}>
              Free Delivery Over NPR 999 <span style={{ opacity: .4 }}>✦</span> 7-Day Returns <span style={{ opacity: .4 }}>✦</span> Summer Sale — Up to 40% OFF <span style={{ opacity: .4 }}>✦</span> Genuine Products Guaranteed <span style={{ opacity: .4 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="mesh" style={{ padding: '80px 0 100px', overflow: 'hidden' }}>
        <Wrap>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
            
            {/* Left copy */}
            <div className="a0" style={{ maxWidth: 540 }}>
              <div className="a0" style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 8, 
                background: '#fff', 
                borderRadius: 100, 
                padding: '5px 16px 5px 5px', 
                border: '1px solid var(--border)', 
                boxShadow: 'var(--sh-sm)', 
                marginBottom: 28 
              }}>
                <span style={{ 
                  background: 'var(--accent)', 
                  color: '#fff', 
                  fontSize: 10, 
                  fontWeight: 800, 
                  borderRadius: 100, 
                  padding: '3px 10px', 
                  letterSpacing: '.06em', 
                  textTransform: 'uppercase' 
                }}>2026</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>Summer Collection is Live</span>
              </div>
              <h1 className="ff a1" style={{ 
                fontSize: 'clamp(44px, 5.5vw, 72px)', 
                fontWeight: 900, 
                lineHeight: 1.04, 
                letterSpacing: '-.03em', 
                color: 'var(--text)', 
                marginBottom: 22 
              }}>
                The Best<br />
                <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 800 }}>Accessories</em><br />
                for Every Device.
              </h1>
              <p className="a2" style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.75, maxWidth: 400, marginBottom: 36 }}>
                Premium-grade mobile accessories crafted for durability and style. Trusted by 10,000+ customers across Nepal.
              </p>
              
              <div className="a3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                <button onClick={() => navigate('/shop')} className="btn btn-p" style={{ fontSize: 15 }}>
                  Shop the Collection <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate('/categories')} className="btn btn-s" style={{ fontSize: 15 }}>
                  Browse Categories
                </button>
              </div>

              {/* Social proof */}
              <div className="a3" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex' }}>
                  {avatars.map((id, i) => (
                    <img 
                      key={id} 
                      src={`https://images.unsplash.com/${id}?w=80&fit=crop`} 
                      alt="" 
                      style={{ 
                        width: 34, 
                        height: 34, 
                        borderRadius: '50%', 
                        border: '2.5px solid #fff', 
                        marginLeft: i > 0 ? -10 : 0, 
                        objectFit: 'cover', 
                        boxShadow: '0 2px 6px rgba(0,0,0,.1)' 
                      }} 
                    />
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} style={{ fill: '#FBBF24', color: '#FBBF24' }} />)}
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
                    <strong style={{ color: 'var(--text)' }}>10,000+</strong> happy customers
                  </span>
                </div>
              </div>
            </div>

            {/* Right collage */}
            <div style={{ position: 'relative', height: 480 }}>
              <div className="float" style={{ 
                position: 'absolute', 
                left: '3%', 
                top: 0, 
                width: '54%', 
                borderRadius: 24, 
                overflow: 'hidden', 
                boxShadow: '0 20px 60px rgba(0,0,0,.14)', 
                transform: 'rotate(-2.5deg)', 
                border: '4px solid #fff' 
              }}>
                <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} alt="" />
              </div>
              <div className="float2" style={{ 
                position: 'absolute', 
                right: 0, 
                top: '4%', 
                width: '43%', 
                borderRadius: 20, 
                overflow: 'hidden', 
                boxShadow: '0 16px 40px rgba(0,0,0,.12)', 
                transform: 'rotate(2deg)', 
                border: '4px solid #fff' 
              }}>
                <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&auto=format&fit=crop" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} alt="" />
              </div>
              <div className="float" style={{ 
                position: 'absolute', 
                right: '3%', 
                bottom: '3%', 
                width: '40%', 
                borderRadius: 20, 
                overflow: 'hidden', 
                boxShadow: '0 16px 40px rgba(0,0,0,.12)', 
                transform: 'rotate(-1.5deg)', 
                border: '4px solid #fff', 
                animationDelay: '.5s' 
              }}>
                <img src="https://images.unsplash.com/photo-1622445262465-2481c4574875?w=400&auto=format&fit=crop" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} alt="" />
              </div>
              
              {/* Floating stats */}
              <div style={{ 
                position: 'absolute', 
                left: '-2%', 
                bottom: '16%', 
                background: '#fff', 
                borderRadius: 16, 
                padding: '12px 18px', 
                boxShadow: '0 10px 32px rgba(0,0,0,.12)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                zIndex: 10 
              }}>
                <div style={{ width: 40, height: 40, background: 'var(--accent-bg)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>500+</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginTop: 2 }}>Products in Stock</div>
                </div>
              </div>

              <div style={{ 
                position: 'absolute', 
                right: '-3%', 
                top: '48%', 
                background: '#fff', 
                borderRadius: 16, 
                padding: '12px 18px', 
                boxShadow: '0 10px 32px rgba(0,0,0,.12)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                zIndex: 10 
              }}>
                <div style={{ width: 40, height: 40, background: '#FFF7ED', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={18} style={{ fill: '#F97316', color: '#F97316' }} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>4.9/5</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginTop: 2 }}>Avg. Rating</div>
                </div>
              </div>
            </div>

          </div>
        </Wrap>
      </section>

      {/* Trust bar */}
      <div style={{ background: 'var(--text)', padding: '32px 0' }}>
        <Wrap>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { icon: <Truck size={20} style={{ color: '#60A5FA' }} />, bg: 'rgba(96,165,250,.12)', title: 'Free Delivery', desc: 'On orders over NPR 999' },
              { icon: <Shield size={20} style={{ color: '#34D399' }} />, bg: 'rgba(52,211,153,.12)', title: 'Secure Checkout', desc: 'SSL encrypted & safe' },
              { icon: <RotateCcw size={20} style={{ color: '#FB923C' }} />, bg: 'rgba(251,146,60,.12)', title: '7-Day Returns', desc: 'Hassle-free process' },
              { icon: <Award size={20} style={{ color: '#A78BFA' }} />, bg: 'rgba(167,139,250,.12)', title: 'Genuine Products', desc: '100% authenticity' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, background: item.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', fontWeight: 500 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </div>

      {/* Shop by Category */}
      <section style={{ padding: '80px 0' }}>
        <Wrap>
          <SectionHeader
            label="Browse Collections"
            title="Shop by Category"
            action={
              <Link to="/categories" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                View All <ChevronRight size={15} />
              </Link>
            }
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
            {[
              ['📱', 'Phone Cases', 'Phone Cases'],
              ['⚡', 'Chargers', 'Chargers'],
              ['🎧', 'Earphones', 'Earphones'],
              ['🔋', 'Power Banks', 'Power Banks'],
              ['💎', 'Protectors', 'Protectors'],
              ['🔌', 'Cables', 'Cables'],
              ['💼', 'Accessories', 'Accessories'],
            ].map(([icon, name, categoryName]) => (
              <Link 
                key={name} 
                to={`/shop?category=${encodeURIComponent(categoryName)}`} 
                className="ccard" 
                style={{ padding: '22px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}
              >
                <div className="cicon" style={{ 
                  width: 48, 
                  height: 48, 
                  background: '#F5F4F0', 
                  borderRadius: 14, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 22, 
                  transition: 'background .25s ease' 
                }}>{icon}</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{name}</span>
              </Link>
            ))}
          </div>
        </Wrap>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '0 0 80px' }}>
        <Wrap>
          <SectionHeader
            label="Hand-Picked for You"
            title="Featured Products"
            action={
              <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
                View All <ChevronRight size={15} />
              </Link>
            }
          />
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>Loading featured items...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 22 }}>
              {featuredProducts.map(p => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </Wrap>
      </section>

      {/* Promo banner */}
      <section style={{ padding: '0 0 80px' }}>
        <Wrap>
          <div style={{ 
            background: 'linear-gradient(130deg, #1A35C8 0%, #2455E8 45%, #4F6FF5 100%)', 
            borderRadius: 28, 
            padding: '56px 60px', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 40, 
            alignItems: 'center', 
            overflow: 'hidden', 
            position: 'relative' 
          }}>
            <div style={{ position: 'absolute', top: -60, right: '35%', width: 300, height: 300, background: 'rgba(255,255,255,.04)', borderRadius: '50%' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 14 }}>
                Limited Time Offer
              </div>
              <h3 className="ff" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: 18 }}>
                Summer Tech Fest.<br />Up to 40% OFF.
              </h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,.7)', lineHeight: 1.7, marginBottom: 28, maxWidth: 360 }}>
                Refresh your mobile setup with our best-selling accessories at unbeatable prices. Limited time only.
              </p>
              <button onClick={() => navigate('/shop')} className="btn" style={{ background: '#fff', color: 'var(--accent)', padding: '13px 26px', fontSize: 14 }}>
                Explore Deals <ArrowRight size={15} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop" style={{ width: 300, borderRadius: 22, objectFit: 'cover', aspectRatio: '4/3', border: '4px solid rgba(255,255,255,.15)', display: 'block' }} alt="" />
                <div style={{ 
                  position: 'absolute', 
                  bottom: -12, 
                  right: -12, 
                  background: '#fff', 
                  borderRadius: 14, 
                  padding: '10px 16px', 
                  boxShadow: '0 8px 24px rgba(0,0,0,.2)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8 
                }}>
                  <span style={{ fontSize: 22 }}>🔥</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>Best Seller</div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Top rated this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Wrap>
      </section>
    </div>
  );
}
