"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { formatPrice } from "@/lib/currency"

type Product = {
  id: string
  name: string
  slug: string
  price: number
  image: string | null
  rating: number
  reviewCount: number
}

type RelatedProductsProps = {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: true,
  })

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Produits Similaires</h2>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollPrev}
            className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-indigo-600 flex items-center justify-center transition-colors"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollNext}
            className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-indigo-600 flex items-center justify-center transition-colors"
            aria-label="Suivant"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex-[0_0_280px] min-w-0"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="group bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-600 overflow-hidden transition-all hover:shadow-xl">
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        sizes="280px"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="text-xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
