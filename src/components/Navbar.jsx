import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scissors, Hotel, ShoppingCart, User, Search, Menu, X, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ cartCount }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showLayanan, setShowLayanan] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  // Fungsi untuk menutup dropdown saat klik di luar area
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowLayanan(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Efek shadow saat scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .nav-root {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .nav-scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-logo span { color: #1a7a4a; }

        .nav-menu { display: flex; align-items: center; gap: 8px; }
        
        .nav-link {
          text-decoration: none;
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 10px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link:hover { color: #1a7a4a; background: #f0fdf4; }
        .nav-link.active { color: #1a7a4a; background: #e6f7ee; }

        .search-container { position: relative; margin-right: 12px; }
        .search-input {
          background: #f1f5f9;
          border: 1.5px solid transparent;
          border-radius: 12px;
          padding: 8px 12px 8px 38px;
          font-size: 13px;
          width: 180px;
          transition: all 0.3s;
          outline: none;
        }
        .search-input:focus { width: 240px; border-color: #1a7a4a; background: #fff; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }

        .nav-actions { display: flex; align-items: center; gap: 10px; }
        
        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #475569;
          position: relative;
          text-decoration: none;
          transition: all 0.2s;
        }
        .icon-btn:hover { border-color: #1a7a4a; color: #1a7a4a; }
        
        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 10px;
          border: 2px solid white;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 8px;
          min-width: 180px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          display: none;
          flex-direction: column;
          gap: 4px;
        }
        .dropdown-menu.show { display: flex; }
        .drop-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #475569;
          font-weight: 600;
          font-size: 13px;
        }
        .drop-item:hover { background: #f8fafc; color: #1a7a4a; }

        @media (max-width: 768px) {
          .nav-menu, .search-container { display: none; }
        }
      `}</style>

      <nav className={`nav-root ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <span>Paw</span>Mart
          </Link>

          {/* Menu Desktop */}
          <div className="nav-menu">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Produk</Link>
            
            {/* Dropdown Layanan */}
            <div style={{ position: 'relative' }} ref={dropRef}>
              <button 
                className="nav-link" 
                onClick={() => setShowLayanan(!showLayanan)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Layanan <ChevronDown size={14} style={{ transform: showLayanan ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
              <div className={`dropdown-menu ${showLayanan ? 'show' : ''}`}>
                <Link to="/booking" className="drop-item" onClick={() => setShowLayanan(false)}>
                  <Scissors size={16} /> Grooming
                </Link>
                <Link to="/layanan/pet-hotel" className="drop-item" onClick={() => setShowLayanan(false)}>
                  <Hotel size={16} /> Pet Hotel
                </Link>
              </div>
            </div>

            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>Pesanan</Link>
          </div>

          {/* Actions: Search & Icons */}
          <div className="nav-actions">
            <form onSubmit={handleSearch} className="search-container">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Cari kebutuhan anabul..." 
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <Link to="/cart" className="icon-btn">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <Link to="/profile" className="icon-btn">
                <User size={20} />
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" className="nav-link" style={{ background: '#f1f5f9', color: '#475569' }}>
                   Login
                </Link>
                <Link to="/register" className="nav-link" style={{ background: '#1a7a4a', color: '#fff' }}>
                   Register
                </Link>
              </div>
            )}

            {/* Tombol Mobile */}
            <button className="icon-btn" style={{ display: 'none' }} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}