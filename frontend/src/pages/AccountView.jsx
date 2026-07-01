import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Package, Heart, Settings, Bell, LogOut, Check, MapPin, Plus, Trash2, Edit3, Sliders, Lock, Mail, Phone, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';

export default function AccountView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { 
    profile, 
    orders, 
    wishlist, 
    isLoggedIn, 
    login, 
    register, 
    logout, 
    updateProfile, 
    toggleWishlist 
  } = useStore();

  // Auth States
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'register'
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer' // customer, manager, admin
  });

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Pre-fill profile form details on load
  const [prevProfile, setPrevProfile] = useState(null);
  if (profile !== prevProfile) {
    setPrevProfile(profile);
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || ''
      });
    }
  }

  // Wishlist States
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Address Form States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: '', street: '', province: '' });
  const [successMsg, setSuccessMsg] = useState('');

  // Product Management States (Manager / Admin only)
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: 'Phone Cases',
    price: '',
    originalPrice: '',
    tag: '',
    image: '',
    desc: '',
    specsRaw: '' // key-value lines, e.g. "Material: Liquid Silicone"
  });

  // Fetch product info for wishlist IDs
  useEffect(() => {
    async function loadWishlistDetails() {
      if (activeTab === 'wishlist' && wishlist.length > 0) {
        setLoadingWishlist(true);
        try {
          const allProducts = await api.getProducts();
          const filtered = allProducts.filter(p => wishlist.includes(p.id));
          setWishlistProducts(filtered);
        } catch (err) {
          console.error('Failed to load wishlist details:', err);
        } finally {
          setLoadingWishlist(false);
        }
      } else {
        setWishlistProducts([]);
      }
    }
    loadWishlistDetails();
  }, [wishlist, activeTab]);

  // Fetch products for Product Management Tab
  const loadProductInventory = async () => {
    if (profile && (profile.role === 'manager' || profile.role === 'admin')) {
      setLoadingProducts(true);
      try {
        const list = await api.getProducts();
        setProductsList(list);
      } catch (err) {
        console.error('Failed to load products list:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'products') {
      loadProductInventory();
    }
  }, [activeTab, profile]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
    setSuccessMsg('');
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Auth Submit Handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setAuthError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      await register(registerForm);
      setSuccessMsg('Account registered successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setAuthError(err.message || 'Failed to register account.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Profile submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await updateProfile({
        ...profile,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phone: profileForm.phone
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  // Add Address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!profile || !addressForm.name || !addressForm.street) return;

    try {
      const newAddress = {
        id: `addr-${Math.floor(1000 + Math.random() * 9000)}`,
        name: addressForm.name,
        street: addressForm.street,
        province: addressForm.province || 'Bagmati Province, Nepal',
        isDefault: profile.addresses.length === 0
      };

      const updatedAddresses = [...profile.addresses, newAddress];
      await updateProfile({ ...profile, addresses: updatedAddresses });
      
      setAddressForm({ name: '', street: '', province: '' });
      setShowAddressForm(false);
      setSuccessMsg('Address added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error adding address:', err);
    }
  };

  const handleMakeDefaultAddress = async (addrId) => {
    if (!profile) return;
    try {
      const updatedAddresses = profile.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addrId
      }));
      await updateProfile({ ...profile, addresses: updatedAddresses });
      setSuccessMsg('Default address updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error setting default address:', err);
    }
  };

  // Product Management CRUD Actions
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    // Parse specsRaw line-by-line (e.g. "Material: Liquid Silicone") into map
    const specs = {};
    if (productForm.specsRaw) {
      productForm.specsRaw.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join(':').trim();
          if (key && val) {
            specs[key] = val;
          }
        }
      });
    }

    const productData = {
      name: productForm.name,
      brand: productForm.brand,
      category: productForm.category,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      tag: productForm.tag || undefined,
      image: productForm.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      desc: productForm.desc,
      specs
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
        setSuccessMsg('Product updated successfully!');
      } else {
        await api.addProduct(productData);
        setSuccessMsg('Product added successfully!');
      }
      
      setProductForm({
        name: '',
        brand: '',
        category: 'Phone Cases',
        price: '',
        originalPrice: '',
        tag: '',
        image: '',
        desc: '',
        specsRaw: ''
      });
      setShowProductForm(false);
      setEditingProduct(null);
      setTimeout(() => setSuccessMsg(''), 3000);
      loadProductInventory();
    } catch (error) {
      console.error('Failed to submit product:', error);
      alert('Error updating/adding product. Check authorization.');
    }
  };

  const handleEditProductClick = (p) => {
    // Convert specs map back to text
    let specsRawText = '';
    if (p.specs) {
      const specMap = p.specs instanceof Map ? Object.fromEntries(p.specs) : p.specs;
      specsRawText = Object.entries(specMap)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
    }

    setProductForm({
      name: p.name || '',
      brand: p.brand || '',
      category: p.category || 'Phone Cases',
      price: p.price || '',
      originalPrice: p.originalPrice || '',
      tag: p.tag || '',
      image: p.image || '',
      desc: p.desc || '',
      specsRaw: specsRawText
    });
    setEditingProduct(p);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        setSuccessMsg('Product deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        loadProductInventory();
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product.');
      }
    }
  };

  // --- RENDER GUEST AUTH CARD IF NOT LOGGED IN ---
  if (!isLoggedIn || !profile) {
    return (
      <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 20px' }}>
        <div style={{
          background: 'var(--surface)',
          borderRadius: 24,
          border: '1px solid var(--border)',
          padding: '40px 32px',
          boxShadow: 'var(--sh-xl)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ 
              width: 50, 
              height: 50, 
              background: 'var(--accent)', 
              borderRadius: 14, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 6px 20px rgba(36,85,232,.25)'
            }}>
              <Lock size={22} style={{ color: '#fff' }} />
            </div>
            <h2 className="ff" style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              {authTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>
              {authTab === 'login' 
                ? 'Sign in to access your orders, profile and cart sync.' 
                : 'Join MobileHub Nepal and customize your shopping experience.'
              }
            </p>
          </div>

          {authError && (
            <div style={{ 
              background: '#FEF2F2', 
              color: '#B91C1C', 
              border: '1px solid #FCA5A5', 
              padding: '12px 16px', 
              borderRadius: 12, 
              fontSize: 13, 
              fontWeight: 600, 
              marginBottom: 20 
            }}>
              {authError}
            </div>
          )}

          {successMsg && (
            <div style={{ 
              background: '#ECFDF5', 
              color: '#047857', 
              border: '1px solid #A7F3D0', 
              padding: '12px 16px', 
              borderRadius: 12, 
              fontSize: 13, 
              fontWeight: 600, 
              marginBottom: 20 
            }}>
              {successMsg}
            </div>
          )}

          {/* Form Toggle Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg)', padding: 4, borderRadius: 12, marginBottom: 24 }}>
            <button 
              onClick={() => { setAuthTab('login'); setAuthError(''); }}
              style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: authTab === 'login' ? 'var(--surface)' : 'transparent',
                color: authTab === 'login' ? 'var(--text)' : 'var(--text-3)',
                boxShadow: authTab === 'login' ? 'var(--sh-sm)' : 'none',
                transition: 'all .2s'
              }}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setAuthTab('register'); setAuthError(''); }}
              style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: authTab === 'register' ? 'var(--surface)' : 'transparent',
                color: authTab === 'register' ? 'var(--text)' : 'var(--text-3)',
                boxShadow: authTab === 'register' ? 'var(--sh-sm)' : 'none',
                transition: 'all .2s'
              }}
            >
              Register
            </button>
          </div>

          {/* SIGN IN FORM */}
          {authTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="finp"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="finp"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={authLoading}
                className="btn btn-p" 
                style={{ width: '100%', padding: '12px', fontSize: 14, marginTop: 10, justifyContent: 'center' }}
              >
                {authLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>First Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="John"
                    value={registerForm.firstName}
                    onChange={e => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="finp"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Last Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="Doe"
                    value={registerForm.lastName}
                    onChange={e => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="finp"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                  <input 
                    type="email"
                    required
                    placeholder="john.doe@example.com"
                    value={registerForm.email}
                    onChange={e => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    className="finp"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                  <input 
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={registerForm.password}
                    onChange={e => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    className="finp"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                  <input 
                    type="text"
                    placeholder="+977 98XXXXXXXX"
                    value={registerForm.phone}
                    onChange={e => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="finp"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>

              {/* ROLE SELECTION dropdown for easy testing! */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Testing Role Permissions</label>
                <select 
                  value={registerForm.role}
                  onChange={e => setRegisterForm(prev => ({ ...prev, role: e.target.value }))}
                  className="finp"
                  style={{ width: '100%', height: 42, background: 'var(--surface)', cursor: 'pointer' }}
                >
                  <option value="customer">Customer (Buy and Shop)</option>
                  <option value="manager">Manager (Add / Remove Products)</option>
                  <option value="admin">Admin (All Access & View Orders)</option>
                </select>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500, marginTop: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
                  <Info size={11} /> You can select any role to test backend controls!
                </div>
              </div>

              <button 
                type="submit" 
                disabled={authLoading}
                className="btn btn-p" 
                style={{ width: '100%', padding: '12px', fontSize: 14, marginTop: 10, justifyContent: 'center' }}
              >
                {authLoading ? 'Creating Account...' : 'Register'}
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // Define sidebar menu items dynamically based on roles
  const menuItems = [
    { id: 'profile', icon: <User size={16} />, label: 'My Profile' },
    { id: 'orders', icon: <Package size={16} />, label: 'Order History' },
    { id: 'wishlist', icon: <Heart size={16} />, label: 'Wishlist' },
    { id: 'settings', icon: <Settings size={16} />, label: 'Address Settings' },
    { id: 'notifications', icon: <Bell size={16} />, label: 'Notifications' },
  ];

  if (profile.role === 'manager' || profile.role === 'admin') {
    menuItems.push({ id: 'products', icon: <Sliders size={16} />, label: 'Product Manager' });
  }

  return (
    <div style={{ 
      maxWidth: 1280, 
      margin: '0 auto', 
      padding: '48px 28px', 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
      gap: 28, 
      alignItems: 'start' 
    }}>
      
      {/* Sidebar Nav */}
      <aside style={{ gridColumn: 'span 1' }}>
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '28px 24px', textAlign: 'center', marginBottom: 12 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 14px', border: '3px solid var(--border)' }}>
            <img src={profile.role === 'customer' ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format" : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
            {profile.firstName} {profile.lastName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500, marginBottom: 12 }}>{profile.email}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <span style={{ 
              display: 'inline-block', 
              background: 'var(--accent-bg)', 
              color: 'var(--accent)', 
              fontSize: 10, 
              fontWeight: 800, 
              letterSpacing: '.08em', 
              textTransform: 'uppercase', 
              padding: '4px 12px', 
              borderRadius: 20, 
              border: '1px solid rgba(36,85,232,.2)' 
            }}>
              {profile.membership}
            </span>
            <span style={{ 
              display: 'inline-block', 
              background: profile.role === 'customer' ? '#F3F4F6' : (profile.role === 'manager' ? '#FEF3C7' : '#ECFDF5'), 
              color: profile.role === 'customer' ? '#374151' : (profile.role === 'manager' ? '#D97706' : '#059669'), 
              fontSize: 9, 
              fontWeight: 800, 
              letterSpacing: '.08em', 
              textTransform: 'uppercase', 
              padding: '3px 10px', 
              borderRadius: 20, 
              border: '1px solid transparent'
            }}>
              ROLE: {profile.role}
            </span>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '10px' }}>
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => handleTabChange(item.id)} 
              className={`amBtn ${activeTab === item.id ? 'on' : ''}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '6px 4px' }} />
          <button 
            className="amBtn" 
            style={{ color: '#EF4444' }}
            onClick={logout}
            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444'; }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, gridColumn: 'span 2' }}>
        
        {successMsg && (
          <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px 18px', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
            {successMsg}
          </div>
        )}

        {/* Tab 1: Profile Edit */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '28px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Personal Profile</h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28, fontWeight: 500 }}>Manage your personal info, delivery addresses, and preferences.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 7 }}>First Name</label>
                <input 
                  value={profileForm.firstName} 
                  onChange={e => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="finp" 
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 7 }}>Last Name</label>
                <input 
                  value={profileForm.lastName} 
                  onChange={e => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="finp" 
                  required
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 7 }}>Email Address</label>
                <input 
                  value={profileForm.email} 
                  onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="finp" 
                  type="email"
                  required
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 7 }}>Phone Number</label>
                <input 
                  value={profileForm.phone} 
                  onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="finp" 
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button type="submit" className="btn btn-p" style={{ fontSize: 14 }}>
                Save Changes <Check size={15} />
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Orders History */}
        {activeTab === 'orders' && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '28px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Order History</h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20, fontWeight: 500 }}>
              {profile.role === 'manager' || profile.role === 'admin' 
                ? 'All order transactions placed by customers across MobileHub.' 
                : 'Track details of your recently placed mobile accessory purchases.'
              }
            </p>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)' }}>
                <Package size={40} style={{ margin: '0 auto 12px', strokeWidth: 1.5 }} />
                <div style={{ fontWeight: 600 }}>No orders placed yet</div>
                <Link to="/shop" className="btn btn-p btn-sm" style={{ marginTop: 14 }}>Explore Shop</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {orders.map(order => (
                  <div key={order.id} style={{ border: '1.5px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                    <div style={{ background: '#F8F7F3', borderBottom: '1px solid var(--border)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>ORDER ID</div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{order.id}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>DATE PLACED</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{order.date}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>TOTAL COST</div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>${order.total.toFixed(2)}</span>
                      </div>
                      {(profile.role === 'manager' || profile.role === 'admin') && order.user && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>CUSTOMER</div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>
                            {order.user.firstName} {order.user.lastName} ({order.user.email})
                          </span>
                        </div>
                      )}
                      <div>
                        <span style={{ 
                          fontSize: 11, 
                          fontWeight: 700, 
                          padding: '4px 10px', 
                          borderRadius: 20, 
                          background: order.status === 'Delivered' ? '#ECFDF5' : '#FEF3C7', 
                          color: order.status === 'Delivered' ? '#065F46' : '#92400E' 
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '16px 20px' }}>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '10px 0', borderBottom: idx < order.items.length - 1 ? '1px dashed var(--border)' : 'none' }}>
                            <img src={item.image} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} alt="" />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{item.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Variant: {item.variant} · Qty: {item.quantity}</div>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Seeded mock order containing {order.itemsCount || 1} accessories.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Wishlist Items */}
        {activeTab === 'wishlist' && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '28px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>My Wishlist</h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24, fontWeight: 500 }}>Your hand-picked accessories saved for later purchasing.</p>

            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)' }}>
                <Heart size={40} style={{ margin: '0 auto 12px', strokeWidth: 1.5 }} />
                <div style={{ fontWeight: 600 }}>Your wishlist is empty</div>
                <Link to="/shop" className="btn btn-p btn-sm" style={{ marginTop: 14 }}>Browse Products</Link>
              </div>
            ) : loadingWishlist ? (
              <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: '20px' }}>Loading wishlist...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                {wishlistProducts.map(p => (
                  <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', background: '#fff', position: 'relative' }}>
                    <button 
                      onClick={() => toggleWishlist(p.id)}
                      style={{ 
                        position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%', 
                        background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--sh-sm)', color: 'var(--accent-warm)'
                      }}
                    >
                      <Heart size={14} style={{ fill: 'var(--accent-warm)' }} />
                    </button>
                    <Link to={`/product/${p.id}`}>
                      <img src={p.image} style={{ width: '100%', aspectRatio: '1.2', objectFit: 'cover' }} alt="" />
                      <div style={{ padding: '12px 14px' }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</h4>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>${p.price.toFixed(2)}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Address Settings */}
        {activeTab === 'settings' && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '28px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Saved Addresses</h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24, fontWeight: 500 }}>Manage default shipping addresses for fast checkouts.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {profile.addresses && profile.addresses.map(addr => (
                <div key={addr.id} style={{ 
                  background: '#F8F7F3', 
                  border: addr.isDefault ? '2.5px solid var(--accent)' : '1.5px solid var(--border)', 
                  borderRadius: 14, 
                  padding: '18px 20px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start' 
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <MapPin size={14} style={{ color: 'var(--accent)' }} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{addr.name}</span>
                      {addr.isDefault && (
                        <span style={{ background: 'var(--accent-bg)', color: 'var(--accent)', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                          Default
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
                      {addr.street}<br />{addr.province}
                    </p>
                  </div>
                  {!addr.isDefault && (
                    <button 
                      onClick={() => handleMakeDefaultAddress(addr.id)}
                      style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Make Default
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!showAddressForm ? (
              <button 
                onClick={() => setShowAddressForm(true)}
                style={{ 
                  width: '100%', border: '2px dashed var(--border)', borderRadius: 14, padding: '14px', fontSize: 13, fontWeight: 700, 
                  color: 'var(--text-3)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .2s' 
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-bg)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'none'; }}
              >
                <Plus size={15} /> Add New Address
              </button>
            ) : (
              <form onSubmit={handleAddAddress} style={{ background: '#F8F7F3', padding: 20, borderRadius: 14, border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>New Address details</h4>
                <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Label Name (e.g. Work, Home)</label>
                    <input 
                      value={addressForm.name}
                      onChange={e => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Home, Office" 
                      className="finp" 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Street Address</label>
                    <input 
                      value={addressForm.street}
                      onChange={e => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                      placeholder="Street, Building No." 
                      className="finp" 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Province / City</label>
                    <input 
                      value={addressForm.province}
                      onChange={e => setAddressForm(prev => ({ ...prev, province: e.target.value }))}
                      placeholder="Bagmati Province, Kathmandu, Nepal" 
                      className="finp" 
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAddressForm(false)} className="btn btn-s btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-p btn-sm">Add Address</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 5: Dummy Notifications */}
        {activeTab === 'notifications' && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '28px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Notifications</h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20, fontWeight: 500 }}>Updates on order delivery dispatches, coupon deals, and items.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { title: 'Summer Tech Fest Coupon 🎉', msg: 'Use coupon SUMMER40 at checkout to save up to 40% on all Fast Chargers!', time: '1 hour ago', read: false },
                { title: 'Order Dispatched 📦', msg: 'Your order #MH-28471 has been loaded and dispatched via courier. Track shipment updates.', time: '2 days ago', read: true },
                { title: 'Premium Status Active 🏆', msg: 'Welcome to MobileHub Premium membership! Enjoy free delivery thresholds and early collections access.', time: '1 week ago', read: true }
              ].map((n, idx) => (
                <div key={idx} style={{ 
                  padding: '16px 20px', 
                  borderRadius: 14, 
                  background: n.read ? '#fff' : 'var(--accent-bg)', 
                  border: '1.5px solid var(--border)',
                  position: 'relative'
                }}>
                  {!n.read && (
                    <div style={{ position: 'absolute', top: 16, right: 16, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                  )}
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{n.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 8 }}>{n.msg}</p>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Product Management (Manager & Admin only) */}
        {activeTab === 'products' && (profile.role === 'manager' || profile.role === 'admin') && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Product Inventory Manager</h2>
                <p style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>Add, edit, or remove mobile accessories in the database.</p>
              </div>
              {!showProductForm && (
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      brand: '',
                      category: 'Phone Cases',
                      price: '',
                      originalPrice: '',
                      tag: '',
                      image: '',
                      desc: '',
                      specsRaw: ''
                    });
                    setShowProductForm(true);
                  }}
                  className="btn btn-p btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={15} /> Add Product
                </button>
              )}
            </div>

            {showProductForm ? (
              <form onSubmit={handleProductSubmit} style={{ background: '#F8F7F3', padding: 24, borderRadius: 16, border: '1.5px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Product Name</label>
                    <input 
                      value={productForm.name} 
                      onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. UltraFit Clear Case"
                      className="finp" 
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Brand</label>
                    <input 
                      value={productForm.brand} 
                      onChange={e => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="e.g. Spigen"
                      className="finp" 
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Category</label>
                    <select 
                      value={productForm.category}
                      onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="finp"
                      style={{ width: '100%', height: 42, background: 'var(--surface)' }}
                    >
                      <option value="Phone Cases">Phone Cases</option>
                      <option value="Chargers">Chargers</option>
                      <option value="Earphones">Earphones</option>
                      <option value="Protectors">Protectors</option>
                      <option value="Power Banks">Power Banks</option>
                      <option value="Cables">Cables</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Tag Badge (e.g. NEW, SALE)</label>
                    <input 
                      value={productForm.tag} 
                      onChange={e => setProductForm(prev => ({ ...prev, tag: e.target.value.toUpperCase() }))}
                      placeholder="e.g. NEW or SALE"
                      className="finp" 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Selling Price ($)</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={productForm.price} 
                      onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g. 29.99"
                      className="finp" 
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Original Price ($) - Optional</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={productForm.originalPrice} 
                      onChange={e => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                      placeholder="e.g. 39.99"
                      className="finp" 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Main Image URL</label>
                  <input 
                    value={productForm.image} 
                    onChange={e => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="finp" 
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                    Leave blank to use a fallback product placeholder image.
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Product Description</label>
                  <textarea 
                    value={productForm.desc} 
                    onChange={e => setProductForm(prev => ({ ...prev, desc: e.target.value }))}
                    placeholder="Provide details about the build, comfort, warranty, etc."
                    className="finp" 
                    style={{ minHeight: 90, resize: 'vertical', padding: '10px 14px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Specifications (One key-value pair per line)</label>
                  <textarea 
                    value={productForm.specsRaw} 
                    onChange={e => setProductForm(prev => ({ ...prev, specsRaw: e.target.value }))}
                    placeholder="Material: Liquid Silicone&#10;Compatibility: iPhone 15 Pro&#10;MagSafe: Yes"
                    className="finp" 
                    style={{ minHeight: 80, resize: 'vertical', padding: '10px 14px', fontFamily: 'monospace' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 6 }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }} 
                    className="btn btn-s btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-p btn-sm">
                    {editingProduct ? 'Save Product Changes' : 'Publish Product'}
                  </button>
                </div>
              </form>
            ) : null}

            {loadingProducts ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-3)' }}>Loading inventory list...</div>
            ) : productsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>Inventory database is empty.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {productsList.map(p => (
                  <div key={p.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 16, 
                    border: '1px solid var(--border)', 
                    borderRadius: 14, 
                    padding: '12px 16px',
                    background: '#fff'
                  }}>
                    <img src={p.image} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} alt="" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>
                        {p.brand} · {p.category} {p.tag ? `· [${p.tag}]` : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>${p.price.toFixed(2)}</div>
                      {p.originalPrice && (
                        <div style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'line-through' }}>${p.originalPrice.toFixed(2)}</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button 
                        onClick={() => handleEditProductClick(p)}
                        style={{ border: '1px solid var(--border)', background: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)' }}
                        title="Edit Product"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        style={{ border: '1px solid var(--border)', background: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444' }}
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
