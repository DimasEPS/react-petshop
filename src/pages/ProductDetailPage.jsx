import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Truck, ImageOff, RefreshCw, Trophy, Tag, Sparkles } from 'lucide-react';
import { products, fmtPrice, starsHTML } from '../data/products';
import ProductCard from '../components/ProductCard';

const REVIEWS = [
  { initials: 'SR', name: 'Sari R.', date: 'April 2026 · ★★★★★', text: 'Produknya bagus banget! Kucingku langsung suka. Packaging rapi dan pengiriman cepat. Sudah order ke-3 kalinya, pasti balik lagi.', color: '#2d7a4f' },
  { initials: 'BD', name: 'Budi D.', date: 'Maret 2026 · ★★★★★', text: 'Original dan berkualitas. Harga sebanding sama kualitas. Recommended untuk yang punya anabul!', color: '#f59e0b' },
];

export default function ProductDetailPage({ onAddToCart, wishlist = [], onToggleWishlist, showNotif }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [thumbIdx, setThumbIdx] = useState(0);

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <p style={{ fontSize: '48px' }}>😔</p>
      <p style={{ fontSize: '18px', marginBottom: '16px' }}>Produk tidak ditemukan</p>
      <button className="btn-green" onClick={() => navigate('/products')}>← Kembali ke Produk</button>
    </div>
  );

  const isWished = wishlist.includes(product.id);
  const discPct = product.oldPrice ? Math.round((product.oldPrice - product.price) / product.oldPrice * 100) : 0;
  const thumbs = [null, null, null, null];
  const related = products.filter(p => p.hewan === product.hewan && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    showNotif?.(`${qty}x ${product.name} ditambahkan! 🛒`);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={s.prodHero}>
        <div className="container">
          <div style={s.breadcrumb}>
            <span style={s.breadLink} onClick={() => navigate('/')}>Home</span>
            <span style={s.breadSep}>›</span>
            <span style={s.breadLink} onClick={() => navigate('/products')}>Produk</span>
            <span style={s.breadSep}>›</span>
            <span style={s.breadCurrent}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Detail */}
      <div style={s.detailWrap}>
        <div className="container" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          {/* Gallery */}
          <div style={s.gallery}>
            <div style={s.galleryMain}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', opacity: 0.35 }}>
                <ImageOff size={56} color="#2d7a4f" strokeWidth={1.5} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2d7a4f', letterSpacing: '.06em', textTransform: 'uppercase' }}>No Image</span>
              </div>
            </div>
            <div style={s.galleryThumbs}>
              {thumbs.map((_, i) => (
                <div key={i} style={{ ...s.galleryThumb, ...(thumbIdx === i ? s.galleryThumbActive : {}) }} onClick={() => setThumbIdx(i)}>
                  <ImageOff size={20} color="#2d7a4f" strokeWidth={1.5} style={{ opacity: 0.35 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={s.detailInfo}>
            <div style={s.detailBadges}>
              {product.badge === 'bestseller' && <span style={s.badgeBestseller}><Trophy size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Best Seller</span>}
              {product.oldPrice && <span style={s.badgeDiscount}><Tag size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Diskon {discPct}%</span>}
              {product.isNew && <span style={s.badgeNew}><Sparkles size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Baru</span>}
            </div>
            <div style={s.detailName}>{product.name}</div>
            <div style={s.detailRating}>
              <span style={{ color: '#f59e0b', fontSize: '16px' }}>{starsHTML(product.rating)}</span>
              <span style={{ fontSize: '14px', color: '#1a1a2e' }}>{product.rating}/5</span>
              <span style={{ fontSize: '14px', color: '#2d7a4f', cursor: 'pointer' }} onClick={() => setActiveTab('reviews')}>({product.reviews} ulasan)</span>
            </div>
            <div style={s.detailPriceRow}>
              <span style={s.detailPrice}>{fmtPrice(product.price)}</span>
              {product.oldPrice && <span style={s.detailPriceOld}>{fmtPrice(product.oldPrice)}</span>}
              {product.oldPrice && <span style={s.detailDiscPct}>{discPct}% OFF</span>}
            </div>
            <div style={s.detailMeta}>
              <div><label style={s.metaLabel}>Stok</label><span style={s.metaVal}>{product.stok} tersedia</span></div>
              <div><label style={s.metaLabel}>Kategori</label><span style={s.metaVal}>{product.kat}</span></div>
              <div><label style={s.metaLabel}>Jenis Hewan</label><span style={s.metaVal}>{product.hewan.charAt(0).toUpperCase() + product.hewan.slice(1)}</span></div>
              <div><label style={s.metaLabel}>Terjual</label><span style={s.metaVal}>{product.sold}+ item</span></div>
            </div>
            <div style={s.qtyRow}>
              <span style={s.qtyLabel}>Jumlah:</span>
              <div style={s.qtyCtrl}>
                <button style={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <div style={s.qtyNum}>{qty}</div>
                <button style={s.qtyBtn} onClick={() => setQty(q => Math.min(product.stok, q + 1))}>+</button>
              </div>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Sisa {product.stok} item</span>
            </div>
            <div style={s.detailActions}>
              <button style={s.btnCart} onClick={handleAddToCart}>
                <ShoppingCart size={18} strokeWidth={2} /> Tambah ke Keranjang
              </button>
              <button
                style={{ ...s.btnWish, ...(isWished ? s.btnWishActive : {}) }}
                onClick={() => { onToggleWishlist?.(product.id); showNotif?.(isWished ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist'); }}
              >
                <Heart size={20} strokeWidth={2} fill={isWished ? '#f43f5e' : 'none'} color={isWished ? '#f43f5e' : '#64748b'} />
              </button>
            </div>
            <div style={s.shippingInfo}>
              <Truck size={16} strokeWidth={2} />
              <span>Estimasi tiba <strong>1-2 hari kerja</strong> | Gratis ongkir min. Rp 150.000</span>
            </div>

            {/* Tabs */}
            <div style={s.tabBar}>
              {[{ id: 'desc', label: 'Deskripsi' }, { id: 'reviews', label: 'Review & Rating' }, { id: 'info', label: 'Info Produk' }].map(t => (
                <button key={t.id} style={{ ...s.tabBtn, ...(activeTab === t.id ? s.tabBtnActive : {}) }} onClick={() => setActiveTab(t.id)}>{t.label}</button>
              ))}
            </div>

            {activeTab === 'desc' && <p style={{ fontSize: '14px', color: '#1a1a2e', lineHeight: 1.8 }}>{product.desc}</p>}

            {activeTab === 'reviews' && (
              <div>
                <div style={s.reviewSummary}>
                  <div style={s.reviewBig}>
                    <div style={s.reviewBigNum}>{product.rating}</div>
                    <div style={{ fontSize: '24px', color: '#f59e0b', margin: '4px 0' }}>★★★★★</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>dari {product.reviews} ulasan</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {[[5, 78], [4, 15], [3, 5], [2, 2], [1, 0]].map(([star, pct]) => (
                      <div key={star} style={s.reviewBarRow}>
                        <span style={{ width: '20px', fontSize: '13px' }}>{star}★</span>
                        <div style={s.reviewBarBg}><div style={{ ...s.reviewBarFill, width: `${pct}%` }} /></div>
                        <span style={{ fontSize: '13px' }}>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {REVIEWS.map(r => (
                  <div key={r.name} style={s.reviewItem}>
                    <div style={s.reviewAuthor}>
                      <div style={{ ...s.reviewAvatar, background: r.color }}>{r.initials}</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{r.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{r.date}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#1a1a2e', lineHeight: 1.7 }}>{r.text}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'info' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                {[['Nama Produk', product.name], ['Kategori', `${product.kat} → ${product.subkat}`], ['Jenis Hewan', product.hewan.charAt(0).toUpperCase() + product.hewan.slice(1)], ['Berat', '1-5 kg']].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', width: '140px' }}>{k}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{v}</td>
                  </tr>
                ))}
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="section section-alt">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <RefreshCw size={18} color="#2d7a4f" strokeWidth={2} />
            <div className="section-title" style={{ fontSize: '20px' }}>Produk Serupa</div>
          </div>
          <div style={s.relatedGrid}>
            {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} showNotif={showNotif} />)}
          </div>
        </div>
      </div>

      {/* Sticky Cart Bar */}
      <div style={s.stickyCart}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>{product.name}</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a5c38' }}>{fmtPrice(product.price)}</div>
        </div>
        <button style={s.stickyCartBtn} onClick={handleAddToCart}>+ Tambah ke Keranjang</button>
      </div>
    </div>
  );
}

const s = {
  prodHero: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '24px 0' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' },
  breadLink: { color: '#2d7a4f', fontWeight: 600, cursor: 'pointer' },
  breadSep: { color: '#e5e7eb' },
  breadCurrent: { color: '#6b7280' },
  detailWrap: { padding: '32px 0' },
  gallery: { flexShrink: 0, width: '420px' },
  galleryMain: { background: '#e8f5ee', borderRadius: '12px', height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', border: '1px solid #e5e7eb' },
  galleryThumbs: { display: 'flex', gap: '10px' },
  galleryThumb: { width: '72px', height: '72px', borderRadius: '8px', background: '#e8f5ee', border: '2px solid #e5e7eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '.2s' },
  galleryThumbActive: { borderColor: '#2d7a4f' },
  detailInfo: { flex: 1 },
  detailBadges: { display: 'flex', gap: '8px', marginBottom: '12px' },
  badgeBestseller: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: '#fef3c7', color: '#92400e' },
  badgeDiscount: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: '#fee2e2', color: '#991b1b' },
  badgeNew: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: '#dcfce7', color: '#166534' },
  detailName: { fontFamily: "'Quicksand', sans-serif", fontSize: '28px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px', lineHeight: 1.3 },
  detailRating: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  detailPriceRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  detailPrice: { fontSize: '36px', fontWeight: 700, color: '#1a5c38' },
  detailPriceOld: { fontSize: '18px', color: '#9ca3af', textDecoration: 'line-through' },
  detailDiscPct: { background: '#fee2e2', color: '#dc2626', fontSize: '14px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' },
  detailMeta: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', background: '#f8faf8', borderRadius: '12px', padding: '16px' },
  metaLabel: { fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '2px' },
  metaVal: { fontSize: '14px', fontWeight: 600, color: '#1a1a2e' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  qtyLabel: { fontSize: '14px', fontWeight: 600, color: '#6b7280' },
  qtyCtrl: { display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' },
  qtyBtn: { width: '40px', height: '40px', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '18px', fontWeight: 600, color: '#1a1a2e', transition: '.2s', fontFamily: "'Nunito', sans-serif" },
  qtyNum: { width: '48px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' },
  detailActions: { display: 'flex', gap: '12px', marginBottom: '24px' },
  btnCart: { flex: 1, padding: '14px', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', transition: '.2s', fontFamily: "'Nunito', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  btnWish: { width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '22px', transition: '.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnWishActive: { borderColor: '#f87171', background: '#fee2e2' },
  shippingInfo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#e8f5ee', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', color: '#1a5c38' },
  tabBar: { borderBottom: '2px solid #e5e7eb', display: 'flex', gap: 0, marginBottom: '24px' },
  tabBtn: { padding: '12px 24px', border: 'none', background: 'none', fontSize: '14px', fontWeight: 600, color: '#6b7280', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: '-2px', fontFamily: "'Nunito', sans-serif", transition: '.2s' },
  tabBtnActive: { color: '#2d7a4f', borderBottomColor: '#2d7a4f' },
  reviewSummary: { display: 'flex', gap: '24px', padding: '20px', background: '#f8faf8', borderRadius: '12px', marginBottom: '20px' },
  reviewBig: { textAlign: 'center', paddingRight: '24px', borderRight: '1px solid #e5e7eb' },
  reviewBigNum: { fontSize: '56px', fontWeight: 700, color: '#1a5c38', lineHeight: 1 },
  reviewBarRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '13px' },
  reviewBarBg: { flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' },
  reviewBarFill: { height: '100%', background: '#f59e0b', borderRadius: '4px' },
  reviewItem: { borderBottom: '1px solid #e5e7eb', padding: '16px 0' },
  reviewAuthor: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  reviewAvatar: { width: '36px', height: '36px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 },
  relatedGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' },
  stickyCart: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e5e7eb', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 -8px 24px rgba(0,0,0,.1)', zIndex: 50 },
  stickyCartBtn: { background: '#2d7a4f', color: '#fff', padding: '12px 32px', borderRadius: '30px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: '.2s' },
};
