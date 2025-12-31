import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Reels from './pages/Reels';
import About from './pages/About';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

import Favorites from './pages/Favorites';
import SellerProducts from './pages/SellerProducts';
import SellerOrders from './pages/SellerOrders';
import SellerAnalytics from './pages/SellerAnalytics';
import SellerEarnings from './pages/SellerEarnings';
import Settings from './pages/Settings';
import PrivacySecurity from './pages/PrivacySecurity';
import HelpSupport from './pages/HelpSupport';
import ReelStudio from './pages/ReelStudio';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CategoryPage from './pages/CategoryPage';
import { AuthProvider } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1]}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="reels" element={<Reels />} />
          <Route path="about" element={<About />} />
          <Route path="profile" element={<Profile />} />

          <Route path="favorites" element={<Favorites />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="earnings" element={<SellerEarnings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/privacy" element={<PrivacySecurity />} />
          <Route path="settings/help" element={<HelpSupport />} />
          <Route path="reel-studio" element={<ReelStudio />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="category/:categoryName" element={<CategoryPage />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MarketplaceProvider>
          <CartProvider>
            <ToastProvider>
              <Router>
                <AnimatedRoutes />
              </Router>
            </ToastProvider>
          </CartProvider>
        </MarketplaceProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
