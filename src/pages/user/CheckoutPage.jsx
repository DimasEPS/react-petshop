import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import { ordersAPI } from '../../services/api';
import {
  ArrowLeft, ChevronRight, CheckCircle2, MapPin, Truck,
  CreditCard, ShieldCheck, Package, User, Phone, Home,
  Building2, Map, Hash, Clock, Zap, Check, PawPrint,
  Lock, ImageOff, QrCode, Landmark, Wallet, WalletCards
} from "lucide-react";

const shippingOpts = [
  { id: "jne-reg", label: "JNE Regular", sub: "Estimasi 3–5 hari kerja", price: 15000, Icon: Package },
  { id: "jne-yes", label: "JNE YES — Next Day", sub: "Estimasi 1 hari kerja", price: 35000, Icon: Zap, badge: "Tercepat" },
  { id: "sicepat", label: "SiCepat BEST", sub: "Estimasi 2–3 hari kerja", price: 12000, Icon: Truck, badge: "Termurah" },
];

const paymentOpts = [
  { id: "qris", label: "QRIS", sub: "Scan & bayar instan", Icon: QrCode },
  { id: "bca-va", label: "BCA Virtual Account", sub: "Transfer via BCA", Icon: Landmark },
  { id: "gopay", label: "GoPay", sub: "via Midtrans", Icon: Wallet },
  { id: "ovo", label: "OVO", sub: "via Midtrans", Icon: WalletCards },
];

const fmtPrice = (n) => `Rp ${n.toLocaleString("id-ID")}`;

/* ─── STEP INDICATOR ────────────────────────────────────── */
const STEPS = [
  { label: "Alamat", Icon: MapPin },
  { label: "Pengiriman", Icon: Truck },
  { label: "Pembayaran", Icon: CreditCard },
];

function StepBar({ step }) {
  return (
    <div style={{ background: "rgba(255,255,255,.06)", borderTop: "1px solid rgba(255,255,255,.08)" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center" }}>
        {STEPS.map(({ label, Icon }, i) => {
          const done = step > i + 1;
          const active = step === i + 1;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? "#a8e6c3" : active ? "#fff" : "rgba(255,255,255,.08)",
                  border: active ? "none" : done ? "none" : "1px solid rgba(255,255,255,.15)",
                  transition: "all .3s",
                }}>
                  {done
                    ? <Check size={16} color="#1a5c38" strokeWidth={2.5} />
                    : <Icon size={15} color={active ? "#1a5c38" : "rgba(255,255,255,.35)"} strokeWidth={active ? 2.2 : 1.8} />
                  }
                </div>
                <span style={{
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? "#fff" : done ? "#a8e6c3" : "rgba(255,255,255,.4)",
                  display: window.innerWidth < 500 ? "none" : "inline",
                }}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div style={{ flex: 1, height: 1, margin: "0 12px", background: done ? "#a8e6c3" : "rgba(255,255,255,.12)", borderRadius: 1, transition: "background .4s" }} />
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
  const [focus, setFocus] = useState(false);
  const style = {
    width: "100%", padding: "11px 14px",
    border: `1.5px solid ${focus ? "#2d7a4f" : "#e5e7eb"}`,
    borderRadius: 10, fontSize: 14, boxSizing: "border-box",
    outline: "none", fontFamily: "inherit", color: "#1a1a2e",
    background: "#fff", transition: "border .2s",
    resize: as === "textarea" ? "vertical" : undefined,
  };
  return as === "textarea"
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows || 3} style={style} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
    : <input value={value} onChange={onChange} placeholder={placeholder} style={style} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />;
}

/* ─── FIELD ─────────────────────────────────────────────── */
function Field({ label, icon: Icon, full, children }) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : {}}>
      <label style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8, fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".6px" }}>
        {Icon && <Icon size={11} color="#2d7a4f" />} {label}
      </label>
      {children}
    </div>
  );
}

/* ─── SHIPPING OPTION ───────────────────────────────────── */
function ShipOpt({ opt, selected, onSelect }) {
  const [hov, setHov] = useState(false);
  const { Icon } = opt;
  return (
    <div
      onClick={() => onSelect(opt.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "16px 18px", borderRadius: 12, cursor: "pointer",
        border: `2px solid ${selected ? "#2d7a4f" : hov ? "#d1d5db" : "#e5e7eb"}`,
        background: selected ? "linear-gradient(135deg,#f0fdf4,#e8f5ee)" : hov ? "#f9fafb" : "#fff",
        transition: "all .2s", position: "relative",
      }}
    >
      {opt.badge && (
        <span style={{
          position: "absolute", top: -8, right: 14,
          background: opt.id === "jne-yes" ? "#1a5c38" : "#2d7a4f",
          color: "#fff", fontSize: 10, fontWeight: 700,
          padding: "2px 8px", borderRadius: 20, letterSpacing: ".3px",
        }}>{opt.badge}</span>
      )}
      {/* Radio */}
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected ? "#2d7a4f" : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border .2s" }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2d7a4f" }} />}
      </div>
      {/* Icon */}
      <div style={{ width: 40, height: 40, borderRadius: 10, background: selected ? "#dcfce7" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .2s" }}>
        <Icon size={18} color={selected ? "#2d7a4f" : "#9ca3af"} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e", marginBottom: 2 }}>{opt.label}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
          <Clock size={10} /> {opt.sub}
        </div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, color: selected ? "#2d7a4f" : "#374151", flexShrink: 0 }}>{fmtPrice(opt.price)}</div>
    </div>
  );
}

