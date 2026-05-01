import { useState } from "react";
import { Link } from "react-router-dom";

const services = [
  { id: "basic-cat", label: "Grooming Kucing Basic", price: 75000, duration: "60 menit", icon: "🐱", desc: "Mandi, sisir, potong kuku" },
  { id: "full-cat", label: "Grooming Kucing Full", price: 150000, duration: "120 menit", icon: "🐱✨", desc: "Basic + gunting bulu & parfum" },
  { id: "basic-dog", label: "Grooming Anjing Basic", price: 85000, duration: "60 menit", icon: "🐕", desc: "Mandi, sisir, potong kuku" },
  { id: "full-dog", label: "Grooming Anjing Full", price: 175000, duration: "150 menit", icon: "🐕✨", desc: "Basic + gunting bulu & parfum" },
  { id: "spa-cat", label: "Spa Kucing Premium", price: 200000, duration: "90 menit", icon: "🛁🐱", desc: "Full grooming + masker bulu + vitamin" },
  { id: "spa-dog", label: "Spa Anjing Premium", price: 250000, duration: "120 menit", icon: "🛁🐕", desc: "Full grooming + masker bulu + vitamin" },
];

const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const bookedSlots = ["10:00", "14:00"]; // simulasi slot yang sudah terisi

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
      disabled: d.getDay() === 0, // Tutup Minggu
    });
  }
  return days;
};

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    service: "",
    date: "",
    time: "",
    petName: "",
    petType: "kucing",
    petAge: "",
    petWeight: "",
    notes: "",
    ownerName: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const days = getNextDays(14);
  const selectedService = services.find((s) => s.id === form.service);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf6ee", fontFamily: "'Georgia', serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 48, maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 4px 32px rgba(44,24,16,0.1)" }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: "#2c1810", fontSize: 24, margin: "0 0 12px" }}>Booking Berhasil!</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>Booking grooming untuk <strong>{form.petName}</strong> telah dikonfirmasi.</p>
          <div style={{ background: "#fdf6ee", borderRadius: 10, padding: 20, marginBottom: 24, textAlign: "left", border: "1px solid #f0e0c8" }}>
            {[
              { label: "Layanan", value: selectedService?.label },
              { label: "Tanggal", value: form.date },
              { label: "Waktu", value: form.time },
              { label: "Hewan", value: `${form.petName} (${form.petType})` },
              { label: "Total", value: `Rp ${selectedService?.price?.toLocaleString("id-ID")}` },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                <span style={{ color: "#888" }}>{row.label}</span>
                <span style={{ fontWeight: "bold", color: "#2c1810" }}>{row.value}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#aaa", marginBottom: 24 }}>Tim kami akan menghubungi kamu di {form.phone} untuk konfirmasi.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/orders" style={{ background: "#2c1810", color: "#fff", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: "bold", fontSize: 14 }}>
              Lihat Pesanan
            </Link>
            <button onClick={() => { setSubmitted(false); setStep(1); setForm({ service: "", date: "", time: "", petName: "", petType: "kucing", petAge: "", petWeight: "", notes: "", ownerName: "", phone: "" }); }}
              style={{ background: "#fff", color: "#2c1810", border: "2px solid #2c1810", padding: "12px 24px", borderRadius: 8, fontWeight: "bold", fontSize: 14, cursor: "pointer" }}>
              Booking Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6ee", fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: "#2c1810", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/" style={{ color: "#f5c842", textDecoration: "none", fontSize: 14 }}>← Beranda</Link>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 20, fontWeight: "bold" }}>✂️ Booking Grooming</h1>
      </div>

      {/* Step Indicator */}
      <div style={{ background: "#fff", borderBottom: "2px solid #f0e0c8", padding: "16px 24px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", display: "flex", alignItems: "center" }}>
          {["Pilih Layanan", "Jadwal", "Data Hewan", "Konfirmasi"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: step > i ? "#2c1810" : step === i + 1 ? "#f5c842" : "#e0d0bb",
                color: step > i ? "#fff" : step === i + 1 ? "#2c1810" : "#999",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "bold", fontSize: 13, flexShrink: 0
              }}>
                {step > i ? "✓" : i + 1}
              </div>
              <span style={{ marginLeft: 6, fontSize: 12, color: step === i + 1 ? "#2c1810" : "#999", fontWeight: step === i + 1 ? "bold" : "normal", whiteSpace: "nowrap" }}>
                {s}
              </span>
              {i < 3 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? "#2c1810" : "#e0d0bb", margin: "0 8px" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 740, margin: "32px auto", padding: "0 16px" }}>

        {/* Step 1: Pilih Layanan */}
        {step === 1 && (
          <div>
            <h2 style={{ color: "#2c1810", marginBottom: 20 }}>🛁 Pilih Layanan Grooming</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {services.map((svc) => (
                <div key={svc.id} onClick={() => setForm({ ...form, service: svc.id })}
                  style={{
                    background: "#fff", borderRadius: 12, padding: 20, cursor: "pointer",
                    border: `2px solid ${form.service === svc.id ? "#2c1810" : "#e0d0bb"}`,
                    boxShadow: form.service === svc.id ? "0 4px 16px rgba(44,24,16,0.15)" : "0 2px 8px rgba(44,24,16,0.05)",
                    transform: form.service === svc.id ? "translateY(-2px)" : "none",
                    transition: "all 0.2s"
                  }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{svc.icon}</div>
                  <div style={{ fontWeight: "bold", color: "#2c1810", fontSize: 15, marginBottom: 4 }}>{svc.label}</div>
                  <div style={{ color: "#888", fontSize: 13, marginBottom: 10 }}>{svc.desc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#aaa" }}>⏱️ {svc.duration}</span>
                    <span style={{ fontWeight: "bold", color: "#2c1810", fontSize: 15 }}>Rp {svc.price.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => form.service && setStep(2)} disabled={!form.service}
              style={{ marginTop: 24, background: form.service ? "#2c1810" : "#ccc", color: "#fff", border: "none", padding: "13px 36px", borderRadius: 8, fontSize: 15, fontWeight: "bold", cursor: form.service ? "pointer" : "not-allowed", letterSpacing: 0.5 }}>
              Lanjut →
            </button>
          </div>
        )}

        {/* Step 2: Jadwal */}
        {step === 2 && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 16px rgba(44,24,16,0.07)" }}>
            <h2 style={{ color: "#2c1810", marginTop: 0, fontSize: 18 }}>📅 Pilih Jadwal</h2>
            <h4 style={{ color: "#555", marginBottom: 12 }}>Tanggal</h4>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
              {days.map((d) => (
                <div key={d.value} onClick={() => !d.disabled && setForm({ ...form, date: d.value, time: "" })}
                  style={{
                    minWidth: 64, padding: "12px 8px", borderRadius: 10, textAlign: "center", flexShrink: 0,
                    border: `2px solid ${form.date === d.value ? "#2c1810" : "#e0d0bb"}`,
                    background: d.disabled ? "#f5f5f5" : form.date === d.value ? "#2c1810" : "#fff",
                    cursor: d.disabled ? "not-allowed" : "pointer",
                    opacity: d.disabled ? 0.5 : 1
                  }}>
                  <div style={{ fontSize: 11, color: form.date === d.value ? "#f5c842" : "#888" }}>{d.dayName}</div>
                  <div style={{ fontSize: 20, fontWeight: "bold", color: form.date === d.value ? "#fff" : "#2c1810" }}>{d.date}</div>
                  <div style={{ fontSize: 11, color: form.date === d.value ? "#ddd" : "#aaa" }}>{d.month}</div>
                </div>
              ))}
            </div>

            {form.date && (
              <>
                <h4 style={{ color: "#555", marginTop: 20, marginBottom: 12 }}>Waktu</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    return (
                      <button key={time} onClick={() => !isBooked && setForm({ ...form, time })} disabled={isBooked}
                        style={{
                          padding: "10px 20px", borderRadius: 8, border: `2px solid`,
                          borderColor: isBooked ? "#ddd" : form.time === time ? "#2c1810" : "#e0d0bb",
                          background: isBooked ? "#f5f5f5" : form.time === time ? "#2c1810" : "#fff",
                          color: isBooked ? "#ccc" : form.time === time ? "#fff" : "#333",
                          cursor: isBooked ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: 14,
                          textDecoration: isBooked ? "line-through" : "none"
                        }}>
                        {time} {isBooked && <span style={{ fontSize: 10 }}>Penuh</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(1)} style={{ background: "#fff", color: "#2c1810", border: "2px solid #2c1810", padding: "12px 24px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>← Kembali</button>
              <button onClick={() => form.date && form.time && setStep(3)} disabled={!form.date || !form.time}
                style={{ background: form.date && form.time ? "#2c1810" : "#ccc", color: "#fff", border: "none", padding: "12px 32px", borderRadius: 8, fontSize: 15, fontWeight: "bold", cursor: form.date && form.time ? "pointer" : "not-allowed" }}>
                Lanjut →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Data Hewan */}
        {step === 3 && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 16px rgba(44,24,16,0.07)" }}>
            <h2 style={{ color: "#2c1810", marginTop: 0, fontSize: 18 }}>🐾 Data Hewan & Pemilik</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Nama Hewan", name: "petName", placeholder: "Contoh: Mochi" },
                { label: "Nama Pemilik", name: "ownerName", placeholder: "Nama lengkap" },
                { label: "No. Telepon", name: "phone", placeholder: "08xxxxxxxxxx" },
                { label: "Usia Hewan", name: "petAge", placeholder: "Contoh: 2 tahun" },
                { label: "Berat Hewan", name: "petWeight", placeholder: "Contoh: 3.5 kg" },
              ].map((f) => (
                <div key={f.name}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", color: "#555", fontSize: 13 }}>{f.label}</label>
                  <input name={f.name} value={form[f.name]} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} placeholder={f.placeholder}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0d0bb", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", color: "#555", fontSize: 13 }}>Jenis Hewan</label>
                <select name="petType" value={form.petType} onChange={(e) => setForm({ ...form, petType: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0d0bb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}>
                  <option value="kucing">🐱 Kucing</option>
                  <option value="anjing">🐕 Anjing</option>
                  <option value="kelinci">🐰 Kelinci</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", color: "#555", fontSize: 13 }}>Catatan Khusus (opsional)</label>
              <textarea name="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Alergi, kondisi kesehatan, permintaan khusus..."
                rows={3} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0d0bb", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none", resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(2)} style={{ background: "#fff", color: "#2c1810", border: "2px solid #2c1810", padding: "12px 24px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>← Kembali</button>
              <button onClick={() => form.petName && form.ownerName && form.phone && setStep(4)} disabled={!form.petName || !form.ownerName || !form.phone}
                style={{ background: form.petName && form.ownerName && form.phone ? "#2c1810" : "#ccc", color: "#fff", border: "none", padding: "12px 32px", borderRadius: 8, fontSize: 15, fontWeight: "bold", cursor: "pointer" }}>
                Lanjut →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Konfirmasi */}
        {step === 4 && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 16px rgba(44,24,16,0.07)" }}>
            <h2 style={{ color: "#2c1810", marginTop: 0, fontSize: 18 }}>✅ Konfirmasi Booking</h2>
            <div style={{ background: "#fdf6ee", borderRadius: 10, padding: 20, border: "1px solid #f0e0c8", marginBottom: 20 }}>
              {[
                { label: "Layanan", value: selectedService?.label },
                { label: "Harga", value: `Rp ${selectedService?.price?.toLocaleString("id-ID")}` },
                { label: "Durasi", value: selectedService?.duration },
                { label: "Tanggal", value: form.date },
                { label: "Waktu", value: form.time },
                { label: "Nama Hewan", value: `${form.petName} (${form.petType})` },
                { label: "Pemilik", value: form.ownerName },
                { label: "Telepon", value: form.phone },
                form.notes && { label: "Catatan", value: form.notes },
              ].filter(Boolean).map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, alignItems: "flex-start" }}>
                  <span style={{ color: "#888", minWidth: 100 }}>{row.label}</span>
                  <span style={{ fontWeight: "bold", color: "#2c1810", textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#eafaf1", borderRadius: 8, padding: 14, marginBottom: 20, fontSize: 13, color: "#27ae60", border: "1px solid #a9dfbf" }}>
              ℹ️ Pembayaran dilakukan di tempat (cash) atau via transfer bank setelah konfirmasi dari admin.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(3)} style={{ background: "#fff", color: "#2c1810", border: "2px solid #2c1810", padding: "12px 24px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>← Kembali</button>
              <button onClick={handleSubmit}
                style={{ flex: 1, background: "#f5c842", color: "#2c1810", border: "none", padding: "14px", borderRadius: 8, fontSize: 16, fontWeight: "bold", cursor: "pointer" }}>
                ✂️ Konfirmasi Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;