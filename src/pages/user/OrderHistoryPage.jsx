import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ordersAPI, bookingAPI } from '../../services/api';
import { toast } from 'sonner';
import {
  PawPrint, Search, ChevronDown, ChevronUp, ArrowLeft,
  Clock, CheckCircle2, Package, Truck, XCircle,
  CreditCard, MapPin, Star, RefreshCw, Phone, ShoppingBag,
  CalendarDays, Inbox, ImageOff
} from "lucide-react";

/* ─── STATUS CONFIG ─────────────────────────────────────── */
const statusConfig = {
  "Menunggu Pembayaran": {
    bgClass: "bg-amber-100", textClass: "text-amber-700", borderClass: "border-amber-200",
    Icon: Clock
  },
  "Menunggu Konfirmasi": {
    bgClass: "bg-sky-100", textClass: "text-sky-700", borderClass: "border-sky-200",
    Icon: CheckCircle2
  },
  "Diproses": {
    bgClass: "bg-violet-100", textClass: "text-violet-700", borderClass: "border-violet-200",
    Icon: Package
  },
  "Dikirim": {
    bgClass: "bg-teal-100", textClass: "text-teal-700", borderClass: "border-teal-200",
    Icon: Truck
  },
  "Selesai": {
    bgClass: "bg-emerald-100", textClass: "text-emerald-700", borderClass: "border-emerald-200",
    Icon: CheckCircle2
  },
  "Dibatalkan": {
    bgClass: "bg-red-100", textClass: "text-red-700", borderClass: "border-red-200",
    Icon: XCircle
  },
};


const fmtPrice = (n) => `Rp ${n.toLocaleString("id-ID")}`;
const getTotal = (o) => o.items.reduce((s, i) => s + i.price * i.qty, 0) + o.shipping;

