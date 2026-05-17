import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, ImageOff, Trash2, Lock, ShieldCheck, ChevronRight } from 'lucide-react';
import { fmtPrice } from '../../data/products';
import { useCart } from '../../context/CartContext';

export default function CartPage({ showNotif }) {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, cartSubtotal } = useCart();
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDisc, setVoucherDisc] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState('');

  const total = cartSubtotal - voucherDisc;

  const applyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    if (code === 'PAWMART10') { setVoucherDisc(10000); setVoucherMsg('Voucher PAWMART10: hemat Rp 10.000!'); }
    else { setVoucherMsg('Kode voucher tidak valid.'); setVoucherDisc(0); }
  };

  if (cart.length === 0) return (
    <div className="min-h-[calc(100vh-200px)] bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart size={48} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3 font-jakarta">Keranjang Kamu Kosong</h3>
          <p className="text-slate-500 mb-8">Yuk, belanja produk terbaik untuk hewan peliharaanmu!</p>
          <button 
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors" 
            onClick={() => navigate('/products')}
          >
            <ShoppingBag size={18} /> Mulai Belanja
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-jakarta pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <button onClick={() => navigate('/')} className="font-semibold text-green-700 hover:text-green-800 transition-colors">Home</button>
            <ChevronRight size={14} className="text-slate-300" />
            <span>Keranjang Belanja</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShoppingCart className="text-green-700" size={32} /> 
            Keranjang Belanja 
            <span className="text-lg font-medium text-slate-500">({cart.length} item)</span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl mt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Cart Items */}
          <div className="flex-1 w-full space-y-4">
            {cart.map(item => {
              const p = item.productId;
              if (!p) return null;
              return (
                <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow">
                  <div className="w-full sm:w-28 h-28 shrink-0 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.title || p.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageOff className="text-slate-400" size={32} />
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-lg text-slate-900">{p.title || p.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-slate-500">{p.hewan ? p.hewan.charAt(0).toUpperCase() + p.hewan.slice(1) : p.category}</span>
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-medium">{p.kat || p.brand}</span>
                    </div>
                    
                    <div className="text-sm text-slate-500 mb-4">
                      Harga satuan: <strong className="text-emerald-600 text-base">{fmtPrice(p.price)}</strong>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-green-700 hover:text-white transition-colors font-bold text-lg" onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                        <div className="w-11 h-9 flex items-center justify-center font-bold text-sm bg-white border-x-2 border-slate-200">{item.qty}</div>
                        <button className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-green-700 hover:text-white transition-colors font-bold text-lg" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                      </div>
                      
                      <div className="font-bold text-emerald-600 text-lg">{fmtPrice(p.price * item.qty)}</div>
                      
                      <button 
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors ml-auto sm:ml-0" 
                        onClick={() => { removeFromCart(item._id); showNotif?.('Produk dihapus dari keranjang'); }}
                      >
                        <Trash2 size={16} /> <span className="hidden sm:inline">Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-[380px] shrink-0 bg-white border border-slate-200 rounded-2xl p-6 lg:sticky lg:top-24 shadow-sm">
            <h2 className="font-bold text-xl text-slate-900 mb-5 pb-4 border-b border-slate-100">Ringkasan Belanja</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">{fmtPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkir</span>
                <span className="text-sm italic text-slate-500">Dihitung di checkout</span>
              </div>
              {voucherDisc > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Diskon voucher</span>
                  <span className="font-medium">-{fmtPrice(voucherDisc)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t-2 border-slate-100 mb-6">
              <span className="font-bold text-lg text-slate-900">Total</span>
              <span className="font-bold text-xl text-emerald-600">{fmtPrice(Math.max(0, total))}</span>
            </div>
            
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                placeholder="Kode voucher..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 transition-all"
                value={voucherCode} 
                onChange={e => setVoucherCode(e.target.value)} 
              />
              <button 
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
                onClick={applyVoucher}
              >
                Pakai
              </button>
            </div>
            {voucherMsg && <div className={`text-sm mb-6 ${voucherDisc > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{voucherMsg}</div>}
            
            <button 
              className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-green-700/30 active:scale-[0.98] mt-2" 
              onClick={() => navigate('/checkout')}
            >
              <Lock size={18} /> Lanjut ke Checkout
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-medium text-center">
              <ShieldCheck size={16} className="shrink-0" />
              <span>Pembayaran aman via Midtrans (QRIS, VA, E-Wallet)</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
