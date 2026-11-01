import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('vizhop_theme') || 'dark';
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vizhop_theme', theme);
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setProfileOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Vizhop</span>
          </Link>

          {/* Center Links */}
          <div className="nav-links hide-mobile">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Products</Link>
            {user && !user.isAdmin && (
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>Orders</Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="nav-actions">
            {user && !user.isAdmin && (
              <Link to="/cart" className="nav-cart" id="navbar-cart-btn">
                <span className="cart-icon">🛒</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
              </Link>
            )}

            {user ? (
              <div className="profile-dropdown">
                <button className="nav-avatar" onClick={() => setProfileOpen(!profileOpen)} id="navbar-profile-btn">
                  <span className="avatar-text">{user.name.charAt(0).toUpperCase()}</span>
                </button>
                {profileOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-email">{user.email}</div>
                      {user.isAdmin && <span className="badge badge-purple" style={{marginTop: '6px', fontSize:'0.7rem'}}>Admin</span>}
                    </div>
                    <div className="dropdown-divider" />
                    {user.isAdmin ? (
                      <Link to="/admin" className="dropdown-item">📊 Dashboard</Link>
                    ) : (
                      <>
                        <Link to="/profile" className="dropdown-item">👤 My Profile</Link>
                        <Link to="/cart" className="dropdown-item">🛒 Cart {cartCount > 0 && `(${cartCount})`}</Link>
                      </>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout} id="navbar-logout-btn">🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth hide-mobile">
                <Link to="/login" className="btn btn-secondary btn-sm" id="navbar-login-btn">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" id="navbar-register-btn">Sign Up</Link>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              className="theme-toggle-pill"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
              id="navbar-theme-btn"
            >
              <span>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
            </button>

            {/* Mobile Hamburger */}
            <button className="hamburger show-mobile" onClick={() => setMenuOpen(!menuOpen)} id="navbar-hamburger">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link">Home</Link>
            <Link to="/products" className="mobile-link">Products</Link>
            {user && !user.isAdmin && <Link to="/profile" className="mobile-link">My Orders</Link>}
            {user && !user.isAdmin && <Link to="/cart" className="mobile-link">Cart {cartCount > 0 && `(${cartCount})`}</Link>}
            {user && user.isAdmin && <Link to="/admin" className="mobile-link">Admin Dashboard</Link>}
            {!user && <Link to="/login" className="mobile-link">Login</Link>}
            {!user && <Link to="/register" className="mobile-link">Sign Up</Link>}
            <button className="mobile-link theme-mobile-link" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
            </button>
            {user && <button className="mobile-link danger-link" onClick={handleLogout}>Logout</button>}
          </div>
        )}
      </nav>

      {profileOpen && <div className="overlay" onClick={() => setProfileOpen(false)} />}

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: var(--nav-bg, rgba(5, 0, 26, 0.5));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
          height: 72px;
        }
        .navbar.scrolled {
          background: var(--nav-bg-scrolled, rgba(5, 0, 26, 0.9));
          border-bottom-color: var(--nav-border-scrolled, rgba(255,255,255,0.08));
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }
        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.4rem;
          font-weight: 800;
          text-decoration: none;
          color: white;
        }
        .logo-icon { font-size: 1.6rem; }
        .logo-ez { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.9rem;
          transition: var(--transition);
          text-decoration: none;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
          background: rgba(255,255,255,0.08);
        }
        .nav-link.active { color: var(--purple-light); }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .nav-auth { display: flex; gap: 8px; }
        .nav-cart {
          position: relative;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition);
          text-decoration: none;
          font-size: 1.1rem;
        }
        .nav-cart:hover { background: rgba(168,85,247,0.2); border-color: rgba(168,85,247,0.4); }
        .cart-badge {
          position: absolute;
          top: -4px; right: -4px;
          background: var(--gradient-primary);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
        }
        .profile-dropdown { position: relative; }
        .nav-avatar {
          width: 40px; height: 40px;
          background: var(--gradient-primary);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition);
        }
        .nav-avatar:hover { box-shadow: 0 0 0 3px rgba(168,85,247,0.3); }
        .avatar-text { color: white; font-weight: 700; font-size: 0.95rem; }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          min-width: 220px;
          background: rgba(10, 0, 48, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          overflow: hidden;
          animation: fadeIn 0.2s ease;
        }
        .dropdown-header { padding: 16px; }
        .dropdown-name { font-weight: 600; color: var(--text-primary); }
        .dropdown-email { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
        .dropdown-divider { height: 1px; background: rgba(255,255,255,0.06); }
        .dropdown-item {
          display: block;
          padding: 12px 16px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition-fast);
          text-decoration: none;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-family: var(--font);
        }
        .dropdown-item:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .dropdown-item.danger { color: #f87171; }
        .dropdown-item.danger:hover { background: rgba(239,68,68,0.1); }
        .overlay { position: fixed; inset: 0; z-index: 999; }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .theme-toggle-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font);
        }
        .theme-toggle-pill:hover {
          background: rgba(168, 85, 247, 0.3);
          border-color: var(--purple-light);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
        }
        [data-theme="light"] .theme-toggle-pill {
          background: rgba(147, 51, 234, 0.1);
          border-color: rgba(147, 51, 234, 0.4);
          color: #9333ea;
        }
        .theme-mobile-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--purple-light);
          font-weight: 600;
        }
        .hamburger span { display: block; width: 22px; height: 2px; background: var(--text-secondary); border-radius: 2px; transition: var(--transition-fast); }
        .show-mobile { display: flex !important; }
        .mobile-menu {
          display: flex;
          flex-direction: column;
          background: rgba(5, 0, 26, 0.98);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 16px;
          gap: 4px;
        }
        .mobile-link {
          display: block;
          padding: 12px 16px;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
          font-size: 0.95rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-family: var(--font);
        }
        .mobile-link:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .danger-link { color: #f87171; width: 100%; }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hamburger { display: none !important; }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
