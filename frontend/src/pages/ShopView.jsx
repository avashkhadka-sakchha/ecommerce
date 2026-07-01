import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Zap } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ShopView() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Strictly derive all states from URL params
  const searchVal = searchParams.get('search') || '';
  const tagVal = searchParams.get('tag') || '';
  const selectedCategories = searchParams.getAll('category');
  const selectedBrands = searchParams.getAll('brand');
  const priceMax = parseInt(searchParams.get('priceMax') || '200');
  const sort = searchParams.get('sort') || 'Sort: Featured';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync products list when query params change.
  // IMPORTANT: depend on searchParams.toString() (a stable primitive),
  // NOT on selectedCategories/selectedBrands, which are new array
  // references on every render and would cause an infinite loop here.
  useEffect(() => {
    async function loadFilteredProducts() {
      setLoading(true);
      try {
        const filters = {
          categories: selectedCategories,
          brands: selectedBrands,
          priceMax: priceMax,
          search: searchVal,
          sort: sort
        };

        let data = await api.getProducts(filters);

        if (tagVal === 'SALE') {
          data = data.filter(p => p.tag === 'SALE');
        }

        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFilteredProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Handler for category checkbox change updates URL params
  const handleCategoryChange = (categoryName) => {
    const nextParams = new URLSearchParams(searchParams);
    const current = nextParams.getAll('category');
    if (current.includes(categoryName)) {
      const filtered = current.filter(c => c !== categoryName);
      nextParams.delete('category');
      filtered.forEach(c => nextParams.append('category', c));
    } else {
      nextParams.append('category', categoryName);
    }
    setSearchParams(nextParams);
  };

  // Handler for brand checkbox change updates URL params
  const handleBrandChange = (brandName) => {
    const nextParams = new URLSearchParams(searchParams);
    const current = nextParams.getAll('brand');
    if (current.includes(brandName)) {
      const filtered = current.filter(b => b !== brandName);
      nextParams.delete('brand');
      filtered.forEach(b => nextParams.append('brand', b));
    } else {
      nextParams.append('brand', brandName);
    }
    setSearchParams(nextParams);
  };

  const handlePriceChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('priceMax', val);
    setSearchParams(nextParams);
  };

  const handleSortChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', val);
    setSearchParams(nextParams);
  };

  // Reset all filters (clears URL search query string)
  const handleClearAll = () => {
    setSearchParams({});
  };

  return (
    <div style={{
      maxWidth: 1280,
      margin: '0 auto',
      padding: '48px 28px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 32,
      alignItems: 'start'
    }}>

      {/* Sidebar Filter Panel */}
      <aside style={{
        background: 'var(--surface)',
        borderRadius: 20,
        border: '1px solid var(--border)',
        padding: '24px',
        boxShadow: 'var(--sh-sm)',
        gridColumn: 'span 1'
      }} className="sticky-sidebar">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 18,
          borderBottom: '1px solid var(--border)',
          marginBottom: 20
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15 }}>
            <SlidersHorizontal size={15} style={{ color: 'var(--accent)' }} /> Filters
          </span>
          <button
            onClick={handleClearAll}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
            Categories
          </div>
          {['Phone Cases', 'Chargers', 'Earphones', 'Power Banks', 'Protectors', 'Cables', 'Accessories'].map(item => (
            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>
              <input
                type="checkbox"
                style={{ width: 15, height: 15 }}
                checked={selectedCategories.includes(item)}
                onChange={() => handleCategoryChange(item)}
              />
              {item}
            </label>
          ))}
        </div>

        {/* Price Slider */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
            Price Range
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={priceMax}
            onChange={(e) => handlePriceChange(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--text-2)', marginTop: 6 }}>
            <span>$0</span>
            <span>${priceMax}</span>
          </div>
        </div>

        {/* Brands */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
            Brand
          </div>
          {['Anker', 'Belkin', 'Spigen', 'Native Union', 'Baseus'].map(b => (
            <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>
              <input
                type="checkbox"
                style={{ width: 15, height: 15 }}
                checked={selectedBrands.includes(b)}
                onChange={() => handleBrandChange(b)}
              />
              {b}
            </label>
          ))}
        </div>

        {/* Promo box */}
        <div style={{ background: 'var(--accent-bg)', border: '1px solid rgba(36,85,232,.15)', borderRadius: 14, padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Zap size={13} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Bundle & Save
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 10 }}>Buy any case + screen protector and save 20%.</p>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', cursor: 'pointer' }}>Shop Bundles →</span>
        </div>
      </aside>

      {/* Product Grid Area */}
      <div style={{ gridColumn: 'span 2' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              {searchVal ? `Search results for "${searchVal}"` : tagVal === 'SALE' ? 'Exclusive Deals' : 'All Accessories'}
            </h2>
            <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>
              {loading ? 'Searching...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
            </span>
          </div>

          <select
            className="finp"
            style={{ width: 'auto', padding: '9px 16px', fontSize: 13 }}
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Top Rated</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)', fontWeight: 600 }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 40px',
            background: 'var(--surface)',
            borderRadius: 20,
            border: '1px solid var(--border)',
            boxShadow: 'var(--sh-sm)'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No products found</h3>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>
              Try adjusting your search query or clear filters to see all available items.
            </p>
            <button className="btn btn-p" onClick={handleClearAll}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 22
          }}>
            {products.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}