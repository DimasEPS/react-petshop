import { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

// Auth & Admin Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
// import UserDashboard from "@/pages/user/UserDashboard";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminUsers from "@/pages/admin/AdminUsers";

// User Pages & Components
import Navbar from './components/Navbar';
import HomePage from './pages/user/HomePage';
import ProductListingPage from './pages/user/ProductListingPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from "./pages/user/CheckoutPage";
import ProfilePage from "./pages/user/ProfilePage";
import OrderHistoryPage from "./pages/user/OrderHistoryPage";
import BookingPage from "./pages/user/BookingPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }
  return children;
}

function App() {
  const { isAuthenticated } = useAuth();
  const { cartCount, addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [notif, setNotif] = useState('');
  const [notifVisible, setNotifVisible] = useState(false);

  // Fungsi Notifikasi
  const showNotif = useCallback((msg) => {
    setNotif(msg);
    setNotifVisible(true);
    setTimeout(() => setNotifVisible(false), 2500);
  }, []);

  // Fungsi Wishlist
  const toggleWishlist = (id) => {
    if (!isAuthenticated) {
      showNotif('Silakan login terlebih dahulu');
      return;
    }
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Define common props
  const sharedProps = {
    onAddToCart: async (product) => {
      const res = await addToCart(product.id || product._id, 1);
      if (res?.success) {
        showNotif(`${product.name || product.title || 'Produk'} ditambahkan ke keranjang!`);
      } else if (res?.message) {
        showNotif(res.message);
      }
    },
    wishlist,
    onToggleWishlist: toggleWishlist,
    showNotif
  };

  return (
    <>
      {/* Overlay Notifikasi Global */}
      <div className={`notification ${notifVisible ? 'show' : ''}`} style={notificationStyle}>
        {notif}
      </div>

      <Routes>
        {/* ===== Auth & Admin Routes ===== */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* ===== Public & User Store Routes ===== */}
        <Route path="/" element={<><Navbar cartCount={cartCount} /><HomePage {...sharedProps} /></>} />
        <Route path="/products" element={<><Navbar cartCount={cartCount} /><ProductListingPage {...sharedProps} /></>} />
        <Route path="/products/:id" element={<><Navbar cartCount={cartCount} /><ProductDetailPage {...sharedProps} /></>} />
        <Route path="/cart" element={<ProtectedRoute><Navbar cartCount={cartCount} /><CartPage showNotif={showNotif} /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Navbar cartCount={cartCount} /><CheckoutPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Navbar cartCount={cartCount} /><ProfilePage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Navbar cartCount={cartCount} /><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><Navbar cartCount={cartCount} /><BookingPage /></ProtectedRoute>} />

        {/* Dashboard User - keep it protected */}
        {/* <Route path="/dashboard" element={<ProtectedRoute><Navbar cartCount={cartCount} /><UserDashboard /></ProtectedRoute>} /> */}

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

// Inline style sederhana untuk notifikasi
const notificationStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  backgroundColor: '#1a7a4a',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 1000,
  transition: 'all 0.3s ease',
  display: 'none'
};

export default App;
