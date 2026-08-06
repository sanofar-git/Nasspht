import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Bags', 'Accessories', 'Sports', 'Home', 'Beauty', 'Books', 'Other']

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(({ data }) => setForm({
        name: data.name, description: data.description, price: data.price,
        category: data.category, image: data.image, stock: data.stock,
        discount: data.discount || 0, rating: data.rating || 0, reviews: data.reviews || 0,
      }))
      .catch(() => navigate('/admin/products'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await axios.put(`/api/products/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        discount: Number(form.discount),
        rating: Number(form.rating),
        reviews: Number(form.reviews),
      })
      setSuccess('Product updated successfully! ✓')
      setTimeout(() => navigate('/admin/products'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex-center" style={{height:'400px'}}><div className="spinner" /></div>
  if (!form) return null

  return (
    <div className="edit-product fade-in">
      <div className="admin-page-header flex-between" style={{marginBottom:'28px'}}>
        <div>
          <h1 className="admin-page-title">✏️ Edit Product</h1>
          <p style={{color:'var(--text-muted)'}}>Update the product details below</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/products')}>← Back</button>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      <div className="ep-layout">
        <form onSubmit={handleSubmit} className="glass-card" style={{padding:'32px'}}>
          <div className="ep-grid">
            <div className="form-group ep-full">
              <label className="form-label">Product Name *</label>
              <input name="name" className="form-control" value={form.name} onChange={handleChange} required id="ep-name" />
            </div>
            <div className="form-group ep-full">
              <label className="form-label">Description *</label>
              <textarea name="description" className="form-control" value={form.description} onChange={handleChange} required rows={4} id="ep-desc" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-control" value={form.category} onChange={handleChange} id="ep-cat">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input name="price" type="number" className="form-control" value={form.price} onChange={handleChange} required min={0} id="ep-price" />
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input name="stock" type="number" className="form-control" value={form.stock} onChange={handleChange} min={0} id="ep-stock" />
            </div>
            <div className="form-group">
              <label className="form-label">Discount (%)</label>
              <input name="discount" type="number" className="form-control" value={form.discount} onChange={handleChange} min={0} max={100} id="ep-discount" />
            </div>
            <div className="form-group">
              <label className="form-label">Rating (0–5)</label>
              <input name="rating" type="number" className="form-control" value={form.rating} onChange={handleChange} min={0} max={5} step={0.1} id="ep-rating" />
            </div>
            <div className="form-group">
              <label className="form-label">Review Count</label>
              <input name="reviews" type="number" className="form-control" value={form.reviews} onChange={handleChange} min={0} id="ep-reviews" />
            </div>
            <div className="form-group ep-full">
              <label className="form-label">Image URL *</label>
              <input name="image" className="form-control" value={form.image} onChange={handleChange} required id="ep-image" />
            </div>
          </div>

          <div style={{display:'flex', gap:'12px'}}>
            <button type="submit" className="btn btn-primary" disabled={saving} id="ep-save">
              {saving ? <><div className="spinner spinner-sm" /> Saving...</> : '💾 Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/products')}>Cancel</button>
          </div>
        </form>

        {/* Image Preview */}
        <div className="glass-card" style={{padding:'20px'}}>
          <h3 style={{marginBottom:'16px', fontWeight:700}}>Current Image</h3>
          <img src={form.image} alt={form.name} style={{width:'100%', borderRadius:'var(--radius-md)', objectFit:'cover', maxHeight:'250px'}} onError={(e)=>{e.target.src='https://via.placeholder.com/400x300/1a0050/a855f7?text=Product'}} />
          <div style={{marginTop:'16px'}}>
            <div style={{fontWeight:700}}>{form.name}</div>
            <div style={{color:'var(--text-muted)', fontSize:'0.85rem', marginTop:'4px'}}>{form.category}</div>
            <div style={{marginTop:'8px', fontWeight:800, fontSize:'1.2rem', background:'var(--gradient-primary)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
              ₹{(Number(form.price) * (1 - Number(form.discount)/100)).toLocaleString('en-IN', {maximumFractionDigits:0})}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-page-title { font-size: 1.8rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 6px; }
        .admin-error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 14px; border-radius: var(--radius-md); margin-bottom: 20px; }
        .admin-success { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); color: #34d399; padding: 14px; border-radius: var(--radius-md); margin-bottom: 20px; }
        .ep-layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
        .ep-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .ep-full { grid-column: 1 / -1; }
        @media (max-width: 900px) { .ep-layout { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .ep-grid { grid-template-columns: 1fr; } .ep-full { grid-column: auto; } }
      `}</style>
    </div>
  )
}
