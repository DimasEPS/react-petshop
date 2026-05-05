import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../services/api';
import {
  User, MapPin, Lock, ShoppingBag, Scissors,
  Star, ArrowLeft, Edit3, X, Save, Plus, Trash2, Home,
  Briefcase, Check, Eye, EyeOff, ChevronRight, LogOut,
  Mail, Phone, Building2, Map, FileText, Shield
} from "lucide-react";

/* ─── INPUT COMPONENT ───────────────────────────────────── */
function Input({ value, onChange, placeholder, type = "text", disabled }) {
  const [focus, setFocus] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ position: "relative" }}>
      <input
        type={isPassword && show ? "text" : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%", padding: isPassword ? "11px 42px 11px 14px" : "11px 14px",
          border: `1.5px solid ${disabled ? "#f3f4f6" : focus ? "#2d7a4f" : "#e5e7eb"}`,
          borderRadius: 10, fontSize: 14, boxSizing: "border-box",
          outline: "none", fontFamily: "inherit",
          background: disabled ? "#f9fafb" : "#fff",
          color: disabled ? "#9ca3af" : "#1a1a2e",
          transition: "border .2s",
        }}
      />
      {isPassword && (
        <button
          onClick={() => setShow(s => !s)}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}

/* ─── FORM FIELD ────────────────────────────────────────── */
function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".5px" }}>
        {Icon && <Icon size={12} color="#2d7a4f" />} {label}
      </label>
      {children}
    </div>
  );
}

