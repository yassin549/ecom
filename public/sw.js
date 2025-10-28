// Service Worker for PWA with offline analytics
const CACHE_NAME = 'ecom-v1'
const OFFLINE_ANALYTICS_CACHE = 'offline-analytics-v1'

const STATIC_ASSETS = [
  '/',
  '/shop',
  '/offline',
  '/manifest.json',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== OFFLINE_ANALYTICS_CACHE)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // API requests - network first
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached version if offline
          return caches.match(request).then((cached) => {
            if (cached) return cached
            
            // Return offline response
            return new Response(
              JSON.stringify({ error: 'Offline', cached: true }),
              { headers: { 'Content-Type': 'application/json' } }
            )
          })
        })
    )
    return
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached

      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
    })
  )
})

// Background sync for offline analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncOfflineAnalytics())
  }
})

// Sync offline analytics
async function syncOfflineAnalytics() {
  try {
    const cache = await caches.open(OFFLINE_ANALYTICS_CACHE)
    const requests = await cache.keys()

    for (const request of requests) {
      try {
        const response = await cache.match(request)
        const data = await response.json()

        // Send to analytics endpoint
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        // Remove from cache after successful sync
        await cache.delete(request)
        console.log('✅ Synced offline analytics')
      } catch (error) {
        console.error('❌ Failed to sync analytics:', error)
      }
    }
  } catch (error) {
    console.error('❌ Sync error:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}

  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'E-Commerce', options)
  )
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  )
})

// Message handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CACHE_ANALYTICS') {
    cacheAnalytics(event.data.payload)
  }
})

// Cache analytics data when offline
async function cacheAnalytics(data) {
  try {
    const cache = await caches.open(OFFLINE_ANALYTICS_CACHE)
    const request = new Request('/api/analytics/offline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })

    await cache.put(request, response)
    console.log('📊 Cached analytics for offline sync')
  } catch (error) {
    console.error('❌ Failed to cache analytics:', error)
  }
}
