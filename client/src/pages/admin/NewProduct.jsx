import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Bags', 'Accessories', 'Sports', 'Home', 'Beauty', 'Books', 'Other']

export default function NewProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Electronics', image: '', stock: '', discount: '0' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.description || !form.price || !form.image) {
      setError('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        discount: Number(form.discount) || 0,
      })
      navigate('/admin/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-product fade-in">
      <div className="admin-page-header flex-between" style={{marginBottom:'28px'}}>
        <div>
          <h1 className="admin-page-title">➕ Add New Product</h1>
          <p style={{color:'var(--text-muted)'}}>Fill in the details to list a new product</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/products')}>← Back</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="np-layout">
        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card" style={{padding:'32px'}}>
          <div className="np-grid">
            <div className="form-group np-full">
              <label className="form-label">Product Name *</label>
              <input name="name" className="form-control" value={form.name} onChange={handleChange} required placeholder="Enter product name" id="np-name" />
            </div>

            <div className="form-group np-full">
              <label className="form-label">Description *</label>
              <textarea name="description" className="form-control" value={form.description} onChange={handleChange} required placeholder="Detailed product description..." rows={4} id="np-desc" />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-control" value={form.category} onChange={handleChange} id="np-cat">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input name="price" type="number" className="form-control" value={form.price} onChange={handleChange} required min={0} placeholder="e.g. 1999" id="np-price" />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input name="stock" type="number" className="form-control" value={form.stock} onChange={handleChange} min={0} placeholder="e.g. 100" id="np-stock" />
            </div>

            <div className="form-group">
              <label className="form-label">Discount (%)</label>
              <input name="discount" type="number" className="form-control" value={form.discount} onChange={handleChange} min={0} max={100} placeholder="0-100" id="np-discount" />
            </div>

            <div className="form-group np-full">
              <label className="form-label">Image URL *</label>
              <input
                name="image"
                className="form-control"
                value={form.image}
                onChange={e => { handleChange(e); setPreview(false) }}
                required
                placeholder="https://example.com/product-image.jpg"
                id="np-image"
              />
              {form.image && (
                <button type="button" className="btn btn-secondary btn-sm" style={{marginTop:'8px', width:'fit-content'}} onClick={() => setPreview(p => !p)}>
                  {preview ? 'Hide' : 'Preview'} Image
                </button>
              )}
            </div>
          </div>

          <div style={{display:'flex', gap:'12px', marginTop:'8px'}}>
            <button type="submit" className="btn btn-primary" disabled={loading} id="np-submit">
              {loading ? <><div className="spinner spinner-sm" /> Creating...</> : '✓ Create Product'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/products')}>Cancel</button>
          </div>
        </form>

        {/* Preview */}
        {preview && form.image && (
          <div className="glass-card" style={{padding:'20px'}}>
            <h3 style={{marginBottom:'16px', fontWeight:700}}>Image Preview</h3>
            <img src={form.image} alt="Preview" style={{width:'100%', borderRadius:'var(--radius-md)', objectFit:'cover', maxHeight:'300px'}} onError={(e) => { e.target.src='https://via.placeholder.com/400x300/1a0050/a855f7?text=Invalid+URL'; }} />
            <div style={{marginTop:'16px', padding:'16px', background:'rgba(168,85,247,0.06)', borderRadius:'var(--radius-md)', border:'1px solid rgba(168,85,247,0.1)'}}>
              <div style={{fontWeight:700, color:'var(--text-primary)', marginBottom:'4px'}}>{form.name || 'Product Name'}</div>
              <div style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>{form.category} • {form.stock} in stock</div>
              {form.price && (
                <div style={{marginTop:'8px', fontWeight:800, fontSize:'1.2rem', background:'var(--gradient-primary)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
                  ₹{(Number(form.price) * (1 - Number(form.discount)/100)).toLocaleString('en-IN', {maximumFractionDigits:0})}
                  {form.discount > 0 && <span style={{fontSize:'0.9rem', color:'#34d399', WebkitTextFillColor:'#34d399'}}> ({form.discount}% off)</span>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-page-title { font-size: 1.8rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 6px; }
        .admin-error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 14px; border-radius: var(--radius-md); margin-bottom: 20px; }
        .np-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
        .np-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .np-full { grid-column: 1 / -1; }
        @media (max-width: 900px) { .np-layout { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .np-grid { grid-template-columns: 1fr; } .np-full { grid-column: auto; } }
      `}</style>
    </div>
  )
}
