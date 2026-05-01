import { useState } from "react";
import { Link } from "react-router-dom";
import {
  PawPrint, Search, ChevronDown, ChevronUp, ArrowLeft,
  Clock, CheckCircle2, Package, Truck, PartyPopper, XCircle,
  CreditCard, MapPin, Star, RefreshCw, Phone, ShoppingBag,
  CalendarDays, Inbox
} from "lucide-react";

/* ─── STATUS CONFIG ─────────────────────────────────────── */
const statusConfig = {
  "Menunggu Pembayaran": {
    color: "#b45309", bg: "#fef3c7", border: "#fde68a",
    Icon: Clock, gradient: "linear-gradient(135deg,#fef3c7,#fde68a)"
  },
  "Dikonfirmasi": {
    color: "#0369a1", bg: "#e0f2fe", border: "#bae6fd",
    Icon: CheckCircle2, gradient: "linear-gradient(135deg,#e0f2fe,#bae6fd)"
  },
  "Diproses": {
    color: "#7c3aed", bg: "#ede9fe", border: "#ddd6fe",
    Icon: Package, gradient: "linear-gradient(135deg,#ede9fe,#ddd6fe)"
  },
  "Dikirim": {
    color: "#0f766e", bg: "#ccfbf1", border: "#99f6e4",
    Icon: Truck, gradient: "linear-gradient(135deg,#ccfbf1,#99f6e4)"
  },
  "Selesai": {
    color: "#15803d", bg: "#dcfce7", border: "#bbf7d0",
    Icon: CheckCircle2, gradient: "linear-gradient(135deg,#dcfce7,#bbf7d0)"
  },
  "Dibatalkan": {
    color: "#b91c1c", bg: "#fee2e2", border: "#fecaca",
    Icon: XCircle, gradient: "linear-gradient(135deg,#fee2e2,#fecaca)"
  },
};

/* ─── MOCK DATA ─────────────────────────────────────────── */
const mockOrders = [
  {
    id: "PET-2024-001", date: "28 Apr 2024", status: "Selesai",
    items: [
      { name: "Royal Canin Adult Cat 2kg", qty: 2, price: 185000, emoji: "🐱" },
      { name: "Tali Leash Anjing Premium", qty: 1, price: 75000, emoji: "🐕" },
    ],
    shipping: 15000, payment: "QRIS",
  },
  {
    id: "PET-2024-002", date: "15 Apr 2024", status: "Dikirim",
    items: [
      { name: "Pasir Kucing Clumping 5kg", qty: 1, price: 65000, emoji: "🐾" },
    ],
    shipping: 12000, payment: "GoPay",
  },
  {
    id: "PET-2024-003", date: "10 Apr 2024", status: "Menunggu Pembayaran",
    items: [
      { name: "Vitamin C Kelinci 30ml", qty: 3, price: 45000, emoji: "🐰" },
    ],
    shipping: 15000, payment: "BCA Virtual Account",
  },
  {
    id: "PET-2024-004", date: "2 Mar 2024", status: "Dibatalkan",
    items: [
      { name: "Kandang Hamster Premium", qty: 1, price: 250000, emoji: "🐹" },
    ],
    shipping: 35000, payment: "OVO",
  },
];

const fmtPrice = (n) => `Rp ${n.toLocaleString("id-ID")}`;
const getTotal = (o) => o.items.reduce((s, i) => s + i.price * i.qty, 0) + o.shipping;

