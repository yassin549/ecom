"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type Category = {
  id: string
  name: string
  slug: string
  image: string | null
  productCount?: number
}

type CategoriesSidebarProps = {
  categories: Category[]
  currentCategoryId?: string
}

export function CategoriesSidebar({ categories, currentCategoryId }: CategoriesSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-20 bg-card rounded-lg border shadow-sm overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
        >
          <h2 className="font-semibold text-lg">Catégories</h2>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </button>

        {/* Categories List */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
                {/* All Products Link */}
                <Link href="/shop">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                      !currentCategoryId
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                      Tous
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Tous les Produits</p>
                      <p className="text-xs opacity-70">Tout voir</p>
                    </div>
                  </motion.div>
                </Link>

                {/* Category Items */}
                {categories.map((category) => {
                  const isActive = currentCategoryId === category.id

                  return (
                    <Link key={category.id} href={`/shop?category=${category.slug}`}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        {/* Category Image */}
                        {category.image ? (
                          <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Category Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{category.name}</p>
                          {category.productCount !== undefined && (
                            <p className="text-xs opacity-70">
                              {category.productCount} produit{category.productCount > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}
