"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, ArrowLeft } from "lucide-react"

type BreadcrumbItem = {
  label: string
  href: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4">
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.back()}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
        aria-label="Retour"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </motion.button>

      {/* Breadcrumb Trail */}
      <nav aria-label="Breadcrumb" className="flex items-center">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                )}
                {isLast ? (
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