/* ─── ACTION BUTTONS ────────────────────────────────────── */
function ActionBtn({ label, icon: Icon, variant = "primary", color, onClick }) {
  const [hov, setHov] = useState(false);
  const styles = {
    primary: {
      bg: hov ? "#1a5c38" : "#2d7a4f", color: "#fff", border: "none",
      shadow: hov ? "0 6px 20px rgba(26,92,56,.3)" : "0 2px 8px rgba(26,92,56,.15)",
    },
    outline: {
      bg: hov ? "#f9fafb" : "#fff", color: color || "#2d7a4f",
      border: `1.5px solid ${color || "#2d7a4f"}`,
      shadow: hov ? "0 4px 12px rgba(0,0,0,.06)" : "none",
    },
    ghost: {
      bg: hov ? "#f3f4f6" : "#fff", color: "#6b7280",
      border: "1px solid #e5e7eb", shadow: "none",
    },
    danger: {
      bg: hov ? "#fee2e2" : "#fff", color: "#b91c1c",
      border: "1.5px solid #fecaca", shadow: "none",
    },
    yellow: {
      bg: hov ? "#fcd34d" : "#fbbf24", color: "#1a1a2e",
      border: "none", shadow: hov ? "0 6px 16px rgba(251,191,36,.4)" : "none",
    },
  };
  const st = styles[variant] || styles.primary;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "9px 16px", borderRadius: 10, cursor: "pointer",
        fontWeight: 700, fontSize: 13, fontFamily: "inherit",
        background: st.bg, color: st.color,
        border: st.border || "none",
        boxShadow: st.shadow,
        transform: hov ? "translateY(-1px)" : "none",
        transition: "all .2s",
        whiteSpace: "nowrap",
      }}
    >
      {Icon && <Icon size={14} strokeWidth={2.2} />} {label}
    </button>
  );
}

