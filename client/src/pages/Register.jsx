import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page fade-in">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo">⚡ Vizhop</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join thousands of happy shoppers today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <input id="reg-name" name="name" type="text" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input id="reg-email" name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">Phone Number (Optional)</label>
            <input id="reg-phone" name="phone" type="tel" className="form-control" placeholder="+91 99999 99999" value={form.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input id="reg-password" name="password" type="password" className="form-control" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
            <input id="reg-confirm" name="confirm" type="password" className="form-control" placeholder="Re-enter your password" value={form.confirm} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="register-submit-btn">
            {loading ? <><div className="spinner spinner-sm" /> Creating Account...</> : '🚀 Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" id="register-login-link">Sign in →</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height: calc(100vh - 72px); display: flex; align-items: center; justify-content: center; padding: 40px 16px; }
        .auth-card { width: 100%; max-width: 480px; padding: 44px 40px; }
        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-logo { font-size: 1.6rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 16px; }
        .auth-title { font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px; }
        .auth-subtitle { color: var(--text-muted); font-size: 0.9rem; }
        .auth-error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 12px 16px; border-radius: var(--radius-md); font-size: 0.88rem; margin-bottom: 20px; text-align: center; }
        .auth-form { display: flex; flex-direction: column; gap: 18px; margin-bottom: 24px; }
        .auth-switch { text-align: center; color: var(--text-muted); font-size: 0.9rem; }
        .auth-switch a { color: var(--purple-light); font-weight: 600; text-decoration: none; }
        .auth-switch a:hover { text-decoration: underline; }
        @media (max-width: 480px) { .auth-card { padding: 32px 20px; } }
      `}</style>
    </div>
  )
}
