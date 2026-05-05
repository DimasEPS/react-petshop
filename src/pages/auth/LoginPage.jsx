import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8faf8;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 24px;
        }

        .auth-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 440px;
          padding: 40px;
          position: relative;
        }

        .auth-logo {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          text-align: center;
          margin-bottom: 8px;
        }
        .auth-logo span { color: #1a7a4a; }

        .auth-subtitle {
          text-align: center;
          color: #64748b;
          font-size: 15px;
          margin-bottom: 32px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }

        .auth-input {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f1f5f9;
          font-size: 15px;
          color: #0f172a;
          transition: all 0.2s;
          outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .auth-input:focus {
          border-color: #1a7a4a;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(26, 122, 74, 0.1);
        }

        .auth-btn {
          background: #1a7a4a;
          color: white;
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .auth-btn:hover {
          background: #145c37;
          transform: translateY(-2px);
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .auth-error {
          background: #fee2e2;
          color: #b91c1c;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 14px;
          color: #64748b;
        }

        .auth-link {
          color: #1a7a4a;
          font-weight: 700;
          text-decoration: none;
          transition: 0.2s;
        }

        .auth-link:hover {
          color: #145c37;
          text-decoration: underline;
        }
          
        .back-btn {
          position: absolute;
          top: 24px;
          left: 24px;
          color: #64748b;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s;
        }
        .back-btn:hover { color: #1a7a4a; }
      `}</style>

      <div className="auth-container">
        <div className="auth-card">
          <Link to="/" className="back-btn">
            <ArrowLeft size={16} />
          </Link>

          <div style={{ marginTop: '20px' }}>
            <div className="auth-logo"><span>Paw</span>Mart</div>
            <div className="auth-subtitle">Selamat datang kembali! Silakan login.</div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="input-group">
              <label className="input-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading && <Loader2 className="animate-spin" size={20} style={{ marginRight: '8px' }} />}
              Masuk
            </button>
          </form>

          <div className="auth-footer">
            Belum punya akun? <Link to="/register" className="auth-link">Daftar sekarang</Link>
          </div>
        </div>
      </div>
    </>
  );
}
