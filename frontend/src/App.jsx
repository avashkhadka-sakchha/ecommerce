import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import ShopView from './pages/ShopView';
import ProductDetail from './pages/ProductDetail';
import CategoriesView from './pages/CategoriesView';
import CheckoutView from './pages/CheckoutView';
import AccountView from './pages/AccountView';

export default function App() {
  return (
    <StoreProvider>
      <Router>
        {/* Route transition scroll controller */}
        <ScrollToTop />

        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
          {/* Global Header */}
          <Header />

          {/* Main Content Pages Router */}
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/shop" element={<ShopView />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<CategoriesView />} />
              <Route path="/checkout" element={<CheckoutView />} />
              <Route path="/account" element={<AccountView />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </Router>
    </StoreProvider>
  );
}
