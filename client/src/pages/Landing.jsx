import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

const features = [
  { icon: '🚀', title: 'Fast Delivery', desc: 'Get your orders delivered to your doorstep within 2-5 business days.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Multiple payment options with 256-bit SSL encryption for your safety.' },
  { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free return policy. No questions asked.' },
  { icon: '💎', title: 'Premium Quality', desc: 'All products are carefully curated and quality-checked before listing.' },
]

const categories = [
  { name: 'Electronics', icon: '💻', color: 'rgba(168,85,247,0.2)', border: 'rgba(168,85,247,0.3)' },
  { name: 'Clothing', icon: '👕', color: 'rgba(236,72,153,0.2)', border: 'rgba(236,72,153,0.3)' },
  { name: 'Footwear', icon: '👟', color: 'rgba(6,182,212,0.2)', border: 'rgba(6,182,212,0.3)' },
  { name: 'Bags', icon: '👜', color: 'rgba(245,158,11,0.2)', border: 'rgba(245,158,11,0.3)' },
  { name: 'Accessories', icon: '⌚', color: 'rgba(16,185,129,0.2)', border: 'rgba(16,185,129,0.3)' },
  { name: 'Sports', icon: '🏋️', color: 'rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.3)' },
]

export default function Landing() {
  const [featured, setFeatured] = useState([])
  const [limitedOffers, setLimitedOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 })

  useEffect(() => {
    // Fetch featured
    axios.get('/api/products?limit=4&sort=rating')
      .then(({ data }) => setFeatured(data.products || []))
      .catch(() => {})

    // Fetch products for limited offers
    axios.get('/api/products?limit=55')
      .then(({ data }) => {
        const prods = data.products || []
        // Filter products with discount >= 40%
        const discounted = prods
          .filter(p => p.discount >= 40)
          .sort((a, b) => b.discount - a.discount)
          .slice(0, 4)
        setLimitedOffers(discounted)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const target = new Date()
    target.setHours(23, 59, 59, 999) // Ends tonight

    const timer = setInterval(() => {
      const difference = target.getTime() - new Date().getTime()
      if (difference <= 0) {
        clearInterval(timer)
        return
      }
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const m = Math.floor((difference / 1000 / 60) % 60)
      const s = Math.floor((difference / 1000) % 60)
      setTimeLeft({ hours: h, minutes: m, seconds: s })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="landing fade-in">

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge badge-purple">🎉 New Arrivals Every Week</span>
          </div>
          <h1 className="hero-title">
            Shop Smarter,<br />
            <span className="gradient-text">Live Better</span>
          </h1>
          <p className="hero-subtitle">
            Vizhop is your one-stop destination for effortless online shopping.
            Discover thousands of premium products with amazing deals and fast delivery.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">
              🛍️ Shop Now
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg" id="hero-register-btn">
              Join Free →
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>10K+</strong><span>Products</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>50K+</strong><span>Customers</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>4.9★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="hero-float-card card-1">
              <span className="card-emoji">📱</span>
              <div>
                <div className="card-prod">iPhone 15 Pro</div>
                <div className="card-price gradient-text">₹79,999</div>
              </div>
            </div>
            <div className="hero-float-card card-2">
              <span className="card-emoji">💻</span>
              <div>
                <div className="card-prod">Laptop Pro</div>
                <div className="card-price gradient-text">₹89,999</div>
              </div>
            </div>
            <div className="hero-float-card card-3">
              <span className="card-emoji">🎧</span>
              <div>
                <div className="card-prod">Headphones</div>
                <div className="card-price gradient-text">₹2,499</div>
              </div>
            </div>
            <div className="hero-glow" />
          </div>
        </div>
      </section>

      {/* ─── PROJECT LINKS (for mentor) ─────────────────────────── */}
      <section className="project-links-section">
        <div className="container">
          <div className="project-links-card glass-card">
            <div className="project-links-content">
              <div className="project-links-text">
                <h2 className="section-title" style={{textAlign:'left', marginBottom:'8px'}}>📎 Project Links</h2>
                <p style={{color:'var(--text-muted)'}}>Review the live demo and source code for this project.</p>
              </div>
              <div className="project-links-btns">
                <a
                  href="YOUR_DEMO_LINK_HERE"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  id="demo-link-btn"
                >
                  🌐 Live Demo
                </a>
                <a
                  href="YOUR_GITHUB_LINK_HERE"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  id="github-link-btn"
                >
                  💻 GitHub Repo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our wide selection of product categories</p>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="category-card"
                style={{ '--cat-bg': cat.color, '--cat-border': cat.border }}
                id={`category-${cat.name.toLowerCase()}`}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIMITED TIME OFFERS ─────────────────────────────────── */}
      {limitedOffers.length > 0 && (
        <section className="section limited-offers-section" style={{paddingTop: 0}}>
          <div className="container">
            <div className="limited-offers-card glass-card">
              <div className="limited-offers-header">
                <div className="limited-offers-title-block">
                  <span className="limited-badge">⚡ FLASH SALE</span>
                  <h2 className="limited-title">Limited Time Offers</h2>
                  <p className="limited-subtitle">Huge discounts on premium products! Grab them before the timer runs out.</p>
                </div>
                <div className="countdown-container">
                  <span className="countdown-label">Ending in:</span>
                  <div className="countdown-timer">
                    <div className="countdown-time-box">
                      <span className="time-val">{timeLeft.hours.toString().padStart(2, '0')}</span>
                      <span className="time-unit">hr</span>
                    </div>
                    <span className="timer-separator">:</span>
                    <div className="countdown-time-box">
                      <span className="time-val">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                      <span className="time-unit">min</span>
                    </div>
                    <span className="timer-separator">:</span>
                    <div className="countdown-time-box">
                      <span className="time-val">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                      <span className="time-unit">sec</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-4" style={{marginTop: '30px'}}>
                {limitedOffers.map(p => (
                  <div key={p._id} className="limited-offer-card-wrapper">
                    <span className="sale-banner-tag">🔥 HOT DEAL</span>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURED PRODUCTS ──────────────────────────────────── */}
      <section className="section" style={{paddingTop: 0}}>
        <div className="container">
          <div className="flex-between" style={{marginBottom:'40px'}}>
            <div>
              <h2 className="section-title" style={{textAlign:'left', marginBottom:'8px'}}>🔥 Top Rated Products</h2>
              <p style={{color:'var(--text-muted)'}}>Our most loved products by customers</p>
            </div>
            <Link to="/products" className="btn btn-secondary" id="view-all-products-btn">View All →</Link>
          </div>
          {loading ? (
            <div className="flex-center" style={{height:'200px'}}><div className="spinner"></div></div>
          ) : (
            <div className="grid grid-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────── */}
      <section className="section" style={{paddingTop: 0}}>
        <div className="container">
          <h2 className="section-title">Why Choose Vizhop?</h2>
          <p className="section-subtitle">We make online shopping simple, safe, and satisfying</p>
          <div className="grid grid-4">
            {features.map(f => (
              <div key={f.title} className="feature-card glass-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CUSTOMER REVIEWS & FEEDBACK ────────────────────────── */}
      <section className="section" style={{paddingTop: 0}}>
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'48px'}}>
            <h2 className="section-title">⭐ Customer Feedback & Reviews</h2>
            <p className="section-subtitle">Real experiences and verified feedback from our happy shoppers</p>
          </div>
          <div className="grid grid-3">
            <div className="glass-card" style={{padding:'28px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
                <div style={{width:'44px', height:'44px', borderRadius:'50%', background:'var(--gradient-primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700}}>P</div>
                <div>
                  <div style={{fontWeight:700, color:'var(--text-primary)'}}>Priya Sharma</div>
                  <div style={{fontSize:'0.75rem', color:'var(--green)'}}>✓ Verified Buyer · Bengaluru</div>
                </div>
              </div>
              <div style={{color:'var(--yellow)', marginBottom:'12px', fontSize:'1.1rem'}}>★★★★★</div>
              <p style={{color:'var(--text-secondary)', fontSize:'0.92rem', lineHeight:1.6}}>
                "Vizhop has become my go-to store! The noise-cancelling headphones arrived in just 2 days. Sound quality is remarkable, packaging was pristine!"
              </p>
            </div>

            <div className="glass-card" style={{padding:'28px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
                <div style={{width:'44px', height:'44px', borderRadius:'50%', background:'var(--gradient-secondary)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700}}>R</div>
                <div>
                  <div style={{fontWeight:700, color:'var(--text-primary)'}}>Rahul Verma</div>
                  <div style={{fontSize:'0.75rem', color:'var(--green)'}}>✓ Verified Buyer · Chennai</div>
                </div>
              </div>
              <div style={{color:'var(--yellow)', marginBottom:'12px', fontSize:'1.1rem'}}>★★★★★</div>
              <p style={{color:'var(--text-secondary)', fontSize:'0.92rem', lineHeight:1.6}}>
                "Ordered the Ultra-Slim Laptop for my remote work. The 4K OLED display and battery life are top tier. Smooth checkout process with instant UPI!"
              </p>
            </div>

            <div className="glass-card" style={{padding:'28px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
                <div style={{width:'44px', height:'44px', borderRadius:'50%', background:'var(--gradient-success)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700}}>K</div>
                <div>
                  <div style={{fontWeight:700, color:'var(--text-primary)'}}>Karthik Rajan</div>
                  <div style={{fontSize:'0.75rem', color:'var(--green)'}}>✓ Verified Buyer · Chennai</div>
                </div>
              </div>
              <div style={{color:'var(--yellow)', marginBottom:'12px', fontSize:'1.1rem'}}>★★★★★</div>
              <p style={{color:'var(--text-secondary)', fontSize:'0.92rem', lineHeight:1.6}}>
                "Got the DSLR Camera kit and Leather Backpack. Both exceeded my expectations. Outstanding customer support and genuine original products."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────── */}
      <section className="section" style={{paddingTop: 0}}>
        <div className="container">
          <div className="cta-card glass-card">
            <h2 className="cta-title">Ready to Start Shopping?</h2>
            <p className="cta-subtitle">Join thousands of happy customers and discover amazing products today.</p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link to="/register" className="btn btn-primary btn-lg" id="cta-signup-btn">Create Free Account</Link>
              <Link to="/products" className="btn btn-secondary btn-lg" id="cta-browse-btn">Browse Products</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .landing { overflow-x: hidden; }
        .hero {
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          padding: 80px 24px;
          max-width: 1280px;
          margin: 0 auto;
          gap: 80px;
        }
        .hero-content { flex: 1; }
        .hero-badge { margin-bottom: 24px; }
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 24px;
          color: var(--text-primary);
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.8;
          max-width: 520px;
          margin-bottom: 36px;
        }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
        .hero-stats { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
        .hero-stat { display: flex; flex-direction: column; gap: 2px; }
        .hero-stat strong { font-size: 1.6rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-stat span { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
        .hero-stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }
        .hero-visual { flex: 1; display: flex; justify-content: center; align-items: center; }
        .hero-card-stack { position: relative; width: 320px; height: 320px; }
        .hero-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 3s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{ transform: translate(-50%,-50%) scale(1); opacity:0.6; } 50%{ transform: translate(-50%,-50%) scale(1.1); opacity:1; } }
        .hero-float-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-lg);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          min-width: 180px;
          z-index: 2;
        }
        .card-emoji { font-size: 2rem; }
        .card-prod { font-size: 0.8rem; color: var(--text-muted); }
        .card-price { font-weight: 700; font-size: 1rem; }
        .card-1 { top: 20px; left: 0; animation: float1 6s ease-in-out infinite; }
        .card-2 { top: 50%; left: 50%; transform: translateY(-50%); animation: float2 7s ease-in-out infinite; }
        .card-3 { bottom: 20px; left: 20px; animation: float3 8s ease-in-out infinite; }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float2 { 0%,100%{transform:translateY(-50%) translateX(0)} 50%{transform:translateY(calc(-50% - 10px)) translateX(5px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .limited-offers-section { margin-bottom: 40px; }
        .limited-offers-card { 
          padding: 40px; 
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%);
          border: 1px solid rgba(239, 68, 68, 0.2);
          box-shadow: 0 20px 50px rgba(239, 68, 68, 0.06);
          border-radius: var(--radius-xl);
          position: relative;
          overflow: hidden;
        }
        .limited-offers-card::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%);
          z-index: 0;
          pointer-events: none;
        }
        .limited-offers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .limited-offers-title-block { flex: 1; }
        .limited-badge {
          background: var(--gradient-primary);
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          letter-spacing: 0.05em;
          display: inline-block;
          margin-bottom: 12px;
          box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
        }
        .limited-title {
          font-size: 2rem;
          font-weight: 850;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .limited-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .countdown-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }
        .countdown-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 700;
        }
        .countdown-timer {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .countdown-time-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          min-width: 60px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .time-val {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ef4444;
          font-family: monospace;
          line-height: 1;
        }
        .time-unit {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-top: 2px;
        }
        .timer-separator {
          font-size: 1.5rem;
          font-weight: 900;
          color: rgba(239, 68, 68, 0.8);
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .limited-offer-card-wrapper {
          position: relative;
          z-index: 1;
        }
        .sale-banner-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-md);
          z-index: 10;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .limited-offers-card { padding: 24px; }
          .limited-offers-header { flex-direction: column; align-items: flex-start; }
          .countdown-container { align-items: flex-start; margin-top: 8px; }
        }

        .project-links-section { padding: 0 0 40px; }
        .project-links-card { padding: 32px 40px; }
        .project-links-content { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .project-links-btns { display: flex; gap: 12px; flex-wrap: wrap; }

        .categories-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 28px 16px;
          background: var(--cat-bg);
          border: 1px solid var(--cat-border);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: var(--transition);
          cursor: pointer;
        }
        .category-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
        .category-icon { font-size: 2.2rem; }
        .category-name { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
        .feature-card { padding: 32px 24px; text-align: center; }
        .feature-icon { font-size: 2.5rem; margin-bottom: 16px; }
        .feature-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 10px; color: var(--text-primary); }
        .feature-desc { font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; }
        .cta-card { padding: 64px 40px; text-align: center; background: linear-gradient(135deg, rgba(168,85,247,0.1), rgba(236,72,153,0.05)); }
        .cta-title { font-size: 2.2rem; font-weight: 800; margin-bottom: 16px; }
        .cta-subtitle { color: var(--text-muted); font-size: 1rem; margin-bottom: 36px; }

        @media (max-width: 1024px) {
          .hero { flex-direction: column; text-align: center; }
          .hero-subtitle { margin-left: auto; margin-right: auto; }
          .hero-actions { justify-content: center; }
          .hero-stats { justify-content: center; }
          .categories-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .hero { padding: 40px 16px; }
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
          .project-links-content { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}
