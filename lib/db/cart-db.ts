import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface CartDB extends DBSchema {
  cart: {
    key: string
    value: {
      id: string
      productId: string
      name: string
      price: number
      image: string
      quantity: number
      addedAt: number
    }
  }
}

let dbPromise: Promise<IDBPDatabase<CartDB>> | null = null

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<CartDB>('shophub-cart', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('cart')) {
          db.createObjectStore('cart', { keyPath: 'productId' })
        }
      },
    })
  }
  return dbPromise
}

export const cartDB = {
  async getAll() {
    const db = await getDB()
    return db.getAll('cart')
  },

  async get(productId: string) {
    const db = await getDB()
    return db.get('cart', productId)
  },

  async set(item: CartDB['cart']['value']) {
    const db = await getDB()
    await db.put('cart', item)
  },

  async delete(productId: string) {
    const db = await getDB()
    await db.delete('cart', productId)
  },

  async clear() {
    const db = await getDB()
    await db.clear('cart')
  },
}
