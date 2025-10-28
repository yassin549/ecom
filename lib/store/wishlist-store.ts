import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WishlistItem = {
  id: string
  productId: string
  name: string
  price: number
  image: string
  category: string
  addedAt: Date
  order: number
}

type WishlistState = {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'addedAt' | 'order'>) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (item: Omit<WishlistItem, 'addedAt' | 'order'>) => boolean
  reorderItems: (items: WishlistItem[]) => void
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get()
        
        // Check if already in wishlist
        if (items.some((i) => i.productId === item.productId)) {
          return
        }

        const newItem: WishlistItem = {
          ...item,
          addedAt: new Date(),
          order: items.length,
        }

        set({ items: [...items, newItem] })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId)
      },

      toggleItem: (item) => {
        const { isInWishlist, addItem, removeItem } = get()
        
        if (isInWishlist(item.productId)) {
          removeItem(item.productId)
          return false // Removed
        } else {
          addItem(item)
          return true // Added
        }
      },

      reorderItems: (items) => {
        set({ items })
      },

      clearWishlist: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'wishlist-storage',
      version: 1,
    }
  )
)

// Selectors
export const useWishlistCount = () =>
  useWishlistStore((state) => state.items.length)

export const useIsInWishlist = (productId: string) =>
  useWishlistStore((state) => state.isInWishlist(productId))
