import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Favorite = {
  productId: string
  productName: string
  productPrice: number
  productImage: string
  addedAt: string
}

type FavoritesStore = {
  favorites: Favorite[]
  addFavorite: (product: Omit<Favorite, 'addedAt'>) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product) => {
        const { favorites } = get()
        if (!favorites.some((f) => f.productId === product.productId)) {
          set({
            favorites: [
              ...favorites,
              { ...product, addedAt: new Date().toISOString() },
            ],
          })
        }
      },

      removeFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.productId !== productId),
        }))
      },

      isFavorite: (productId) => {
        return get().favorites.some((f) => f.productId === productId)
      },

      clearFavorites: () => {
        set({ favorites: [] })
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
)
