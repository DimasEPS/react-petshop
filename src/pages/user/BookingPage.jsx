import { useState } from "react";
import { Link } from "react-router-dom";
import { bookingAPI } from '../../services/api';
import {
  Cat, Dog, Rabbit, Scissors, Sparkles, Bath, Star,
  Clock, ChevronRight, ChevronLeft, CheckCircle2,
  CalendarDays, User, Phone, Weight, Info, PawPrint,
  ShieldCheck, ArrowLeft
} from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────── */
const services = [
  {
    id: "basic-cat", label: "Grooming Kucing Basic", price: 75000,
    duration: "60 menit", Icon: Cat, accentColor: "#2d7a4f",
    desc: "Mandi, sisir, potong kuku", tag: "Populer",
    gradient: "linear-gradient(135deg,#e8f5ee,#d1edd9)"
  },
  {
    id: "full-cat", label: "Grooming Kucing Full", price: 150000,
    duration: "120 menit", Icon: Cat, accentColor: "#0369a1",
    desc: "Basic + gunting bulu & parfum", tag: "Lengkap",
    gradient: "linear-gradient(135deg,#e0f2fe,#bae6fd)"
  },
  {
    id: "basic-dog", label: "Grooming Anjing Basic", price: 85000,
    duration: "60 menit", Icon: Dog, accentColor: "#b45309",
    desc: "Mandi, sisir, potong kuku", tag: "Hemat",
    gradient: "linear-gradient(135deg,#fef3c7,#fde68a)"
  },
  {
    id: "full-dog", label: "Grooming Anjing Full", price: 175000,
    duration: "150 menit", Icon: Dog, accentColor: "#7c3aed",
    desc: "Basic + gunting bulu & parfum", tag: "Rekomendasi",
    gradient: "linear-gradient(135deg,#ede9fe,#ddd6fe)"
  },
  {
    id: "spa-cat", label: "Spa Kucing Premium", price: 200000,
    duration: "90 menit", Icon: Star, accentColor: "#be185d",
    desc: "Full grooming + masker bulu + vitamin", tag: "Premium",
    gradient: "linear-gradient(135deg,#fce7f3,#fbcfe8)"
  },
  {
    id: "spa-dog", label: "Spa Anjing Premium", price: 250000,
    duration: "120 menit", Icon: Sparkles, accentColor: "#c2410c",
    desc: "Full grooming + masker bulu + vitamin", tag: "Luxury",
    gradient: "linear-gradient(135deg,#ffedd5,#fed7aa)"
  },
];

const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const bookedSlots = ["10:00", "14:00"];

const getNextDays = (n) => {
  const days = [];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const today = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      value: d.toISOString().split("T")[0],
      dayName: dayNames[d.getDay()],
      date: d.getDate(),
      month: monthNames[d.getMonth()],
      disabled: d.getDay() === 0,
    });
  }
  return days;
};

const fmtPrice = (n) => `Rp ${n.toLocaleString("id-ID")}`;

/* ─── STEP INDICATOR ────────────────────────────────────── */
const STEPS = ["Layanan", "Jadwal", "Data Hewan", "Konfirmasi"];

