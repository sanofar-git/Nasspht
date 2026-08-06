import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AllUsers from './pages/admin/AllUsers'
import AllProducts from './pages/admin/AllProducts'
import NewProduct from './pages/admin/NewProduct'
import EditProduct from './pages/admin/EditProduct'
import AllOrders from './pages/admin/AllOrders'

function ProtectedRoute({ children, adminRequired = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading"><div className="spinner"></div></div>
  if (!user) return <Navigate to="/login" replace />
  if (adminRequired && !user.isAdmin) return <Navigate to="/" replace />
  return children
}

function App() {
  const { user } = useAuth()

  return (
    <div className="app">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminRequired>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="products" element={<AllProducts />} />
          <Route path="products/new" element={<NewProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<AllOrders />} />
        </Route>

        {/* Public / User Routes */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  )
}

export default App
