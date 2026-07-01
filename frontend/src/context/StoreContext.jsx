/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Sync wishlist to localstorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load profile, orders, and cart when token changes
  useEffect(() => {
    async function loadUserData() {
      if (token) {
        setLoadingProfile(true);
        try {
          localStorage.setItem('token', token);
          const uProfile = await api.getProfile();
          setProfile(uProfile);
          
          const uCart = await api.getCart();
          setCart(uCart);

          const uOrders = await api.getOrders();
          setOrders(uOrders);
        } catch (err) {
          console.error('Error loading initial profile/orders data:', err);
          handleLogout();
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setProfile(null);
        setOrders([]);
        setLoadingProfile(false);
        // Default cart from local storage for guests
        const saved = localStorage.getItem('cart');
        setCart(saved ? JSON.parse(saved) : []);
      }
    }
    loadUserData();
  }, [token]);

  // Sync cart changes with DB if logged in, else with localStorage
  useEffect(() => {
    if (token) {
      api.updateCart(cart).catch(err => console.error('Cart sync failed:', err));
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, token]);

  const handleLogin = async (email, password) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setProfile(data.user);
      return data.user;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const data = await api.register(userData);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setProfile(data.user);
      return data.user;
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    setToken('');
    setProfile(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
  };

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
      token,
      isLoggedIn: !!token,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      updateProfile: handleUpdateProfile,
      placeOrder,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout
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
