import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import BookingPage from "./pages/BookingPage";

// =====================================================
// PLACEHOLDER PAGES (yang masih in progress / perlu dibuat)
// Ganti dengan komponen asli kamu saat sudah siap
// =====================================================
const PlaceholderPage = ({ title, emoji }) => (
  <div style={{
    minHeight: "100vh", background: "#fdf6ee", fontFamily: "Georgia, serif",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16
  }}>
    <div style={{ fontSize: 72 }}>{emoji}</div>
    <h1 style={{ color: "#2c1810", fontSize: 28, margin: 0 }}>{title}</h1>
    <p style={{ color: "#888", fontSize: 15 }}>Halaman ini sedang dalam pengembangan.</p>
    <a href="/" style={{ background: "#2c1810", color: "#fff", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: "bold" }}>← Beranda</a>
  </div>
);

const HomePage = () => <PlaceholderPage title="Home Page" emoji="🏠" />;
const ProductListingPage = () => <PlaceholderPage title="Product Listing" emoji="🛍️" />;
const ProductDetailPage = () => <PlaceholderPage title="Product Detail" emoji="🐾" />;
const CartPage = () => <PlaceholderPage title="Cart" emoji="🛒" />;
const LoginPage = () => <PlaceholderPage title="Login" emoji="🔑" />;
const RegisterPage = () => <PlaceholderPage title="Register" emoji="📝" />;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== Public Routes ===== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ===== Protected / User Routes ===== */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/booking" element={<BookingPage />} />

        {/* ===== Fallback ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;