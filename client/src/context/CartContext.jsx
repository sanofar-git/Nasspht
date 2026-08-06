import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], totalPrice: 0, totalItems: 0 }); return }
    try {
      setLoading(true)
      const { data } = await axios.get('/api/cart')
      setCart(data)
    } catch (err) {
      console.error('Cart fetch error:', err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return false
    try {
      const { data } = await axios.post('/api/cart/add', { productId, quantity })
      setCart(data)
      return true
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add to cart')
    }
  }

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await axios.put(`/api/cart/item/${itemId}`, { quantity })
      setCart(data)
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update cart')
    }
  }

  const removeItem = async (itemId) => {
    try {
      const { data } = await axios.delete(`/api/cart/item/${itemId}`)
      setCart(data)
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear')
      setCart({ items: [], totalPrice: 0, totalItems: 0 })
    } catch (err) {
      console.error('Clear cart error:', err.message)
    }
  }

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0
  const cartTotal = cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0

  return (
    <CartContext.Provider value={{ cart, loading, cartCount, cartTotal, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
