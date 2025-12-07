'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Clock, MapPin } from 'lucide-react'
import { api } from '@/lib/codewords'

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
      return
    }
    setUser(JSON.parse(savedUser))
    loadOrders(JSON.parse(savedUser).user_id)
  }, [router])

  const loadOrders = async (userId: string) => {
    try {
      setLoading(true)
      const response = await api.getOrderHistory(userId)
      setOrders(response.orders || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Order History</h1>

        {loading ? (
          <div className="text-center text-white py-12">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {order.order_id}
                    </h3>
                    <p className="text-sm text-gray-400">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {new Date(order.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      ${order.total}
                    </div>
                    <span className={`inline-block px-3 py-1 rounded text-sm ${
                      order.priority === 1 ? 'bg-red-600' :
                      order.priority === 2 ? 'bg-orange-600' : 'bg-blue-600'
                    } text-white`}>
                      {order.priority === 1 ? 'URGENT' : order.priority === 2 ? 'EXPRESS' : 'STANDARD'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4">
                  <h4 className="text-white font-semibold mb-2">Items:</h4>
                  <ul className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx} className="text-gray-300 flex justify-between">
                        <span>{item.product_name} × {item.quantity}</span>
                        <span>${item.subtotal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {order.delivery_address && (
                  <div className="mt-4 text-gray-300">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {order.delivery_address}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
