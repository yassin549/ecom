import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface ProductFilters {
  page?: number
  limit?: number
  categoryId?: string
  search?: string
  featured?: boolean
  sort?: string
  minPrice?: number
  maxPrice?: number
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })

      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      return response.json()
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      return response.json()
    },
    enabled: !!id,
  })
}

export function useRelatedProducts(productId: string, limit = 4) {
  return useQuery({
    queryKey: ['relatedProducts', productId, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/products/related?productId=${productId}&limit=${limit}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch related products')
      }
      return response.json()
    },
    enabled: !!productId,
  })
}

export function useSearchProducts(query: string, limit = 10) {
  return useQuery({
    queryKey: ['searchProducts', query, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}&limit=${limit}`
      )
      if (!response.ok) {
        throw new Error('Failed to search products')
      }
      return response.json()
    },
    enabled: query.length >= 2,
  })
}

// Admin mutations
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to create product')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update product')
      }
      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete product')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
