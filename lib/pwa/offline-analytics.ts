"use client"

type AnalyticsEvent = {
  type: 'pageview' | 'click' | 'purchase' | 'search' | 'custom'
  page?: string
  element?: string
  value?: number
  metadata?: Record<string, any>
  timestamp: number
  sessionId: string
}

class OfflineAnalytics {
  private sessionId: string
  private queue: AnalyticsEvent[] = []
  private readonly STORAGE_KEY = 'analytics_queue'

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.loadQueue()
    this.setupSyncOnReconnect()
  }

  /**
   * Track event
   */
  track(
    type: AnalyticsEvent['type'],
    data?: Partial<Omit<AnalyticsEvent, 'type' | 'timestamp' | 'sessionId'>>
  ) {
    const event: AnalyticsEvent = {
      type,
      ...data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    }

    if (navigator.onLine) {
      this.sendEvent(event)
    } else {
      this.queueEvent(event)
    }
  }

  /**
   * Track page view
   */
  trackPageView(page: string) {
    this.track('pageview', { page })
  }

  /**
   * Track click
   */
  trackClick(element: string, metadata?: Record<string, any>) {
    this.track('click', { element, metadata })
  }

  /**
   * Track purchase
   */
  trackPurchase(value: number, metadata?: Record<string, any>) {
    this.track('purchase', { value, metadata })
  }

  /**
   * Track search
   */
  trackSearch(query: string, results: number) {
    this.track('search', { metadata: { query, results } })
  }

  /**
   * Send event to server
   */
  private async sendEvent(event: AnalyticsEvent) {
    try {
      // Send to analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true, // Ensure request completes even if page unloads
      })

      console.log('📊 Analytics event sent:', event.type)
    } catch (error) {
      // Queue if failed
      this.queueEvent(event)
      console.warn('⚠️ Analytics event queued:', event.type)
    }
  }

  /**
   * Queue event for later
   */
  private queueEvent(event: AnalyticsEvent) {
    this.queue.push(event)
    this.saveQueue()

    // Try to cache in service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ANALYTICS',
        payload: event,
      })
    }
  }

  /**
   * Sync queued events
   */
  async syncQueue() {
    if (this.queue.length === 0) return

    console.log(`🔄 Syncing ${this.queue.length} analytics events...`)

    const events = [...this.queue]
    this.queue = []
    this.saveQueue()

    for (const event of events) {
      try {
        await this.sendEvent(event)
      } catch (error) {
        // Re-queue failed events
        this.queue.push(event)
      }
    }

    this.saveQueue()
  }

  /**
   * Setup auto-sync on reconnect
   */
  private setupSyncOnReconnect() {
    if (typeof window === 'undefined') return

    window.addEventListener('online', () => {
      console.log('🌐 Back online - syncing analytics...')
      this.syncQueue()
    })
  }

  /**
   * Get or create session ID
   */
  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server'

    let sessionId = sessionStorage.getItem('analytics_session_id')
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }

    return sessionId
  }

  /**
   * Load queue from storage
   */
  private loadQueue() {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.queue = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load analytics queue:', error)
    }
  }

  /**
   * Save queue to storage
   */
  private saveQueue() {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue))
    } catch (error) {
      console.error('Failed to save analytics queue:', error)
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      queued: this.queue.length,
      sessionId: this.sessionId,
    }
  }

  /**
   * Clear queue
   */
  clearQueue() {
    this.queue = []
    this.saveQueue()
  }
}

// Singleton instance
export const analytics = new OfflineAnalytics()

/**
 * Hook for analytics
 */
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackPurchase: analytics.trackPurchase.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    getQueueStatus: analytics.getQueueStatus.bind(analytics),
  }
}

/**
 * Example usage:
 * 
 * import { analytics } from '@/lib/pwa/offline-analytics'
 * 
 * // Track page view
 * analytics.trackPageView('/shop')
 * 
 * // Track click
 * analytics.trackClick('add-to-cart-button', { productId: '123' })
 * 
 * // Track purchase
 * analytics.trackPurchase(99.99, { orderId: 'ORD-123', items: 3 })
 * 
 * // Track search
 * analytics.trackSearch('laptop', 42)
 * 
 * // Custom event
 * analytics.track('custom', { metadata: { action: 'wishlist_add' } })
 */
