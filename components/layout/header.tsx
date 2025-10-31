"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, User, Menu, X, Search } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { CartDrawer } from "@/components/cart/cart-drawer"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartCount = useCartStore((state) => state.getTotalItems())
  const pathname = usePathname()

  // Hide public header on admin routes to prevent overlap with the admin UI
  if (pathname?.startsWith("/admin")) {
    return null
  }

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Boutique", href: "/shop" },
    { name: "Catégories", href: "/categories" },
    { name: "À propos", href: "/about" },
  ]

  return (
    <>
      <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
        <nav className="container mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-xl" aria-label="Main navigation">
          <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-gray-900"
              aria-label="Home"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
              >
                ShopHub
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-block"
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={`Panier avec ${cartCount} articles`}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white font-semibold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User Profile */}
              <Link href="/profile">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-accent transition-colors"
                  aria-label="Profil utilisateur"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent transition-colors"
                aria-label="Basculer le menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Menu - Floating Below Header */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden"
            >
              <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl overflow-hidden max-w-sm mx-auto">
                <div className="py-3 px-2">
                  {navigation.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                      >
                        {item.name}
                      </motion.div>
                    </Link>
                  ))}
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navigation.length * 0.05 }}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors sm:hidden"
                    >
                      Profil
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