function StepIndicator({ step }) {
  return (
    <div style={{
      background: "#fff", borderBottom: "1px solid #e5e7eb",
      padding: "20px 0",
    }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center" }}>
        {STEPS.map((s, i) => {
          const done = step > i + 1;
          const active = step === i + 1;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: done ? "#2d7a4f" : active ? "#1a5c38" : "#f3f4f6",
                  color: done || active ? "#fff" : "#9ca3af",
                  fontWeight: 700, fontSize: 13,
                  border: active ? "3px solid #a8e6c3" : "none",
                  boxShadow: active ? "0 0 0 4px rgba(45,122,79,0.12)" : "none",
                  transition: "all .3s",
                }}>
                  {done ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? "#1a5c38" : done ? "#2d7a4f" : "#9ca3af",
                  display: window.innerWidth < 480 ? "none" : "inline",
                }}>
                  {s}
                </span>
              </div>
              {i < 3 && (
                <div style={{
                  flex: 1, height: 2, margin: "0 12px",
                  background: done ? "#2d7a4f" : "#e5e7eb",
                  transition: "background .4s",
                  borderRadius: 2,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── SERVICE CARD ──────────────────────────────────────── */
function ServiceCard({ svc, selected, onSelect }) {
  const [hov, setHov] = useState(false);
  const { Icon } = svc;
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected ? svc.gradient : "#fff",
        borderRadius: 16, padding: 22, cursor: "pointer",
        border: `2px solid ${selected ? svc.accentColor : hov ? "#d1d5db" : "#e5e7eb"}`,
        boxShadow: selected
          ? `0 8px 28px ${svc.accentColor}28`
          : hov ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
        transform: selected || hov ? "translateY(-3px)" : "none",
        transition: "all .25s",
        position: "relative", overflow: "hidden",
      }}
    >
      {selected && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: svc.accentColor, borderRadius: "50%",
          width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <CheckCircle2 size={14} color="#fff" />
        </div>
      )}
      <div style={{
        width: 52, height: 52, borderRadius: 14, marginBottom: 12,
        background: `${svc.accentColor}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={28} color={svc.accentColor} strokeWidth={1.8} />
      </div>
      <span style={{
        display: "inline-block", fontSize: 10, fontWeight: 700,
        background: `${svc.accentColor}18`, color: svc.accentColor,
        padding: "2px 8px", borderRadius: 20, marginBottom: 8,
        textTransform: "uppercase", letterSpacing: ".5px",
      }}>{svc.tag}</span>
      <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1a2e", marginBottom: 4 }}>{svc.label}</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12, lineHeight: 1.5 }}>{svc.desc}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
          <Clock size={12} /> {svc.duration}
        </span>
        <span style={{ fontWeight: 800, fontSize: 15, color: svc.accentColor }}>{fmtPrice(svc.price)}</span>
      </div>
    </div>
  );
}

/* ─── DATE CARD ─────────────────────────────────────────── */
function DateCard({ d, selected, onSelect }) {
  return (
    <div
      onClick={() => !d.disabled && onSelect(d.value)}
      style={{
        minWidth: 62, padding: "12px 6px", borderRadius: 14, textAlign: "center", flexShrink: 0,
        cursor: d.disabled ? "not-allowed" : "pointer",
        opacity: d.disabled ? 0.4 : 1,
        background: selected ? "#1a5c38" : "#fff",
        border: `2px solid ${selected ? "#1a5c38" : "#e5e7eb"}`,
        boxShadow: selected ? "0 4px 16px rgba(26,92,56,.25)" : "none",
        transform: selected ? "translateY(-2px)" : "none",
        transition: "all .2s",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: selected ? "#a8e6c3" : "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px" }}>{d.dayName}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: selected ? "#fff" : "#1a1a2e", lineHeight: 1.3, fontFamily: "'Quicksand', sans-serif" }}>{d.date}</div>
      <div style={{ fontSize: 10, color: selected ? "#a8e6c3" : "#9ca3af" }}>{d.month}</div>
    </div>
  );
}

/* ─── TIME SLOT ─────────────────────────────────────────── */
function TimeSlot({ time, selected, booked, onSelect }) {
  return (
    <button
      onClick={() => !booked && onSelect(time)}
      disabled={booked}
      style={{
        padding: "10px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13,
        cursor: booked ? "not-allowed" : "pointer",
        border: `2px solid ${booked ? "#e5e7eb" : selected ? "#1a5c38" : "#e5e7eb"}`,
        background: booked ? "#f9fafb" : selected ? "#1a5c38" : "#fff",
        color: booked ? "#d1d5db" : selected ? "#fff" : "#374151",
        textDecoration: booked ? "line-through" : "none",
        transition: "all .2s",
        fontFamily: "inherit",
        boxShadow: selected ? "0 4px 12px rgba(26,92,56,.2)" : "none",
      }}
    >
      {time} {booked && <span style={{ fontSize: 10, display: "block", fontWeight: 500 }}>Penuh</span>}
    </button>
  );
}

/* ─── FORM FIELD ────────────────────────────────────────── */
function FormField({ label, icon: Icon, required, children }) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#374151" }}>
        {Icon && <Icon size={14} color="#2d7a4f" />}
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 14px",
  border: "1.5px solid #e5e7eb", borderRadius: 10,
  fontSize: 14, boxSizing: "border-box",
  outline: "none", fontFamily: "inherit",
  color: "#1a1a2e", background: "#fff",
  transition: "border .2s",
};

/* ─── NAV BUTTONS ───────────────────────────────────────── */
function NavBtns({ onBack, onNext, nextLabel = "Lanjut", nextDisabled }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
      {onBack && (
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fff", color: "#1a5c38",
          border: "1.5px solid #1a5c38", padding: "12px 22px",
          borderRadius: 12, cursor: "pointer", fontWeight: 700,
          fontSize: 14, fontFamily: "inherit", transition: "all .2s",
        }}>
          <ChevronLeft size={16} /> Kembali
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "flex", alignItems: "center", gap: 8, flex: 1,
          background: nextDisabled ? "#e5e7eb" : hov ? "#1a5c38" : "#2d7a4f",
          color: nextDisabled ? "#9ca3af" : "#fff",
          border: "none", padding: "13px 28px", borderRadius: 12,
          cursor: nextDisabled ? "not-allowed" : "pointer",
          fontWeight: 700, fontSize: 15, fontFamily: "inherit",
          justifyContent: "center",
          boxShadow: nextDisabled ? "none" : hov ? "0 8px 24px rgba(26,92,56,.3)" : "0 4px 12px rgba(26,92,56,.2)",
          transform: !nextDisabled && hov ? "translateY(-1px)" : "none",
          transition: "all .2s",
        }}
      >
        {nextLabel} {!nextDisabled && <ChevronRight size={16} />}
      </button>
    </div>
  );
}

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    service: "", date: "", time: "",
    petName: "", petType: "kucing", petAge: "", petWeight: "",
    notes: "", ownerName: "", phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const days = getNextDays(14);
  const selectedService = services.find(s => s.id === form.service);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* ── SUCCESS SCREEN ── */
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a5c38,#2d7a4f,#4a9e6d)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: 48, maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,.2)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#e8f5ee,#a8e6c3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={44} color="#2d7a4f" strokeWidth={2} />
          </div>
          <h2 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 26, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>Booking Berhasil!</h2>
          <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 28 }}>
            Grooming untuk <strong style={{ color: "#1a5c38" }}>{form.petName}</strong> telah terjadwal.
          </p>
          <div style={{ background: "#f9fafb", borderRadius: 14, padding: 20, marginBottom: 24, textAlign: "left", border: "1px solid #e5e7eb" }}>
            {[
              { label: "Layanan", value: selectedService?.label },
              { label: "Tanggal", value: form.date },
              { label: "Waktu", value: form.time },
              { label: "Hewan", value: `${form.petName} (${form.petType})` },
              { label: "Total", value: fmtPrice(selectedService?.price) },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: 14 }}>
                <span style={{ color: "#9ca3af" }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{r.value}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24 }}>
            Tim kami akan menghubungi <strong>{form.phone}</strong> untuk konfirmasi jadwal.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/orders" style={{
              flex: 1, background: "#1a5c38", color: "#fff",
              padding: "13px 20px", borderRadius: 12, textDecoration: "none",
              fontWeight: 700, fontSize: 14, textAlign: "center", display: "block",
            }}>Lihat Pesanan</Link>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setForm({ service: "", date: "", time: "", petName: "", petType: "kucing", petAge: "", petWeight: "", notes: "", ownerName: "", phone: "" }); }}
              style={{ flex: 1, background: "#fff", color: "#1a5c38", border: "1.5px solid #1a5c38", padding: "13px 20px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
            >Booking Lagi</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Nunito', sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg,#1a5c38,#2d7a4f)", padding: "0 0 0 0" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "rgba(255,255,255,.8)", textDecoration: "none",
            fontSize: 13, fontWeight: 600,
            background: "rgba(255,255,255,.1)", padding: "6px 12px",
            borderRadius: 20, border: "1px solid rgba(255,255,255,.2)",
            transition: "all .2s",
          }}>
            <ArrowLeft size={14} /> Beranda
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Scissors size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ color: "#fff", margin: 0, fontSize: 17, fontWeight: 800, fontFamily: "'Quicksand', sans-serif", letterSpacing: "-.02em" }}>Booking Grooming</h1>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>Profesional & Terpercaya</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STEP INDICATOR ── */}
      <StepIndicator step={step} />

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 780, margin: "32px auto", padding: "0 24px 48px" }}>

        {/* STEP 1: Pilih Layanan */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
                <Bath size={22} color="#2d7a4f" /> Pilih Layanan Grooming
              </h2>
              <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Pilih paket yang sesuai untuk hewan peliharaanmu</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {services.map(svc => (
                <ServiceCard
                  key={svc.id} svc={svc}
                  selected={form.service === svc.id}
                  onSelect={() => set("service", svc.id)}
                />
              ))}
            </div>
            <NavBtns
              onNext={() => form.service && setStep(2)}
              nextDisabled={!form.service}
              nextLabel="Pilih Jadwal"
            />
          </div>
        )}

        {/* STEP 2: Jadwal */}
        {step === 2 && (
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarDays size={20} color="#2d7a4f" /> Pilih Jadwal
            </h2>
            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 24px" }}>Toko buka Senin–Sabtu. Minggu tutup.</p>

            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: ".5px" }}>Tanggal</h4>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
              {days.map(d => (
                <DateCard
                  key={d.value} d={d}
                  selected={form.date === d.value}
                  onSelect={v => { set("date", v); set("time", ""); }}
                />
              ))}
            </div>

            {form.date && (
              <div style={{ marginTop: 28 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: ".5px" }}>Waktu Tersedia</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {timeSlots.map(t => (
                    <TimeSlot
                      key={t} time={t}
                      selected={form.time === t}
                      booked={bookedSlots.includes(t)}
                      onSelect={v => set("time", v)}
                    />
                  ))}
                </div>
              </div>
            )}

            <NavBtns
              onBack={() => setStep(1)}
              onNext={() => form.date && form.time && setStep(3)}
              nextDisabled={!form.date || !form.time}
              nextLabel="Isi Data Hewan"
            />
          </div>
        )}

        {/* STEP 3: Data Hewan */}
        {step === 3 && (
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
              <PawPrint size={20} color="#2d7a4f" /> Data Hewan & Pemilik
            </h2>
            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 24px" }}>Isi informasi berikut agar groomer kami bisa mempersiapkan layanan terbaik.</p>

            {/* Jenis Hewan */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 10, fontSize: 13, fontWeight: 700, color: "#374151" }}>
                Jenis Hewan <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { value: "kucing", label: "Kucing", Icon: Cat, color: "#2d7a4f" },
                  { value: "anjing", label: "Anjing", Icon: Dog, color: "#b45309" },
                  { value: "kelinci", label: "Kelinci", Icon: Rabbit, color: "#7c3aed" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set("petType", opt.value)}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "12px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                      fontWeight: 700, fontSize: 14,
                      background: form.petType === opt.value ? `${opt.color}14` : "#f9fafb",
                      border: `2px solid ${form.petType === opt.value ? opt.color : "#e5e7eb"}`,
                      color: form.petType === opt.value ? opt.color : "#6b7280",
                      transition: "all .2s",
                    }}
                  >
                    <opt.Icon size={18} />  {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <FormField label="Nama Hewan" icon={PawPrint} required>
                <input
                  value={form.petName}
                  onChange={e => set("petName", e.target.value)}
                  placeholder="Contoh: Mochi"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#2d7a4f"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </FormField>
              <FormField label="Nama Pemilik" icon={User} required>
                <input
                  value={form.ownerName}
                  onChange={e => set("ownerName", e.target.value)}
                  placeholder="Nama lengkap"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#2d7a4f"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </FormField>
              <FormField label="No. Telepon" icon={Phone} required>
                <input
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#2d7a4f"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </FormField>
              <FormField label="Usia Hewan" icon={Clock}>
                <input
                  value={form.petAge}
                  onChange={e => set("petAge", e.target.value)}
                  placeholder="Contoh: 2 tahun"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#2d7a4f"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </FormField>
              <FormField label="Berat Hewan" icon={Weight}>
                <input
                  value={form.petWeight}
                  onChange={e => set("petWeight", e.target.value)}
                  placeholder="Contoh: 3.5 kg"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#2d7a4f"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </FormField>
            </div>

            <FormField label="Catatan Khusus (opsional)" icon={Info}>
              <textarea
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
                placeholder="Alergi, kondisi kesehatan, permintaan khusus..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = "#2d7a4f"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </FormField>

            <NavBtns
              onBack={() => setStep(2)}
              onNext={() => form.petName && form.ownerName && form.phone && setStep(4)}
              nextDisabled={!form.petName || !form.ownerName || !form.phone}
              nextLabel="Konfirmasi Booking"
            />
          </div>
        )}

        {/* STEP 4: Konfirmasi */}
        {step === 4 && (
          <div>
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={20} color="#2d7a4f" /> Konfirmasi Booking
              </h2>
              <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 24px" }}>Cek kembali detail booking sebelum dikonfirmasi.</p>

              {/* Service highlight */}
              {selectedService && (
                <div style={{
                  background: selectedService.gradient,
                  borderRadius: 14, padding: "18px 20px", marginBottom: 20,
                  display: "flex", alignItems: "center", gap: 16,
                  border: `1.5px solid ${selectedService.accentColor}30`,
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${selectedService.accentColor}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <selectedService.Icon size={26} color={selectedService.accentColor} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "#1a1a2e", fontFamily: "'Quicksand', sans-serif" }}>{selectedService.label}</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{selectedService.desc} · {selectedService.duration}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: selectedService.accentColor }}>{fmtPrice(selectedService.price)}</div>
                </div>
              )}

              {/* Detail rows */}
              <div style={{ background: "#f9fafb", borderRadius: 12, padding: "4px 20px", border: "1px solid #f3f4f6" }}>
                {[
                  { label: "Tanggal", value: form.date, icon: CalendarDays },
                  { label: "Waktu", value: form.time, icon: Clock },
                  { label: "Nama Hewan", value: `${form.petName} (${form.petType})`, icon: PawPrint },
                  { label: "Pemilik", value: form.ownerName, icon: User },
                  { label: "Telepon", value: form.phone, icon: Phone },
                  form.notes ? { label: "Catatan", value: form.notes, icon: Info } : null,
                ].filter(Boolean).map((row, i) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < 4 ? "1px solid #f3f4f6" : "none", gap: 12 }}>
                    <span style={{ fontSize: 13, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6 }}>
                      <row.icon size={13} /> {row.label}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", textAlign: "right" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment note */}
            <div style={{ background: "#e8f5ee", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10, border: "1px solid #a8e6c3" }}>
              <ShieldCheck size={18} color="#2d7a4f" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: "#1a5c38", margin: 0, lineHeight: 1.6 }}>
                <strong>Pembayaran di tempat</strong> — Cash atau transfer bank setelah konfirmasi dari admin PawMart.
              </p>
            </div>

            <NavBtns
              onBack={() => setStep(3)}
              onNext={async () => {
                try {
                  const reqBody = {
                    service: form.service,
                    date: form.date,
                    time: form.time,
                    petName: form.petName,
                    petType: form.petType,
                    petAge: form.petAge,
                    petWeight: form.petWeight,
                    notes: form.notes,
                    ownerName: form.ownerName,
                    phone: form.phone
                  };
                  const res = await bookingAPI.create(reqBody);
                  if (res.data.success) {
                    setSubmitted(true);
                  } else {
                    alert('Gagal: ' + res.data.message);
                  }
                } catch (err) {
                  console.error(err);
                  alert('Terjadi kesalahan.');
                }
              }}
              nextLabel={<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={16} /> Konfirmasi Booking</div>}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;