/* ─── STAT CARD ─────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${color}22` }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={19} color={color} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 22, fontWeight: 800, color: "#1a1a2e", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── NAV ITEM ──────────────────────────────────────────── */
function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px", border: "none", cursor: "pointer",
        fontFamily: "inherit", fontSize: 14, fontWeight: active ? 700 : 500,
        background: active ? "linear-gradient(135deg,#1a5c38,#2d7a4f)" : "transparent",
        color: active ? "#fff" : "#6b7280",
        borderRadius: 10, transition: "all .2s",
        marginBottom: 4,
      }}
    >
      <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
      {label}
      {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
    </button>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    province: user?.province || "",
    bio: user?.bio || "",
  });
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [pwSaved, setPwSaved] = useState(false);

  const savedAddresses = [
    { id: 1, label: "Rumah", Icon: Home, address: "Jl. Teuku Umar No. 12, Kedaton, Bandar Lampung, 35148", isDefault: true },
    { id: 2, label: "Kantor", Icon: Briefcase, address: "Jl. Jend. Sudirman No. 55, Enggal, Bandar Lampung, 35119", isDefault: false },
  ];

  const handleSave = async () => {
    try {
      const res = await profileAPI.update({
        phone: profile.phone,
        city: profile.city,
        province: profile.province,
        bio: profile.bio
      });
      if (res.data.success) {
        setUser({ ...user, ...res.data.data });
        setEditMode(false);
        setSaveFlash(true);
        setTimeout(() => setSaveFlash(false), 2500);
      } else {
        alert('Gagal: ' + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan.');
    }
  };

  const handlePwSave = () => {
    setPwSaved(true);
    setPasswords({ old: "", new: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 2500);
  };

  const initials = (profile.name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Nunito', sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg,#1a5c38,#2d7a4f)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "rgba(255,255,255,.8)", textDecoration: "none",
            fontSize: 13, fontWeight: 600,
            background: "rgba(255,255,255,.1)", padding: "6px 12px",
            borderRadius: 20, border: "1px solid rgba(255,255,255,.2)",
          }}>
            <ArrowLeft size={14} /> Beranda
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Quicksand', sans-serif", color: "#fff", margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: "-.02em" }}>Akun Saya</h1>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>Kelola profil & preferensi</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 960, margin: "28px auto", padding: "0 20px 48px", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width: 250, flexShrink: 0 }}>

          {/* Avatar card */}
          <div style={{
            background: "#fff", borderRadius: 18, padding: 24,
            border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            textAlign: "center", marginBottom: 14,
          }}>
            {/* Avatar circle */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "linear-gradient(135deg,#1a5c38,#4a9e6d)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Quicksand', sans-serif", fontSize: 28, fontWeight: 800,
                color: "#fff", border: "3px solid #fff",
                boxShadow: "0 4px 16px rgba(26,92,56,.3)",
              }}>
                {initials}
              </div>
              <div style={{
                position: "absolute", bottom: 2, right: 2,
                width: 20, height: 20, borderRadius: "50%",
                background: "#22c55e", border: "2px solid #fff",
              }} />
            </div>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 800, color: "#1a1a2e", fontSize: 16 }}>{profile.name}</div>
            <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>{profile.email}</div>
            <span style={{
              display: "inline-block", marginTop: 10,
              background: "linear-gradient(135deg,#e8f5ee,#d1edd9)",
              color: "#1a5c38", padding: "4px 14px", borderRadius: 20,
              fontSize: 11, fontWeight: 700, border: "1px solid #a8e6c3", display: "flex", alignItems: "center", gap: 4, justifyContent: "center"
            }}><Star size={12} fill="currentColor" /> Customer</span>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            <StatCard label="Total Order" value={12} icon={ShoppingBag} color="#2d7a4f" bg="#f0fdf4" />
            <StatCard label="Booking Grooming" value={5} icon={Scissors} color="#7c3aed" bg="#faf5ff" />
            <StatCard label="Produk Direview" value={8} icon={Star} color="#b45309" bg="#fffbeb" />
          </div>

          {/* Nav */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 10, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", marginBottom: 14 }}>
            <NavItem icon={User} label="Profil Saya" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
            <NavItem icon={MapPin} label="Alamat" active={activeTab === "address"} onClick={() => setActiveTab("address")} />
            <NavItem icon={Lock} label="Keamanan" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
          </div>

          {/* Quick links */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 10, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", marginBottom: 14 }}>
            {[
              { to: "/orders", icon: ShoppingBag, label: "Riwayat Pesanan" },
              { to: "/booking", icon: Scissors, label: "Booking Grooming" },
            ].map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 12px", borderRadius: 10, textDecoration: "none",
                color: "#374151", fontSize: 14, fontWeight: 600,
                transition: "background .15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Icon size={15} color="#6b7280" /> {label}
                <ChevronRight size={13} color="#d1d5db" style={{ marginLeft: "auto" }} />
              </Link>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", borderRadius: 12, border: "1.5px solid #fecaca",
              background: "#fff", color: "#b91c1c", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
          >
            <LogOut size={15} /> Keluar
          </button>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, minWidth: 300 }}>

          {/* Save flash */}
          {saveFlash && (
            <div style={{
              background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 12,
              padding: "12px 18px", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 10,
              color: "#15803d", fontWeight: 700, fontSize: 14,
            }}>
              <Check size={16} /> Profil berhasil disimpan!
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <div style={{ background: "#fff", borderRadius: 18, padding: 28, border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontFamily: "'Quicksand', sans-serif", margin: "0 0 4px", color: "#1a1a2e", fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                    <User size={20} color="#2d7a4f" /> Profil Saya
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>Kelola informasi pribadi kamu</p>
                </div>
                <button
                  onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 18px", borderRadius: 10, border: "none",
                    background: editMode ? "#fee2e2" : "linear-gradient(135deg,#1a5c38,#2d7a4f)",
                    color: editMode ? "#b91c1c" : "#fff",
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    fontFamily: "inherit", transition: "all .2s",
                    boxShadow: editMode ? "none" : "0 4px 12px rgba(26,92,56,.2)",
                  }}
                >
                  {editMode ? <><X size={14} /> Batal</> : <><Edit3 size={14} /> Edit Profil</>}
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <Field label="Nama Lengkap" icon={User}>
                  {editMode
                    ? <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Nama lengkap" />
                    : <div style={readStyle}>{profile.name}</div>
                  }
                </Field>
                <Field label="No. Telepon" icon={Phone}>
                  {editMode
                    ? <Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="08xxxxxxxx" />
                    : <div style={readStyle}>{profile.phone}</div>
                  }
                </Field>
                <Field label="Kota" icon={Building2}>
                  {editMode
                    ? <Input value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} placeholder="Kota" />
                    : <div style={readStyle}>{profile.city}</div>
                  }
                </Field>
                <Field label="Provinsi" icon={Map}>
                  {editMode
                    ? <Input value={profile.province} onChange={e => setProfile({ ...profile, province: e.target.value })} placeholder="Provinsi" />
                    : <div style={readStyle}>{profile.province}</div>
                  }
                </Field>
              </div>

              <Field label="Email" icon={Mail}>
                <div style={{ ...readStyle, background: "#f9fafb", color: "#9ca3af", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {profile.email}
                  <span style={{ fontSize: 11, background: "#f3f4f6", color: "#9ca3af", padding: "2px 8px", borderRadius: 6 }}>Tidak bisa diubah</span>
                </div>
              </Field>

              <div style={{ marginTop: 16 }}>
                <Field label="Bio" icon={FileText}>
                  {editMode
                    ? (
                      <textarea
                        value={profile.bio}
                        onChange={e => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                        style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit", resize: "vertical", color: "#1a1a2e" }}
                        onFocus={e => e.target.style.borderColor = "#2d7a4f"}
                        onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                      />
                    )
                    : <div style={{ ...readStyle, lineHeight: 1.6 }}>{profile.bio}</div>
                  }
                </Field>
              </div>

              {editMode && (
                <button
                  onClick={handleSave}
                  style={{
                    marginTop: 20, display: "flex", alignItems: "center", gap: 8,
                    padding: "12px 28px", borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg,#1a5c38,#2d7a4f)",
                    color: "#fff", fontWeight: 700, fontSize: 15,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 4px 16px rgba(26,92,56,.25)",
                  }}
                >
                  <Save size={16} /> Simpan Perubahan
                </button>
              )}
            </div>
          )}

          {/* ── ADDRESS TAB ── */}
          {activeTab === "address" && (
            <div style={{ background: "#fff", borderRadius: 18, padding: 28, border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontFamily: "'Quicksand', sans-serif", margin: "0 0 4px", color: "#1a1a2e", fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                    <MapPin size={20} color="#2d7a4f" /> Alamat Tersimpan
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>{savedAddresses.length} alamat terdaftar</p>
                </div>
                <button style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "9px 18px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#1a5c38,#2d7a4f)",
                  color: "#fff", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 12px rgba(26,92,56,.2)",
                }}>
                  <Plus size={14} /> Tambah Alamat
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {savedAddresses.map(addr => (
                  <div key={addr.id} style={{
                    borderRadius: 14, padding: 20,
                    border: `2px solid ${addr.isDefault ? "#a8e6c3" : "#e5e7eb"}`,
                    background: addr.isDefault ? "linear-gradient(135deg,#f0fdf4,#e8f5ee)" : "#fff",
                    position: "relative", transition: "all .2s",
                  }}>
                    {addr.isDefault && (
                      <span style={{
                        position: "absolute", top: 14, right: 14,
                        background: "linear-gradient(135deg,#1a5c38,#2d7a4f)",
                        color: "#fff", fontSize: 10, fontWeight: 700,
                        padding: "3px 10px", borderRadius: 20, letterSpacing: ".5px", display: "flex", alignItems: "center", gap: 4
                      }}><Star size={10} fill="currentColor" /> UTAMA</span>
                    )}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: addr.isDefault ? "#dcfce7" : "#f3f4f6",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <addr.Icon size={20} color={addr.isDefault ? "#2d7a4f" : "#9ca3af"} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: "#1a1a2e", fontSize: 15, marginBottom: 4, fontFamily: "'Quicksand', sans-serif" }}>{addr.label}</div>
                        <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{addr.address}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f3f4f6" }}>
                      <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        <Edit3 size={12} /> Edit
                      </button>
                      {!addr.isDefault && (
                        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #fecaca", background: "#fff", color: "#b91c1c", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          <Trash2 size={12} /> Hapus
                        </button>
                      )}
                      {!addr.isDefault && (
                        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #a8e6c3", background: "#f0fdf4", color: "#1a5c38", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          <Check size={12} /> Jadikan Utama
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === "security" && (
            <div style={{ background: "#fff", borderRadius: 18, padding: 28, border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Quicksand', sans-serif", margin: "0 0 4px", color: "#1a1a2e", fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                  <Lock size={20} color="#2d7a4f" /> Keamanan Akun
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>Perbarui password secara berkala untuk keamanan akunmu</p>
              </div>

              {pwSaved && (
                <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "#15803d", fontWeight: 700, fontSize: 14 }}>
                  <Check size={16} /> Password berhasil diubah!
                </div>
              )}

              {/* Security status */}
              <div style={{ background: "linear-gradient(135deg,#f0fdf4,#e8f5ee)", borderRadius: 12, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12, border: "1px solid #a8e6c3" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield size={20} color="#15803d" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#15803d" }}>Akun Terlindungi</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Password terakhir diubah 30 hari lalu</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Password Lama", key: "old", placeholder: "Masukkan password lama" },
                  { label: "Password Baru", key: "new", placeholder: "Minimal 8 karakter" },
                  { label: "Konfirmasi Password Baru", key: "confirm", placeholder: "Ulangi password baru" },
                ].map(f => (
                  <Field key={f.key} label={f.label} icon={Lock}>
                    <Input
                      type="password"
                      value={passwords[f.key]}
                      onChange={e => setPasswords({ ...passwords, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                    />
                  </Field>
                ))}
              </div>

              <button
                onClick={handlePwSave}
                style={{
                  marginTop: 24, display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 28px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg,#1a5c38,#2d7a4f)",
                  color: "#fff", fontWeight: 700, fontSize: 15,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(26,92,56,.25)",
                }}
              >
                <Lock size={16} /> Ubah Password
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const readStyle = {
  padding: "11px 14px", background: "#f9fafb",
  borderRadius: 10, fontSize: 14, color: "#374151",
  border: "1.5px solid #f3f4f6", lineHeight: 1.5,
};

export default ProfilePage;