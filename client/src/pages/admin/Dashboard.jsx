import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const STATS = [
  { key: 'totalUsers', label: 'Total Users', icon: '👥', gradient: 'linear-gradient(135deg,#a855f7,#ec4899)' },
  { key: 'totalProducts', label: 'Total Products', icon: '📦', gradient: 'linear-gradient(135deg,#06b6d4,#a855f7)' },
  { key: 'totalOrders', label: 'Total Orders', icon: '🛒', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { key: 'totalRevenue', label: 'Total Revenue', icon: '💰', gradient: 'linear-gradient(135deg,#10b981,#06b6d4)', prefix: '₹' },
]

const STATUS_COLORS = {
  Pending: 'badge-yellow', Confirmed: 'badge-cyan', Processing: 'badge-purple',
  Shipped: 'badge-cyan', Delivered: 'badge-green', Cancelled: 'badge-red',
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex-center" style={{height:'400px'}}><div className="spinner" /></div>

  return (
    <div className="dashboard fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">📊 Dashboard</h1>
        <p style={{color:'var(--text-muted)'}}>Welcome back, Admin! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-4" style={{marginBottom:'32px'}}>
        {STATS.map(s => (
          <div key={s.key} className="glass-card stat-card">
            <div className="stat-icon" style={{fontSize:'2.2rem'}}>{s.icon}</div>
            <div className="stat-value" style={{background: s.gradient, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
              {s.prefix || ''}
              {s.key === 'totalRevenue'
                ? (stats[s.key] || 0).toLocaleString('en-IN', {maximumFractionDigits:0})
                : stats[s.key] || 0}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-2" style={{marginBottom:'32px'}}>
        <div className="glass-card" style={{padding:'20px'}}>
          <div className="mini-stat-row">
            <div className="mini-stat">
              <div className="mini-val badge-yellow" style={{background:'rgba(245,158,11,0.15)', color:'#fbbf24', border:'1px solid rgba(245,158,11,0.3)', padding:'4px 14px', borderRadius:'9999px', fontWeight:700}}>
                {stats?.pendingOrders || 0} Pending
              </div>
            </div>
            <div className="mini-stat">
              <div style={{background:'rgba(16,185,129,0.15)', color:'#34d399', border:'1px solid rgba(16,185,129,0.3)', padding:'4px 14px', borderRadius:'9999px', fontWeight:700}}>
                {stats?.deliveredOrders || 0} Delivered
              </div>
            </div>
          </div>
          <div style={{color:'var(--text-muted)', fontSize:'0.85rem', marginTop:'12px'}}>Order Status Overview</div>
        </div>
        <div className="glass-card" style={{padding:'20px', display:'flex', gap:'12px', flexWrap:'wrap'}}>
          <Link to="/admin/products/new" className="btn btn-primary btn-sm" id="dash-add-product">+ Add Product</Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm" id="dash-view-orders">View Orders</Link>
          <Link to="/admin/users" className="btn btn-secondary btn-sm" id="dash-view-users">View Users</Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card" style={{overflow:'hidden'}}>
        <div className="admin-table-header">
          <h2 className="admin-table-title">🕐 Recent Orders</h2>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm" id="dash-all-orders">View All</Link>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).map(order => (
                <tr key={order._id}>
                  <td style={{fontFamily:'monospace', color:'var(--purple-light)'}}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div style={{fontWeight:600, color:'var(--text-primary)'}}>{order.user?.name || 'N/A'}</div>
                    <div style={{fontSize:'0.78rem', color:'var(--text-muted)'}}>{order.user?.email}</div>
                  </td>
                  <td style={{fontWeight:700, color:'var(--text-primary)'}}>₹{order.totalPrice.toLocaleString('en-IN', {maximumFractionDigits:0})}</td>
                  <td><span className={`badge ${STATUS_COLORS[order.status] || 'badge-purple'}`}>{order.status}</span></td>
                  <td style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <tr><td colSpan={5} style={{textAlign:'center', color:'var(--text-muted)', padding:'32px'}}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .dashboard {}
        .admin-page-header { margin-bottom: 28px; }
        .admin-page-title { font-size: 1.8rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 6px; }
        .admin-table-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--glass-border); }
        .admin-table-title { font-weight: 700; font-size: 1rem; }
        .mini-stat-row { display: flex; gap: 12px; flex-wrap: wrap; }
      `}</style>
    </div>
  )
}
