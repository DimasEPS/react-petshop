import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/booking", label: "Grooming" },
    { to: "/orders", label: "My Orders" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .nav-root {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(248, 247, 244, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #E8E6E1;
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .nav-logo {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: #1A1A2E;
          text-decoration: none;
          letter-spacing: -0.3px;
          flex-shrink: 0;
        }
        .nav-logo span {
          color: #C8963E;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #5A5550;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          letter-spacing: 0.1px;
        }
        .nav-link:hover {
          color: #1A1A2E;
          background: #F0ECE4;
        }
        .nav-link.active {
          color: #1A1A2E;
          font-weight: 600;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .nav-icon-btn {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #E8E6E1;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          text-decoration: none;
          color: #1A1A2E;
        }
        .nav-icon-btn:hover {
          border-color: #C8963E;
          box-shadow: 0 2px 8px rgba(200,150,62,0.15);
        }
        .nav-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: #C8963E;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          background: #1A1A2E;
          color: #fff;
          padding: 9px 20px;
          border-radius: 8px;
          text-decoration: none;
          letter-spacing: 0.1px;
          transition: background 0.2s, transform 0.15s;
        }
        .nav-cta:hover {
          background: #C8963E;
          transform: translateY(-1px);
        }
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 6px;
        }
        .nav-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #1A1A2E;
          border-radius: 2px;
          transition: all 0.25s;
        }
        .mobile-menu {
          display: none;
          position: fixed;
          inset: 68px 0 0 0;
          background: #F8F7F4;
          z-index: 999;
          padding: 24px 32px;
          flex-direction: column;
          gap: 4px;
          border-top: 1px solid #E8E6E1;
          animation: slideDown 0.2s ease;
        }
        .mobile-menu.open {
          display: flex;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          font-weight: 500;
          color: #1A1A2E;
          text-decoration: none;
          padding: 14px 0;
          border-bottom: 1px solid #E8E6E1;
          letter-spacing: -0.1px;
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
          .nav-cta { display: none; }
          .nav-inner { padding: 0 20px; }
        }
      `}</style>

      <nav className="nav-root">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">Paw<span>Store</span></Link>

          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={`nav-link${isActive(l.to) ? " active" : ""}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Link to="/cart" className="nav-icon-btn" title="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="nav-badge">2</span>
            </Link>
            <Link to="/profile" className="nav-icon-btn" title="Profile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
            <Link to="/checkout" className="nav-cta">Checkout</Link>
            <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks.map((l) => (
          <Link key={l.to} to={l.to} className="mobile-link" onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>Account</Link>
        <Link to="/cart" className="mobile-link" onClick={() => setMenuOpen(false)}>Cart (2)</Link>
      </div>
    </>
  );
};

export default Navbar;