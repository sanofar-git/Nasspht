import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, cartTotal, cartCount, updateItem, removeItem, loading } = useCart()
  const navigate = useNavigate()

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>

  const items = cart?.items || []

  if (items.length === 0) {
    return (
      <div className="cart-page container fade-in">
        <h1 className="section-title" style={{textAlign:'left', marginBottom:'40px'}}>🛒 My Cart</h1>
        <div className="empty-state glass-card" style={{padding:'80px'}}>
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some amazing products to get started!</p>
          <Link to="/products" className="btn btn-primary" id="cart-browse-btn">Browse Products</Link>
        </div>

        <style>{`
          .cart-page { padding: 40px 24px 80px; }
        `}</style>
      </div>
    )
  }

  const deliveryFee = cartTotal >= 499 ? 0 : 49
  const total = cartTotal + deliveryFee

  return (
    <div className="cart-page container fade-in">
      <h1 className="section-title" style={{textAlign:'left', marginBottom:'8px'}}>🛒 My Cart</h1>
      <p style={{color:'var(--text-muted)', marginBottom:'32px'}}>{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {items.map(item => {
            const product = item.product
            if (!product) return null
            const itemTotal = item.price * item.quantity
            return (
              <div key={item._id} className="cart-item glass-card">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="cart-item-img"
                  onError={(e) => { e.target.src='https://placehold.co/100x100/1a0050/a855f7?text=P' }}
                />
                <div className="cart-item-info">
                  <Link to={`/products/${product._id}`} className="cart-item-name">{product.name}</Link>
                  <div className="cart-item-price-each">₹{item.price.toLocaleString('en-IN', {maximumFractionDigits:0})} each</div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateItem(item._id, item.quantity - 1)}>−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateItem(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItem(item._id)}
                      id={`remove-cart-${item._id}`}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  ₹{itemTotal.toLocaleString('en-IN', {maximumFractionDigits:0})}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <div className="glass-card" style={{padding:'28px'}}>
            <h3 className="cart-summary-title">Order Summary</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-green' : ''}>
                  {deliveryFee === 0 ? 'FREE 🎉' : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <div className="free-delivery-hint">
                  Add ₹{(499 - cartTotal).toLocaleString('en-IN')} more for free delivery
                </div>
              )}
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span className="gradient-text">₹{total.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={() => navigate('/checkout')}
              id="cart-checkout-btn"
              style={{marginTop:'24px'}}
            >
              Proceed to Checkout →
            </button>

            <Link to="/products" className="btn btn-secondary btn-full" style={{marginTop:'12px'}} id="cart-continue-btn">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page { padding: 40px 24px 80px; }
        .cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
        .cart-items { display: flex; flex-direction: column; gap: 16px; }
        .cart-item { display: flex; align-items: center; gap: 20px; padding: 20px; }
        .cart-item-img { width: 90px; height: 90px; object-fit: contain; border-radius: var(--radius-md); flex-shrink: 0; background: rgba(10,0,40,0.6); padding: 4px; }
        .cart-item-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .cart-item-name { font-weight: 600; color: var(--text-primary); text-decoration: none; font-size: 0.95rem; transition: var(--transition-fast); }
        .cart-item-name:hover { color: var(--purple-light); }
        .cart-item-price-each { font-size: 0.85rem; color: var(--text-muted); }
        .cart-item-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .cart-item-total { font-size: 1.1rem; font-weight: 700; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; white-space: nowrap; }
        .cart-summary-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; }
        .summary-rows { display: flex; flex-direction: column; gap: 12px; }
        .summary-row { display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.9rem; }
        .text-green { color: #34d399; font-weight: 600; }
        .free-delivery-hint { font-size: 0.78rem; color: var(--cyan); background: rgba(6,182,212,0.1); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(6,182,212,0.2); }
        .summary-divider { height: 1px; background: var(--glass-border); }
        .summary-total { font-weight: 700; font-size: 1rem; color: var(--text-primary); }
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-item { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  )
}
