/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const uProfile = await api.getProfile();
        setProfile(uProfile);
        
        const uOrders = await api.getOrders();
        setOrders(uOrders);
      } catch (err) {
        console.error('Error loading initial profile/orders data:', err);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadInitialData();
  }, []);

  const addToCart = (product, quantity = 1, variant = 'Default') => {
    setCart(prev => {
      const cartItemId = `${product.id}-${variant.replace(/\s+/g, '-').toLowerCase()}`;
      const existing = prev.find(item => item.cartId === cartItemId);
      if (existing) {
        return prev.map(item => 
          item.cartId === cartItemId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [
        ...prev, 
        { 
          cartId: cartItemId,
          id: product.id, 
          name: product.name, 
          price: product.price, 
          image: product.image,
          quantity: quantity, 
          variant: variant
        }
      ];
    });
  };

  const updateCartQty = (cartId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const handleUpdateProfile = async (updatedProfile) => {
    try {
      const saved = await api.updateProfile(updatedProfile);
      setProfile(saved);
      return saved;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  const placeOrder = async (shippingDetails, paymentDetails) => {
    try {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;

      const orderData = {
        items: cart,
        shipping: shippingDetails,
        payment: {
          method: 'Credit Card',
          cardNumberLast4: paymentDetails.cardNumber ? paymentDetails.cardNumber.slice(-4) : '4242'
        },
        subtotal,
        tax,
        total,
        itemsCount: cart.reduce((sum, item) => sum + item.quantity, 0)
      };

      const newOrder = await api.placeOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      return newOrder;
    } catch (err) {
      console.error('Failed to place order:', err);
      throw err;
    }
  };

  return (
    <StoreContext.Provider value={{
      cart,
      wishlist,
      profile,
      orders,
      loadingProfile,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      updateProfile: handleUpdateProfile,
      placeOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
