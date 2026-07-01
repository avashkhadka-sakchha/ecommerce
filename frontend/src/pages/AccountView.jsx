import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Package, Heart, Settings, Bell, LogOut, Check, MapPin, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';

export default function AccountView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { profile, orders, wishlist, updateProfile, toggleWishlist } = useStore();

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Pre-fill profile form details on load to avoid useEffect cascading renders
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

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: '', street: '', province: '' });
  const [successMsg, setSuccessMsg] = useState('');

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

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
    setSuccessMsg('');
  };

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

  const menuItems = [
    { id: 'profile', icon: <User size={16} />, label: 'My Profile' },
    { id: 'orders', icon: <Package size={16} />, label: 'Order History' },
    { id: 'wishlist', icon: <Heart size={16} />, label: 'Wishlist' },
    { id: 'settings', icon: <Settings size={16} />, label: 'Address Settings' },
    { id: 'notifications', icon: <Bell size={16} />, label: 'Notifications' },
  ];

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
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
            {profile.firstName} {profile.lastName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500, marginBottom: 12 }}>{profile.email}</div>
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
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444'; }}
          >
            <LogOut size={16} /> Reset & Logout
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
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20, fontWeight: 500 }}>Track details of your recently placed mobile accessory purchases.</p>

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

      </div>

    </div>
  );
}
