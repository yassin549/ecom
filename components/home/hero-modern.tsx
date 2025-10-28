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
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-900">
                Qualité Premium · Livraison Rapide · Prix Justes
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Votre Boutique
              <br />
              <span className="text-indigo-600">Premium</span> en Ligne
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez une sélection raffinée de produits exceptionnels.
              <br className="hidden md:block" />
              Qualité garantie, satisfaction assurée.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto mb-10"
          >
            <div className="relative group">
              <div className="flex items-center bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group-hover:border-indigo-300">
                <div className="pl-6 pr-4">
                  <Search className="h-6 w-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher parmi 10,000+ produits..."
                  className="flex-1 py-5 text-lg bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
                  aria-label="Rechercher des produits"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="m-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg"
                >
                  Rechercher
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
              >
                <ShoppingBag className="h-5 w-5" />
                Explorer la Boutique
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/categories">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-indigo-600 text-gray-900 hover:text-indigo-600 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
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
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { label: "Produits", value: "10K+", icon: ShoppingBag, color: "text-indigo-600" },
              { label: "Clients Satisfaits", value: "50K+", icon: TrendingUp, color: "text-purple-600" },
              { label: "Note Moyenne", value: "4.8★", icon: Award, color: "text-pink-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
