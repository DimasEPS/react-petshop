import { useState } from "react";
import { Link } from "react-router-dom";

const statusConfig = {
  "Menunggu Pembayaran": { color: "#e67e22", bg: "#fef3e2", icon: "⏳" },
  "Dikonfirmasi": { color: "#2980b9", bg: "#eaf4fb", icon: "✅" },
  "Diproses": { color: "#8e44ad", bg: "#f5eef8", icon: "📦" },
  "Dikirim": { color: "#16a085", bg: "#e8f8f5", icon: "🚚" },
  "Selesai": { color: "#27ae60", bg: "#eafaf1", icon: "🎉" },
  "Dibatalkan": { color: "#c0392b", bg: "#fdedec", icon: "❌" },
};

const mockOrders = [
  {
    id: "PET-2024-001",
    date: "28 Apr 2024",
    status: "Selesai",
    items: [
      { name: "Royal Canin Adult Cat 2kg", qty: 2, price: 185000, img: "🐱" },
      { name: "Tali Leash Anjing Premium", qty: 1, price: 75000, img: "🐕" },
    ],
    shipping: 15000,
    payment: "QRIS",
  },
  {
    id: "PET-2024-002",
    date: "15 Apr 2024",
    status: "Dikirim",
    items: [
      { name: "Pasir Kucing Clumping 5kg", qty: 1, price: 65000, img: "🐾" },
    ],
    shipping: 12000,
    payment: "GoPay",
  },
  {
    id: "PET-2024-003",
    date: "10 Apr 2024",
    status: "Menunggu Pembayaran",
    items: [
      { name: "Vitamin C Kelinci 30ml", qty: 3, price: 45000, img: "🐰" },
    ],
    shipping: 15000,
    payment: "BCA Virtual Account",
  },
  {
    id: "PET-2024-004",
    date: "2 Mar 2024",
    status: "Dibatalkan",
    items: [
      { name: "Kandang Hamster Premium", qty: 1, price: 250000, img: "🐹" },
    ],
    shipping: 35000,
    payment: "OVO",
  },
];

const OrderHistoryPage = () => {
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allStatuses = ["Semua", ...Object.keys(statusConfig)];

  const filteredOrders = mockOrders.filter((order) => {
    const matchStatus = filterStatus === "Semua" || order.status === filterStatus;
    const matchSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const getTotal = (order) =>
    order.items.reduce((sum, item) => sum + item.price * item.qty, 0) + order.shipping;

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6ee", fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: "#2c1810", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/profile" style={{ color: "#f5c842", textDecoration: "none", fontSize: 14 }}>← Profil</Link>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 20, fontWeight: "bold" }}>🐾 Riwayat Pesanan</h1>
      </div>

      <div style={{ maxWidth: 860, margin: "32px auto", padding: "0 16px" }}>
        {/* Search & Filter */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 24, boxShadow: "0 2px 16px rgba(44,24,16,0.07)" }}>
          <input
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Cari berdasarkan nomor order atau nama produk..."
            style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e0d0bb", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none", marginBottom: 16 }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {allStatuses.map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{
                  padding: "7px 16px", borderRadius: 20, border: "2px solid",
                  borderColor: filterStatus === s ? "#2c1810" : "#e0d0bb",
                  background: filterStatus === s ? "#2c1810" : "#fff",
                  color: filterStatus === s ? "#fff" : "#555",
                  fontWeight: filterStatus === s ? "bold" : "normal",
                  cursor: "pointer", fontSize: 13
                }}>
                {s === "Semua" ? `Semua (${mockOrders.length})` : `${statusConfig[s]?.icon} ${s}`}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📭</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "#888" }}>Tidak ada pesanan ditemukan</div>
            <Link to="/products" style={{ display: "inline-block", marginTop: 16, background: "#2c1810", color: "#fff", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: "bold" }}>
              Belanja Sekarang
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const cfg = statusConfig[order.status];
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} style={{ background: "#fff", borderRadius: 12, marginBottom: 16, boxShadow: "0 2px 16px rgba(44,24,16,0.07)", overflow: "hidden", border: "1px solid #f0e0c8" }}>
                {/* Order Header */}
                <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: "bold", color: "#2c1810", fontSize: 15 }}>#{order.id}</div>
                    <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>🗓️ {order.date} • 💳 {order.payment}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      background: cfg.bg, color: cfg.color,
                      padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: "bold"
                    }}>
                      {cfg.icon} {order.status}
                    </span>
                    <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      style={{ background: "none", border: "1px solid #e0d0bb", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#555" }}>
                      {isExpanded ? "Sembunyikan ▲" : "Detail ▼"}
                    </button>
                  </div>
                </div>

                {/* Order Preview (always visible) */}
                <div style={{ padding: "0 24px 18px", display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {order.items.slice(0, 3).map((item, i) => (
                      <span key={i} style={{ fontSize: 28 }}>{item.img}</span>
                    ))}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: "#333" }}>
                      {order.items[0].name}{order.items.length > 1 ? ` +${order.items.length - 1} produk lainnya` : ""}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, color: "#888" }}>Total</div>
                    <div style={{ fontWeight: "bold", color: "#2c1810", fontSize: 16 }}>
                      Rp {getTotal(order).toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #f0e0c8", padding: "20px 24px", background: "#fdf6ee" }}>
                    <h4 style={{ margin: "0 0 12px", color: "#2c1810", fontSize: 14 }}>Detail Produk</h4>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid #f0e0c8" }}>
                        <span style={{ fontSize: 32 }}>{item.img}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "bold", color: "#2c1810", fontSize: 14 }}>{item.name}</div>
                          <div style={{ color: "#888", fontSize: 13 }}>x{item.qty} × Rp {item.price.toLocaleString("id-ID")}</div>
                        </div>
                        <div style={{ fontWeight: "bold", fontSize: 14 }}>Rp {(item.price * item.qty).toLocaleString("id-ID")}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, padding: "12px 0", borderTop: "1px solid #e0d0bb" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 6 }}>
                        <span>Ongkir</span><span>Rp {order.shipping.toLocaleString("id-ID")}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#2c1810", fontSize: 16 }}>
                        <span>Total Pembayaran</span><span>Rp {getTotal(order).toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                      {order.status === "Menunggu Pembayaran" && (
                        <button style={{ background: "#f5c842", color: "#2c1810", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13 }}>
                          💳 Bayar Sekarang
                        </button>
                      )}
                      {order.status === "Selesai" && (
                        <>
                          <button style={{ background: "#2c1810", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13 }}>
                            ⭐ Beri Ulasan
                          </button>
                          <button style={{ background: "#fff", color: "#2c1810", border: "2px solid #2c1810", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13 }}>
                            🔄 Beli Lagi
                          </button>
                        </>
                      )}
                      {order.status === "Dikirim" && (
                        <button style={{ background: "#16a085", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13 }}>
                          📍 Lacak Pesanan
                        </button>
                      )}
                      {order.status === "Menunggu Pembayaran" && (
                        <button style={{ background: "#fff", color: "#c0392b", border: "2px solid #c0392b", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13 }}>
                          ❌ Batalkan
                        </button>
                      )}
                      <button style={{ background: "#fff", color: "#555", border: "1px solid #e0d0bb", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                        📞 Hubungi CS
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;