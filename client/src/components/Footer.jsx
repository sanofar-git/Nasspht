import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span>⚡</span>
              <span>Vizhop</span>
            </div>
            <p className="footer-tagline">Your one-stop destination for effortless online shopping. Discover amazing products at unbeatable prices.</p>
            <div className="social-links">
              <a href="#" className="social-btn" aria-label="Twitter">𝕏</a>
              <a href="#" className="social-btn" aria-label="Instagram">📸</a>
              <a href="#" className="social-btn" aria-label="Facebook">f</a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=Electronics">Electronics</Link></li>
              <li><Link to="/products?category=Clothing">Clothing</Link></li>
              <li><Link to="/products?category=Footwear">Footwear</Link></li>
              <li><Link to="/products?category=Accessories">Accessories</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Project Links</h4>
            <ul className="footer-links">
              <li>
                <a href="YOUR_DEMO_LINK_HERE" target="_blank" rel="noreferrer" className="footer-link-special">
                  🌐 Live Demo
                </a>
              </li>
              <li>
                <a href="YOUR_GITHUB_LINK_HERE" target="_blank" rel="noreferrer" className="footer-link-special">
                  💻 GitHub Repository
                </a>
              </li>
            </ul>
            <div className="footer-contact">
              <h4 className="footer-heading" style={{marginTop: '24px'}}>Contact</h4>
              <p style={{color: 'var(--text-muted)', fontSize:'0.85rem'}}>📧 vizhop@example.com</p>
              <p style={{color: 'var(--text-muted)', fontSize:'0.85rem'}}>📞 +91 99999 99999</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider" />
          <div className="footer-bottom-content">
            <p>© {new Date().getFullYear()} Vizhop. All rights reserved. Built with ❤️ using MERN Stack.</p>
            <p className="footer-tech">React • Node.js • Express • MongoDB</p>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: rgba(5, 0, 26, 0.8);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 64px 0 32px;
          margin-top: 80px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 48px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.4rem;
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
        }
        .footer-tagline {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .social-links { display: flex; gap: 10px; }
        .social-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          text-decoration: none;
          transition: var(--transition);
          font-weight: 700;
          font-size: 0.85rem;
        }
        .social-btn:hover {
          background: rgba(168,85,247,0.2);
          border-color: rgba(168,85,247,0.4);
          color: var(--purple-light);
          transform: translateY(-2px);
        }
        .footer-heading {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links a {
          color: var(--text-muted);
          font-size: 0.9rem;
          text-decoration: none;
          transition: var(--transition-fast);
        }
        .footer-links a:hover { color: var(--purple-light); }
        .footer-link-special {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.2);
          border-radius: var(--radius-md);
          color: var(--purple-light) !important;
          font-size: 0.85rem;
          font-weight: 600;
          transition: var(--transition) !important;
        }
        .footer-link-special:hover {
          background: rgba(168,85,247,0.2) !important;
          border-color: rgba(168,85,247,0.4) !important;
          transform: translateY(-1px);
        }
        .footer-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 40px 0 24px; }
        .footer-bottom-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-bottom-content p { color: var(--text-dim); font-size: 0.85rem; }
        .footer-tech {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600 !important;
        }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
          .footer-bottom-content { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  )
}
