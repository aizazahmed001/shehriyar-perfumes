import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/ProductManager';
import AdminOrders from './pages/admin/OrderManager';
import HelpCenter from './pages/HelpCenter';
import ShippingReturns from './pages/ShippingReturns';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext'; // Import WishlistProvider

import AuthPage from './pages/AuthPage';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  React.useEffect(() => {
    // Dynamic Title
    document.title = isAdminRoute ? "Admin Panel | Perfume Store" : "Perfume Store | Luxury Fragrances";

    // Dynamic Favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';

    if (isAdminRoute) {
      // Shield icon for Admin
      link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23000000%22/><path d=%22M50 20 L80 35 V55 C80 75 50 85 50 85 C50 85 20 75 20 55 V35 L50 20Z%22 fill=%22white%22/></svg>`;
    } else {
      // Shopping Cart icon for Client (Black theme)
      link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23000000%22/><path d=%22M30 30 H75 L70 60 H35 L30 30 Z M35 70 A5 5 0 1 0 35 80 A5 5 0 1 0 35 70 Z M65 70 A5 5 0 1 0 65 80 A5 5 0 1 0 65 70 Z%22 fill=%22white%22/></svg>`;
    }

    document.getElementsByTagName('head')[0].appendChild(link);
  }, [isAdminRoute]);

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/shop" element={<><Navbar /><Shop /></>} />

        <Route path="/product/:id" element={<><Navbar /><ProductDetail /></>} />
        <Route path="/help-center" element={<><Navbar /><HelpCenter /></>} />
        <Route path="/shipping-returns" element={<><Navbar /><ShippingReturns /></>} />
        <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicy /></>} />
        <Route path="/terms-conditions" element={<><Navbar /><TermsConditions /></>} />

        {/* Protected Routes */}
        <Route path="/cart" element={
          <ProtectedRoute>
            <Navbar /><Cart />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Navbar /><Checkout />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Navbar /><Orders />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Navbar /><Profile />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
