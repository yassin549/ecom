"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { useState } from "react"
import confetti from "canvas-confetti"
import { useCartStore } from "@/lib/store/cart-store"
import { formatPrice } from "@/lib/currency"

type Product = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  rating: number
  reviewCount: number
  stock: number
}

type ProductCardProps = {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isAdding) return
    
    setIsAdding(true)
    
    // Add to cart
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    // Trigger confetti
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#FFD700', '#FFA500', '#FF6347'],
      ticks: 100,
      gravity: 1.2,
      scalar: 0.8,
    })

    setTimeout(() => setIsAdding(false), 500)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.05, // Stagger effect
      },
    },
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border relative">
          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
              } transition-colors`}
            />
          </motion.button>

          {/* Stock Badge */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-md bg-orange-500 text-white text-xs font-medium">
              Seulement {product.stock} restant{product.stock > 1 ? 's' : ''}
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-md bg-red-500 text-white text-xs font-medium">
              Rupture de Stock
            </div>
          )}

          {/* Product Image with Blur Placeholder */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
              {product.name}
            </h3>

            {/* Progressive Star Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => {
                  const fillPercentage = Math.max(0, Math.min(1, product.rating - i))
                  return (
                    <div key={i} className="relative">
                      <Star className="h-4 w-4 text-muted fill-muted" />
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${fillPercentage * 100}%` }}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                  )
                })}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price and Cart */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className={`p-3 rounded-full transition-all ${
                  product.stock === 0
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:shadow-lg opacity-0 group-hover:opacity-100"
                } ${isAdding ? "animate-pulse" : ""}`}
                aria-label={`Ajouter ${product.name} au panier`}
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