/* ─── ORDER CARD ────────────────────────────────────────── */
function OrderCard({ order, expanded, onToggle }) {
  const cfg = statusConfig[order.status];
  const StatusIcon = cfg.Icon;
  const total = getTotal(order);

  return (
    <div style={{
      background: "#fff", borderRadius: 18, marginBottom: 14,
      border: "1px solid #e5e7eb",
      boxShadow: expanded ? "0 8px 32px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
      overflow: "hidden", transition: "box-shadow .25s",
    }}>
      {/* Top accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg,${cfg.color},${cfg.color}88)` }} />

      {/* Header */}
      <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 800, color: "#1a1a2e", fontSize: 15, marginBottom: 4 }}>
            #{order.id}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#9ca3af" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CalendarDays size={11} /> {order.date}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CreditCard size={11} /> {order.payment}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Status badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: cfg.bg, color: cfg.color,
            border: `1.5px solid ${cfg.border}`,
            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
          }}>
            <StatusIcon size={12} strokeWidth={2.5} /> {order.status}
          </span>
          {/* Toggle */}
          <button
            onClick={onToggle}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: "50%",
              background: expanded ? "#f3f4f6" : "#fff",
              border: "1.5px solid #e5e7eb", cursor: "pointer",
              color: "#6b7280", transition: "all .2s",
            }}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Preview row */}
      <div style={{ padding: "0 22px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        {/* Emoji stack */}
        <div style={{ display: "flex" }}>
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} style={{
              width: 42, height: 42, borderRadius: 10,
              background: "#f3f4f6", border: "2px solid #fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, marginLeft: i > 0 ? -10 : 0,
              boxShadow: "0 2px 6px rgba(0,0,0,.08)",
            }}>
              {item.emoji}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {order.items[0].name}
            {order.items.length > 1 && <span style={{ color: "#9ca3af", fontWeight: 500 }}> +{order.items.length - 1} produk</span>}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>Total</div>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 800, color: "#1a1a2e", fontSize: 16 }}>{fmtPrice(total)}</div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: "1px solid #f3f4f6", background: "#f9fafb" }}>
          <div style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 12 }}>
              Rincian Produk
            </div>
            {order.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 0",
                borderBottom: i < order.items.length - 1 ? "1px solid #e5e7eb" : "none",
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#fff", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {item.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 14, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ color: "#9ca3af", fontSize: 12 }}>{item.qty} × {fmtPrice(item.price)}</div>
                </div>
                <div style={{ fontWeight: 800, color: "#1a1a2e", fontSize: 14, flexShrink: 0 }}>
                  {fmtPrice(item.price * item.qty)}
                </div>
              </div>
            ))}

            {/* Total breakdown */}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Truck size={12} /> Ongkos Kirim</span>
                <span>{fmtPrice(order.shipping)}</span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#fff", borderRadius: 10, padding: "12px 16px",
                border: "1px solid #e5e7eb",
              }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>Total Pembayaran</span>
                <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 800, fontSize: 18, color: "#2d7a4f" }}>{fmtPrice(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {order.status === "Menunggu Pembayaran" && (
                <>
                  <ActionBtn label="Bayar Sekarang" icon={CreditCard} variant="yellow" />
                  <ActionBtn label="Batalkan" icon={XCircle} variant="danger" />
                </>
              )}
              {order.status === "Selesai" && (
                <>
                  <ActionBtn label="Beri Ulasan" icon={Star} variant="primary" />
                  <ActionBtn label="Beli Lagi" icon={RefreshCw} variant="outline" />
                </>
              )}
              {order.status === "Dikirim" && (
                <ActionBtn label="Lacak Pesanan" icon={MapPin} color="#0f766e" variant="outline" />
              )}
              <ActionBtn label="Hubungi CS" icon={Phone} variant="ghost" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
const OrderHistoryPage = () => {
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);

  const allStatuses = ["Semua", ...Object.keys(statusConfig)];

  const filteredOrders = mockOrders.filter(o => {
    const matchStatus = filterStatus === "Semua" || o.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.items.some(i => i.name.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Nunito', sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg,#1a5c38,#2d7a4f)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/profile" style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "rgba(255,255,255,.8)", textDecoration: "none",
            fontSize: 13, fontWeight: 600,
            background: "rgba(255,255,255,.1)", padding: "6px 12px",
            borderRadius: 20, border: "1px solid rgba(255,255,255,.2)",
          }}>
            <ArrowLeft size={14} /> Profil
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShoppingBag size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Quicksand', sans-serif", color: "#fff", margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: "-.02em" }}>Riwayat Pesanan</h1>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>{mockOrders.length} transaksi</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "28px auto", padding: "0 20px 48px" }}>

        {/* ── SEARCH & FILTER ── */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 20, marginBottom: 20, border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          {/* Search input */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <Search size={16} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholder="Cari nomor order atau nama produk..."
              style={{
                width: "100%", padding: "11px 14px 11px 40px",
                border: `1.5px solid ${searchFocus ? "#2d7a4f" : "#e5e7eb"}`,
                borderRadius: 12, fontSize: 14, boxSizing: "border-box",
                outline: "none", fontFamily: "inherit", color: "#1a1a2e",
                background: "#f9fafb", transition: "border .2s",
              }}
            />
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {allStatuses.map(s => {
              const active = filterStatus === s;
              const cfg = statusConfig[s];
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "6px 14px", borderRadius: 20,
                    border: `1.5px solid ${active ? (cfg?.color || "#1a5c38") : "#e5e7eb"}`,
                    background: active ? (cfg?.bg || "#e8f5ee") : "#fff",
                    color: active ? (cfg?.color || "#1a5c38") : "#6b7280",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer", fontSize: 12,
                    fontFamily: "inherit", transition: "all .2s",
                  }}
                >
                  {s === "Semua"
                    ? <><PawPrint size={11} /> Semua ({mockOrders.length})</>
                    : <><cfg.Icon size={11} strokeWidth={2.5} /> {s}</>
                  }
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ORDERS LIST ── */}
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 18, border: "1px solid #e5e7eb" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Inbox size={32} color="#d1d5db" />
            </div>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginBottom: 6 }}>Tidak ada pesanan</div>
            <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>Coba ubah filter atau kata kunci pencarian</div>
            <Link to="/products" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#2d7a4f", color: "#fff",
              padding: "12px 24px", borderRadius: 12, textDecoration: "none",
              fontWeight: 700, fontSize: 14,
            }}>
              <ShoppingBag size={16} /> Belanja Sekarang
            </Link>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              expanded={expandedId === order.id}
              onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;