import { Star, ShoppingCart } from 'lucide-react'
import { Product } from '@/lib/codewords'

interface Props {
  product: Product
  onAddToCart: (productId: string) => void
}

export default function ProductCard({ product, onAddToCart }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20">
      <div className="relative h-48 bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.stock < 10 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            Only {product.stock} left!
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs text-purple-400 mb-1">{product.category}</div>
        <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {product.name}
        </h4>
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          ))}
          <span className="text-sm text-gray-400 ml-2">
            ({product.rating})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-400">
            ${product.price}
          </span>
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  )
}
