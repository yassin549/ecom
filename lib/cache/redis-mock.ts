/**
 * Redis mock for development/testing
 * Replace with actual Redis in production
 */

type CacheEntry = {
  value: any
  expiry: number | null
}

class RedisMock {
  private store: Map<string, CacheEntry> = new Map()

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const expiry = ttl ? Date.now() + ttl * 1000 : null
    this.store.set(key, { value, expiry })
    this.cleanup()
  }

  async get(key: string): Promise<any | null> {
    const entry = this.store.get(key)
    
    if (!entry) return null
    
    // Check if expired
    if (entry.expiry && Date.now() > entry.expiry) {
      this.store.delete(key)
      return null
    }
    
    return entry.value
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key)
    return value !== null
  }

  async clear(): Promise<void> {
    this.store.clear()
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiry && now > entry.expiry) {
        this.store.delete(key)
      }
    }
  }
}

export const cache = new RedisMock()
