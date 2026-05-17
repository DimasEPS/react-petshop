import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shopProductsAPI } from '../../services/api';
import { Cat, Dog, Rabbit, Star, Tag, ShieldCheck, Truck, CreditCard, MessageCircle, Stethoscope, Scissors, Hotel, PawPrint, CalendarDays, ShoppingBag, Lock, Users, Info } from 'lucide-react';
import { products, fmtPrice } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import imgKucing from './../../assets/Kucing.jpg';
import imgAnjing from './../../assets/Anjing.jpg';
import imgKelinci from './../../assets/Kelinci.jpg';

function CtaBtn({ icon, label, sub, variant = 'white', onClick }) {
  const [hov, setHov] = useState(false);
  const isWhite = variant === 'white';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '14px',
        padding: '14px 28px',
        background: isWhite
          ? (hov ? '#f0fdf4' : '#fff')
          : (hov ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.1)'),
        border: isWhite ? 'none' : '1.5px solid rgba(255,255,255,.4)',
        borderRadius: '16px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all .25s',
        boxShadow: isWhite
          ? (hov ? '0 12px 36px rgba(0,0,0,.22)' : '0 6px 24px rgba(0,0,0,.15)')
          : (hov ? '0 8px 24px rgba(0,0,0,.2)' : 'none'),
        transform: hov ? 'translateY(-2px)' : 'none',
        backdropFilter: isWhite ? 'none' : 'blur(8px)',
      }}
    >
      <span style={{
        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
        background: isWhite ? '#e8f5ee' : 'rgba(255,255,255,.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: isWhite ? '#1a7a4a' : '#fff',
      }}>
        {icon}
      </span>
      <span style={{ textAlign: 'left' }}>
        <span style={{ display: 'block', fontWeight: 700, fontSize: '15px', color: isWhite ? '#0f4f2e' : '#fff', letterSpacing: '-.01em' }}>{label}</span>
        <span style={{ display: 'block', fontSize: '11px', color: isWhite ? '#6b9e7e' : 'rgba(255,255,255,.6)', marginTop: '2px' }}>{sub}</span>
      </span>
    </button>
  );
}

function BtnLihatSemua({ onClick, label = 'Lihat Semua' }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ textAlign: 'center', marginTop: '28px' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '11px 28px',
          background: hov ? '#1a7a4a' : '#fff',
          color: hov ? '#fff' : '#1a7a4a',
          border: '1.5px solid #1a7a4a',
          borderRadius: '50px',
          fontSize: '14px', fontWeight: 700,
          cursor: 'pointer',
          transition: 'all .2s',
          fontFamily: 'inherit',
          letterSpacing: '-.01em',
          boxShadow: hov ? '0 6px 20px rgba(26,122,74,.25)' : 'none',
        }}
      >
        {label}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ transition: 'transform .2s', transform: hov ? 'translateX(3px)' : 'none' }}>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function SectionIcon({ icon: Icon, color = '#2d7a4f', bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '40px', height: '40px', borderRadius: '10px',
      background: bg || `${color}18`,
      flexShrink: 0,
    }}>
      <Icon size={22} color={color} strokeWidth={2.2} />
    </span>
  );
}

