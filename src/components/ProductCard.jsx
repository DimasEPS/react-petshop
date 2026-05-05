import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ImageOff } from 'lucide-react';
import { fmtPrice, starsHTML } from '../data/products';

export default function ProductCard({ product: p, onAddToCart, wishlist = [], onToggleWishlist, showNotif }) {
  const navigate = useNavigate();
  const id = p._id || p.id;
  const isWished = wishlist.includes(id);
  const discPct = p.salePrice ? Math.round((p.salePrice - p.price) / p.salePrice * 100) : 0;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${id}`)}>
      <div className="pc-img">
        {p.image ? (
          <img src={p.image} alt={p.title || p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.35 }}>
            <ImageOff size={36} color="#2d7a4f" strokeWidth={1.5} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#2d7a4f', letterSpacing: '.03em', textTransform: 'uppercase' }}>No Image</span>
          </div>
        )}
        {p.badge && <span className={`pc-badge ${p.badge}`}>{p.badge === 'bestseller' ? 'Best Seller' : 'Baru'}</span>}
        <div
          className={`pc-wishlist${isWished ? ' active' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleWishlist?.(id); }}
        >
          <Heart size={15} strokeWidth={2} fill={isWished ? '#f43f5e' : 'none'} color={isWished ? '#f43f5e' : '#64748b'} />
        </div>
        <div className="pc-hover-btns" onClick={e => e.stopPropagation()}>
          <button className="pc-hbtn" onClick={() => { onAddToCart(p); }}>
            <ShoppingCart size={14} strokeWidth={2} /> Keranjang
          </button>
          <button className="pc-hbtn" onClick={() => onToggleWishlist?.(id)}>
            <Heart size={14} strokeWidth={2} /> Wishlist
          </button>
        </div>
      </div>
      <div className="pc-body">
        <div className="pc-cat">{p.hewan || p.category} · {p.kat || p.brand}</div>
        <div className="pc-name">{p.title || p.name}</div>
        <div className="pc-rating">
          <span className="stars">{starsHTML(p.rating || 0)}</span>
          <span className="rating-num">{p.rating || 0} ({p.reviews || 0})</span>
        </div>
        <div className="pc-price">
          <span className="pc-price-main">{fmtPrice(p.price)}</span>
          {p.salePrice > 0 && <span className="pc-price-old">{fmtPrice(p.salePrice)}</span>}
        </div>
        <div className="pc-stock">Stok: {p.stock || p.stok} | Terjual {p.sold || 0}+</div>
      </div>
      <button
        className="add-cart-btn"
        onClick={e => { e.stopPropagation(); onAddToCart(p); }}
      >
        + Tambah ke Keranjang
      </button>
    </div>
  );
}