/* ─── ACTION BUTTONS ────────────────────────────────────── */
function ActionBtn({ label, icon: Icon, variant = "primary", colorClass, onClick }) {
  const styles = {
    primary: "bg-green-700 text-white hover:bg-green-800 hover:shadow-md hover:-translate-y-px transition-all",
    outline: `bg-white ${colorClass || "text-green-700"} border-2 ${colorClass ? "border-current" : "border-green-700"} hover:bg-slate-50 transition-all`,
    ghost: "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors",
    yellow: "bg-amber-400 text-slate-900 hover:bg-amber-500 hover:shadow-md hover:-translate-y-px transition-all",
  };
  const st = styles[variant] || styles.primary;
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap ${st}`}
    >
      {Icon && <Icon size={16} strokeWidth={2.2} />} {label}
    </button>
  );
}

/* ─── ORDER CARD ────────────────────────────────────────── */
function OrderCard({ order, expanded, onToggle, onPay, onCancel }) {
  const cfg = statusConfig[order.status];
  const StatusIcon = cfg.Icon;
  const total = getTotal(order);

  return (
    <div className={`bg-white rounded-2xl mb-4 border border-slate-200 overflow-hidden transition-all duration-300 ${
      expanded ? "shadow-lg shadow-slate-200/50" : "shadow-sm hover:shadow-md"
    }`}>
      {/* Top accent bar */}
      <div className={`h-1 w-full ${cfg.bgClass.replace('bg-', 'bg-gradient-to-r from-').replace('100', '400')} to-transparent`} />

      {/* Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-slate-900 text-base mb-1 truncate font-jakarta flex items-center gap-2">
            {order.items[0].name}
            {order.items.length > 1 && <span className="text-slate-500 font-medium text-xs bg-slate-100 px-2 py-0.5 rounded-full">+{order.items.length - 1} produk</span>}
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-slate-400" /> {order.date}</span>
            <span className="flex items-center gap-1.5"><CreditCard size={14} className="text-slate-400" /> {order.payment}</span>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}>
            <StatusIcon size={14} strokeWidth={2.5} /> {order.status}
          </span>
          {/* Toggle */}
          <button
            onClick={onToggle}
            className={`w-8 h-8 rounded-full border flex items-center justify-center text-slate-500 transition-colors ${
              expanded ? "bg-slate-100 border-slate-200" : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Preview row */}
      <div className="p-4 sm:p-5 flex items-center gap-4 cursor-pointer" onClick={onToggle}>
        {/* Images stack */}
        <div className="flex shrink-0">
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className={`w-12 h-12 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm ${i > 0 ? '-ml-3 sm:-ml-4' : ''} relative z-[${3-i}]`}>
              {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <ImageOff size={20} className="text-slate-400" />}
            </div>
          ))}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-700 truncate">
            Order ID: <span className="font-mono text-xs ml-1 text-slate-500">{order.id}</span>
          </div>
        </div>
        
        <div className="text-right shrink-0">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total</div>
          <div className="font-bold text-slate-900 text-base sm:text-lg font-jakarta">{fmtPrice(total)}</div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 sm:p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Package size={14} /> Rincian Produk
            </div>
            
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <ImageOff size={20} className="text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-sm mb-0.5">{item.name}</div>
                      <div className="text-slate-500 text-xs font-medium">{item.qty} × {fmtPrice(item.price)}</div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 text-sm sm:text-right w-full sm:w-auto text-right pr-2 sm:pr-0">
                    {fmtPrice(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="mt-5 pt-4 border-t border-slate-200 border-dashed">
              <div className="flex justify-between items-center text-sm text-slate-500 mb-3 px-1">
                <span className="flex items-center gap-1.5"><Truck size={14} /> Ongkos Kirim</span>
                <span className="font-medium text-slate-700">{fmtPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <span className="font-bold text-sm text-slate-900">Total Pembayaran</span>
                <span className="font-bold text-xl text-green-700 font-jakarta">{fmtPrice(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2.5 mt-5">
              {order.status === "Menunggu Pembayaran" && (
                <>
                  <ActionBtn label="Bayar Sekarang" icon={CreditCard} variant="yellow" onClick={onPay} />
                  <ActionBtn label="Batalkan" icon={XCircle} variant="danger" onClick={onCancel} />
                </>
              )}
              {order.status === "Selesai" && (
                <>
                  <ActionBtn label="Beri Ulasan" icon={Star} variant="primary" />
                  <ActionBtn label="Beli Lagi" icon={RefreshCw} variant="outline" />
                </>
              )}
              {order.status === "Dikirim" && (
                <ActionBtn label="Lacak Pesanan" icon={MapPin} colorClass="text-teal-700" variant="outline" />
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [ordersRes, bookingsRes] = await Promise.all([
        ordersAPI.getAll().catch(() => ({ data: { success: false } })),
        bookingAPI.getAll().catch(() => ({ data: { success: false } }))
      ]);

      const allData = [];

      if (ordersRes.data && ordersRes.data.success) {
        const mappedOrders = ordersRes.data.data.map(o => ({
          type: 'order',
          id: o._id,
          midtransToken: o.midtransToken,
          rawDate: new Date(o.createdAt),
          date: new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: o.status === 'pending' ? 'Menunggu Pembayaran' :
            o.status === 'confirmed' ? 'Menunggu Konfirmasi' :
              o.status === 'processing' ? 'Diproses' :
                o.status === 'shipped' ? 'Dikirim' :
                  o.status === 'completed' ? 'Selesai' :
                    o.status === 'cancelled' ? 'Dibatalkan' : 'Diproses',
          items: o.items.map(i => ({
            name: i.title || 'Produk',
            qty: i.qty,
            price: i.price,
            image: i.image || ''
          })),
          shipping: o.shippingCost || 0,
          payment: o.paymentMethod || 'Midtrans',
        }));
        allData.push(...mappedOrders);
      }

      if (bookingsRes.data && bookingsRes.data.success) {
        const mappedBookings = bookingsRes.data.data.map(b => ({
          type: 'booking',
          id: b._id,
          midtransToken: b.midtransToken,
          rawDate: new Date(b.createdAt),
          date: new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: b.status === 'pending' ? 'Menunggu Pembayaran' :
            b.status === 'confirmed' ? 'Menunggu Konfirmasi' :
              b.status === 'completed' ? 'Selesai' :
                b.status === 'cancelled' ? 'Dibatalkan' : 'Menunggu Konfirmasi',
          items: [{
            name: `Layanan: ${b.service} - ${b.petName} (${b.petType})`,
            qty: 1,
            price: b.price || 0,
            image: '' 
          }],
          shipping: 0,
          payment: 'Midtrans',
        }));
        allData.push(...mappedBookings);
      }

      allData.sort((a, b) => b.rawDate - a.rawDate);
      setOrders(allData);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePay = (order) => {
    if (order.midtransToken && window.snap) {
      window.snap.pay(order.midtransToken, {
        onSuccess: () => fetchOrders(),
        onPending: () => {
          toast.info("Pembayaran menunggu konfirmasi.");
          fetchOrders();
        },
        onError: () => {
          toast.error("Pembayaran gagal atau kadaluarsa.");
          fetchOrders();
        },
        onClose: () => fetchOrders()
      });
    } else {
      toast.error("Sistem pembayaran belum siap atau token tidak ditemukan.");
    }
  };

  const handleCancel = async (orderId, type) => {
    if (window.confirm("Yakin ingin membatalkan transaksi ini?")) {
      try {
        const res = type === 'booking' ? await bookingAPI.cancel(orderId) : await ordersAPI.cancel(orderId);
        if (res.data.success) {
          toast.success("Pesanan berhasil dibatalkan.");
          fetchOrders();
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Gagal membatalkan pesanan.");
      }
    }
  };

  const allStatuses = ["Semua", ...Object.keys(statusConfig)];

  const filteredOrders = orders.filter(o => {
    const matchStatus = filterStatus === "Semua" || o.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.items.some(i => i.name.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-jakarta pb-24">

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-green-800 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Riwayat Pesanan</h1>
              <span className="text-sm font-medium text-white/70">{orders.length} transaksi tercatat</span>
            </div>
          </div>
          <Link to="/profile" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/20 w-max">
            <ArrowLeft size={16} /> Kembali ke Profil
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">

        {/* ── SEARCH & FILTER ── */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
          {/* Search input */}
          <div className="relative mb-5">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nomor order atau nama produk..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none text-slate-900 focus:border-green-600 focus:bg-white transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {allStatuses.map(s => {
              const active = filterStatus === s;
              const cfg = statusConfig[s];
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                    active 
                      ? `${cfg?.bgClass || 'bg-green-100'} ${cfg?.textClass || 'text-green-800'} border-transparent font-bold shadow-sm` 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 font-medium'
                  }`}
                >
                  {s === "Semua" ? (
                    <><PawPrint size={12} className={active ? '' : 'text-slate-400'} /> Semua ({orders.length})</>
                  ) : (
                    <><cfg.Icon size={12} strokeWidth={active ? 2.5 : 2} className={active ? '' : 'text-slate-400'} /> {s}</>
                  )}
                </button>
              );
            })}

          </div>
        </div>

        {/* ── ORDERS LIST ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium text-sm">Memuat riwayat pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 sm:p-16 border border-slate-200 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300">
              <Inbox size={40} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-2 font-jakarta">Tidak ada pesanan</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">
              Kamu belum memiliki pesanan dengan status ini atau kata kunci tidak ditemukan.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5">
              <ShoppingBag size={18} /> Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedId === order.id}
                onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
                onPay={() => handlePay(order)}
                onCancel={() => handleCancel(order.id, order.type)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;