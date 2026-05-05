import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import imgKucing from '../../assets/Kucing.jpg';
import imgAnjing from '../../assets/Anjing.jpg';
import imgKelinci from '../../assets/Kelinci.jpg';
import ProductCard from '../../components/ProductCard';
import { shopProductsAPI } from '../../services/api';
import { Frown } from 'lucide-react';

export default function ProductListingPage({ onAddToCart, wishlist, onToggleWishlist, showNotif }) {
  const [searchParams] = useSearchParams();
  const [hewan, setHewan] = useState(searchParams.get('hewan') || null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const h = searchParams.get('hewan');
    const s = searchParams.get('search');
    if (h) setHewan(h);
    if (s) setSearch(s);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (hewan) params.hewan = hewan;
        if (search) params.search = search;
        if (sort !== 'default') params.sort = sort;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await shopProductsAPI.getAll(params);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [hewan, search, sort, minPrice, maxPrice]);

  const filtered = products;

  const hewanData = [
    { id: 'kucing', img: imgKucing, name: 'Kucing', count: '240 Produk', badge: 'Terlengkap' },
    { id: 'anjing', img: imgAnjing, name: 'Anjing', count: '185 Produk', badge: 'Terlaris' },
    { id: 'kelinci', img: imgKelinci, name: 'Kelinci', count: '92 Produk', badge: 'Baru' },
  ];

  return (
    <div>
      <div style={s.prodHero}>
        <div className="container">
          <div style={s.breadcrumb}>
            <span style={s.breadLink}>Home</span>
            <span style={s.breadSep}>›</span>
            <span style={s.breadCurrent}>Produk</span>
            {hewan && <><span style={s.breadSep}>›</span><span style={s.breadCurrent}>{hewan.charAt(0).toUpperCase() + hewan.slice(1)}</span></>}
          </div>
          <div style={s.hewanCards}>
            {hewanData.map(h => (
              <div
                key={h.id}
                style={{ ...s.hewanCard, ...(hewan === h.id ? s.hewanCardActive : {}) }}
                onClick={() => setHewan(hewan === h.id ? null : h.id)}
              >
                <div>
                  <div style={s.hewanName}>{h.name}</div>
                  <div style={s.hewanCount}>{h.count}</div>
                  <span style={{ ...s.hewanBadge, ...(hewan === h.id ? s.hewanBadgeActive : {}) }}>{h.badge}</span>
                </div>
                <div style={{ ...s.hewanIconWrap, ...(hewan === h.id ? s.hewanIconWrapActive : {}) }}>
                  <img src={h.img} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', opacity: hewan === h.id ? 1 : 0.45 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.prodMain}>
        <div className="container" style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
          {/* SIDEBAR */}
          <div style={s.sidebar}>
            <div style={s.filterTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d7a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              Filter Produk
            </div>
            <div style={s.filterSection}>
              <div style={s.filterLabel}>Range Harga</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                <input style={s.priceInput} type="number" placeholder="Min (Rp)" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                <input style={s.priceInput} type="number" placeholder="Max (Rp)" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>
            </div>
            <button style={s.filterApply} onClick={() => showNotif?.('Filter diterapkan!')}>Terapkan Filter</button>
            <button style={s.filterReset} onClick={() => { setMinPrice(''); setMaxPrice(''); setHewan(null); setSearch(''); showNotif?.('Filter direset'); }}>Reset Filter</button>
          </div>

          {/* PRODUCT AREA */}
          <div style={s.prodArea}>
            <div style={s.prodSearch}>
              <div style={s.searchWrap2}>
                <span style={s.searchIcon2}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </span>
                <input style={s.prodSearchInput} type="text" placeholder="Cari produk di sini..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div style={s.prodToolbar}>
              <div style={s.prodCount}><strong>{filtered.length}</strong> produk ditemukan</div>
              <div style={s.sortBtns}>
                {[
                  { id: 'default', label: 'Default' },
                  { id: 'harga-asc', label: 'Harga ↑' },
                  { id: 'harga-desc', label: 'Harga ↓' },
                  { id: 'rating', label: '★ Rating' },
                  { id: 'terlaris', label: 'Terlaris' },
                ].map(o => (
                  <button key={o.id} style={{ ...s.sortBtn, ...(sort === o.id ? s.sortBtnActive : {}) }} onClick={() => setSort(o.id)}>{o.label}</button>
                ))}
              </div>
            </div>
            <div style={s.prodGrid}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} showNotif={showNotif} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={s.empty}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><Frown size={64} color="#9ca3af" /></div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Produk Tidak Ditemukan</h3>
                <p style={{ color: '#6b7280' }}>Coba ubah filter atau kata kunci pencarian</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  prodHero: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '24px 0' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280', marginBottom: '20px' },
  breadLink: { color: '#2d7a4f', fontWeight: 600, cursor: 'pointer' },
  breadSep: { color: '#e5e7eb' },
  breadCurrent: { color: '#6b7280' },
  hewanCards: { display: 'flex', gap: '16px', marginBottom: '8px' },
  hewanCard: { flex: 1, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: '.25s', boxShadow: '0 1px 4px rgba(0,0,0,.04)' },
  hewanCardActive: { borderColor: '#2d7a4f', background: '#fff', boxShadow: '0 0 0 2px #2d7a4f' },
  hewanIconWrap: { width: '52px', height: '52px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  hewanIconWrapActive: { background: '#e8f5ee' },
  hewanName: { fontWeight: 700, fontSize: '17px', color: '#1a1a2e', marginBottom: '2px' },
  hewanCount: { fontSize: '13px', color: '#6b7280', marginBottom: '6px' },
  hewanBadge: { display: 'inline-block', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: '#f1f5f9', color: '#6b7280', letterSpacing: '0.3px' },
  hewanBadgeActive: { background: '#e8f5ee', color: '#2d7a4f' },
  prodMain: { padding: '24px 0 48px' },
  sidebar: { flexShrink: 0, width: '240px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', position: 'sticky', top: '80px' },
  filterTitle: { fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
  filterSection: { marginBottom: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' },
  filterLabel: { fontSize: '13px', fontWeight: 700, color: '#1a1a2e', marginBottom: '10px' },
  priceInput: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', color: '#1a1a2e', fontFamily: "'Nunito', sans-serif", width: '100%', outline: 'none' },
  filterApply: { width: '100%', padding: '10px', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginTop: '12px', fontFamily: "'Nunito', sans-serif", transition: '.2s' },
  filterReset: { width: '100%', padding: '8px', background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', color: '#6b7280', cursor: 'pointer', marginTop: '8px', fontFamily: "'Nunito', sans-serif" },
  prodArea: { flex: 1, minWidth: 0, paddingLeft: '24px' },
  prodSearch: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' },
  searchWrap2: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon2: { position: 'absolute', left: '14px', fontSize: '14px' },
  prodSearchInput: { flex: 1, border: '1px solid #e5e7eb', borderRadius: '30px', padding: '10px 20px 10px 40px', fontSize: '14px', color: '#1a1a2e', fontFamily: "'Nunito', sans-serif", outline: 'none', background: '#fff' },
  prodToolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', background: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb' },
  prodCount: { fontSize: '14px', color: '#6b7280' },
  sortBtns: { display: 'flex', gap: '6px' },
  sortBtn: { padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', transition: '.2s', fontFamily: "'Nunito', sans-serif", color: '#6b7280' },
  sortBtnActive: { background: '#e8f5ee', borderColor: '#2d7a4f', color: '#2d7a4f' },
  prodGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' },
  empty: { textAlign: 'center', padding: '60px 40px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', gridColumn: '1/-1' },
};
