"use client"

import { useEffect, useState } from 'react'

type OfflineAction = {
  id: string
  type: 'cart_add' | 'cart_remove' | 'cart_update' | 'wishlist_add' | 'wishlist_remove'
  payload: any
  timestamp: number
}

class OfflineManager {
  private readonly STORAGE_KEY = 'offline_actions'
  private readonly CACHE_KEY = 'offline_cache'

  /**
   * Check if online
   */
  isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine
  }

  /**
   * Queue action for sync
   */
  queueAction(type: OfflineAction['type'], payload: any) {
    const action: OfflineAction = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: Date.now(),
    }

    const actions = this.getQueuedActions()
    actions.push(action)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(actions))

    console.log('📝 Action queued for sync:', action)
  }

  /**
   * Get queued actions
   */
  getQueuedActions(): OfflineAction[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  /**
   * Sync queued actions
   */
  async syncActions(): Promise<{ success: number; failed: number }> {
    if (!this.isOnline()) {
      console.log('⚠️ Cannot sync: offline')
      return { success: 0, failed: 0 }
    }

    const actions = this.getQueuedActions()
    if (actions.length === 0) {
      return { success: 0, failed: 0 }
    }

    console.log(`🔄 Syncing ${actions.length} actions...`)

    let success = 0
    let failed = 0
    const remainingActions: OfflineAction[] = []

    for (const action of actions) {
      try {
        await this.executeAction(action)
        success++
        console.log(`✅ Synced: ${action.type}`)
      } catch (error) {
        failed++
        remainingActions.push(action)
        console.error(`❌ Failed to sync: ${action.type}`, error)
      }
    }

    // Update queue with failed actions
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(remainingActions))

    console.log(`✅ Sync complete: ${success} success, ${failed} failed`)
    return { success, failed }
  }

  /**
   * Execute action (mock implementation)
   */
  private async executeAction(action: OfflineAction): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In production, make actual API calls based on action type
    switch (action.type) {
      case 'cart_add':
        // await fetch('/api/cart', { method: 'POST', body: JSON.stringify(action.payload) })
        break
      case 'cart_remove':
        // await fetch(`/api/cart/${action.payload.id}`, { method: 'DELETE' })
        break
      case 'wishlist_add':
        // await fetch('/api/wishlist', { method: 'POST', body: JSON.stringify(action.payload) })
        break
      // ... other actions
    }
  }

  /**
   * Cache data for offline use
   */
  cacheData(key: string, data: any) {
    try {
      const cache = this.getCachedData()
      cache[key] = {
        data,
        timestamp: Date.now(),
      }
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache))
    } catch (error) {
      console.error('Failed to cache data:', error)
    }
  }

  /**
   * Get cached data
   */
  getCachedData(key?: string): any {
    if (typeof window === 'undefined') return key ? null : {}

    try {
      const stored = localStorage.getItem(this.CACHE_KEY)
      const cache = stored ? JSON.parse(stored) : {}

      if (key) {
        const item = cache[key]
        if (!item) return null

        // Check if cache is stale (older than 1 hour)
        const isStale = Date.now() - item.timestamp > 60 * 60 * 1000
        return isStale ? null : item.data
      }

      return cache
    } catch {
      return key ? null : {}
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    localStorage.removeItem(this.CACHE_KEY)
  }

  /**
   * Clear queue
   */
  clearQueue() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]))
  }
}

export const offlineManager = new OfflineManager()

/**
 * Hook to monitor online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = async () => {
      setIsOnline(true)
      setShowNotification(true)

      // Auto-sync when coming back online
      const result = await offlineManager.syncActions()
      if (result.success > 0) {
        console.log(`✅ Synced ${result.success} actions`)
      }

      setTimeout(() => setShowNotification(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, showNotification }
}

/**
 * Example usage:
 * 
 * // Queue action when offline
 * if (!offlineManager.isOnline()) {
 *   offlineManager.queueAction('cart_add', { productId: '123', quantity: 1 })
 * } else {
 *   // Make API call directly
 *   await fetch('/api/cart', { method: 'POST', ... })
 * }
 * 
 * // Cache data for offline use
 * offlineManager.cacheData('products', productsData)
 * 
 * // Get cached data
 * const cachedProducts = offlineManager.getCachedData('products')
 * 
 * // Use hook in component
 * const { isOnline, showNotification } = useOnlineStatus()
 */
