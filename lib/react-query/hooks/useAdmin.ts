import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Admin Stats
export function useAdminStats(period = '30') {
  return useQuery({
    queryKey: ['adminStats', period],
    queryFn: async () => {
      const response = await fetch(`/api/admin/stats?period=${period}`)
      if (!response.ok) {
        throw new Error('Failed to fetch admin stats')
      }
      return response.json()
    },
  })
}

// Reviews Management
export function useReviews(approved?: boolean) {
  return useQuery({
    queryKey: ['reviews', approved],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (approved !== undefined) {
        params.append('approved', String(approved))
      }

      const response = await fetch(`/api/admin/reviews?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      return response.json()
    },
  })
}

export function useApproveReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ reviewId, approved }: { reviewId: string; approved: boolean }) => {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, approved }),
      })
      if (!response.ok) {
        throw new Error('Failed to update review')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await fetch(`/api/admin/reviews?reviewId=${reviewId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete review')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

// Promo Codes Management
export function usePromoCodes() {
  return useQuery({
    queryKey: ['promoCodes'],
    queryFn: async () => {
      const response = await fetch('/api/admin/promo-codes')
      if (!response.ok) {
        throw new Error('Failed to fetch promo codes')
      }
      return response.json()
    },
  })
}

export function useCreatePromoCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create promo code')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] })
    },
  })
}

export function useUpdatePromoCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { id: string; active?: boolean; maxUses?: number }) => {
      const response = await fetch('/api/admin/promo-codes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update promo code')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] })
    },
  })
}

export function useDeletePromoCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/promo-codes?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete promo code')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] })
    },
  })
}

// Validate Promo Code (Public)
export function useValidatePromoCode() {
  return useMutation({
    mutationFn: async ({ code, cartTotal }: { code: string; cartTotal: number }) => {
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, cartTotal }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Invalid promo code')
      }
      return response.json()
    },
  })
}
