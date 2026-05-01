import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { products, fmtPrice } from '../data/products';

export default function CartPage({ cart, onUpdateQty, onRemove, showNotif }) {
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDisc, setVoucherDisc] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState('');

  const subtotal = cart.reduce((a, item) => {
    const p = products.find(x => x.id === item.id);
    return a + (p ? p.price * item.qty : 0);
  }, 0);
  const ongkir = cart.length ? 15000 : 0;
  const total = subtotal + ongkir - voucherDisc;

  const applyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    if (code === 'PAWMART10') { setVoucherDisc(10000); setVoucherMsg('Voucher PAWMART10: hemat Rp 10.000!'); }
    else if (code === 'GRATIS') { setVoucherDisc(15000); setVoucherMsg('Voucher GRATIS: ongkir gratis!'); }
    else { setVoucherMsg('Kode voucher tidak valid.'); setVoucherDisc(0); }
  };

if (cart.length === 0) return (
    <div style={s.cartWrap}>
      <div className="container">
        <div style={s.cartEmpty}>
          <div style={s.emptyIcon}>🛒</div>
          <h3 style={s.emptyTitle}>Keranjang Kamu Kosong</h3>
          <p style={s.emptyDesc}>Yuk, belanja produk terbaik untuk hewan peliharaanmu!</p>
          <button className="btn-green" onClick={() => navigate('/products')} style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}><ShoppingBag size={18} /> Mulai Belanja</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={s.cartHeader}>
        <div className="container">
          <div style={s.breadcrumb}>
            <span style={s.breadLink} onClick={() => navigate('/')}>Home</span>
            <span style={s.breadSep}>›</span>
            <span>Keranjang Belanja</span>
          </div>
          <h1 style={s.cartTitle}>🛒 Keranjang Belanja <span style={{ fontSize: '16px', fontWeight: 500, color: '#6b7280' }}>({cart.length} item)</span></h1>
        </div>
      </div>

      <div style={s.cartWrap}>
        <div className="container" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Items */}
          <div style={{ flex: 1 }}>
            {cart.map(item => {
              const p = products.find(x => x.id === item.id);
              if (!p) return null;
              return (
<div key={item.id} style={s.cartItem}>
                  <div style={s.cartThumb}>{p.emoji}</div>
                  <div style={s.cartItemInfo}>
                    <div style={s.cartItemName}>{p.name}</div>
                    <div style={s.cartItemCat}>
                      {p.hewan.charAt(0).toUpperCase() + p.hewan.slice(1)}
                      <span style={s.cartItemCatBadge}>{p.kat}</span>
                    </div>
                    <div style={s.cartItemPrice}>Harga satuan: <strong style={{ color: '#059669', fontSize: '16px' }}>{fmtPrice(p.price)}</strong></div>
                    <div style={s.cartItemActions}>
                      <div style={s.cartQty}>
                        <button style={s.cqBtn} onClick={() => onUpdateQty(item.id, item.qty - 1)}>−</button>
                        <div style={s.cqNum}>{item.qty}</div>
                        <button style={s.cqBtn} onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <div style={s.cartSubtotal}>{fmtPrice(p.price * item.qty)}</div>
                      <button style={s.cartRemove} onClick={() => { onRemove(item.id); showNotif?.('Produk dihapus dari keranjang'); }}>🗑 Hapus</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={s.cartSummary}>
            <div style={s.sumTitle}>Ringkasan Belanja</div>
            <div style={s.sumRow}><span>Subtotal</span><span>{fmtPrice(subtotal)}</span></div>
            <div style={s.sumRow}><span>Ongkir (estimasi)</span><span>{fmtPrice(ongkir)}</span></div>
            <div style={s.sumRow}><span>Diskon voucher</span><span style={{ color: '#dc2626' }}>-{fmtPrice(voucherDisc)}</span></div>
<div style={{ ...s.sumRow, ...s.sumTotal }}><span>Total</span><span style={{ color: '#059669' }}>{fmtPrice(Math.max(0, total))}</span></div>
            <div style={s.voucherWrap}>
              <input style={s.voucherInput} type="text" placeholder="Kode voucher..." value={voucherCode} onChange={e => setVoucherCode(e.target.value)} />
              <button style={s.voucherBtn} onClick={applyVoucher}>Pakai</button>
            </div>
            {voucherMsg && <div style={{ fontSize: '12px', color: voucherDisc > 0 ? '#2d7a4f' : '#dc2626', marginTop: '4px' }}>{voucherMsg}</div>}
            <button style={s.checkoutBtn} onClick={() => showNotif?.('Menuju halaman checkout...')}>🔒 Lanjut ke Checkout</button>
            <div style={s.securityBadge}>🔒 Pembayaran aman via Midtrans · QRIS · VA · E-Wallet</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  cartHeader: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '28px 0 0' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '12px' },
  breadLink: { color: '#2d7a4f', fontWeight: 600, cursor: 'pointer', transition: 'color .2s' },
  breadSep: { color: '#cbd5e1' },
  cartTitle: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', fontWeight: 700, color: '#0f172a', paddingBottom: '16px', letterSpacing: '-.01em' },
  cartWrap: { padding: '32px 0 64px', background: '#f8fafc', minHeight: 'calc(100vh - 200px)' },
  cartItem: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', gap: '20px', marginBottom: '16px', transition: 'all .25s', boxShadow: '0 1px 3px rgba(0,0,0,.04)' },
  cartItemHover: { boxShadow: '0 8px 24px rgba(0,0,0,.08)', borderColor: '#cbd5e1', transform: 'translateY(-2px)' },
  cartThumb: { width: '100px', height: '100px', borderRadius: '12px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px' },
  cartItemInfo: { flex: 1, paddingTop: '4px' },
  cartItemName: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '17px', fontWeight: 600, color: '#0f172a', marginBottom: '6px', letterSpacing: '-.01em' },
  cartItemCat: { fontSize: '13px', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
  cartItemCatBadge: { background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, color: '#475569' },
  cartItemPrice: { fontSize: '14px', color: '#64748b', marginBottom: '16px' },
  cartItemActions: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' },
  cartQty: { display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc' },
  cqBtn: { width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', fontWeight: 600, transition: 'all .2s', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cqBtnHover: { background: '#2d7a4f', color: '#fff' },
  cqNum: { width: '44px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px', color: '#0f172a', background: '#fff', borderLeft: '1.5px solid #e2e8f0', borderRight: '1.5px solid #e2e8f0' },
  cartSubtotal: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#059669' },
  cartRemove: { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: '8px 12px', transition: 'all .2s', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' },
  cartRemoveHover: { background: '#fef2f2', color: '#ef4444' },
  cartSummary: { flexShrink: 0, width: '360px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px', position: 'sticky', top: '96px', boxShadow: '0 4px 20px rgba(0,0,0,.06)' },
  sumTitle: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 700, marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', color: '#0f172a', letterSpacing: '-.01em' },
  sumRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '10px 0', color: '#64748b' },
  sumRowIcon: { display: 'flex', alignItems: 'center', gap: '10px' },
  sumIcon: { width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#64748b' },
  sumTotal: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#0f172a', borderTop: '2px solid #f1f5f9', paddingTop: '16px', marginTop: '12px' },
  voucherWrap: { display: 'flex', gap: '10px', margin: '20px 0' },
  voucherInput: { flex: 1, border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', transition: 'all .2s', background: '#f8fafc' },
  voucherInputFocus: { borderColor: '#2d7a4f', background: '#fff', boxShadow: '0 0 0 3px rgba(45,122,79,.1)' },
  voucherBtn: { padding: '14px 24px', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #2d7a4f 0%, #059669 100%)', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap', transition: 'all .25s', boxShadow: '0 2px 8px rgba(45,122,79,.3)' },
  checkoutBtn: { width: '100%', padding: '18px', background: 'linear-gradient(135deg, #2d7a4f 0%, #059669 100%)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', marginTop: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all .25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 14px rgba(45,122,79,.35)', letterSpacing: '-.01em' },
  checkoutBtnHover: { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(45,122,79,.4)' },
  securityBadge: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '10px', fontSize: '12px', color: '#15803d', fontWeight: 500, border: '1px solid #bbf7d0' },
  cartEmpty: { textAlign: 'center', padding: '100px 40px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,.05)' },
  emptyIcon: { width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', margin: '0 auto 24px' },
  emptyTitle: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', letterSpacing: '-.01em' },
  emptyDesc: { color: '#64748b', marginBottom: '32px', fontSize: '15px' },
};
