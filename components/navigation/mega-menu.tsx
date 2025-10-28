"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type SubCategory = {
  name: string
  href: string
  image: string
  description?: string
}

type Category = {
  name: string
  href: string
  subcategories: SubCategory[]
  featured?: {
    title: string
    description: string
    image: string
    href: string
  }
}

const categories: Category[] = [
  {
    name: "Vêtements",
    href: "/shop/vetements",
    subcategories: [
      {
        name: "T-shirts",
        href: "/shop/vetements/t-shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        description: "Confortables et stylés",
      },
      {
        name: "Chemises",
        href: "/shop/vetements/chemises",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
        description: "Élégantes et modernes",
      },
      {
        name: "Pantalons",
        href: "/shop/vetements/pantalons",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400",
        description: "Pour toutes occasions",
      },
      {
        name: "Vestes",
        href: "/shop/vetements/vestes",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        description: "Tendance et pratiques",
      },
    ],
    featured: {
      title: "Collection Été 2024",
      description: "Découvrez nos nouveautés",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600",
      href: "/shop/nouveautes",
    },
  },
  {
    name: "Chaussures",
    href: "/shop/chaussures",
    subcategories: [
      {
        name: "Baskets",
        href: "/shop/chaussures/baskets",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        description: "Sport et décontracté",
      },
      {
        name: "Bottes",
        href: "/shop/chaussures/bottes",
        image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400",
        description: "Style et confort",
      },
      {
        name: "Sandales",
        href: "/shop/chaussures/sandales",
        image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400",
        description: "Légères et aérées",
      },
      {
        name: "Chaussures de ville",
        href: "/shop/chaussures/ville",
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400",
        description: "Élégance assurée",
      },
    ],
  },
  {
    name: "Accessoires",
    href: "/shop/accessoires",
    subcategories: [
      {
        name: "Sacs",
        href: "/shop/accessoires/sacs",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400",
        description: "Pratiques et tendance",
      },
      {
        name: "Montres",
        href: "/shop/accessoires/montres",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
        description: "Précision et style",
      },
      {
        name: "Bijoux",
        href: "/shop/accessoires/bijoux",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        description: "Brillez de mille feux",
      },
      {
        name: "Lunettes",
        href: "/shop/accessoires/lunettes",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
        description: "Protection et mode",
      },
    ],
  },
]

export function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (categoryName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setActiveCategory(categoryName)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const markImageAsLoaded = (src: string) => {
    setLoadedImages((prev) => new Set(prev).add(src))
  }

  return (
    <nav className="hidden lg:block border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-8 h-14">
          {categories.map((category) => (
            <div
              key={category.name}
              onMouseEnter={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              {/* Category Link */}
              <Link
                href={category.href}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category.name
                    ? "text-indigo-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {category.name}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    activeCategory === category.name ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {activeCategory === category.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                    style={{ width: "800px" }}
                  >
                    <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-6">
                      <div className="grid grid-cols-4 gap-6">
                        {/* Subcategories */}
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="group"
                          >
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                              {/* Lazy-loaded image */}
                              {!loadedImages.has(sub.image) ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
                                </div>
                              ) : null}
                              <Image
                                src={sub.image}
                                alt={sub.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                sizes="200px"
                                loading="lazy"
                                onLoad={() => markImageAsLoaded(sub.image)}
                              />
                            </div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {sub.name}
                            </h3>
                            {sub.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {sub.description}
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>

                      {/* Featured Section */}
                      {category.featured && (
                        <Link
                          href={category.featured.href}
                          className="mt-6 pt-6 border-t border-gray-200 block group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {!loadedImages.has(category.featured.image) ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-6 h-6 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
                                </div>
                              ) : null}
                              <Image
                                src={category.featured.image}
                                alt={category.featured.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                sizes="128px"
                                loading="lazy"
                                onLoad={() =>
                                  markImageAsLoaded(category.featured!.image)
                                }
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {category.featured.title}
                              </h3>
                              <p className="text-gray-600 mt-1">
                                {category.featured.description}
                              </p>
                              <span className="inline-block mt-2 text-sm font-semibold text-indigo-600 group-hover:underline">
                                Découvrir →
                              </span>
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
