import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useProductReviews(productId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['productReviews', productId, page, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/reviews?productId=${productId}&page=${page}&limit=${limit}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      return response.json()
    },
    enabled: !!productId,
  })
}

export function useSubmitReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { productId: string; rating: number; comment: string }) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit review')
      }
      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', variables.productId] })
    },
  })
}
