import { useState, useEffect } from 'react'
import axios from 'axios'

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const STATUS_COLORS = {
  Pending: 'badge-yellow', Confirmed: 'badge-cyan', Processing: 'badge-purple',
  Shipped: 'badge-cyan', Delivered: 'badge-green', Cancelled: 'badge-red',
}

export default function AllOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    axios.get('/api/admin/orders')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      const { data } = await axios.put(`/api/admin/orders/${id}/status`, { status })
      setOrders(orders.map(o => o._id === id ? { ...o, status: data.status } : o))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="all-orders fade-in">
      <div className="admin-page-header" style={{marginBottom:'28px'}}>
        <h1 className="admin-page-title">🛒 All Orders</h1>
        <p style={{color:'var(--text-muted)'}}>{orders.length} total orders</p>
      </div>

      {/* Status Filter */}
      <div className="order-filters">
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            className={`order-filter-btn ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
            id={`filter-status-${s.toLowerCase()}`}
          >
            {s}
            <span className="filter-count">
              {s === 'All' ? orders.length : orders.filter(o => o.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-center" style={{height:'300px'}}><div className="spinner" /></div>
      ) : (
        <div className="orders-grid">
          {filtered.length === 0 ? (
            <div className="empty-state glass-card">
              <div className="empty-state-icon">📦</div>
              <h3>No orders found</h3>
              <p>No orders matching the selected filter</p>
            </div>
          ) : filtered.map(order => (
            <div key={order._id} className="admin-order-card glass-card">
              <div className="aoc-header">
                <div>
                  <div className="aoc-id">#{order._id.slice(-8).toUpperCase()}</div>
                  <div className="aoc-date">{new Date(order.createdAt).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</div>
                </div>
                <span className={`badge ${STATUS_COLORS[order.status] || 'badge-purple'}`}>{order.status}</span>
              </div>

              <div className="aoc-body">
                <div className="aoc-customer">
                  <div className="aoc-avatar">{order.user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                  <div>
                    <div className="aoc-name">{order.user?.name || 'N/A'}</div>
                    <div className="aoc-email">{order.user?.email}</div>
                  </div>
                </div>

                <div className="aoc-items-preview">
                  {order.items.slice(0, 2).map((item, i) => (
                    <div key={i} className="aoc-item">
                      <img src={item.image} alt={item.name} className="aoc-item-img" onError={(e)=>{e.target.src='https://via.placeholder.com/40/1a0050/a855f7?text=P'}} />
                      <span className="aoc-item-name">{item.name} ×{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && <div style={{fontSize:'0.78rem', color:'var(--text-muted)'}}>+{order.items.length - 2} more</div>}
                </div>

                <div className="aoc-address">
                  📍 {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </div>

                <div className="aoc-footer">
                  <div className="aoc-total">₹{order.totalPrice.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{fontSize:'0.82rem', color:'var(--text-muted)'}}>Update:</span>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      disabled={updating === order._id}
                      id={`status-select-${order._id}`}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {updating === order._id && <div className="spinner spinner-sm" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-page-title { font-size: 1.8rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 6px; }
        .order-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .order-filter-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-full);
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-fast);
          font-family: var(--font);
        }
        .order-filter-btn.active { background: rgba(168,85,247,0.15); color: var(--purple-light); border-color: rgba(168,85,247,0.3); }
        .filter-count { background: rgba(255,255,255,0.08); padding: 2px 7px; border-radius: 9999px; font-size: 0.75rem; }
        .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }
        .admin-order-card { overflow: hidden; }
        .aoc-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .aoc-id { font-family: monospace; font-weight: 700; color: var(--purple-light); font-size: 0.95rem; }
        .aoc-date { font-size: 0.78rem; color: var(--text-muted); margin-top: 3px; }
        .aoc-body { padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 12px; }
        .aoc-customer { display: flex; align-items: center; gap: 10px; }
        .aoc-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--gradient-secondary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 0.9rem; flex-shrink: 0; }
        .aoc-name { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }
        .aoc-email { font-size: 0.78rem; color: var(--text-muted); }
        .aoc-items-preview { display: flex; flex-direction: column; gap: 6px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); }
        .aoc-item { display: flex; align-items: center; gap: 8px; }
        .aoc-item-img { width: 32px; height: 32px; border-radius: 4px; object-fit: cover; }
        .aoc-item-name { font-size: 0.82rem; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
        .aoc-address { font-size: 0.82rem; color: var(--text-muted); }
        .aoc-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.04); flex-wrap: wrap; gap: 10px; }
        .aoc-total { font-weight: 800; font-size: 1.1rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .status-select {
          padding: 6px 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: var(--font);
          font-size: 0.82rem;
          cursor: pointer;
        }
        .status-select option { background: #1a0050; }
      `}</style>
    </div>
  )
}
