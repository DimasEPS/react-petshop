import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scissors, Hotel } from 'lucide-react';
import logo2 from '../assets/Logo2.png';

export default function Navbar({ cartCount }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showLayanan, setShowLayanan] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowLayanan(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const [scrolled, setScrolled] = useState(false);

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
    <nav style={{ ...s.nav, ...(scrolled ? s.navScrolled : {}) }}>
      {/* LEFT — Logo */}
      <Link to="/" style={s.logo}>
        <img src={logo2} alt="PawMart" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
        <span style={s.logoText}>PawMart</span>
      </Link>

      {/* CENTER — Menu */}
      <div style={s.centerMenu}>
        <Link to="/" style={{ ...s.link, ...(isActive('/') ? s.linkActive : {}) }}>Home</Link>
        <Link to="/products" style={{ ...s.link, ...(isActive('/products') ? s.linkActive : {}) }}>Produk</Link>

{/* Dropdown Layanan */}
        <div style={s.dropWrap} ref={dropRef}>
          <button
            style={{ ...s.link, gap: '5px', display: 'flex', alignItems: 'center', color: showLayanan ? '#1a7a4a' : undefined }}
            onClick={() => setShowLayanan(v => !v)}
          >
            Layanan
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform .2s', transform: showLayanan ? 'rotate(180deg)' : 'none' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ ...s.dropdown, ...(showLayanan ? s.dropdownVisible : {}) }}>
            {[
              { icon: Scissors, title: 'Grooming', path: '/layanan/grooming' },
              { icon: Hotel, title: 'Pet Hotel', path: '/layanan/pet-hotel' },
            ].map(item => (
              <div key={item.title} style={s.dropItem} onClick={() => { navigate(item.path); setShowLayanan(false); }}>
                <item.icon size={16} color="#2d7a4f" strokeWidth={2} />
                <span style={s.dropTitle}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Search, Cart, User */}
      <div style={s.right}>
        <form onSubmit={handleSearch} style={s.searchForm}>
          <svg style={s.searchSvg} width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </form>

        <Link to="/cart" style={s.iconBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="3" y1="6" x2="21" y2="6" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M16 10a4 4 0 01-8 0" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {cartCount > 0 && <span style={s.badge}>{cartCount}</span>}
        </Link>

        <button style={s.iconBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

const s = {
  nav: { background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(226,232,240,.8)', padding: '0 40px', display: 'flex', alignItems: 'center', height: '68px', position: 'sticky', top: 0, zIndex: 100, transition: 'box-shadow .3s' },
  navScrolled: { boxShadow: '0 4px 24px rgba(0,0,0,.07)' },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, textDecoration: 'none' },
  logoPaw: { fontSize: '22px' },
  logoText: { fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '20px', color: '#1a7a4a', letterSpacing: '-.02em' },
  centerMenu: { display: 'flex', alignItems: 'center', gap: '2px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' },
  link: { padding: '8px 14px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', color: '#64748b', cursor: 'pointer', border: 'none', background: 'none', transition: 'all .2s', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-.01em', display: 'flex', alignItems: 'center' },
  linkActive: { color: '#1a7a4a', background: '#e6f7ee' },
  dropWrap: { position: 'relative' },
  dropdown: { position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%) translateY(6px)', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,.09)', padding: '6px', minWidth: '160px', zIndex: 200, opacity: 0, pointerEvents: 'none', transition: 'all .18s ease' },
  dropdownVisible: { opacity: 1, pointerEvents: 'auto', transform: 'translateX(-50%) translateY(0)' },
  dropItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background .15s' },
  dropTitle: { fontWeight: 600, fontSize: '14px', color: '#0f172a' },
  right: { display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' },
  searchForm: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchSvg: { position: 'absolute', left: '12px', pointerEvents: 'none' },
  searchInput: { border: '1.5px solid #e2e8f0', borderRadius: '50px', padding: '8px 16px 8px 36px', fontSize: '13px', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', width: '210px', background: '#f8fafc', transition: 'all .2s', color: '#0f172a' },
  iconBtn: { width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all .2s', color: '#334155' },
  badge: { position: 'absolute', top: '-5px', right: '-5px', background: '#f97316', color: '#fff', fontSize: '9px', fontWeight: 800, width: '17px', height: '17px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' },
};
