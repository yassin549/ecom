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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground mb-4 sm:mb-6 leading-none tracking-tighter px-2 uppercase italic">
              Boutique
              <br />
              <span className="text-primary drop-shadow-[0_0_15px_rgba(147,51,234,0.3)] drip-text">Drip Shop</span>
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
              {/* Animated Glow effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-30 blur-lg"
                animate={{
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />

              <motion.div
                className="relative flex items-center bg-white/95 backdrop-blur-md border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
                animate={{
                  borderColor: ["#e5e7eb", "#a5b4fc", "#e5e7eb"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {/* Animated background shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                <motion.div
                  className="relative pl-3 sm:pl-6 pr-2 sm:pr-4 z-10"
                  animate={{
                    scale: searchQuery ? [1, 1.2, 1] : 1,
                    rotate: searchQuery ? [0, -15, 15, -15, 0] : 0
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Search className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500 drop-shadow-lg" />
                  </motion.div>
                </motion.div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Trouve ton drip..."
                  className="relative flex-1 py-3 sm:py-5 text-sm sm:text-lg bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder:text-gray-400 z-10"
                  aria-label="Rechercher des produits"
                />

                <motion.button
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="relative m-1.5 sm:m-2 px-4 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold flex items-center gap-1 sm:gap-2 shadow-2xl text-sm sm:text-base overflow-hidden z-10"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  {/* Button shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  <span className="relative hidden sm:inline">Rechercher</span>
                  <span className="relative sm:hidden">OK</span>

                  <motion.div
                    className="relative"
                    animate={{
                      x: [0, 5, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 drop-shadow-lg" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </motion.div>
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
                className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-background/80 backdrop-blur-sm border-2 border-border hover:border-primary text-foreground hover:text-primary rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
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
              { label: "Modèles", value: "200+", icon: ShoppingBag, color: "text-indigo-600" },
              { label: "Drippers", shortLabel: "Clients", value: "10K+", icon: TrendingUp, color: "text-purple-600" },
              { label: "Avis", value: "4.9★", icon: Award, color: "text-pink-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center p-3 sm:p-4 md:p-6 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 dark:border-white/10 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 bg-gray-50 dark:bg-white/5 rounded-lg sm:rounded-xl">
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
