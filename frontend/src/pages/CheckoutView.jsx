import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Minus, Plus, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CheckoutView() {
  const { cart, updateCartQty, removeFromCart, placeOrder, profile } = useStore();

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    province: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync shipping info with profile details on load during render to avoid useEffect warning
  const [prevProfile, setPrevProfile] = useState(null);
  if (profile !== prevProfile) {
    setPrevProfile(profile);
    if (profile) {
      const defaultAddr = profile.addresses.find(a => a.isDefault) || profile.addresses[0];
      setShippingForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        street: defaultAddr ? defaultAddr.street : '',
        city: defaultAddr ? defaultAddr.city || 'Kathmandu' : '',
        province: defaultAddr ? defaultAddr.province || 'Bagmati Province' : ''
      });
    }
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!shippingForm.firstName.trim()) errors.firstName = 'Required';
    if (!shippingForm.lastName.trim()) errors.lastName = 'Required';
    if (!shippingForm.street.trim()) errors.street = 'Required';
    if (!shippingForm.city.trim()) errors.city = 'Required';
    if (!shippingForm.province.trim()) errors.province = 'Required';
    
    if (!paymentForm.cardNumber.trim()) {
      errors.cardNumber = 'Required';
    } else if (paymentForm.cardNumber.replace(/\s/g, '').length < 12) {
      errors.cardNumber = 'Invalid length';
    }
    if (!paymentForm.expiry.trim()) errors.expiry = 'Required';
    if (!paymentForm.cvv.trim()) errors.cvv = 'Required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const order = await placeOrder(shippingForm, paymentForm);
      setPlacedOrder(order);
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to submit checkout:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (isSuccess && placedOrder) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '40px 28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, textAlign: 'center', boxShadow: 'var(--sh-lg)' }}>
        <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: 20 }} />
        <h2 className="ff" style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>Order Placed Successfully!</h2>
        <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.6 }}>
          Thank you for shopping with MobileHub! Your order ID is <strong style={{ color: 'var(--text)' }}>{placedOrder.id}</strong>. We will notify you when it ships.
        </p>
        
        <div style={{ background: '#F8F7F3', padding: '16px', borderRadius: 12, textAlign: 'left', marginBottom: 28, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>Shipping Address</div>
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>
            {placedOrder.shipping.firstName} {placedOrder.shipping.lastName}<br />
            {placedOrder.shipping.street}<br />
            {placedOrder.shipping.city}, {placedOrder.shipping.province}
          </p>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-2)' }}>Amount Charged:</span>
            <span style={{ fontWeight: 800, color: 'var(--accent)' }}>${placedOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/account" className="btn btn-p">View Order History</Link>
          <Link to="/shop" className="btn btn-s">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: 1280, 
      margin: '0 auto', 
      padding: '48px 28px', 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
      gap: 32, 
      alignItems: 'start' 
    }}>
      
      {/* Left panel: Cart review and fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Step 1: Cart Items */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '24px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Review Your Cart</h3>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
              <ShoppingBag size={36} style={{ margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 600 }}>Your cart is empty</div>
              <Link to="/shop" className="btn btn-s btn-sm" style={{ marginTop: 14 }}>Browse Accessories</Link>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartId} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
                <img src={item.image} style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', background: '#F1F0EC', flexShrink: 0, border: '1px solid var(--border)' }} alt="" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500, marginBottom: 8 }}>{item.variant}</div>
                  <button 
                    onClick={() => removeFromCart(item.cartId)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>${(item.price * item.quantity).toFixed(2)}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: '#F5F4F0', border: '1px solid var(--border)', borderRadius: 9, overflow: 'hidden' }}>
                    <button onClick={() => updateCartQty(item.cartId, -1)} style={{ padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex' }}><Minus size={13} /></button>
                    <span style={{ padding: '6px 12px', fontSize: 13, fontWeight: 700 }}>{item.quantity}</span>
                    <button onClick={() => updateCartQty(item.cartId, 1)} style={{ padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex' }}><Plus size={13} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Step 2: Shipping details */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '24px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Shipping Information</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>First Name</label>
              <input 
                name="firstName"
                value={shippingForm.firstName}
                onChange={handleShippingChange}
                className="finp" 
                style={{ borderColor: formErrors.firstName ? '#EF4444' : 'transparent' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Last Name</label>
              <input 
                name="lastName"
                value={shippingForm.lastName}
                onChange={handleShippingChange}
                className="finp" 
                style={{ borderColor: formErrors.lastName ? '#EF4444' : 'transparent' }}
              />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Street Address</label>
              <input 
                name="street"
                value={shippingForm.street}
                onChange={handleShippingChange}
                className="finp" 
                style={{ borderColor: formErrors.street ? '#EF4444' : 'transparent' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>City</label>
              <input 
                name="city"
                value={shippingForm.city}
                onChange={handleShippingChange}
                className="finp" 
                style={{ borderColor: formErrors.city ? '#EF4444' : 'transparent' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Province</label>
              <input 
                name="province"
                value={shippingForm.province}
                onChange={handleShippingChange}
                className="finp" 
                style={{ borderColor: formErrors.province ? '#EF4444' : 'transparent' }}
              />
            </div>
          </div>
        </div>

        {/* Step 3: Payment details */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '24px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Payment Method</h3>
          </div>

          <div style={{ background: 'var(--accent-bg)', border: '1.5px solid rgba(36,85,232,.2)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              <input type="radio" defaultChecked style={{ accentColor: 'var(--accent)' }} /> Credit / Debit Card
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['VISA', 'MC', 'AMEX'].map(c => (
                <span key={c} style={{ background: '#fff', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800, color: 'var(--text-2)' }}>{c}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Card Number</label>
              <input 
                name="cardNumber"
                placeholder="0000  0000  0000  0000" 
                value={paymentForm.cardNumber}
                onChange={handlePaymentChange}
                className="finp" 
                style={{ borderColor: formErrors.cardNumber ? '#EF4444' : 'transparent' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Expiry Date</label>
                <input 
                  name="expiry"
                  placeholder="MM / YY" 
                  value={paymentForm.expiry}
                  onChange={handlePaymentChange}
                  className="finp" 
                  style={{ borderColor: formErrors.expiry ? '#EF4444' : 'transparent' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>CVV</label>
                <input 
                  type="password" 
                  name="cvv"
                  placeholder="•••" 
                  value={paymentForm.cvv}
                  onChange={handlePaymentChange}
                  className="finp" 
                  style={{ borderColor: formErrors.cvv ? '#EF4444' : 'transparent' }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right panel: Order summary details */}
      <div style={{ background: 'var(--surface)', borderRadius: 22, border: '1px solid var(--border)', padding: '28px', boxShadow: 'var(--sh)', position: 'sticky', top: 88 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Order Summary
          <span style={{ background: '#F5F4F0', color: 'var(--text-2)', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
            {cart.reduce((a, c) => a + c.quantity, 0)} items
          </span>
        </h3>

        {/* Promo Code input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input placeholder="Promo Code" className="finp" style={{ flex: 1, fontSize: 13 }} />
          <button className="btn" style={{ background: 'var(--text)', color: '#fff', padding: '10px 16px', fontSize: 13, flexShrink: 0, borderRadius: 11 }}>Apply</button>
        </div>

        {/* Totals table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 18, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
          {[
            ['Subtotal', `$${subtotal.toFixed(2)}`],
            ['Shipping', 'Free', true],
            ['Tax (8%)', `$${tax.toFixed(2)}`],
          ].map(([label, val, green]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 500, color: 'var(--text-2)' }}>
              <span>{label}</span>
              <span style={{ fontWeight: 700, color: green ? '#10B981' : 'var(--text)' }}>{val}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Total</span>
          <span className="ff" style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent)' }}>${total.toFixed(2)}</span>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={cart.length === 0 || isSubmitting}
          className="btn btn-p" 
          style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 15, opacity: (cart.length === 0 || isSubmitting) ? 0.6 : 1 }}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Purchase'} <ArrowRight size={16} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>
          <Shield size={13} /> Secured by SSL encryption
        </div>
      </div>

    </div>
  );
}
