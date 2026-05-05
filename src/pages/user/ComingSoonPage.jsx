import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, ArrowLeft, PawPrint } from 'lucide-react';

const LABELS = {
  '/layanan/grooming': 'Grooming Profesional',
  '/layanan/pet-hotel': 'Pet Hotel & Penitipan',
};

export default function ComingSoonPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const label = LABELS[pathname] || 'Layanan';

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.iconWrap}>
          <PawPrint size={36} color="#2d7a4f" strokeWidth={1.8} />
        </div>
        <div style={s.badge}>
          <Clock size={13} color="#0369a1" strokeWidth={2.2} />
          Segera Hadir
        </div>
        <h1 style={s.title}>{label}</h1>
        <p style={s.sub}>
          Halaman ini sedang dalam pengembangan.<br />
          Kami akan segera meluncurkannya untuk kamu!
        </p>
        <div style={s.divider} />
        <p style={s.coming}>Coming Soon</p>
        <button style={s.btn} onClick={() => navigate('/')}>
          <ArrowLeft size={16} strokeWidth={2.2} />
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

const s = {
  wrap: {
    minHeight: 'calc(100vh - 68px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f7ee 100%)',
    padding: '40px 24px',
  },
  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '56px 48px',
    textAlign: 'center',
    maxWidth: '440px',
    width: '100%',
    boxShadow: '0 12px 48px rgba(45,122,79,.1)',
    border: '1px solid #e2e8f0',
  },
  iconWrap: {
    width: '72px', height: '72px', borderRadius: '20px',
    background: '#e8f5ee',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: '#eff6ff', color: '#0369a1',
    fontSize: '12px', fontWeight: 700,
    padding: '5px 14px', borderRadius: '50px',
    letterSpacing: '.04em', textTransform: 'uppercase',
    marginBottom: '20px',
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontSize: '28px', fontWeight: 700,
    color: '#0f172a', marginBottom: '12px',
    letterSpacing: '-.02em',
  },
  sub: {
    fontSize: '15px', color: '#64748b',
    lineHeight: 1.7, marginBottom: '28px',
  },
  divider: {
    height: '1px', background: '#e2e8f0', marginBottom: '28px',
  },
  coming: {
    fontFamily: "'Fraunces', serif",
    fontSize: '42px', fontWeight: 700,
    color: '#2d7a4f', letterSpacing: '-.03em',
    marginBottom: '32px',
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '11px 24px',
    background: '#fff', color: '#1a7a4a',
    border: '1.5px solid #1a7a4a', borderRadius: '50px',
    fontSize: '14px', fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all .2s',
  },
};
