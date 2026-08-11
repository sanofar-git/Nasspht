import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.isAdmin ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillAdmin = () => setForm({ email: 'admin@gmail.com', password: 'admin123' })

  return (
    <div className="auth-page fade-in">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo">⚡ Vizhop</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Login to your account to continue shopping</p>
        </div>

        {error && (
          <div className="auth-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? <><div className="spinner spinner-sm" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        {/* Admin Quick Login */}
        <button className="admin-quick-btn" onClick={fillAdmin} id="admin-quickfill-btn">
          <span>👤</span>
          <div>
            <div className="admin-quick-title">Admin Demo</div>
            <div className="admin-quick-sub">admin@gmail.com • admin123</div>
          </div>
        </button>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" id="login-register-link">Create one →</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: 44px 40px;
        }
        .auth-header { text-align: center; margin-bottom: 36px; }
        .auth-logo { font-size: 1.6rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 16px; }
        .auth-title { font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px; }
        .auth-subtitle { color: var(--text-muted); font-size: 0.9rem; }
        .auth-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          margin-bottom: 20px;
          text-align: center;
        }
        .auth-form { display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px; }
        .auth-divider { display: flex; align-items: center; gap: 16px; margin: 24px 0; color: var(--text-dim); font-size: 0.85rem; }
        .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--glass-border); }
        .admin-quick-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: rgba(168,85,247,0.08);
          border: 1px solid rgba(168,85,247,0.2);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
          font-family: var(--font);
          margin-bottom: 24px;
        }
        .admin-quick-btn:hover { background: rgba(168,85,247,0.15); border-color: rgba(168,85,247,0.4); }
        .admin-quick-btn span { font-size: 1.5rem; }
        .admin-quick-title { font-weight: 600; color: var(--purple-light); font-size: 0.9rem; }
        .admin-quick-sub { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
        .auth-switch { text-align: center; color: var(--text-muted); font-size: 0.9rem; }
        .auth-switch a { color: var(--purple-light); font-weight: 600; text-decoration: none; }
        .auth-switch a:hover { text-decoration: underline; }
        @media (max-width: 480px) {
          .auth-card { padding: 32px 24px; }
        }
      `}</style>
    </div>
  )
}