/* ─── PAYMENT OPTION ────────────────────────────────────── */
function PayOpt({ opt, selected, onSelect }) {
  const [hov, setHov] = useState(false);
  const { Icon } = opt;
  return (
    <div
      onClick={() => onSelect(opt.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px", borderRadius: 12, cursor: "pointer",
        border: `2px solid ${selected ? "#2d7a4f" : hov ? "#d1d5db" : "#e5e7eb"}`,
        background: selected ? "linear-gradient(135deg,#f0fdf4,#e8f5ee)" : hov ? "#f9fafb" : "#fff",
        transition: "all .2s",
      }}
    >
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? "#2d7a4f" : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {selected && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#2d7a4f" }} />}
      </div>
      <Icon size={24} color="#1a1a2e" strokeWidth={1.5} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{opt.label}</div>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>{opt.sub}</div>
      </div>
      {selected && <CheckCircle2 size={16} color="#2d7a4f" />}
    </div>
  );
}

/* ─── NAV BUTTONS ───────────────────────────────────────── */
function NavBtns({ onBack, backLabel = "Kembali", onNext, nextLabel, isLast, total }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 28, paddingTop: 24, borderTop: "1px solid #f3f4f6" }}>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "12px 20px", border: "1.5px solid #e5e7eb",
        borderRadius: 10, background: "#fff", color: "#6b7280",
        fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        transition: "all .2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#1a5c38"; e.currentTarget.style.color = "#1a5c38"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}
      >
        <ArrowLeft size={15} /> {backLabel}
      </button>
      <button onClick={onNext}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "13px", border: "none", borderRadius: 10,
          background: isLast
            ? (hov ? "#fbbf24" : "linear-gradient(135deg,#f59e0b,#fbbf24)")
            : (hov ? "#1a5c38" : "linear-gradient(135deg,#1a5c38,#2d7a4f)"),
          color: isLast ? "#1a1a2e" : "#fff",
          fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          boxShadow: isLast
            ? (hov ? "0 8px 24px rgba(251,191,36,.4)" : "0 4px 14px rgba(245,158,11,.25)")
            : (hov ? "0 8px 24px rgba(26,92,56,.35)" : "0 4px 14px rgba(26,92,56,.2)"),
          transform: hov ? "translateY(-1px)" : "none",
          transition: "all .2s",
        }}
      >
        {isLast ? <Lock size={16} /> : null}
        {isLast ? `Bayar ${fmtPrice(total)}` : nextLabel}
        {!isLast && <ChevronRight size={16} />}
      </button>
    </div>
  );
}

