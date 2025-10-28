"use client"

import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { ProductCard } from './product-card'
import { Loader2 } from 'lucide-react'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  rating: number
  reviewCount: number
  stock: number
}

type ProductGridProps = {
  initialProducts: Product[]
  categoryId?: string
}

async function fetchProducts({ pageParam = 0, categoryId }: { pageParam: number; categoryId?: string }) {
  const params = new URLSearchParams({
    skip: String(pageParam * 12),
    take: '12',
    ...(categoryId && { categoryId }),
  })
  
  const response = await fetch(`/api/products?${params}`)
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export function ProductGrid({ initialProducts, categoryId }: ProductGridProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    status,
  } = useInfiniteQuery({
    queryKey: ['products', categoryId],
    queryFn: ({ pageParam = 0 }) => fetchProducts({ pageParam, categoryId }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 12) return undefined
      return pages.length
    },
    initialPageParam: 0,
    initialData: {
      pages: [initialProducts],
      pageParams: [0],
    },
    staleTime: 60 * 1000, // 1 minute
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const allProducts = data?.pages.flat() || []

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Échec du chargement des produits. Veuillez réessayer.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Masonry Grid for Desktop, Regular Grid for Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allProducts.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            product={product}
            index={index}
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Intersection Observer Target */}
      {hasNextPage && (
        <div ref={ref} className="h-20 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Chargement de plus de produits...</span>
        </div>
      )}

      {/* End of Results */}
      {!hasNextPage && allProducts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Vous avez atteint la fin du catalogue</p>
        </div>
      )}

      {/* No Results */}
      {allProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">Aucun produit trouvé</p>
        </div>
      )}
    </div>
  )
}
