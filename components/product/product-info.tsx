"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, Check } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { formatPrice } from "@/lib/currency"
import confetti from "canvas-confetti"

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  rating: number
  reviewCount: number
}

type ProductInfoProps = {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [copied, setCopied] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newValue = prev + delta
      return Math.max(1, Math.min(newValue, product.stock))
    })
  }

  const handleAddToCart = async () => {
    setIsAdding(true)

    // Add to cart (add quantity times)
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: "",
      })
    }

    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#a855f7", "#ec4899"],
    })

    setTimeout(() => setIsAdding(false), 1000)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const inStock = product.stock > 0

  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      {/* Product Name */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating.toFixed(1)} ({product.reviewCount} avis)
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="py-4 border-y border-gray-200">
        <div className="text-4xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </div>
        <p className="text-sm text-gray-600 mt-1">TVA incluse · Livraison calculée à la caisse</p>
      </div>

      {/* Stock Status */}
      <div>
        {inStock ? (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 rounded-full bg-green-600" />
            <span className="font-medium">
              {product.stock > 10 ? "En stock" : `Seulement ${product.stock} restant(s)`}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <span className="font-medium">Rupture de stock</span>
          </div>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Quantity Stepper */}
      {inStock && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">
            Quantité
          </label>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-4 w-4" />
            </motion.button>

            <div className="w-16 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center font-semibold text-lg">
              {quantity}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
              className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <>
              <Check className="h-5 w-5" />
              Ajouté au panier !
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              Ajouter au panier
            </>
          )}
        </motion.button>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-3 bg-white border-2 border-gray-200 hover:border-indigo-600 text-gray-900 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Heart className="h-5 w-5" />
            Favoris
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="py-3 bg-white border-2 border-gray-200 hover:border-indigo-600 text-gray-900 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                Copié !
              </>
            ) : (
              <>
                <Share2 className="h-5 w-5" />
                Partager
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Features */}
      <div className="p-4 bg-gray-50 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Check className="h-4 w-4 text-green-600" />
          <span>Livraison gratuite dès 100 TND</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Check className="h-4 w-4 text-green-600" />
          <span>Retours gratuits sous 30 jours</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Check className="h-4 w-4 text-green-600" />
          <span>Garantie 2 ans</span>
        </div>
      </div>
    </div>
  )
}
