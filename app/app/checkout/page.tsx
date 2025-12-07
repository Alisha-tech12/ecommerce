'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, MapPin, Zap, CheckCircle } from 'lucide-react'
import { api } from '@/lib/codewords'

export default function CheckoutPage() {
  const [user, setUser] = useState<any>(null)
  const [address, setAddress] = useState('')
  const [priority, setPriority] = useState<'standard' | 'express' | 'urgent'>('standard')
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card' | 'paypal'>('credit_card')
  const [loading, setLoading] = useState(false)
  const [orderResult, setOrderResult] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
      return
    }
    setUser(JSON.parse(savedUser))
  }, [router])

  const handlePlaceOrder = async () => {
    if (!user || !address) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await api.createOrder(user.user_id, address, priority, paymentMethod)
      setOrderResult(response)
    } catch (error: any) {
      alert(error.message || 'Order failed')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  if (orderResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
            <p className="text-gray-300 mb-6">{orderResult.message}</p>

            <div className="bg-black/30 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-xl font-bold text-white mb-4">Order Details</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong>Order ID:</strong> {orderResult.order_id}</p>
                <p><strong>Total:</strong> ${orderResult.total}</p>
                <p><strong>Priority:</strong> <span className={`px-2 py-1 rounded text-sm ${
                  orderResult.priority === 1 ? 'bg-red-600' : 
                  orderResult.priority === 2 ? 'bg-orange-600' : 'bg-blue-600'
                }`}>
                  {orderResult.priority === 1 ? 'URGENT' : orderResult.priority === 2 ? 'EXPRESS' : 'STANDARD'}
                </span></p>
                <p><strong>Payment:</strong> {orderResult.payment_status}</p>
              </div>

              {orderResult.delivery_estimate && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">
                    Delivery Route (Dijkstra's Algorithm)
                  </h4>
                  <p className="text-gray-300">📍 Distance: {orderResult.delivery_estimate.distance_km} km</p>
                  <p className="text-gray-300">🛣️ Route: {orderResult.delivery_estimate.route}</p>
                  <p className="text-gray-300">⏱️ Estimated: {orderResult.delivery_estimate.estimated_time_hours}h</p>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push('/orders')}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Checkout</h1>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="space-y-6">
            {/* Delivery Address */}
            <div>
              <label className="flex items-center space-x-2 text-white font-semibold mb-2">
                <MapPin className="w-5 h-5" />
                <span>Delivery Address</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State, ZIP"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Priority Selection */}
            <div>
              <label className="flex items-center space-x-2 text-white font-semibold mb-2">
                <Zap className="w-5 h-5" />
                <span>Order Priority (Priority Queue)</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'standard', label: 'Standard', price: 0, color: 'blue' },
                  { value: 'express', label: 'Express', price: 10, color: 'orange' },
                  { value: 'urgent', label: 'Urgent', price: 25, color: 'red' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPriority(option.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      priority === option.value
                        ? `border-${option.color}-500 bg-${option.color}-900/30`
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-white font-semibold">{option.label}</div>
                    <div className="text-sm text-gray-400">+${option.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="flex items-center space-x-2 text-white font-semibold mb-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Method</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !address}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-lg rounded-lg transition-all"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
