import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(() => localStorage.getItem('vizhop_theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('vizhop_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleLogout = () => { logout(); navigate('/') }

  const navItems = [
    { to: '/admin', label: '📊 Dashboard', end: true, id: 'admin-nav-dashboard' },
    { to: '/admin/users', label: '👥 All Users', id: 'admin-nav-users' },
    { to: '/admin/products', label: '📦 All Products', id: 'admin-nav-products' },
    { to: '/admin/orders', label: '🛒 All Orders', id: 'admin-nav-orders' },
  ]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo">⚡ Vizhop</div>
          <div className="admin-role-badge">Admin Panel</div>
        </div>

        <div className="admin-user-info">
          <div className="admin-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div className="admin-user-name">{user?.name}</div>
            <div className="admin-user-email">{user?.email}</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              id={item.id}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-link" id="admin-view-store">🏪 View Store</NavLink>
          <button className="admin-nav-link admin-logout-btn" onClick={handleLogout} id="admin-logout">🚪 Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-breadcrumb">Admin Dashboard</div>
          <div className="admin-topbar-right" style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
              id="admin-theme-btn"
              style={{width:'38px', height:'38px', fontSize:'1rem'}}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <span className="badge badge-purple">Admin Mode</span>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        .admin-layout { display: flex; min-height: 100vh; }
        .admin-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: var(--nav-bg-scrolled, rgba(5, 0, 26, 0.9));
          backdrop-filter: blur(20px);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          overflow-y: auto;
        }
        .admin-brand { margin-bottom: 28px; }
        .admin-logo { font-size: 1.4rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 4px; }
        .admin-role-badge { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
        .admin-user-info {
          display: flex; align-items: center; gap: 12px;
          padding: 14px;
          background: rgba(168,85,247,0.08);
          border: 1px solid rgba(168,85,247,0.15);
          border-radius: var(--radius-md);
          margin-bottom: 28px;
        }
        .admin-avatar { width: 38px; height: 38px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 1rem; flex-shrink: 0; }
        .admin-user-name { font-weight: 600; font-size: 0.88rem; color: var(--text-primary); }
        .admin-user-email { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
        .admin-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .admin-nav-link {
          display: flex; align-items: center;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition-fast);
          border: none;
          background: none;
          cursor: pointer;
          font-family: var(--font);
          width: 100%;
          text-align: left;
        }
        .admin-nav-link:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .admin-nav-link.active { background: rgba(168,85,247,0.15); color: var(--purple-light); border-left: 2px solid var(--purple); }
        .admin-sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 4px; }
        .admin-logout-btn { color: #f87171 !important; }
        .admin-logout-btn:hover { background: rgba(239,68,68,0.1) !important; }
        .admin-main { margin-left: 260px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
        .admin-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 28px;
          background: var(--nav-bg, rgba(5,0,26,0.6));
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--glass-border);
          position: sticky; top: 0; z-index: 50;
        }
        .admin-breadcrumb { font-weight: 600; color: var(--text-primary); }
        .admin-content { padding: 28px; flex: 1; }
        @media (max-width: 768px) {
          .admin-sidebar { width: 220px; }
          .admin-main { margin-left: 220px; }
        }
      `}</style>
    </div>
  )
}
