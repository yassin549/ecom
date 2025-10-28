"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, ShoppingCart, Eye } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import { useCartStore } from "@/lib/store/cart-store"

type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  views?: number
}

type PersonalizedProductsProps = {
  viewedProducts?: string[]
  maxItems?: number
}

export function PersonalizedProducts({
  viewedProducts = [],
  maxItems = 6,
}: PersonalizedProductsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    // Simulate fetching recommendations based on viewed products
    const mockRecommendations: Product[] = [
      {
        id: "1",
        name: "Casque Bluetooth Premium",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        category: "Électronique",
        views: 1234,
      },
      {
        id: "2",
        name: "Montre Connectée Sport",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        category: "Électronique",
        views: 987,
      },
      {
        id: "3",
        name: "Sac à Dos Urbain",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        category: "Mode",
        views: 756,
      },
      {
        id: "4",
        name: "Lunettes de Soleil",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        category: "Mode",
        views: 654,
      },
      {
        id: "5",
        name: "Enceinte Portable",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        category: "Électronique",
        views: 543,
      },
      {
        id: "6",
        name: "Chaussures Running",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        category: "Sports",
        views: 432,
      },
    ]

    setRecommendations(mockRecommendations.slice(0, maxItems))

    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 500)
  }, [viewedProducts, maxItems])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  if (recommendations.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100 p-8 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <Sparkles className="h-6 w-6 text-indigo-600" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recommandé pour vous
          </h2>
          <p className="text-sm text-gray-600">
            Basé sur vos produits consultés
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {recommendations.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
            >
              {/* Image */}
              <Link href={`/product/${product.id}`}>
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Nudge Badge */}
                  <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="absolute top-2 left-2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    {product.views} vues
                  </motion.div>
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 hover:text-indigo-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">
                      {product.category}
                    </div>
                    <div className="text-lg font-bold text-indigo-600">
                      {formatPrice(product.price)}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddToCart(product)}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Subtle Nudge Animation */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.8, duration: 0.5 }}
                className="h-1 bg-gradient-to-r from-indigo-600 to-purple-600"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View All Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-6"
      >
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Voir tous les produits
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  )
}
