"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import { showSuccess } from "@/lib/utils/toast"

type WishlistButtonProps = {
  product: {
    id: string
    name: string
    price: number
    image: string
    category: string
  }
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function WishlistButton({
  product,
  size = "md",
  showLabel = false,
}: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore()
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isLiked = isInWishlist(product.id)

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const handleToggle = () => {
    const added = toggleItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })

    if (added) {
      // Create particles
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.cos((i * 2 * Math.PI) / 12) * 50,
        y: Math.sin((i * 2 * Math.PI) / 12) * 50,
      }))
      setParticles(newParticles)

      // Remove particles after animation
      setTimeout(() => setParticles([]), 1000)

      showSuccess(`${product.name} ajouté à la liste de souhaits`)
    } else {
      showSuccess(`${product.name} retiré de la liste de souhaits`)
    }
  }

  return (
    <div className="relative">
      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: particle.x,
              y: particle.y,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        ref={buttonRef}
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-colors ${
          isLiked
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        } ${showLabel ? "px-4 w-auto gap-2" : ""}`}
      >
        <motion.div
          animate={
            isLiked
              ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, -10, 10, 0],
                }
              : {}
          }
          transition={{ duration: 0.4 }}
        >
          <Heart
            className={`${iconSizes[size]} ${
              isLiked ? "fill-current" : ""
            } transition-all`}
          />
        </motion.div>
        {showLabel && (
          <span className="text-sm font-medium">
            {isLiked ? "Dans la liste" : "Ajouter"}
          </span>
        )}
      </motion.button>
    </div>
  )
}
