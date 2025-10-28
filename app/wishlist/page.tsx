"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, ShoppingCart, Trash2, Heart, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useWishlistStore, WishlistItem } from "@/lib/store/wishlist-store"
import { useCartStore } from "@/lib/store/cart-store"
import { formatPrice } from "@/lib/currency"
import { showSuccess } from "@/lib/utils/toast"

function SortableWishlistItem({ item }: { item: WishlistItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })

  const { removeItem } = useWishlistStore()
  const { addItem } = useCartStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleAddToCart = () => {
    addItem({
      id: item.productId,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
    })
    showSuccess(`${item.name} ajouté au panier`)
  }

  const handleRemove = () => {
    removeItem(item.productId)
    showSuccess(`${item.name} retiré de la liste`)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-white rounded-xl border-2 border-gray-200 p-4 ${
        isDragging ? "shadow-2xl z-50 opacity-50" : "hover:border-gray-300"
      } transition-all`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
        >
          <GripVertical className="h-6 w-6" />
        </button>

        {/* Image */}
        <Link href={`/product/${item.productId}`} className="flex-shrink-0">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/product/${item.productId}`}>
            <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
              {item.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-1">{item.category}</p>
          <p className="text-lg font-bold text-indigo-600 mt-2">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter au panier</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function WishlistPage() {
  const { items, reorderItems, clearWishlist } = useWishlistStore()
  const [sortedItems, setSortedItems] = useState(items)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sortedItems.findIndex((item) => item.id === active.id)
      const newIndex = sortedItems.findIndex((item) => item.id === over.id)

      const newItems = arrayMove(sortedItems, oldIndex, newIndex).map(
        (item, index) => ({ ...item, order: index })
      )

      setSortedItems(newItems)
      reorderItems(newItems)
    }
  }

  const handleClearAll = () => {
    if (confirm("Êtes-vous sûr de vouloir vider votre liste de souhaits?")) {
      clearWishlist()
      showSuccess("Liste de souhaits vidée")
    }
  }

  // Update sorted items when store items change
  if (items.length !== sortedItems.length) {
    setSortedItems(items)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-600 fill-current" />
                Ma Liste de Souhaits
              </h1>
              <p className="text-gray-600 mt-2">
                {items.length} {items.length === 1 ? "produit" : "produits"}
              </p>
            </div>

            {items.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearAll}
                className="px-4 py-2 text-red-600 hover:bg-red-50 border-2 border-red-200 rounded-lg transition-colors font-medium"
              >
                Tout supprimer
              </motion.button>
            )}
          </div>

          {items.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 flex items-center gap-2">
                <GripVertical className="h-4 w-4" />
                Glissez-déposez pour réorganiser votre liste
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Votre liste est vide
            </h2>
            <p className="text-gray-600 mb-6">
              Ajoutez des produits à votre liste de souhaits pour les retrouver
              facilement
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Package className="h-5 w-5" />
                Découvrir nos produits
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          /* Wishlist Items */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                <AnimatePresence>
                  {sortedItems.map((item) => (
                    <SortableWishlistItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