/* ─── ORDER SUMMARY ─────────────────────────────────────── */
function OrderSummary({ sub, ship, total, cart }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 28, border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,.04)", position: "sticky", top: 24 }}>
      <h3 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 18, fontWeight: 800, color: "#1a1a2e", margin: "0 0 20px", paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
        Ringkasan Pesanan
      </h3>

      {cart.map(item => {
        const p = item.productId;
        if (!p) return null;
        return (
          <div key={item._id} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, background: "#f3f4f6", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, overflow: 'hidden' }}>
              {p.image ? (
                <img src={p.image} alt={p.title || p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageOff size={24} color="#9ca3af" />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", lineHeight: 1.4, marginBottom: 2 }}>{p.title || p.name}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Qty: {item.qty}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", flexShrink: 0, paddingLeft: 8 }}>{fmtPrice(p.price * item.qty)}</div>
          </div>
        );
      })}

      <div style={{ height: 1, background: "#f3f4f6", margin: "16px 0" }} />

      {[
        { label: "Subtotal", value: fmtPrice(sub) },
        { label: "Ongkos Kirim", value: ship ? fmtPrice(ship.price) : "—" },
      ].map(r => (
        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
          <span>{r.label}</span><span>{r.value}</span>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginTop: 14, paddingTop: 14, borderTop: "2px solid #1a1a2e", fontFamily: "'Quicksand', sans-serif" }}>
        <span>Total</span>
        <span style={{ color: "#2d7a4f" }}>{fmtPrice(total)}</span>
      </div>

      {/* Security badge */}
      <div style={{ marginTop: 18, background: "#f0fdf4", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #bbf7d0" }}>
        <ShieldCheck size={16} color="#2d7a4f" flexShrink={0} />
        <p style={{ fontSize: 11, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
          Transaksi diamankan oleh <strong style={{ color: "#1a5c38" }}>Midtrans SSL</strong>. Data kamu terenkripsi end-to-end.
        </p>
      </div>
    </div>
  );
}

const CheckoutPage = () => {
  const { cart, cartSubtotal } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", phone: "", address: "", city: "", province: "",
    postalCode: "", shipping: "jne-reg", payment: "qris",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const sub = cartSubtotal;
  const ship = shippingOpts.find(s => s.id === form.shipping);
  const total = sub + (ship?.price || 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Nunito', sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg,#1a5c38,#2d7a4f)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "18px 24px" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontSize: 12, color: "rgba(255,255,255,.5)" }}>
            <Link to="/" style={{ color: "#a8e6c3", textDecoration: "none", fontWeight: 600 }}>Beranda</Link>
            <ChevronRight size={12} />
            <Link to="/cart" style={{ color: "#a8e6c3", textDecoration: "none", fontWeight: 600 }}>Keranjang</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#fff" }}>Checkout</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PawPrint size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Quicksand', sans-serif", color: "#fff", margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-.02em" }}>Checkout</h1>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}>{cart.length} produk · {fmtPrice(total)}</span>
            </div>
          </div>
        </div>
        <StepBar step={step} />
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1060, margin: "28px auto", padding: "0 20px 60px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

        {/* ── LEFT PANEL ── */}
        <div>

          {/* STEP 1: Alamat */}
          {step === 1 && (
            <div style={{ background: "#fff", borderRadius: 18, padding: 32, border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={20} color="#2d7a4f" /> Alamat Pengiriman
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>Pastikan alamat sudah benar sebelum melanjutkan</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Nama Lengkap" icon={User}>
                  <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Nama penerima" />
                </Field>
                <Field label="No. Telepon" icon={Phone}>
                  <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+62 8xx xxxx xxxx" />
                </Field>
                <Field label="Alamat Lengkap" icon={Home} full>
                  <Input as="textarea" value={form.address} onChange={e => set("address", e.target.value)} placeholder="Nama jalan, blok, no. rumah, RT/RW..." rows={3} />
                </Field>
                <Field label="Kota" icon={Building2}>
                  <Input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Bandar Lampung" />
                </Field>
                <Field label="Provinsi" icon={Map}>
                  <Input value={form.province} onChange={e => set("province", e.target.value)} placeholder="Lampung" />
                </Field>
                <Field label="Kode Pos" icon={Hash}>
                  <Input value={form.postalCode} onChange={e => set("postalCode", e.target.value)} placeholder="35111" />
                </Field>
              </div>
              <NavBtns
                onBack={() => { }}
                backLabel={<Link to="/cart" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 6 }}><ArrowLeft size={15} /> Keranjang</Link>}
                onNext={() => setStep(2)}
                nextLabel="Pilih Pengiriman"
              />
            </div>
          )}

          {/* STEP 2: Pengiriman */}
          {step === 2 && (
            <div style={{ background: "#fff", borderRadius: 18, padding: 32, border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Truck size={20} color="#2d7a4f" /> Metode Pengiriman
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>Pilih kurir yang sesuai dengan kebutuhanmu</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {shippingOpts.map(opt => (
                  <ShipOpt key={opt.id} opt={opt} selected={form.shipping === opt.id} onSelect={v => set("shipping", v)} />
                ))}
              </div>
              <NavBtns onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Pilih Pembayaran" />
            </div>
          )}

          {/* STEP 3: Pembayaran */}
          {step === 3 && (
            <div style={{ background: "#fff", borderRadius: 18, padding: 32, border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
                  <CreditCard size={20} color="#2d7a4f" /> Metode Pembayaran
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>Transaksi aman menggunakan Midtrans</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {paymentOpts.map(opt => (
                  <PayOpt key={opt.id} opt={opt} selected={form.payment === opt.id} onSelect={v => set("payment", v)} />
                ))}
              </div>
              <NavBtns
                onBack={() => setStep(2)}
                onNext={async () => {
                  try {
                    const reqBody = {
                      items: cart.map(item => ({
                        productId: item.productId._id,
                        qty: item.qty,
                        price: item.productId.price
                      })),
                      totalAmount: total,
                      paymentMethod: form.payment,
                      shippingAddress: {
                        name: form.name,
                        phone: form.phone,
                        street: form.address,
                        city: form.city,
                        province: form.province,
                        postalCode: form.postalCode
                      }
                    };
                    const res = await ordersAPI.create(reqBody);
                    if (res.data.success) {
                      alert('Pesanan berhasil dibuat! ID: ' + res.data.data._id);
                      window.location.href = '/orders'; // Navigate to orders page
                    } else {
                      alert('Gagal: ' + res.data.message);
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Terjadi kesalahan sistem');
                  }
                }}
                isLast
                total={total}
              />
            </div>
          )}
        </div>

        {/* ── RIGHT: SUMMARY ── */}
        <OrderSummary sub={sub} ship={ship} total={total} cart={cart} />
      </div>
    </div>
  );
};

export default CheckoutPage;