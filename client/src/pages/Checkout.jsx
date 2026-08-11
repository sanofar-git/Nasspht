import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const PAYMENT_METHODS = ['COD', 'UPI', 'Card', 'Net Banking']

export default function Checkout() {
  const { cart, cartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  })

  const items = cart?.items || []
  const deliveryFee = cartTotal >= 499 ? 0 : 49
  const total = cartTotal + deliveryFee

  const handleChange = e => setAddress(a => ({ ...a, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) { setError('Your cart is empty'); return }
    setLoading(true)
    setError('')
    try {
      const orderItems = items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.price,
        quantity: item.quantity,
      }))

      const { data } = await axios.post('/api/orders', {
        shippingAddress: address,
        paymentMethod,
        items: orderItems,
        totalPrice: total,
      })

      navigate(`/order-confirmation/${data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="checkout-page container fade-in">
      <h1 className="section-title" style={{textAlign:'left', marginBottom:'8px'}}>🏠 Checkout</h1>
      <p style={{color:'var(--text-muted)', marginBottom:'36px'}}>Review your order and provide shipping details</p>

      {error && <div className="checkout-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="checkout-layout">
          {/* Left: Address + Payment */}
          <div className="checkout-forms">
            {/* Shipping Address */}
            <div className="glass-card" style={{padding:'28px', marginBottom:'24px'}}>
              <h2 className="checkout-section-title">📍 Shipping Address</h2>
              <div className="checkout-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input name="fullName" className="form-control" value={address.fullName} onChange={handleChange} required placeholder="John Doe" id="checkout-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input name="phone" className="form-control" value={address.phone} onChange={handleChange} required placeholder="+91 99999 99999" id="checkout-phone" />
                </div>
                <div className="form-group checkout-full">
                  <label className="form-label">Street Address *</label>
                  <input name="street" className="form-control" value={address.street} onChange={handleChange} required placeholder="123, Street Name, Area" id="checkout-street" />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input name="city" className="form-control" value={address.city} onChange={handleChange} required placeholder="Mumbai" id="checkout-city" />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input name="state" className="form-control" value={address.state} onChange={handleChange} required placeholder="Maharashtra" id="checkout-state" />
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input name="pincode" className="form-control" value={address.pincode} onChange={handleChange} required placeholder="400001" id="checkout-pincode" maxLength={6} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="glass-card" style={{padding:'28px'}}>
              <h2 className="checkout-section-title">💳 Payment Method</h2>
              <div className="payment-methods">
                {PAYMENT_METHODS.map(method => (
                  <label key={method} className={`payment-option ${paymentMethod === method ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      style={{display:'none'}}
                    />
                    <span className="payment-icon">
                      {method === 'COD' ? '💵' : method === 'UPI' ? '📱' : method === 'Card' ? '💳' : '🏦'}
                    </span>
                    <span className="payment-label">{method === 'COD' ? 'Cash on Delivery' : method === 'Net Banking' ? 'Net Banking' : method}</span>
                    {paymentMethod === method && <span className="payment-check">✓</span>}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-summary">
            <div className="glass-card" style={{padding:'28px', position:'sticky', top:'92px'}}>
              <h2 className="checkout-section-title">📦 Order Summary</h2>
              <div className="checkout-items">
                {items.map(item => item.product && (
                  <div key={item._id} className="checkout-item">
                    <img src={item.product.image} alt={item.product.name} className="co-img" onError={(e)=>{e.target.src='https://placehold.co/60/1a0050/a855f7?text=P'}} />
                    <div className="co-info">
                      <div className="co-name">{item.product.name}</div>
                      <div className="co-qty">Qty: {item.quantity}</div>
                    </div>
                    <div className="co-price">₹{(item.price * item.quantity).toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
                  </div>
                ))}
              </div>

              <div className="summary-divider" style={{height:'1px', background:'var(--glass-border)', margin:'20px 0'}} />

              <div className="co-totals">
                <div className="co-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN', {maximumFractionDigits:0})}</span></div>
                <div className="co-row"><span>Delivery</span><span style={{color: deliveryFee === 0 ? '#34d399' : 'inherit'}}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                <div className="co-row co-total"><span>Total</span><span className="gradient-text">₹{total.toLocaleString('en-IN', {maximumFractionDigits:0})}</span></div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="place-order-btn" style={{marginTop:'24px', padding:'16px'}}>
                {loading ? <><div className="spinner spinner-sm" /> Placing Order...</> : '🛍️ Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        .checkout-page { padding: 40px 24px 80px; }
        .checkout-layout { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
        .checkout-section-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 20px; color: var(--text-primary); }
        .checkout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .checkout-full { grid-column: 1 / -1; }
        .checkout-error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 14px; border-radius: var(--radius-md); margin-bottom: 20px; }
        .payment-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .payment-option {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }
        .payment-option.active { background: rgba(168,85,247,0.12); border-color: rgba(168,85,247,0.4); }
        .payment-icon { font-size: 1.4rem; }
        .payment-label { font-size: 0.88rem; color: var(--text-secondary); flex: 1; font-weight: 500; }
        .payment-check { color: var(--purple-light); font-weight: 700; font-size: 1rem; }
        .checkout-items { display: flex; flex-direction: column; gap: 12px; }
        .checkout-item { display: flex; align-items: center; gap: 12px; }
        .co-img { width: 60px; height: 60px; object-fit: contain; border-radius: var(--radius-sm); background: rgba(10,0,40,0.7); padding: 4px; flex-shrink: 0; }
        .co-info { flex: 1; }
        .co-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); line-height: 1.3; }
        .co-qty { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
        .co-price { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); white-space: nowrap; }
        .co-totals { display: flex; flex-direction: column; gap: 10px; }
        .co-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-muted); }
        .co-total { font-weight: 700; font-size: 1rem; color: var(--text-primary); }
        @media (max-width: 900px) {
          .checkout-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .checkout-grid { grid-template-columns: 1fr; }
          .checkout-full { grid-column: auto; }
          .payment-methods { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
