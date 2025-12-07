'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { api, Product } from '@/lib/codewords'

interface Props {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (query.length > 0) {
      const timer = setTimeout(async () => {
        try {
          const response = await api.searchProducts(query, 5)
          setSuggestions(response.suggestions || [])
          setShowSuggestions(true)
        } catch (error) {
          console.error('Search error:', error)
        }
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products... (Trie autocomplete)"
          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 border border-white/20 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => {
                onSearch(product.name)
                setShowSuggestions(false)
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors text-left border-b border-white/10 last:border-b-0"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <div className="text-white font-medium">{product.name}</div>
                <div className="text-sm text-gray-400">{product.category}</div>
              </div>
              <div className="text-purple-400 font-bold">${product.price}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
