import { useState } from "react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "081234567890",
    city: "Bandar Lampung",
    province: "Lampung",
    bio: "Pecinta kucing dan anjing 🐾",
  });
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });

  const stats = [
    { label: "Total Order", value: 12, icon: "📦" },
    { label: "Booking Grooming", value: 5, icon: "✂️" },
    { label: "Produk Direview", value: 8, icon: "⭐" },
  ];

  const tabs = [
    { id: "profile", label: "Profil Saya", icon: "👤" },
    { id: "address", label: "Alamat", icon: "📍" },
    { id: "security", label: "Keamanan", icon: "🔒" },
  ];

  const savedAddresses = [
    { id: 1, label: "Rumah", address: "Jl. Teuku Umar No. 12, Kedaton, Bandar Lampung, 35148", isDefault: true },
    { id: 2, label: "Kantor", address: "Jl. Jend. Sudirman No. 55, Enggal, Bandar Lampung, 35119", isDefault: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6ee", fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: "#2c1810", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/" style={{ color: "#f5c842", textDecoration: "none", fontSize: 14 }}>← Beranda</Link>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 20, fontWeight: "bold" }}>🐾 Akun Saya</h1>
      </div>

      <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px", display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Sidebar */}
        <div style={{ width: 240, flexShrink: 0 }}>
          {/* Avatar Card */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 16px rgba(44,24,16,0.07)", textAlign: "center", marginBottom: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", background: "#2c1810",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, margin: "0 auto 12px", border: "3px solid #f5c842"
            }}>🐾</div>
            <div style={{ fontWeight: "bold", color: "#2c1810", fontSize: 16 }}>{profile.name}</div>
            <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{profile.email}</div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
              <span style={{ background: "#f5c842", color: "#2c1810", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: "bold" }}>Customer</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 16px rgba(44,24,16,0.07)", marginBottom: 16 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0e0c8" }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: "bold", color: "#2c1810" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs Nav */}
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 16px rgba(44,24,16,0.07)" }}>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  width: "100%", padding: "14px 20px", textAlign: "left", border: "none",
                  background: activeTab === tab.id ? "#2c1810" : "#fff",
                  color: activeTab === tab.id ? "#fff" : "#555",
                  fontSize: 14, fontWeight: activeTab === tab.id ? "bold" : "normal",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                  borderBottom: "1px solid #f0e0c8"
                }}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Links */}
          <div style={{ marginTop: 16 }}>
            <Link to="/orders" style={{ display: "block", padding: "12px 16px", background: "#fff", borderRadius: 8, marginBottom: 8, textDecoration: "none", color: "#2c1810", fontSize: 14, fontWeight: "bold", boxShadow: "0 1px 6px rgba(44,24,16,0.06)" }}>
              📦 Riwayat Pesanan
            </Link>
            <Link to="/booking" style={{ display: "block", padding: "12px 16px", background: "#fff", borderRadius: 8, marginBottom: 8, textDecoration: "none", color: "#2c1810", fontSize: 14, fontWeight: "bold", boxShadow: "0 1px 6px rgba(44,24,16,0.06)" }}>
              ✂️ Booking Grooming
            </Link>
            <button onClick={() => alert("Logout! (Integrasi backend diperlukan)")}
              style={{ width: "100%", padding: "12px 16px", background: "#fdf6ee", border: "2px solid #e0d0bb", borderRadius: 8, color: "#c0392b", fontSize: 14, fontWeight: "bold", cursor: "pointer", textAlign: "left" }}>
              🚪 Keluar
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 280 }}>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 16px rgba(44,24,16,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, color: "#2c1810", fontSize: 18 }}>👤 Profil Saya</h2>
                <button onClick={() => setEditMode(!editMode)}
                  style={{ background: editMode ? "#c0392b" : "#2c1810", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13 }}>
                  {editMode ? "Batal" : "✏️ Edit"}
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Nama Lengkap", key: "name" },
                  { label: "No. Telepon", key: "phone" },
                  { label: "Kota", key: "city" },
                  { label: "Provinsi", key: "province" },
                ].map((f) => (
                  <div key={f.key}>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", color: "#555", fontSize: 13 }}>{f.label}</label>
                    {editMode ? (
                      <input value={profile[f.key]} onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #f5c842", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none", background: "#fdf6ee" }} />
                    ) : (
                      <div style={{ padding: "10px 14px", background: "#f8f4ef", borderRadius: 8, fontSize: 14, color: "#333", border: "1.5px solid #e0d0bb" }}>{profile[f.key]}</div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", color: "#555", fontSize: 13 }}>Email</label>
                <div style={{ padding: "10px 14px", background: "#f0f0f0", borderRadius: 8, fontSize: 14, color: "#888", border: "1.5px solid #e0d0bb" }}>
                  {profile.email} <span style={{ fontSize: 11, color: "#aaa" }}>(tidak bisa diubah)</span>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", color: "#555", fontSize: 13 }}>Bio</label>
                {editMode ? (
                  <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #f5c842", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none", background: "#fdf6ee", resize: "vertical" }} />
                ) : (
                  <div style={{ padding: "10px 14px", background: "#f8f4ef", borderRadius: 8, fontSize: 14, color: "#333", border: "1.5px solid #e0d0bb" }}>{profile.bio}</div>
                )}
              </div>

              {editMode && (
                <button onClick={() => { setEditMode(false); alert("Profil berhasil disimpan!"); }}
                  style={{ marginTop: 20, background: "#f5c842", color: "#2c1810", border: "none", padding: "12px 32px", borderRadius: 8, fontSize: 15, fontWeight: "bold", cursor: "pointer" }}>
                  💾 Simpan Perubahan
                </button>
              )}
            </div>
          )}

          {/* Address Tab */}
          {activeTab === "address" && (
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 16px rgba(44,24,16,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, color: "#2c1810", fontSize: 18 }}>📍 Alamat Tersimpan</h2>
                <button style={{ background: "#2c1810", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13 }}>
                  + Tambah Alamat
                </button>
              </div>
              {savedAddresses.map((addr) => (
                <div key={addr.id} style={{
                  border: `2px solid ${addr.isDefault ? "#f5c842" : "#e0d0bb"}`,
                  borderRadius: 10, padding: 20, marginBottom: 16,
                  background: addr.isDefault ? "#fdf6ee" : "#fff"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontWeight: "bold", color: "#2c1810" }}>{addr.label}</span>
                        {addr.isDefault && <span style={{ background: "#f5c842", color: "#2c1810", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: "bold" }}>Utama</span>}
                      </div>
                      <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{addr.address}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button style={{ background: "#fff", border: "1px solid #e0d0bb", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, color: "#555" }}>Edit</button>
                      {!addr.isDefault && <button style={{ background: "#fff", border: "1px solid #e9c2c2", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, color: "#c0392b" }}>Hapus</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 16px rgba(44,24,16,0.07)" }}>
              <h2 style={{ margin: "0 0 24px", color: "#2c1810", fontSize: 18 }}>🔒 Ubah Password</h2>
              {[
                { label: "Password Lama", key: "old", placeholder: "Masukkan password lama" },
                { label: "Password Baru", key: "new", placeholder: "Minimal 8 karakter" },
                { label: "Konfirmasi Password Baru", key: "confirm", placeholder: "Ulangi password baru" },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", color: "#555", fontSize: 13 }}>{f.label}</label>
                  <input type="password" value={passwords[f.key]} onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })} placeholder={f.placeholder}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0d0bb", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
                </div>
              ))}
              <button onClick={() => alert("Password berhasil diubah! (Integrasi backend diperlukan)")}
                style={{ background: "#2c1810", color: "#fff", border: "none", padding: "12px 32px", borderRadius: 8, fontSize: 15, fontWeight: "bold", cursor: "pointer" }}>
                🔑 Ubah Password
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;