import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Footwear', 'Bags', 'Accessories', 'Sports', 'Home', 'Beauty', 'Books', 'Other']
const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(1)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ sort, page, limit: 12 })
      if (category !== 'All') params.set('category', category)
      if (search.trim()) params.set('search', search.trim())
      const { data } = await axios.get(`/api/products?${params}`)
      setProducts(data.products || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [category, sort, search, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  return (
    <div className="products-page container fade-in">
      <div className="products-header">
        <div>
          <h1 className="section-title" style={{textAlign:'left', marginBottom:'4px'}}>Our Products</h1>
          <p style={{color:'var(--text-muted)'}}>{total} products found</p>
        </div>

        {/* Search */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="form-control search-input"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); if (!e.target.value) setPage(1) }}
            id="product-search-input"
          />
          <button type="submit" className="btn btn-primary" id="product-search-btn">🔍</button>
        </form>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="glass-card" style={{padding:'24px'}}>
            <h3 className="filter-heading">Categories</h3>
            <div className="category-filters">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`cat-filter-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => { setCategory(cat); setPage(1) }}
                  id={`filter-cat-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="filter-divider" />

            <h3 className="filter-heading">Sort By</h3>
            <div className="sort-filters">
              {SORTS.map(s => (
                <button
                  key={s.value}
                  className={`sort-btn ${sort === s.value ? 'active' : ''}`}
                  onClick={() => { setSort(s.value); setPage(1) }}
                  id={`sort-${s.value}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="products-main">
          {loading ? (
            <div className="flex-center" style={{height:'400px'}}>
              <div className="spinner"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="btn btn-primary" onClick={() => { setSearch(''); setCategory('All'); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    ← Prev
                  </button>
                  <div className="page-numbers">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`page-btn ${p === page ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .products-page { padding: 40px 24px 80px; }
        .products-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 40px; }
        .search-form { display: flex; gap: 8px; }
        .search-input { width: 280px; }
        .products-layout { display: grid; grid-template-columns: 240px 1fr; gap: 28px; align-items: start; }
        .filters-sidebar { position: sticky; top: 92px; }
        .filter-heading { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 12px; }
        .category-filters { display: flex; flex-direction: column; gap: 4px; }
        .cat-filter-btn {
          padding: 9px 14px;
          text-align: left;
          background: none;
          border: none;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition-fast);
          font-family: var(--font);
        }
        .cat-filter-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .cat-filter-btn.active { background: rgba(168,85,247,0.15); color: var(--purple-light); border-left: 2px solid var(--purple); }
        .filter-divider { height: 1px; background: var(--glass-border); margin: 20px 0; }
        .sort-filters { display: flex; flex-direction: column; gap: 4px; }
        .sort-btn {
          padding: 9px 14px;
          text-align: left;
          background: none;
          border: none;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-fast);
          font-family: var(--font);
        }
        .sort-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .sort-btn.active { background: rgba(168,85,247,0.15); color: var(--purple-light); }
        .products-main {}
        .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .pagination { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 40px; flex-wrap: wrap; }
        .page-numbers { display: flex; gap: 4px; }
        .page-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition-fast);
          font-family: var(--font);
        }
        .page-btn:hover { background: rgba(168,85,247,0.15); color: var(--purple-light); }
        .page-btn.active { background: var(--gradient-primary); color: white; border-color: transparent; }
        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .products-layout { grid-template-columns: 1fr; }
          .filters-sidebar { position: static; }
          .products-header { flex-direction: column; align-items: flex-start; }
          .search-input { width: 100%; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
