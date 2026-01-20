"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, Plus, Minus, ShoppingBag, Undo2 } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { formatPrice } from "@/lib/currency"
import { cartDB } from "@/lib/db/cart-db"

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  const [deletedItem, setDeletedItem] = useState<any>(null)
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null)

  // Sync with IndexedDB
  useEffect(() => {
    if (isOpen) {
      // Save to IndexedDB when drawer opens
      items.forEach((item) => {
        cartDB.set({
          ...item,
          addedAt: Date.now(),
        })
      })
    }
  }, [items, isOpen])

  const handleDelete = (productId: string) => {
    const item = items.find((i) => i.productId === productId)
    if (item) {
      setDeletedItem(item)
      removeItem(productId)
      cartDB.delete(productId)

      // Auto-clear undo after 5 seconds
      const timeout = setTimeout(() => {
        setDeletedItem(null)
      }, 5000)
      setUndoTimeout(timeout)
    }
  }

  const handleUndo = () => {
    if (deletedItem && undoTimeout) {
      clearTimeout(undoTimeout)
      useCartStore.getState().addItem(deletedItem)
      cartDB.set({
        ...deletedItem,
        addedAt: Date.now(),
      })
      setDeletedItem(null)
      setUndoTimeout(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Panier ({items.length})
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-200 sm:border-transparent"
              >
                <X className="h-6 w-6 text-black" />
              </motion.button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Votre panier est vide
                  </p>
                  <p className="text-gray-600 mb-6">
                    Ajoutez des produits pour commencer
                  </p>
                  <Link href="/shop">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Découvrir la Boutique
                    </motion.button>
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                          sizes="80px"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-indigo-600 mb-2">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-7 h-7 rounded-md border border-gray-300 hover:border-indigo-600 flex items-center justify-center transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </motion.button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 rounded-md border border-gray-300 hover:border-indigo-600 flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(item.productId)}
                      className="w-9 h-9 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Undo Toast */}
            <AnimatePresence>
              {deletedItem && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute bottom-24 left-6 right-6 p-4 bg-gray-900 text-white rounded-xl shadow-xl flex items-center justify-between"
                >
                  <span className="text-sm font-medium">Article supprimé</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUndo}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm"
                  >
                    <Undo2 className="h-4 w-4" />
                    Annuler
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-indigo-600">{formatPrice(getTotalPrice())}</span>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors"
                  >
                    Procéder au Paiement
                  </motion.button>
                </Link>

                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full py-3 bg-white border-2 border-gray-200 hover:border-indigo-600 text-gray-900 font-medium rounded-xl transition-colors"
                  >
                    Continuer les Achats
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
