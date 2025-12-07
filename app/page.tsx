'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Search, User, Package } from 'lucide-react'
import { api, Product } from '@/lib/codewords'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import Cart from '@/components/Cart'
import LoginModal from '@/components/LoginModal'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [showCart, setShowCart] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadDashboard()
    loadProducts()
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const loadDashboard = async () => {
    try {
      const response = await api.getDashboard()
      setStats(response)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await api.listProducts()
      setProducts(response.products || [])
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData: any) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setShowLogin(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setCartCount(0)
  }

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      alert('Please login first!')
      setShowLogin(true)
      return
    }

    try {
      await api.addToCart(user.user_id, productId, 1)
      setCartCount(prev => prev + 1)
      alert('Added to cart!')
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">
                DataMart
              </h1>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar onSearch={(query) => {/* TODO */}} />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-300 hover:text-white"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">{user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center space-x-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">
            {stats?.message || 'Welcome to DataMart'}
          </h2>
          <p className="text-xl mb-8">
            Powered by Advanced Data Structures: Hash Maps • Trie • Priority Queue • Graphs
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="bg-white/20 px-6 py-3 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats?.total_products || 0}</div>
              <div className="text-gray-200">Products</div>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats?.active_orders_in_queue || 0}</div>
              <div className="text-gray-200">Active Orders</div>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats?.delivery_hubs?.length || 0}</div>
              <div className="text-gray-200">Delivery Hubs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-bold text-white mb-8">Featured Products</h3>
        
        {loading ? (
          <div className="text-center text-white py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {/* Cart Sidebar */}
      {showCart && user && (
        <Cart
          userId={user.user_id}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  )
}
