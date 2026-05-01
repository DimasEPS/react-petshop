import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ComingSoonPage from './pages/ComingSoonPage';

export default function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notif, setNotif] = useState('');
  const [notifVisible, setNotifVisible] = useState(false);

  const showNotif = useCallback((msg) => {
    setNotif(msg);
    setNotifVisible(true);
    setTimeout(() => setNotifVisible(false), 2500);
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const toggleWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const sharedProps = { onAddToCart: addToCart, wishlist, onToggleWishlist: toggleWishlist, showNotif };

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />
      <div className={`notification${notifVisible ? ' show' : ''}`}>{notif}</div>
      <Routes>
        <Route path="/" element={<HomePage {...sharedProps} />} />
        <Route path="/products" element={<ProductListingPage {...sharedProps} />} />
        <Route path="/products/:id" element={<ProductDetailPage {...sharedProps} />} />
        <Route path="/cart" element={<CartPage cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} showNotif={showNotif} />} />
        <Route path="/layanan/grooming" element={<ComingSoonPage />} />
        <Route path="/layanan/pet-hotel" element={<ComingSoonPage />} />
      </Routes>
    </BrowserRouter>
  );
}
