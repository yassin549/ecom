"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { motion } from "framer-motion"

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {/* Home */}
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Accueil</span>
          </Link>
        </li>

        {/* Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${
                    isLast
                      ? "text-gray-900 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Hook to generate breadcrumbs from pathname
export function useBreadcrumbs(pathname: string, customLabels?: Record<string, string>) {
  const segments = pathname.split("/").filter(Boolean)
  
  const items: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const label = customLabels?.[segment] || 
                  segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    
    return { label, href }
  })

  return items
}
