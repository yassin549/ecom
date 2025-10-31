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
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
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
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight px-2">
              Votre Boutique
              <br />
              <span className="text-indigo-600">Premium</span> en Ligne
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Découvrez une sélection raffinée de produits exceptionnels.
              <br className="hidden sm:block" />
              Qualité garantie, satisfaction assurée.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto mb-8 sm:mb-10"
          >
            <div className="relative group">
              <div className="flex items-center bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group-hover:border-indigo-300">
                <div className="pl-3 sm:pl-6 pr-2 sm:pr-4">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits..."
                  className="flex-1 py-3 sm:py-5 text-sm sm:text-lg bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
                  aria-label="Rechercher des produits"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="m-1.5 sm:m-2 px-4 sm:px-8 py-2.5 sm:py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg sm:rounded-xl font-semibold transition-colors flex items-center gap-1 sm:gap-2 shadow-lg text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Rechercher</span>
                  <span className="sm:hidden">OK</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-12 sm:mb-16 md:mb-20 px-4"
          >
            <Link href="/shop" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 sm:gap-3"
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Explorer la Boutique</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/categories" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-indigo-600 text-gray-900 hover:text-indigo-600 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Voir les Catégories
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-3xl mx-auto"
          >
            {[
              { label: "Produits", value: "10K+", icon: ShoppingBag, color: "text-indigo-600" },
              { label: "Clients", shortLabel: "Clients", value: "50K+", icon: TrendingUp, color: "text-purple-600" },
              { label: "Note", value: "4.8★", icon: Award, color: "text-pink-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center p-3 sm:p-4 md:p-6 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg"
              >
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
