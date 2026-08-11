import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function StarRating({ rating }) {
  return (
    <div className="stars" style={{gap:'3px'}}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{fontSize:'1.1rem', color: i <= Math.round(rating) ? '#f59e0b' : 'rgba(255,255,255,0.2)'}}>★</span>
      ))}
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    if (user.isAdmin) return
    try {
      setAdding(true)
      await addToCart(product._id, qty)
      showToast('Added to cart! 🛒')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return }
    if (user.isAdmin) return
    try {
      setAdding(true)
      await addToCart(product._id, qty)
      navigate('/cart')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>
  if (!product) return null

  const finalPrice = product.price * (1 - (product.discount || 0) / 100)
  const savings = product.price - finalPrice

  return (
    <div className="product-detail-page container fade-in">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="bc-current">{product.name}</span>
      </div>

      <div className="detail-grid">
        {/* Image */}
        <div className="detail-img-wrap glass-card" style={{padding:'0', overflow:'hidden', borderRadius:'var(--radius-xl)'}}>
          <img
            src={product.image}
            alt={product.name}
            className="detail-img"
            onError={(e) => { e.target.src='https://placehold.co/600x500/1a0050/a855f7?text=Product' }}
          />
          {product.discount > 0 && (
            <div className="detail-discount-badge">
              <span className="badge badge-green" style={{fontSize:'0.9rem', padding:'6px 14px'}}>
                {product.discount}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          <div className="detail-category">
            <span className="badge badge-purple">{product.category}</span>
            {product.stock > 0 ? (
              <span className="badge badge-green">✓ In Stock ({product.stock})</span>
            ) : (
              <span className="badge badge-red">✗ Out of Stock</span>
            )}
          </div>

          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            <StarRating rating={product.rating || 4} />
            <span className="detail-reviews">({(product.reviews || 0).toLocaleString()} reviews)</span>
          </div>

          <div className="detail-price-section glass-card" style={{padding:'24px'}}>
            <div className="detail-final-price">₹{finalPrice.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
            {product.discount > 0 && (
              <div className="detail-price-meta">
                <span className="price-original" style={{fontSize:'1rem'}}>₹{product.price.toLocaleString('en-IN')}</span>
                <span className="discount-badge" style={{fontSize:'0.85rem', padding:'4px 12px'}}>Save ₹{savings.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
              </div>
            )}
            <p style={{color:'var(--text-muted)', fontSize:'0.82rem', marginTop:'8px'}}>* Inclusive of all taxes. Free shipping on orders above ₹499.</p>
          </div>

          {/* Quantity */}
          {product.stock > 0 && !user?.isAdmin && (
            <div className="detail-qty">
              <label className="form-label">Quantity</label>
              <div className="qty-control" style={{width:'fit-content'}}>
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          {/* Actions */}
          {!user?.isAdmin && (
            <div className="detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                id="detail-add-cart-btn"
                style={{flex:1}}
              >
                {adding ? <><div className="spinner spinner-sm" /> Adding...</> : '🛒 Add to Cart'}
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={handleBuyNow}
                disabled={adding || product.stock === 0}
                id="detail-buy-now-btn"
                style={{flex:1}}
              >
                ⚡ Buy Now
              </button>
            </div>
          )}

          {!user && (
            <p style={{color:'var(--text-muted)', textAlign:'center', fontSize:'0.9rem'}}>
              <Link to="/login" style={{color:'var(--purple-light)', fontWeight:600}}>Login</Link> to add items to your cart
            </p>
          )}

          {/* Description */}
          <div className="detail-desc glass-card" style={{padding:'24px'}}>
            <h3 className="detail-desc-title">Product Description</h3>
            <p className="detail-desc-text">{product.description}</p>
          </div>

          {/* Delivery Info */}
          <div className="detail-delivery">
            <div className="delivery-item"><span>🚚</span><div><strong>Free Delivery</strong><p>On orders above ₹499</p></div></div>
            <div className="delivery-item"><span>↩️</span><div><strong>Easy Returns</strong><p>30-day return policy</p></div></div>
            <div className="delivery-item"><span>🔒</span><div><strong>Secure Payment</strong><p>SSL encrypted</p></div></div>
          </div>
        </div>
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <style>{`
        .product-detail-page { padding: 32px 24px 80px; }
        .breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; font-size: 0.85rem; color: var(--text-muted); flex-wrap: wrap; }
        .breadcrumb a { color: var(--text-muted); text-decoration: none; transition: var(--transition-fast); }
        .breadcrumb a:hover { color: var(--purple-light); }
        .bc-current { color: var(--text-primary); font-weight: 500; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .detail-img-wrap { position: relative; background: rgba(10, 0, 40, 0.6); display: flex; align-items: center; justify-content: center; min-height: 320px; }
        .detail-img { width: 100%; max-height: 480px; object-fit: contain; display: block; padding: 16px; }
        .detail-discount-badge { position: absolute; top: 20px; left: 20px; }
        .detail-info { display: flex; flex-direction: column; gap: 24px; }
        .detail-category { display: flex; gap: 8px; flex-wrap: wrap; }
        .detail-name { font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 800; line-height: 1.3; color: var(--text-primary); }
        .detail-rating { display: flex; align-items: center; gap: 10px; }
        .detail-reviews { font-size: 0.85rem; color: var(--text-muted); }
        .detail-final-price { font-size: 2.2rem; font-weight: 900; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .detail-price-meta { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
        .detail-qty { display: flex; flex-direction: column; gap: 10px; }
        .detail-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .detail-desc-title { font-size: 1rem; font-weight: 700; margin-bottom: 12px; color: var(--text-primary); }
        .detail-desc-text { color: var(--text-muted); font-size: 0.92rem; line-height: 1.8; }
        .detail-delivery { display: flex; gap: 20px; flex-wrap: wrap; }
        .delivery-item { display: flex; align-items: flex-start; gap: 10px; flex: 1; min-width: 120px; }
        .delivery-item span { font-size: 1.4rem; }
        .delivery-item strong { font-size: 0.88rem; color: var(--text-primary); display: block; }
        .delivery-item p { font-size: 0.78rem; color: var(--text-muted); margin: 0; }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>
    </div>
  )
}
