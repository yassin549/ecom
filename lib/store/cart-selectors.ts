import { useCartStore } from './cart-store'

/**
 * Memoized selectors for cart store
 * These prevent unnecessary re-renders by only updating when specific values change
 */

// Get total items count
export const useCartItemsCount = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  )

// Get cart total price
export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  )

// Get specific item by ID
export const useCartItem = (productId: string) =>
  useCartStore((state) => state.items.find((item) => item.productId === productId))

// Get item quantity
export const useItemQuantity = (productId: string) =>
  useCartStore(
    (state) =>
      state.items.find((item) => item.productId === productId)?.quantity || 0
  )

// Check if item is in cart
export const useIsInCart = (productId: string) =>
  useCartStore((state) =>
    state.items.some((item) => item.productId === productId)
  )

// Get cart items count (for badge)
export const useCartBadgeCount = () =>
  useCartStore((state) => {
    const count = state.items.reduce((total, item) => total + item.quantity, 0)
    return count > 99 ? '99+' : count.toString()
  })

// Get cart subtotal (before discounts)
export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  )

// Get cart with applied promo
export const useCartWithPromo = () =>
  useCartStore((state) => {
    const subtotal = state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )

    // This would be calculated based on applied promo code
    // For now, just return subtotal
    return {
      subtotal,
      discount: 0,
      total: subtotal,
    }
  })

// Get empty cart state
export const useIsCartEmpty = () =>
  useCartStore((state) => state.items.length === 0)

/**
 * Example usage:
 * 
 * const itemsCount = useCartItemsCount()
 * const total = useCartTotal()
 * const isInCart = useIsInCart('product-123')
 * const quantity = useItemQuantity('product-123')
 */
