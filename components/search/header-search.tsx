"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { search, buildSearchIndex, type SearchableProduct } from "@/lib/search/search-index"
import { formatPrice } from "@/lib/currency"

export function HeaderSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchableProduct[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isIndexBuilt, setIsIndexBuilt] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Build search index on mount
  useEffect(() => {
    // Mock products for search
    const mockProducts: SearchableProduct[] = [
      {
        id: "1",
        name: "Casque Bluetooth Premium",
        description: "Casque sans fil avec réduction de bruit active",
        category: "Électronique",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
      },
      {
        id: "2",
        name: "Montre Connectée Sport",
        description: "Montre intelligente avec suivi d'activité",
        category: "Électronique",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100",
      },
      {
        id: "3",
        name: "Sac à Dos Urbain",
        description: "Sac à dos élégant pour ordinateur portable",
        category: "Mode",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100",
      },
      {
        id: "4",
        name: "Lunettes de Soleil",
        description: "Lunettes de soleil polarisées UV400",
        category: "Mode",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100",
      },
      {
        id: "5",
        name: "Enceinte Portable",
        description: "Enceinte Bluetooth étanche",
        category: "Électronique",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100",
      },
    ]

    buildSearchIndex(mockProducts)
    setIsIndexBuilt(true)
  }, [])

  // Perform search
  useEffect(() => {
    if (!isIndexBuilt || !query.trim()) {
      setResults([])
      setSelectedIndex(-1)
      return
    }

    const searchResults = search(query, 5)
    setResults(searchResults)
    setSelectedIndex(-1)
  }, [query, isIndexBuilt])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(`/product/${results[selectedIndex].id}`)
        handleClose()
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`)
        handleClose()
      }
    } else if (e.key === "Escape") {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsExpanded(false)
    setQuery("")
    setResults([])
    setSelectedIndex(-1)
  }

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Search Container */}
      <div className="relative z-50">
        <motion.div
          animate={{
            width: isExpanded ? "100%" : "auto",
          }}
          className="relative"
        >
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher des produits..."
              className={`w-full pl-10 pr-10 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-all ${
                isExpanded ? "md:w-96" : "md:w-64"
              }`}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {isExpanded && (query || results.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full bg-white rounded-xl border-2 border-gray-200 shadow-2xl overflow-hidden"
              >
                {results.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {results.map((product, index) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={handleClose}
                      >
                        <motion.div
                          whileHover={{ backgroundColor: "#F9FAFB" }}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                            selectedIndex === index ? "bg-gray-50" : ""
                          }`}
                        >
                          {/* Thumbnail */}
                          {product.image && (
                            <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {product.category}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="font-semibold text-indigo-600">
                            {formatPrice(product.price)}
                          </div>
                        </motion.div>
                      </Link>
                    ))}

                    {/* View All Results */}
                    {query && (
                      <Link href={`/search?q=${encodeURIComponent(query)}`}>
                        <div className="p-3 text-center text-sm text-indigo-600 hover:bg-gray-50 font-medium border-t border-gray-200">
                          Voir tous les résultats pour "{query}"
                        </div>
                      </Link>
                    )}
                  </div>
                ) : query ? (
                  <div className="p-6 text-center text-gray-600">
                    <Search className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Aucun résultat pour "{query}"</p>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">Recherches populaires</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Casque", "Montre", "Sac", "Lunettes"].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}
