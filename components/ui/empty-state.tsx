"use client"

import { motion } from "framer-motion"
import { ShoppingBag, Package, Search, Heart, FileText } from "lucide-react"
import Link from "next/link"

type EmptyStateType = "cart" | "orders" | "search" | "wishlist" | "general"

type EmptyStateProps = {
  type: EmptyStateType
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

const emptyStateConfig = {
  cart: {
    icon: ShoppingBag,
    title: "Votre panier est vide",
    description: "Ajoutez des produits pour commencer vos achats",
    actionLabel: "Découvrir les produits",
    actionHref: "/shop",
  },
  orders: {
    icon: Package,
    title: "Aucune commande",
    description: "Vous n'avez pas encore passé de commande",
    actionLabel: "Commencer mes achats",
    actionHref: "/shop",
  },
  search: {
    icon: Search,
    title: "Aucun résultat",
    description: "Essayez avec d'autres mots-clés",
    actionLabel: "Voir tous les produits",
    actionHref: "/shop",
  },
  wishlist: {
    icon: Heart,
    title: "Liste de souhaits vide",
    description: "Ajoutez vos produits préférés à votre liste",
    actionLabel: "Parcourir les produits",
    actionHref: "/shop",
  },
  general: {
    icon: FileText,
    title: "Rien à afficher",
    description: "Il n'y a rien ici pour le moment",
    actionLabel: "Retour à l'accueil",
    actionHref: "/",
  },
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const config = emptyStateConfig[type]
  const Icon = config.icon

  const finalTitle = title || config.title
  const finalDescription = description || config.description
  const finalActionLabel = actionLabel || config.actionLabel
  const finalActionHref = actionHref || config.actionHref

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="relative mb-6"
      >
        {/* Dancing animation for cart */}
        {type === "cart" && (
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center"
          >
            <Icon className="h-16 w-16 text-indigo-600" />
          </motion.div>
        )}

        {/* Pulse animation for others */}
        {type !== "cart" && (
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Icon className="h-16 w-16 text-gray-400" />
          </motion.div>
        )}

        {/* Floating particles */}
        {type === "cart" && (
          <>
            <motion.div
              animate={{
                y: [-20, -40, -20],
                x: [-10, 10, -10],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 left-0 w-3 h-3 bg-indigo-400 rounded-full"
            />
            <motion.div
              animate={{
                y: [-20, -40, -20],
                x: [10, -10, 10],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute top-0 right-0 w-2 h-2 bg-purple-400 rounded-full"
            />
            <motion.div
              animate={{
                y: [20, 40, 20],
                x: [-10, 10, -10],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-0 left-0 w-2 h-2 bg-pink-400 rounded-full"
            />
          </>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center max-w-md"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {finalTitle}
        </h3>
        <p className="text-gray-600 mb-6">{finalDescription}</p>

        {/* Action Button */}
        {onAction ? (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors"
          >
            {finalActionLabel}
          </motion.button>
        ) : (
          <Link href={finalActionHref}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors"
            >
              {finalActionLabel}
            </motion.button>
          </Link>
        )}
      </motion.div>
    </div>
  )
}
