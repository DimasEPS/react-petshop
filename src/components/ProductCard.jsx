import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ImageOff } from 'lucide-react';
import { fmtPrice, starsHTML } from '../data/products';

export default function ProductCard({ product: p, onAddToCart, wishlist = [], onToggleWishlist, showNotif }) {
  const navigate = useNavigate();
  const isWished = wishlist.includes(p.id);
  const discPct = p.oldPrice ? Math.round((p.oldPrice - p.price) / p.oldPrice * 100) : 0;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${p.id}`)}>
      <div className="pc-img">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.35 }}>
          <ImageOff size={36} color="#2d7a4f" strokeWidth={1.5} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#2d7a4f', letterSpacing: '.03em', textTransform: 'uppercase' }}>No Image</span>
        </div>
        {p.badge && <span className={`pc-badge ${p.badge}`}>{p.badge === 'bestseller' ? 'Best Seller' : 'Baru'}</span>}
        <div
          className={`pc-wishlist${isWished ? ' active' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleWishlist?.(p.id); }}
        >
          <Heart size={15} strokeWidth={2} fill={isWished ? '#f43f5e' : 'none'} color={isWished ? '#f43f5e' : '#64748b'} />
        </div>
        <div className="pc-hover-btns" onClick={e => e.stopPropagation()}>
          <button className="pc-hbtn" onClick={() => { onAddToCart(p); showNotif?.('Ditambahkan ke keranjang!'); }}>
            <ShoppingCart size={14} strokeWidth={2} /> Keranjang
          </button>
          <button className="pc-hbtn" onClick={() => onToggleWishlist?.(p.id)}>
            <Heart size={14} strokeWidth={2} /> Wishlist
          </button>
        </div>
      </div>
      <div className="pc-body">
        <div className="pc-cat">{p.hewan} · {p.kat}</div>
        <div className="pc-name">{p.name}</div>
        <div className="pc-rating">
          <span className="stars">{starsHTML(p.rating)}</span>
          <span className="rating-num">{p.rating} ({p.reviews})</span>
        </div>
        <div className="pc-price">
          <span className="pc-price-main">{fmtPrice(p.price)}</span>
          {p.oldPrice && <span className="pc-price-old">{fmtPrice(p.oldPrice)}</span>}
        </div>
        <div className="pc-stock">Stok: {p.stok} | Terjual {p.sold}+</div>
      </div>
      <button
        className="add-cart-btn"
        onClick={e => { e.stopPropagation(); onAddToCart(p); showNotif?.('Ditambahkan ke keranjang! 🛒'); }}
      >
        + Tambah ke Keranjang
      </button>
    </div>
  );
}
