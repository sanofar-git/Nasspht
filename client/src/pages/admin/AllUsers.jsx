import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AllUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get('/api/admin/users')
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await axios.delete(`/api/admin/users/${id}`)
      setUsers(u => u.filter(x => x._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-users fade-in">
      <div className="admin-page-header flex-between" style={{flexWrap:'wrap', gap:'16px', marginBottom:'28px'}}>
        <div>
          <h1 className="admin-page-title">👥 All Users</h1>
          <p style={{color:'var(--text-muted)'}}>{users.length} registered users</p>
        </div>
        <input
          className="form-control"
          style={{width:'280px'}}
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          id="users-search"
        />
      </div>

      <div className="glass-card" style={{overflow:'hidden'}}>
        {loading ? (
          <div className="flex-center" style={{height:'300px'}}><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{textAlign:'center', color:'var(--text-muted)', padding:'40px'}}>No users found</td></tr>
                ) : filtered.map((user, i) => (
                  <tr key={user._id}>
                    <td style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>{i + 1}</td>
                    <td>
                      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div style={{width:'36px', height:'36px', borderRadius:'50%', background:'var(--gradient-primary)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'white', flexShrink:0}}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{fontWeight:600, color:'var(--text-primary)'}}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{color:'var(--text-muted)', fontSize:'0.88rem'}}>{user.email}</td>
                    <td style={{color:'var(--text-muted)', fontSize:'0.88rem'}}>{user.phone || '—'}</td>
                    <td style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user._id, user.name)}
                        disabled={deleting === user._id}
                        id={`delete-user-${user._id}`}
                      >
                        {deleting === user._id ? '...' : '🗑 Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .admin-page-title { font-size: 1.8rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 6px; }
      `}</style>
    </div>
  )
}
