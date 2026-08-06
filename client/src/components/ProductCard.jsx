import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'star' : 'star star-empty'}>★</span>
      ))}
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const finalPrice = product.price * (1 - (product.discount || 0) / 100)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user || user.isAdmin) return
    try {
      setAdding(true)
      await addToCart(product._id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      alert(err.message)
    } finally {
      setAdding(false)
    }
  }

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300/1a0050/a855f7?text=Product' }}
        />
        {product.discount > 0 && (
          <span className="product-discount-badge">-{product.discount}%</span>
        )}
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
        <div className="product-overlay">
          <span className="badge badge-purple">{product.category}</span>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <StarRating rating={product.rating || 4} />
          <span className="rating-count">({product.reviews || 0})</span>
        </div>

        <div className="product-price-row">
          <div>
            <div className="price-final">₹{finalPrice.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
            {product.discount > 0 && (
              <div className="price-original">₹{product.price.toLocaleString('en-IN')}</div>
            )}
          </div>
          {user && !user.isAdmin && product.stock > 0 && (
            <button
              className={`btn ${added ? 'btn-success' : 'btn-primary'} btn-sm`}
              onClick={handleAddToCart}
              disabled={adding}
              id={`add-cart-${product._id}`}
            >
              {adding ? '...' : added ? '✓' : '🛒'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: var(--transition);
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          position: relative;
        }
        .product-card:hover {
          border-color: var(--glass-border-hover);
          box-shadow: var(--glass-shadow-hover);
          transform: translateY(-4px);
        }
        .product-img-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4/3;
        }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-card:hover .product-img { transform: scale(1.05); }
        .product-discount-badge {
          position: absolute;
          top: 12px; left: 12px;
          background: var(--gradient-primary);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          z-index: 2;
        }
        .out-of-stock-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }
        .out-of-stock-overlay span {
          background: rgba(239,68,68,0.8);
          color: white;
          padding: 8px 20px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.85rem;
        }
        .product-overlay {
          position: absolute;
          bottom: 12px; right: 12px;
          z-index: 2;
        }
        .product-info { padding: 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .product-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-rating { display: flex; align-items: center; gap: 6px; }
        .rating-count { font-size: 0.78rem; color: var(--text-muted); }
        .product-price-row { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
      `}</style>
    </Link>
  )
}
