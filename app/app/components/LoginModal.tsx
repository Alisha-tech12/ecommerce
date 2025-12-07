'use client'

import { useEffect, useState } from 'react'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import { api, CartItem } from '@/lib/codewords'
import { useRouter } from 'next/navigation'

interface Props {
  userId: string
  onClose: () => void
}

export default function Cart({ userId, onClose }: Props) {
  const [cart, setCart] = useState<{ items: CartItem[]; total: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadCart()
  }, [userId])

  const loadCart = async () => {
    try {
      setLoading(true)
      const response = await api.viewCart(userId)
      setCart(response)
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="text-center text-gray-400 py-12">
                Loading cart...
              </div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product_id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">
                          {item.product_name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          ${item.unit_price} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-400">
                          ${item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t border-white/10 p-6 bg-black/30">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl text-white font-semibold">Total:</span>
                <span className="text-3xl font-bold text-purple-400">
                  ${cart.total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