export default function HomePage({ onAddToCart, wishlist, onToggleWishlist, showNotif }) {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [hoverBelanja, setHoverBelanja] = useState(false);
  const [hoverBooking, setHoverBooking] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Just fetch top 4 bestsellers
        const res = await shopProductsAPI.getAll({ sort: 'terlaris' });
        if (res.data.success) {
          setFeatured(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setFeatured([]);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroBefore} />
        <div style={s.heroAfter} />
        <div style={s.heroContent}>
          <div style={s.heroBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="rgba(255,255,255,.9)" /></svg>
            #1 Petshop Online Indonesia
          </div>
          <h1 style={s.heroH1}>
            Semua Kebutuhan<br />
            <em style={{ color: '#a8e6c3', fontStyle: 'normal' }}>Hewan Peliharaan</em><br />
            Ada di Sini
          </h1>
          <p style={s.heroP}>Produk berkualitas untuk kucing, anjing, dan kelinci kesayanganmu. Grooming profesional & penitipan terpercaya.</p>
          <div style={s.heroBtns}>
            <button
              style={{ ...s.btnBelanja, ...(hoverBelanja ? s.btnBelanjaHover : {}) }}
              onClick={() => navigate('/products')}
              onMouseEnter={() => setHoverBelanja(true)}
              onMouseLeave={() => setHoverBelanja(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#0f4f2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" stroke="#0f4f2e" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0" stroke="#0f4f2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                <span style={{ ...s.btnMain, color: '#0f4f2e' }}>Belanja Sekarang</span>
                <span style={{ ...s.btnSub, color: '#6b9e7e' }}>500+ produk tersedia</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transition: 'transform .25s', transform: hoverBelanja ? 'translateX(4px)' : 'none' }}>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#1a7a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              style={{ ...s.btnBooking, ...(hoverBooking ? s.btnBookingHover : {}) }}
              onMouseEnter={() => setHoverBooking(true)}
              onMouseLeave={() => setHoverBooking(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M6 3v2M18 3v2M3 8h18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="rgba(255,255,255,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" stroke="rgba(255,255,255,.9)" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>
                <span style={{ ...s.btnMain, color: '#fff' }}>Booking Grooming</span>
                <span style={{ ...s.btnSub, color: 'rgba(255,255,255,.6)' }}>Jadwal fleksibel</span>
              </span>
            </button>
          </div>
          <div style={s.heroStats}>
            <div style={s.heroStat}><strong style={s.heroStatNum}>500+</strong><span style={s.heroStatLabel}>Produk Premium</span></div>
            <div style={s.heroStatDivider} />
            <div style={s.heroStat}><strong style={s.heroStatNum}>10k+</strong><span style={s.heroStatLabel}>Pelanggan Happy</span></div>
            <div style={s.heroStatDivider} />
            <div style={s.heroStat}><strong style={s.heroStatNum}><span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>4.9 <Star size={24} fill="currentColor" /></span></strong><span style={s.heroStatLabel}>Rating Toko</span></div>
          </div>
          <div style={s.heroPills}>
            {[
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" fill="rgba(255,255,255,.85)" /></svg>, label: 'Makanan Premium' },
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" fill="rgba(255,255,255,.85)" /></svg>, label: 'Vitamin & Suplemen' },
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M7 4v2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-2V4H7zm0 2h10v2H7V6z" fill="rgba(255,255,255,.85)" /></svg>, label: 'Aksesoris Grooming' },
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="rgba(255,255,255,.85)" /></svg>, label: 'Kandang & Tempat Tidur' },
            ].map(p => (
              <span key={p.label} style={{ ...s.heroPill, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>{p.icon}{p.label}</span>
            ))}
          </div>
        </div>
        <div style={s.heroVisual}>
          <HeroBubbles />
        </div>
      </div>

      {/* KATEGORI HEWAN */}
      <div className="section-tight section-gray">
        <div className="container">
          <div className="section-title" style={{ marginBottom: '24px' }}><SectionIcon icon={PawPrint} color="#2d7a4f" /> Kategori Hewan Peliharaan</div>
          <div style={s.kategoriGrid}>
            {[
              { icon: <Cat size={56} color="#2d7a4f" />, name: 'Kucing', count: '240 Produk Tersedia', tag: 'Terlengkap', hewan: 'kucing' },
              { icon: <Dog size={56} color="#f59e0b" />, name: 'Anjing', count: '185 Produk Tersedia', tag: 'Terlaris', hewan: 'anjing' },
              { icon: <Rabbit size={56} color="#8b5cf6" />, name: 'Kelinci', count: '92 Produk Tersedia', tag: 'Baru', hewan: 'kelinci' },
            ].map(k => (
              <KategoriCard key={k.hewan} {...k} onClick={() => navigate(`/products?hewan=${k.hewan}`)} />
            ))}
          </div>
          <BtnLihatSemua onClick={() => navigate('/products')} label="Lihat Semua Produk" />
        </div>
      </div>

      {/* PROMO */}
      <div className="section section-alt">
        <div className="container">
          <div className="section-title" style={{ marginBottom: '24px' }}><SectionIcon icon={Tag} color="#e05a1a" bg="#e05a1a18" /> Promo & Diskon Spesial</div>
          <div style={s.promoGrid}>
            <div style={{ ...s.promoCard, background: 'linear-gradient(135deg,#ff6b35,#ff9a6c)' }}>
              <div>
                <h3 style={s.promoH3}>Diskon 30% Makanan Kucing</h3>
                <p style={s.promoP}>Royal Canin, Whiskas & brand premium lainnya</p>
                <button style={{ ...s.promoBtn, color: '#ff6b35' }} onClick={() => navigate('/products?hewan=kucing')} className="promo-btn-orange">Belanja Sekarang</button>
              </div>
              <span style={{ ...s.promoEmoji, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Cat size={72} color="rgba(255,255,255,0.3)" /></span>
            </div>
            <div style={{ ...s.promoCard, background: 'linear-gradient(135deg,#2d7a4f,#4a9e6d)' }}>
              <div>
                <h3 style={s.promoH3}>Bundling Grooming + Aksesoris</h3>
                <p style={s.promoP}>Hemat hingga 25% untuk paket lengkap</p>
                <button style={{ ...s.promoBtn, color: '#1a5c38' }}>Lihat Paket</button>
              </div>
              <span style={{ ...s.promoEmoji, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Scissors size={72} color="rgba(255,255,255,0.3)" /></span>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUK UNGGULAN */}
      <div className="section-tight section-gray">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="section-title" style={{ justifyContent: 'center' }}><SectionIcon icon={Star} color="#f59e0b" bg="#f59e0b18" /> Produk Unggulan</div>
          </div>
          <div style={s.productsGrid}>
            {featured.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} showNotif={showNotif} />
            ))}
          </div>
          <BtnLihatSemua onClick={() => navigate('/products')} />
        </div>
      </div>

      {/* TRUST */}
      <div className="section-tight section-white">
        <div className="container">
          <div className="section-title" style={{ marginBottom: '24px' }}><SectionIcon icon={ShieldCheck} color="#2d7a4f" /> Kenapa Pilih PawMart?</div>
          <div style={s.trustGrid}>
            {[
              { icon: <ShieldCheck size={40} color="#2d7a4f" />, title: 'Produk Original', desc: '100% produk original bergaransi dari distributor resmi' },
              { icon: <Truck size={40} color="#2d7a4f" />, title: 'Pengiriman Cepat', desc: 'Same-day delivery untuk area Lampung, next-day untuk kota lain' },
              { icon: <CreditCard size={40} color="#2d7a4f" />, title: 'Pembayaran Aman', desc: 'Midtrans: QRIS, Virtual Account, E-Wallet, kartu kredit' },
              { icon: <Dog size={40} color="#2d7a4f" />, title: 'Layanan Profesional', desc: 'Tim groomer berpengalaman & dokter hewan terverifikasi' },
            ].map(t => (
              <div key={t.title} style={s.trustCard}>
                <div style={{ ...s.trustIcon, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{t.icon}</div>
                <div style={s.trustTitle}>{t.title}</div>
                <div style={s.trustDesc}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LAYANAN */}
      <div className="section-tight section-gray">
        <LayananSection />
      </div>

      {/* TESTIMONI */}
      <div className="section-tight section-white">
        <div className="container">
          <div className="section-title" style={{ marginBottom: '24px' }}><SectionIcon icon={MessageCircle} color="#6d28d9" bg="#6d28d918" /> Kata Pelanggan Kami</div>
          <div style={s.testiGrid}>
            {[
              { rating: 5, text: '"PawMart jadi andalan buat beli makanan si Oreo. Pengiriman cepet banget, produknya original. Recommended!"', initials: 'SR', name: 'Sari R.', sub: 'Pemilik 2 kucing', color: '#2d7a4f' },
              { rating: 5, text: '"Grooming-nya bagus banget! Anjingku jadi wangi sehari penuh. Groomernya sabar & profesional. Pasti balik lagi!"', initials: 'BD', name: 'Budi D.', sub: 'Pemilik Golden Retriever', color: '#f59e0b' },
              { rating: 4, text: '"Nitip kelinci 3 hari pas liburan, alhamdulillah aman. Update foto tiap hari dari staf. Hati tenang liburannya!"', initials: 'AN', name: 'Ani N.', sub: 'Pemilik kelinci', color: '#8b5cf6' },
            ].map(t => (
              <div key={t.name} style={s.testiCard}>
                <div style={{ display: 'flex', gap: '2px', color: '#f59e0b', marginBottom: '12px' }}>
                  {Array(5).fill(0).map((_, i) => <Star key={i} size={16} fill={i < t.rating ? "currentColor" : "none"} color={i < t.rating ? "currentColor" : "#e5e7eb"} strokeWidth={i < t.rating ? 0 : 2} />)}
                </div>
                <div style={s.testiText}>{t.text}</div>
                <div style={s.testiAuthor}>
                  <div style={{ ...s.testiAvatar, background: t.color }}>{t.initials}</div>
                  <div><strong style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>{t.name}</strong><span style={{ fontSize: '12px', color: '#6b7280' }}>{t.sub}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={s.cta}>
        <h2 style={s.ctaH2}>Rawat Hewan Peliharaanmu Sekarang! <PawPrint size={32} color="#a8e6c3" style={{ display: 'inline', verticalAlign: 'middle' }} /></h2>
        <p style={s.ctaP}>Produk terbaik, layanan profesional, harga terjangkau — semua ada di PawMart</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <CtaBtn
            icon={<ShoppingBag size={20} strokeWidth={2} />}
            label="Mulai Belanja"
            sub="500+ produk tersedia"
            variant="white"
            onClick={() => navigate('/products')}
          />
          <CtaBtn
            icon={<CalendarDays size={20} strokeWidth={2} />}
            label="Booking Grooming"
            sub="Jadwal fleksibel"
            variant="ghost"
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div className="container">
          <div style={s.footerGrid}>
            <div>
              <h3 style={{ ...s.footerBrand, display: 'flex', alignItems: 'center', gap: '8px' }}><PawPrint size={22} color="#a8e6c3" /> PawMart</h3>
              <p style={s.footerDesc}>Platform e-commerce petshop terpercaya. Semua kebutuhan hewan peliharaan dalam satu tempat.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { name: 'Facebook', href: '#', svg: <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg> },
                  { name: 'Instagram', href: '#', svg: <svg viewBox="0 0 24 24" width="18" height="18"><defs><radialGradient id="ig2" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497" /><stop offset="45%" stopColor="#fd5949" /><stop offset="60%" stopColor="#d6249f" /><stop offset="90%" stopColor="#285AEB" /></radialGradient></defs><path fill="url(#ig2)" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg> },
                  { name: 'WhatsApp', href: '#', svg: <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg> },
                  { name: 'TikTok', href: '#', svg: <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" /></svg> },
                ].map(({ name, href, svg }) => (
                  <a key={name} href={href} title={name} style={s.socialBtn}>{svg}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={s.footerColTitle}>Produk</h4>
              <ul style={{ listStyle: 'none' }}>
                {['Produk Kucing', 'Produk Anjing', 'Produk Kelinci', 'Promo'].map(l => <li key={l} style={s.footerLink}>{l}</li>)}
              </ul>
            </div>
            <div>
              <h4 style={s.footerColTitle}>Layanan</h4>
              <ul style={{ listStyle: 'none' }}>
                {['Grooming', 'Pet Hotel', 'Konsultasi'].map(l => <li key={l} style={s.footerLink}>{l}</li>)}
              </ul>
            </div>
            <div>
              <h4 style={s.footerColTitle}>Bantuan</h4>
              <ul style={{ listStyle: 'none' }}>
                {['Cara Belanja', 'Cara Pembayaran', 'Kebijakan Return', 'Hubungi Kami'].map(l => <li key={l} style={s.footerLink}>{l}</li>)}
              </ul>
            </div>
          </div>
          <div style={s.footerBottom}>
            <span>© 2026 PawMart. All rights reserved.</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Lock size={13} /> Pembayaran aman via Midtrans</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroBubbles() {
  return (
    <div style={b.wrap}>
      {/* Bubble besar tengah - Kucing */}
      <div style={{ ...b.bubble, ...b.main }}>
        <img src={imgKucing} alt="Kucing" style={b.imgMain} />
      </div>
      {/* Label Kucing */}
      <div style={{ ...b.label, top: '50%', left: '50%', transform: 'translate(-50%, 148px)', zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Cat size={12} color="rgba(255,255,255,.9)" /> Kucing</div>

      {/* Bubble kiri atas - Anjing */}
      <div style={{ ...b.bubble, ...b.topLeft }}>
        <img src={imgAnjing} alt="Anjing" style={b.imgSm} />
      </div>
      {/* Label Anjing */}
      <div style={{ ...b.label, top: '228px', left: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Dog size={12} color="rgba(255,255,255,.9)" /> Anjing</div>

      {/* Bubble kanan bawah - Kelinci */}
      <div style={{ ...b.bubble, ...b.botRight }}>
        <img src={imgKelinci} alt="Kelinci" style={b.imgSm} />
      </div>
      {/* Label Kelinci */}
      <div style={{ ...b.label, bottom: '8px', right: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Rabbit size={12} color="rgba(255,255,255,.9)" /> Kelinci</div>

      {/* Dekorasi titik */}
      <div style={{ ...b.dot, top: '8px', right: '55px', width: '12px', height: '12px', background: 'rgba(255,255,255,.3)' }} />
      <div style={{ ...b.dot, top: '48%', left: '-8px', width: '8px', height: '8px', background: 'rgba(255,255,255,.2)' }} />
      <div style={{ ...b.dot, bottom: '60px', left: '60px', width: '6px', height: '6px', background: 'rgba(255,255,255,.15)' }} />

      {/* Badge dekorasi kiri */}
      <div style={b.badgeLeft}>
        <Star size={18} color="#f59e0b" fill="#f59e0b" />
        <div>
          <div style={{ fontWeight: 700, fontSize: '12px', color: '#fff', lineHeight: 1 }}>4.9 Rating</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.7)' }}>10k+ pelanggan</div>
        </div>
      </div>

      {/* Badge dekorasi kanan atas */}
      <div style={b.badgeTop}>
        <Truck size={16} color="#fff" />
        <div style={{ fontWeight: 700, fontSize: '11px', color: '#fff' }}>Same-day delivery</div>
      </div>
    </div>
  );
}

const b = {
  wrap: { position: 'relative', width: '560px', height: '540px', flexShrink: 0 },
  bubble: {
    position: 'absolute',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,.15)',
    backdropFilter: 'blur(8px)',
    border: '2px solid rgba(255,255,255,.25)',
    boxShadow: '0 8px 32px rgba(0,0,0,.15)',
    gap: '4px',
  },
  main: {
    width: '340px', height: '340px',
    top: '50%', left: '50%',
    transform: 'translate(-50%,-50%)',
    padding: 0,
    overflow: 'hidden',
    animation: 'floatMain 3.5s ease-in-out infinite',
    zIndex: 2,
  },
  topLeft: {
    width: '240px', height: '240px',
    top: '0px', left: '0px',
    padding: 0,
    overflow: 'hidden',
    animation: 'floatA 4s ease-in-out infinite',
    zIndex: 1,
  },
  botRight: {
    width: '220px', height: '220px',
    bottom: '0px', right: '0px',
    padding: 0,
    overflow: 'hidden',
    animation: 'floatB 4.5s ease-in-out infinite',
    zIndex: 1,
  },
  imgMain: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' },
  imgSm: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' },
  dot: { position: 'absolute', borderRadius: '50%' },
  label: {
    position: 'absolute',
    background: 'rgba(255,255,255,.18)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,.3)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    padding: '5px 11px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
    zIndex: 4,
    letterSpacing: '.01em',
  },
  badgeLeft: {
    position: 'absolute',
    left: '-16px',
    top: '62%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,.25)',
    borderRadius: '14px',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 5,
    boxShadow: '0 4px 16px rgba(0,0,0,.12)',
  },
  badgeTop: {
    position: 'absolute',
    right: '20px',
    top: '-10px',
    background: 'rgba(255,255,255,.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,.25)',
    borderRadius: '14px',
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    zIndex: 5,
    boxShadow: '0 4px 16px rgba(0,0,0,.12)',
  },
};

const LAYANAN_INIT = [
  { id: 'grooming', icon: <Scissors size={48} color="#2d7a4f" />, title: 'Grooming Profesional', desc: 'Mandi, potong bulu, perawatan kuku & telinga oleh groomer bersertifikat. Tersedia untuk kucing, anjing & kelinci.', badge: 'Booking Online' },
  { id: 'hotel', icon: <Hotel size={48} color="#2d7a4f" />, title: 'Pet Hotel & Penitipan', desc: 'Penitipan harian & menginap dengan pengawasan 24 jam. Hewan peliharaanmu akan diperlakukan seperti raja!', badge: 'Tersedia Sekarang' },
];

function LayananSection() {
  const [items, setItems] = useState(LAYANAN_INIT);
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => { e.preventDefault(); setOverIdx(i); };
  const onDrop = (i) => {
    if (dragIdx === null || dragIdx === i) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setItems(next);
    setDragIdx(null);
    setOverIdx(null);
  };
  const onDragEnd = () => { setDragIdx(null); setOverIdx(null); };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="section-title" style={{ justifyContent: 'center' }}><SectionIcon icon={Stethoscope} color="#0369a1" bg="#0369a118" /> Layanan Kami</div>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Info size={14} /> Drag kartu untuk mengubah urutan</p>
      </div>
      <div style={s.layananGrid}>
        {items.map((l, i) => (
          <div
            key={l.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDrop={() => onDrop(i)}
            onDragEnd={onDragEnd}
            style={{
              ...s.layananCard,
              opacity: dragIdx === i ? 0.4 : 1,
              border: overIdx === i && dragIdx !== i ? '2px dashed #2d7a4f' : '1px solid #e5e7eb',
              cursor: 'grab',
              transform: overIdx === i && dragIdx !== i ? 'scale(1.02)' : 'none',
              transition: 'transform .2s, border .15s, opacity .2s',
            }}
          >
            <span style={{ ...s.layananIcon, display: 'flex', alignItems: 'center' }}>{l.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <h3 style={s.layananTitle}>{l.title}</h3>
                <span style={{ fontSize: '16px', color: '#d1d5db', cursor: 'grab' }}>⠿</span>
              </div>
              <p style={s.layananDesc}>{l.desc}</p>
              <span style={s.layananBadge}>{l.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KategoriCard({ icon, name, count, tag, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...s.kategoriCard, ...(hovered ? s.kategoriCardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span style={{ ...s.katEmoji, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{icon}</span>
      <div style={s.katName}>{name}</div>
      <div style={s.katCount}>{count}</div>
      <span style={s.katTag}>{tag}</span>
    </div>
  );
}

const s = {
  hero: { background: 'linear-gradient(135deg,#1a5c38 0%,#2d7a4f 50%,#4a9e6d 100%)', padding: '72px 48px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', minHeight: '560px', position: 'relative', overflow: 'hidden' },
  heroBefore: { content: '', position: 'absolute', right: '-60px', top: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,.05)' },
  heroAfter: { content: '', position: 'absolute', right: '100px', bottom: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,.04)' },
  heroContent: { flex: 1, zIndex: 1 },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,.15)', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '20px' },
  heroH1: { fontFamily: "'Quicksand', sans-serif", fontSize: '48px', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '16px' },
  heroP: { color: 'rgba(255,255,255,.85)', fontSize: '17px', lineHeight: 1.7, maxWidth: '480px', marginBottom: '32px' },
  heroBtns: { display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' },
  btnBelanja: { display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', border: 'none', borderRadius: '16px', padding: '14px 20px', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,.18)', transition: 'all .25s', fontFamily: 'inherit' },
  btnBelanjaHover: { transform: 'translateY(-2px)', boxShadow: '0 14px 40px rgba(0,0,0,.25)', background: '#f0fdf4' },
  btnBooking: { display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,.12)', border: '1.5px solid rgba(255,255,255,.35)', borderRadius: '16px', padding: '14px 20px', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all .25s', fontFamily: 'inherit' },
  btnBookingHover: { transform: 'translateY(-2px)', background: 'rgba(255,255,255,.2)', border: '1.5px solid rgba(255,255,255,.6)', boxShadow: '0 8px 24px rgba(0,0,0,.15)' },
  btnMain: { display: 'block', fontWeight: 700, fontSize: '15px', color: '#0f4f2e', letterSpacing: '-.01em' },
  btnSub: { display: 'block', fontSize: '11px', color: '#6b9e7e', marginTop: '1px' },
  heroStats: { display: 'flex', gap: '24px', marginTop: '32px', alignItems: 'center' },
  heroStatDivider: { width: '1px', height: '36px', background: 'rgba(255,255,255,.2)', flexShrink: 0 },
  heroPills: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' },
  heroPill: { background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.85)', fontSize: '11px', fontWeight: 600, padding: '5px 12px', borderRadius: '20px', backdropFilter: 'blur(6px)', letterSpacing: '.01em' },
  heroStat: { color: 'rgba(255,255,255,.9)' },
  heroStatNum: { display: 'block', fontSize: '28px', fontWeight: 700, color: '#fff' },
  heroStatLabel: { fontSize: '12px', opacity: .8 },
  heroVisual: { flexShrink: 0, zIndex: 1 },
  heroCircle: { width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px', margin: '0 auto', border: '2px solid rgba(255,255,255,.2)' },
  btnLihatSemua: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'transparent', color: '#1a7a4a', border: '1.5px solid #1a7a4a', borderRadius: '50px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit', letterSpacing: '-.01em' },
  kategoriGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' },
  kategoriCard: { background: '#fff', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', cursor: 'pointer', border: '2px solid #e5e7eb', transition: '.3s', position: 'relative', overflow: 'hidden' },
  kategoriCardHover: { borderColor: '#2d7a4f', transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(45,122,79,.15)', background: '#e8f5ee' },
  katEmoji: { fontSize: '64px', display: 'block', marginBottom: '12px', lineHeight: 1 },
  katName: { fontFamily: "'Quicksand', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' },
  katCount: { fontSize: '13px', color: '#6b7280' },
  katTag: { display: 'inline-block', background: '#e8f5ee', color: '#2d7a4f', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', marginTop: '8px' },
  productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' },
  promoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  promoCard: { borderRadius: '20px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' },
  promoH3: { fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
  promoP: { color: 'rgba(255,255,255,.85)', fontSize: '14px', marginBottom: '16px' },
  promoBtn: { background: '#fff', padding: '10px 20px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', fontFamily: "'Nunito', sans-serif" },
  promoEmoji: { fontSize: '72px', opacity: .3, position: 'absolute', right: '24px', bottom: '-8px' },
  trustGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' },
  trustCard: { background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '28px 20px', textAlign: 'center' },
  trustIcon: { fontSize: '40px', marginBottom: '12px' },
  trustTitle: { fontWeight: 700, fontSize: '15px', color: '#1a1a2e', marginBottom: '6px' },
  trustDesc: { fontSize: '13px', color: '#6b7280', lineHeight: 1.6 },
  layananGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '24px' },
  layananCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '32px', display: 'flex', alignItems: 'flex-start', gap: '20px', transition: '.2s', cursor: 'pointer' },
  layananIcon: { fontSize: '48px', flexShrink: 0 },
  layananTitle: { fontSize: '18px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px' },
  layananDesc: { fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '12px' },
  layananBadge: { display: 'inline-block', background: '#e8f5ee', color: '#2d7a4f', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px' },
  testiGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' },
  testiCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' },
  testiStars: { color: '#f59e0b', fontSize: '16px', marginBottom: '12px' },
  testiText: { fontSize: '14px', color: '#1a1a2e', lineHeight: 1.7, marginBottom: '16px', fontStyle: 'italic' },
  testiAuthor: { display: 'flex', alignItems: 'center', gap: '10px' },
  testiAvatar: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', color: '#fff', flexShrink: 0 },
  cta: { background: '#1a5c38', padding: '64px 48px', textAlign: 'center' },
  ctaH2: { fontFamily: "'Quicksand', sans-serif", fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '12px' },
  ctaP: { color: 'rgba(255,255,255,.8)', fontSize: '17px', marginBottom: '32px' },
  footer: { background: '#1a1a2e', color: 'rgba(255,255,255,.7)', paddingTop: '48px' },
  footerGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' },
  footerBrand: { fontFamily: "'Quicksand', sans-serif", fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '10px' },
  footerDesc: { fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' },
  footerColTitle: { fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.5px' },
  footerLink: { fontSize: '14px', padding: '4px 0', cursor: 'pointer', transition: '.2s' },
  socialBtn: { width: '36px', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', cursor: 'pointer', color: 'rgba(255,255,255,.7)' },
  footerBottom: { borderTop: '1px solid rgba(255,255,255,.1)', padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' },
};
