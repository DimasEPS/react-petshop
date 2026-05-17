import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import { ordersAPI } from '../../services/api';
import { toast } from "sonner";
import {
  ArrowLeft, ChevronRight, MapPin, Truck,
  ShieldCheck, Package, User, Phone, Home,
  Building2, Map, Hash, Clock, Zap, Check,
  Lock, ImageOff, ShoppingCart
} from "lucide-react";

const shippingOpts = [
  { id: "jne-reg", label: "JNE Regular", sub: "Estimasi 3–5 hari kerja", price: 15000, Icon: Package },
  { id: "jne-yes", label: "JNE YES — Next Day", sub: "Estimasi 1 hari kerja", price: 35000, Icon: Zap, badge: "Tercepat" },
  { id: "sicepat", label: "SiCepat BEST", sub: "Estimasi 2–3 hari kerja", price: 12000, Icon: Truck, badge: "Termurah" },
];

const fmtPrice = (n) => `Rp ${n.toLocaleString("id-ID")}`;

/* ─── STEP INDICATOR ────────────────────────────────────── */
const STEPS = [
  { label: "Alamat", Icon: MapPin },
  { label: "Pengiriman", Icon: Truck },
];

function StepBar({ step }) {
  return (
    <div className="bg-white/5 border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center">
        {STEPS.map(({ label, Icon }, i) => {
          const done = step > i + 1;
          const active = step === i + 1;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5 shrink-0">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                  done ? 'bg-green-300 border-none' : 
                  active ? 'bg-white border-none shadow-md shadow-white/20' : 
                  'bg-white/10 border border-white/20'
                }`}>
                  {done ? (
                    <Check size={16} className="text-green-900" strokeWidth={2.5} />
                  ) : (
                    <Icon size={15} className={active ? "text-green-800" : "text-white/40"} strokeWidth={active ? 2.2 : 1.8} />
                  )}
                </div>
                <span className={`text-xs sm:text-sm hidden sm:inline ${
                  active ? 'font-bold text-white' : 
                  done ? 'font-medium text-green-300' : 
                  'font-medium text-white/40'
                }`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 sm:mx-4 transition-colors ${done ? 'bg-green-300' : 'bg-white/15'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── INPUT ─────────────────────────────────────────────── */
function Input({ value, onChange, placeholder, as = "input", rows }) {
  const baseClasses = "w-full px-4 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none text-slate-900 bg-white transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10 placeholder:text-slate-400";
  return as === "textarea" ? (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows || 3} className={`${baseClasses} resize-y`} />
  ) : (
    <input value={value} onChange={onChange} placeholder={placeholder} className={baseClasses} />
  );
}

/* ─── FIELD ─────────────────────────────────────────────── */
function Field({ label, icon: Icon, full, children }) {
  return (
    <div className={full ? "col-span-1 md:col-span-2" : "col-span-1"}>
      <label className="flex items-center gap-1.5 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        {Icon && <Icon size={12} className="text-green-700" />} {label}
      </label>
      {children}
    </div>
  );
}

/* ─── SHIPPING OPTION ───────────────────────────────────── */
function ShipOpt({ opt, selected, onSelect }) {
  const { Icon } = opt;
  return (
    <div
      onClick={() => onSelect(opt.id)}
      className={`relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl cursor-pointer border-2 transition-all hover:-translate-y-0.5 ${
        selected 
          ? "border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm" 
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {opt.badge && (
        <span className={`absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white tracking-wide shadow-sm ${
          opt.id === "jne-yes" ? "bg-green-800" : "bg-green-600"
        }`}>
          {opt.badge}
        </span>
      )}
      
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
        selected ? "border-green-600" : "border-slate-300"
      }`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
      </div>
      
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
        selected ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
      }`}>
        <Icon size={20} strokeWidth={selected ? 2 : 1.8} />
      </div>
      
      <div className="flex-1">
        <div className="font-bold text-sm text-slate-900 mb-0.5">{opt.label}</div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Clock size={11} /> {opt.sub}
        </div>
      </div>
      
      <div className={`font-extrabold text-sm sm:text-base shrink-0 ${
        selected ? "text-green-700" : "text-slate-700"
      }`}>
        {fmtPrice(opt.price)}
      </div>
    </div>
  );
}

/* ─── NAV BUTTONS ───────────────────────────────────────── */
function NavBtns({ onBack, backLabel = "Kembali", onNext, nextLabel, isLast, total, submitting }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
      <button 
        onClick={onBack} 
        disabled={submitting}
        className="flex items-center justify-center gap-2 px-5 py-3.5 border-2 border-slate-200 rounded-xl bg-white text-slate-600 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
      >
        <ArrowLeft size={16} /> {backLabel}
      </button>
      
      <button 
        onClick={onNext}
        disabled={submitting}
        className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl font-bold text-sm sm:text-base transition-all ${
          isLast 
            ? "bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5" 
            : "bg-gradient-to-br from-green-700 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-600/30 hover:-translate-y-0.5"
        } disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none`}
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            {isLast && <ShieldCheck size={18} />}
            {isLast ? `Bayar ${fmtPrice(total)} (Midtrans)` : nextLabel}
            {!isLast && <ChevronRight size={18} />}
          </>
        )}
      </button>
    </div>
  );
}

/* ─── ORDER SUMMARY ─────────────────────────────────────── */
function OrderSummary({ sub, ship, total, cart }) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm lg:sticky lg:top-6">
      <h3 className="font-bold text-lg text-slate-900 mb-5 pb-4 border-b border-slate-100 font-jakarta">
        Ringkasan Pesanan
      </h3>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {cart.map(item => {
          const p = item.productId;
          if (!p) return null;
          return (
            <div key={item._id} className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.title || p.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageOff size={20} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-sm font-semibold text-slate-900 leading-tight mb-1 truncate">{p.title || p.name}</div>
                <div className="text-xs text-slate-500">Qty: {item.qty}</div>
              </div>
              <div className="text-sm font-bold text-slate-900 shrink-0 pl-2 pt-0.5">
                {fmtPrice(p.price * item.qty)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-slate-100 my-5" />

      <div className="space-y-2 mb-5">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Subtotal produk</span>
          <span className="font-medium text-slate-900">{fmtPrice(sub)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Ongkos Kirim</span>
          <span className="font-medium text-slate-900">{ship ? fmtPrice(ship.price) : "—"}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t-2 border-slate-800 mt-2">
        <span className="font-bold text-lg text-slate-900 font-jakarta">Total</span>
        <span className="font-bold text-xl text-green-700">{fmtPrice(total)}</span>
      </div>

      <div className="mt-6 bg-green-50 rounded-xl p-4 flex items-start gap-3 border border-green-100">
        <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed m-0">
          Transaksi ini diamankan oleh <strong className="text-green-800">Midtrans SSL</strong>. Berbagai metode pembayaran tersedia (QRIS, VA, E-Wallet).
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCartState } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", address: "", city: "", province: "",
    postalCode: "", shipping: "jne-reg",
  });
  
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const sub = cartSubtotal;
  const ship = shippingOpts.find(s => s.id === form.shipping);
  const total = sub + (ship?.price || 0);

  const handleCheckout = async () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.province || !form.postalCode) {
      toast.error("Mohon lengkapi semua field alamat terlebih dahulu.");
      setStep(1);
      return;
    }

    setSubmitting(true);
    try {
      const reqBody = {
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
        shippingMethod: {
          label: ship?.label || "JNE Regular",
          price: ship?.price || 0,
        },
        paymentMethod: "midtrans", // backend will process via midtrans
      };

      const res = await ordersAPI.create(reqBody);

      if (res.data.success) {
        const snapToken = res.data.snapToken;

        // Clear local cart
        clearCartState();

        if (snapToken && window.snap) {
          window.snap.pay(snapToken, {
            onSuccess: () => navigate("/orders"),
            onPending: () => {
              toast.info("Pembayaran menunggu konfirmasi. Silakan cek status di halaman pesanan.");
              navigate("/orders");
            },
            onError: () => {
              toast.error("Pembayaran gagal. Silakan coba bayar kembali dari halaman pesanan.");
              navigate("/orders");
            },
            onClose: () => navigate("/orders"),
          });
        } else {
          toast.success("Pesanan berhasil dibuat! Segera lakukan pembayaran.");
          navigate("/orders");
        }
      } else {
        toast.error("Gagal: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Terjadi kesalahan sistem";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <ShoppingCart size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Checkout Kosong</h2>
        <p className="text-slate-500 mb-6 text-center">Silakan tambahkan produk ke keranjang terlebih dahulu.</p>
        <button 
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-colors"
        >
          Belanja Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-jakarta pb-24">

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-green-800 to-green-700 pt-6">
        <div className="max-w-5xl mx-auto px-6 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60 mb-4">
            <Link to="/" className="text-green-200 hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={12} />
            <Link to="/cart" className="text-green-200 hover:text-white transition-colors">Keranjang</Link>
            <ChevronRight size={12} />
            <span className="text-white">Checkout</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Lock size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Checkout</h1>
              <span className="text-sm font-medium text-white/70">{cart.length} produk · {fmtPrice(total)}</span>
            </div>
          </div>
        </div>
        <StepBar step={step} />
      </div>

      {/* ── BODY ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* ── LEFT PANEL ── */}
          <div className="w-full lg:flex-1">
            
            {/* STEP 1: Alamat */}
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1.5 font-jakarta">
                    <MapPin size={22} className="text-green-700" /> Alamat Pengiriman
                  </h2>
                  <p className="text-sm text-slate-500">Pastikan alamat dan data diri sudah benar</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <Field label="Nama Lengkap" icon={User}>
                    <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Nama penerima" />
                  </Field>
                  <Field label="No. Telepon" icon={Phone}>
                    <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="08xx xxxx xxxx" />
                  </Field>
                  <Field label="Alamat Lengkap" icon={Home} full>
                    <Input as="textarea" value={form.address} onChange={e => set("address", e.target.value)} placeholder="Nama jalan, blok, no. rumah, RT/RW, kelurahan..." rows={3} />
                  </Field>
                  <Field label="Kota" icon={Building2}>
                    <Input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Misal: Bandar Lampung" />
                  </Field>
                  <Field label="Provinsi" icon={Map}>
                    <Input value={form.province} onChange={e => set("province", e.target.value)} placeholder="Misal: Lampung" />
                  </Field>
                  <Field label="Kode Pos" icon={Hash} full>
                    <Input value={form.postalCode} onChange={e => set("postalCode", e.target.value)} placeholder="35xxx" />
                  </Field>
                </div>
                
                <NavBtns
                  onBack={() => navigate('/cart')}
                  backLabel={<span className="flex items-center gap-1.5"><ArrowLeft size={16} /> Ke Keranjang</span>}
                  onNext={() => setStep(2)}
                  nextLabel="Pilih Pengiriman"
                />
              </div>
            )}

            {/* STEP 2: Pengiriman */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1.5 font-jakarta">
                    <Truck size={22} className="text-green-700" /> Metode Pengiriman
                  </h2>
                  <p className="text-sm text-slate-500">Pilih kurir yang sesuai dengan kebutuhanmu</p>
                </div>
                
                <div className="flex flex-col gap-3">
                  {shippingOpts.map(opt => (
                    <ShipOpt key={opt.id} opt={opt} selected={form.shipping === opt.id} onSelect={v => set("shipping", v)} />
                  ))}
                </div>
                
                <NavBtns 
                  onBack={() => setStep(1)} 
                  backLabel="Ubah Alamat"
                  onNext={handleCheckout} 
                  isLast 
                  total={total}
                  submitting={submitting}
                />
              </div>
            )}
            
          </div>

          {/* ── RIGHT: SUMMARY ── */}
          <div className="w-full lg:w-[360px] shrink-0">
            <OrderSummary sub={sub} ship={ship} total={total} cart={cart} />
          </div>
          
        </div>
      </div>
    </div>
  );
}