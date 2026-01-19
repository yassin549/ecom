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
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="sticky top-28 bg-card rounded-[2rem] border-2 border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-6 bg-muted/30 hover:bg-muted transition-colors transition-all"
        >
          <h2 className="font-black text-xl uppercase italic tracking-tighter">Catégories</h2>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-6 w-6 text-primary" />
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
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                {/* All Products Link */}
                <Link href="/shop">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${!currentCategoryId
                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-black italic shadow-inner">
                      ALL
                    </div>
                    <div className="flex-1">
                      <p className="font-black uppercase italic tracking-tighter">Tous</p>
                      <p className="text-[10px] font-bold opacity-60 uppercase">Selection</p>
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
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/25"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        {/* Category Image */}
                        <div className="relative w-12 h-12 rounded-xl border-2 border-border overflow-hidden flex-shrink-0 group-hover:border-primary/50 transition-colors">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center font-black italic text-primary">
                              {category.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Category Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-black uppercase italic tracking-tighter truncate">{category.name}</p>
                          <p className="text-[10px] font-bold opacity-60 uppercase">
                            {category.productCount ?? 0} ITEMS
                          </p>
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
