import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Komponen & Halaman
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import BookingPage from "./pages/BookingPage";

function App() {
  // --- State untuk Fitur Keranjang & Wishlist ---
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notif, setNotif] = useState('');
  const [notifVisible, setNotifVisible] = useState(false);

  // Fungsi Notifikasi
  const showNotif = useCallback((msg) => {
    setNotif(msg);
    setNotifVisible(true);
    setTimeout(() => setNotifVisible(false), 2500);
  }, []);

  // Fungsi Keranjang
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, qty: 1 }];
    });
    showNotif(`${product.name || 'Produk'} ditambahkan ke keranjang!`);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  // Fungsi Wishlist
  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // Props yang sering dibagikan ke halaman produk
  const sharedProps = { 
    onAddToCart: addToCart, 
    wishlist, 
    onToggleWishlist: toggleWishlist, 
    showNotif 
  };

  return (
    <BrowserRouter>
      {/* Navbar muncul di semua halaman */}
      <Navbar cartCount={cartCount} />

      {/* Overlay Notifikasi Global */}
      <div className={`notification ${notifVisible ? 'show' : ''}`} style={notificationStyle}>
        {notif}
      </div>

      <Routes>
        {/* ===== Public Routes ===== */}
        <Route path="/" element={<HomePage {...sharedProps} />} />
        <Route path="/products" element={<ProductListingPage {...sharedProps} />} />
        <Route path="/products/:id" element={<ProductDetailPage {...sharedProps} />} />
        
        {/* ===== User & Transaction Routes ===== */}
        <Route path="/cart" element={
          <CartPage 
            cart={cart} 
            onUpdateQty={updateQty} 
            onRemove={removeFromCart} 
            showNotif={showNotif} 
          />
        } />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/booking" element={<BookingPage />} />

        {/* ===== Fallback (Jika halaman tidak ditemukan) ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Inline style sederhana untuk notifikasi jika belum ada di CSS kamu
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
  display: 'none' // Nanti akan diatur oleh class 'show' di CSS
};

export default App;