"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, ArrowRight, ShoppingBag, TrendingUp, Award, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroModern() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      // If empty, just go to shop page
      router.push('/shop')
    }
  }

  return (
    <section className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-sm">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">
                <span className="hidden sm:inline">Qualité Premium · Livraison Rapide · Prix Justes</span>
                <span className="sm:hidden">Premium · Rapide · Juste</span>
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-foreground mb-4 sm:mb-6 leading-none tracking-tighter px-2 uppercase italic">
              Boutique
              <br />
              <span className="text-primary drop-shadow-[0_0_30px_rgba(147,51,234,0.6)] drip-text">Drip Shop</span>
            </h1>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: "spring",
              stiffness: 100
            }}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto mb-8 sm:mb-10"
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              <div className="relative flex items-center bg-card backdrop-blur-md border-2 border-border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative pl-3 sm:pl-6 pr-2 sm:pr-4 z-10">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary drop-shadow-lg" />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Trouve ton drip..."
                  className="relative flex-1 py-3 sm:py-5 text-sm sm:text-lg bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground z-10 font-bold"
                  aria-label="Rechercher des produits"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="relative m-1.5 sm:m-2 px-4 sm:px-8 py-2.5 sm:py-3.5 bg-primary text-white rounded-lg sm:rounded-xl font-black uppercase italic tracking-tighter flex items-center gap-1 sm:gap-2 shadow-xl text-sm sm:text-base overflow-hidden z-10"
                >
                  <span className="relative hidden sm:inline">Chercher</span>
                  <span className="relative sm:hidden">GO</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4"
          >
            <Link href="/shop" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full sm:w-auto px-8 sm:px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase italic tracking-tighter shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Explorer la Boutique</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/categories" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-muted border-2 border-border text-foreground rounded-2xl font-black uppercase italic tracking-tighter transition-all shadow-lg"
              >
                Nos Catégories
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
