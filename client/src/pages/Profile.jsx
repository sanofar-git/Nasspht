import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = {
  Pending: 'badge-yellow', Confirmed: 'badge-cyan', Processing: 'badge-purple',
  Shipped: 'badge-cyan', Delivered: 'badge-green', Cancelled: 'badge-red',
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', street: user?.address?.street || '', city: user?.address?.city || '', state: user?.address?.state || '', pincode: user?.address?.pincode || '' })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    axios.get('/api/orders/my-orders')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    try {
      const { data } = await axios.put('/api/auth/profile', {
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode }
      })
      updateUser(data)
      setSaveMsg('Profile updated successfully! ✓')
    } catch {
      setSaveMsg('Failed to update profile')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  return (
    <div className="profile-page container fade-in">
      {/* Profile Header */}
      <div className="profile-header glass-card">
        <div className="profile-avatar-big">{user?.name?.charAt(0).toUpperCase()}</div>
        <div className="profile-header-info">
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
          {user?.phone && <p className="profile-phone">📞 {user.phone}</p>}
        </div>
        <div className="profile-stats">
          <div className="pstat"><strong>{orders.length}</strong><span>Orders</span></div>
          <div className="pstat-div" />
          <div className="pstat"><strong>{orders.filter(o => o.status === 'Delivered').length}</strong><span>Delivered</span></div>
          <div className="pstat-div" />
          <div className="pstat"><strong>₹{orders.reduce((s, o) => s + o.totalPrice, 0).toLocaleString('en-IN', {maximumFractionDigits:0})}</strong><span>Spent</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')} id="tab-orders">📦 My Orders</button>
        <button className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')} id="tab-profile">👤 Edit Profile</button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="orders-list fade-in">
          {loading ? (
            <div className="flex-center" style={{height:'200px'}}><div className="spinner" /></div>
          ) : orders.length === 0 ? (
            <div className="empty-state glass-card">
              <div className="empty-state-icon">📦</div>
              <h3>No orders yet</h3>
              <p>Start shopping to see your orders here!</p>
              <Link to="/products" className="btn btn-primary">Shop Now</Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="order-card glass-card">
                <div className="order-card-header">
                  <div>
                    <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</div>
                  </div>
                  <div className="order-meta-right">
                    <span className={`badge ${STATUS_COLORS[order.status] || 'badge-purple'}`}>{order.status}</span>
                    <div className="order-total-tag">₹{order.totalPrice.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
                  </div>
                </div>
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="order-preview-item">
                      <img src={item.image} alt={item.name} className="order-preview-img" onError={(e)=>{e.target.src='https://via.placeholder.com/50/1a0050/a855f7?text=P'}} />
                      <div>
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-qty">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && <div className="order-more">+{order.items.length - 3} more items</div>}
                </div>
                <div className="order-address-line">
                  📍 {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Profile Edit Tab */}
      {activeTab === 'profile' && (
        <div className="profile-edit-card glass-card fade-in" style={{padding:'32px'}}>
          <h2 style={{marginBottom:'24px', fontWeight:700}}>Edit Profile</h2>
          {saveMsg && (
            <div className={`save-msg ${saveMsg.includes('Failed') ? 'save-error' : 'save-success'}`}>{saveMsg}</div>
          )}
          <form onSubmit={handleSave} className="profile-form">
            <div className="profile-form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" value={form.name} onChange={e => setForm(f=>({...f, name: e.target.value}))} id="profile-name-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" value={form.phone} onChange={e => setForm(f=>({...f, phone: e.target.value}))} placeholder="+91 99999 99999" id="profile-phone-input" />
              </div>
              <div className="form-group pf-full">
                <label className="form-label">Street Address</label>
                <input className="form-control" value={form.street} onChange={e => setForm(f=>({...f, street: e.target.value}))} placeholder="Street address" id="profile-street-input" />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-control" value={form.city} onChange={e => setForm(f=>({...f, city: e.target.value}))} placeholder="City" id="profile-city-input" />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-control" value={form.state} onChange={e => setForm(f=>({...f, state: e.target.value}))} placeholder="State" id="profile-state-input" />
              </div>
              <div className="form-group">
                <label className="form-label">PIN Code</label>
                <input className="form-control" value={form.pincode} onChange={e => setForm(f=>({...f, pincode: e.target.value}))} placeholder="400001" maxLength={6} id="profile-pin-input" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving} id="profile-save-btn">
              {saving ? <><div className="spinner spinner-sm" /> Saving...</> : '💾 Save Changes'}
            </button>
          </form>
        </div>
      )}

      <style>{`
        .profile-page { padding: 40px 24px 80px; display: flex; flex-direction: column; gap: 28px; }
        .profile-header { padding: 32px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .profile-avatar-big { width: 80px; height: 80px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 800; color: white; flex-shrink: 0; }
        .profile-header-info { flex: 1; }
        .profile-name { font-size: 1.6rem; font-weight: 800; }
        .profile-email { color: var(--text-muted); font-size: 0.9rem; margin-top: 4px; }
        .profile-phone { color: var(--text-muted); font-size: 0.88rem; margin-top: 4px; }
        .profile-stats { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .pstat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .pstat strong { font-size: 1.4rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .pstat span { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .pstat-div { width: 1px; height: 36px; background: var(--glass-border); }
        .profile-tabs { display: flex; gap: 8px; }
        .profile-tab { padding: 10px 24px; border-radius: var(--radius-full); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); font-family: var(--font); font-size: 0.9rem; cursor: pointer; transition: var(--transition); }
        .profile-tab.active { background: var(--gradient-primary); color: white; border-color: transparent; }
        .profile-tab:hover:not(.active) { background: rgba(255,255,255,0.1); }
        .orders-list { display: flex; flex-direction: column; gap: 16px; }
        .order-card { padding: 20px; }
        .order-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
        .order-id { font-weight: 700; font-size: 0.95rem; }
        .order-date { font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; }
        .order-meta-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .order-total-tag { font-weight: 700; font-size: 1rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .order-items-preview { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
        .order-preview-item { display: flex; align-items: center; gap: 12px; }
        .order-preview-img { width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; }
        .order-item-name { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
        .order-item-qty { font-size: 0.78rem; color: var(--text-muted); }
        .order-more { font-size: 0.8rem; color: var(--text-muted); font-style: italic; }
        .order-address-line { font-size: 0.8rem; color: var(--text-dim); border-top: 1px solid var(--glass-border); padding-top: 12px; }
        .profile-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .pf-full { grid-column: 1 / -1; }
        .save-msg { padding: 12px; border-radius: var(--radius-md); margin-bottom: 20px; font-size: 0.9rem; font-weight: 500; text-align: center; }
        .save-success { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); color: #34d399; }
        .save-error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
        @media (max-width: 640px) {
          .profile-header { flex-direction: column; text-align: center; }
          .profile-form-grid { grid-template-columns: 1fr; }
          .pf-full { grid-column: auto; }
        }
      `}</style>
    </div>
  )
}
