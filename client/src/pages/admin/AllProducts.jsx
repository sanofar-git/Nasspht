import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function AllProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)

  const fetchProducts = () => {
    setLoading(true)
    axios.get('/api/products?limit=100')
      .then(({ data }) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await axios.delete(`/api/products/${id}`)
      setProducts(p => p.filter(x => x._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-products fade-in">
      <div className="admin-page-header flex-between" style={{flexWrap:'wrap', gap:'16px', marginBottom:'28px'}}>
        <div>
          <h1 className="admin-page-title">📦 All Products</h1>
          <p style={{color:'var(--text-muted)'}}>{products.length} products listed</p>
        </div>
        <div style={{display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center'}}>
          <input
            className="form-control"
            style={{width:'240px'}}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="products-search"
          />
          <Link to="/admin/products/new" className="btn btn-primary" id="admin-add-product-btn">+ Add Product</Link>
        </div>
      </div>

      <div className="glass-card" style={{overflow:'hidden'}}>
        {loading ? (
          <div className="flex-center" style={{height:'300px'}}><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{textAlign:'center', color:'var(--text-muted)', padding:'40px'}}>No products found</td></tr>
                ) : filtered.map(product => {
                  const finalPrice = product.price * (1 - (product.discount || 0) / 100)
                  return (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{width:'52px', height:'52px', objectFit:'cover', borderRadius:'var(--radius-md)'}}
                          onError={(e)=>{e.target.src='https://via.placeholder.com/52/1a0050/a855f7?text=P'}}
                        />
                      </td>
                      <td>
                        <div style={{fontWeight:600, color:'var(--text-primary)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{product.name}</div>
                      </td>
                      <td><span className="badge badge-purple">{product.category}</span></td>
                      <td>
                        <div style={{fontWeight:700, color:'var(--text-primary)'}}>₹{finalPrice.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
                        {product.discount > 0 && <div style={{fontSize:'0.78rem', textDecoration:'line-through', color:'var(--text-dim)'}}>₹{product.price.toLocaleString('en-IN')}</div>}
                      </td>
                      <td>
                        {product.discount > 0
                          ? <span className="badge badge-green">{product.discount}% off</span>
                          : <span style={{color:'var(--text-dim)'}}>—</span>}
                      </td>
                      <td>
                        <span className={`badge ${product.stock > 10 ? 'badge-green' : product.stock > 0 ? 'badge-yellow' : 'badge-red'}`}>
                          {product.stock > 0 ? product.stock : 'Out'}
                        </span>
                      </td>
                      <td>
                        <div style={{display:'flex', gap:'8px'}}>
                          <Link to={`/admin/products/edit/${product._id}`} className="btn btn-secondary btn-sm" id={`edit-product-${product._id}`}>✏️ Edit</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id, product.name)} disabled={deleting === product._id} id={`delete-product-${product._id}`}>
                            {deleting === product._id ? '...' : '🗑'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
