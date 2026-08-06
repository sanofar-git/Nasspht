import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const STATUS_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered']

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-loading"><div className="spinner" /></div>

  if (!order) return (
    <div className="container" style={{padding:'80px 24px', textAlign:'center'}}>
      <h2>Order not found</h2>
      <Link to="/" className="btn btn-primary" style={{marginTop:'20px'}}>Go Home</Link>
    </div>
  )

  const stepIndex = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="oc-page container fade-in">
      {/* Success Banner */}
      <div className="oc-success glass-card">
        <div className="oc-checkmark">✓</div>
        <h1 className="oc-title">Order Placed Successfully!</h1>
        <p className="oc-subtitle">Thank you for shopping with ShopEZ. Your order has been confirmed.</p>
        <div className="oc-id">Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong></div>
      </div>

      {/* Order Status Track */}
      <div className="glass-card" style={{padding:'32px'}}>
        <h2 className="oc-section-title">📍 Order Status</h2>
        <div className="status-track">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className={`track-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'current' : ''}`}>
              <div className="track-dot">
                {i < stepIndex ? '✓' : i === stepIndex ? '●' : '○'}
              </div>
              <div className="track-label">{step}</div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`track-line ${i < stepIndex ? 'done' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="oc-grid">
        {/* Order Items */}
        <div className="glass-card" style={{padding:'28px'}}>
          <h2 className="oc-section-title">📦 Items Ordered</h2>
          <div className="oc-items">
            {order.items.map((item, i) => (
              <div key={i} className="oc-item">
                <img src={item.image} alt={item.name} className="oc-item-img" onError={(e)=>{e.target.src='https://via.placeholder.com/60/1a0050/a855f7?text=P'}} />
                <div className="oc-item-info">
                  <div className="oc-item-name">{item.name}</div>
                  <div className="oc-item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="oc-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
              </div>
            ))}
          </div>
          <div className="oc-total-row">
            <span>Total Paid</span>
            <span className="oc-total gradient-text">₹{order.totalPrice.toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div>
          <div className="glass-card" style={{padding:'28px', marginBottom:'20px'}}>
            <h2 className="oc-section-title">📍 Delivery Address</h2>
            <div className="oc-address">
              <div className="oc-addr-name">{order.shippingAddress.fullName}</div>
              <div className="oc-addr-line">{order.shippingAddress.street}</div>
              <div className="oc-addr-line">{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</div>
              <div className="oc-addr-line">📞 {order.shippingAddress.phone}</div>
            </div>
          </div>
          <div className="glass-card" style={{padding:'28px'}}>
            <h2 className="oc-section-title">💳 Payment</h2>
            <div className="oc-payment">
              <span className="badge badge-green">{order.paymentMethod}</span>
              <span style={{color:'var(--text-muted)', fontSize:'0.88rem', marginTop:'8px', display:'block'}}>
                {order.paymentMethod === 'COD' ? 'Pay when your order arrives' : 'Payment confirmed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="oc-actions">
        <Link to="/profile" className="btn btn-secondary btn-lg" id="oc-my-orders-btn">📦 My Orders</Link>
        <Link to="/products" className="btn btn-primary btn-lg" id="oc-continue-btn">🛍️ Continue Shopping</Link>
      </div>

      <style>{`
        .oc-page { padding: 40px 24px 80px; display: flex; flex-direction: column; gap: 24px; }
        .oc-success { padding: 48px; text-align: center; background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.05)); }
        .oc-checkmark { width: 72px; height: 72px; background: var(--gradient-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: white; margin: 0 auto 20px; animation: bounceIn 0.5s ease; }
        @keyframes bounceIn { 0%{ transform: scale(0); } 60%{ transform: scale(1.1); } 100%{ transform: scale(1); } }
        .oc-title { font-size: 2rem; font-weight: 800; margin-bottom: 12px; }
        .oc-subtitle { color: var(--text-muted); font-size: 1rem; margin-bottom: 20px; }
        .oc-id { font-size: 0.9rem; color: var(--text-muted); }
        .oc-id strong { color: var(--purple-light); }
        .oc-section-title { font-size: 1rem; font-weight: 700; margin-bottom: 20px; color: var(--text-primary); }
        .status-track { display: flex; align-items: flex-start; position: relative; overflow-x: auto; padding: 8px 0; }
        .track-step { display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 80px; position: relative; }
        .track-dot { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 700; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.15); color: var(--text-dim); transition: var(--transition); z-index: 1; }
        .track-step.done .track-dot { background: var(--gradient-success); border-color: transparent; color: white; }
        .track-step.current .track-dot { background: var(--gradient-primary); border-color: transparent; color: white; box-shadow: 0 0 20px rgba(168,85,247,0.5); }
        .track-label { font-size: 0.75rem; color: var(--text-dim); margin-top: 8px; text-align: center; }
        .track-step.done .track-label, .track-step.current .track-label { color: var(--text-secondary); font-weight: 600; }
        .track-line { position: absolute; top: 18px; left: calc(50% + 18px); right: calc(-50% + 18px); height: 2px; background: rgba(255,255,255,0.1); z-index: 0; }
        .track-line.done { background: var(--gradient-success); }
        .oc-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
        .oc-items { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
        .oc-item { display: flex; align-items: center; gap: 12px; }
        .oc-item-img { width: 52px; height: 52px; object-fit: cover; border-radius: var(--radius-sm); }
        .oc-item-info { flex: 1; }
        .oc-item-name { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
        .oc-item-qty { font-size: 0.78rem; color: var(--text-muted); }
        .oc-item-price { font-weight: 700; color: var(--text-primary); }
        .oc-total-row { display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px solid var(--glass-border); font-weight: 700; font-size: 1rem; }
        .oc-total { font-size: 1.3rem; }
        .oc-address { display: flex; flex-direction: column; gap: 6px; }
        .oc-addr-name { font-weight: 700; font-size: 1rem; }
        .oc-addr-line { color: var(--text-muted); font-size: 0.88rem; }
        .oc-payment { }
        .oc-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 8px; }
        @media (max-width: 900px) { .oc-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
