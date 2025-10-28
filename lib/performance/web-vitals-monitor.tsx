"use client"

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

type Metric = {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
}

/**
 * Core Web Vitals thresholds
 * Based on Google's recommendations
 */
const THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: { good: 2500, poor: 4000 },
  
  // First Input Delay (FID)
  FID: { good: 100, poor: 300 },
  
  // Cumulative Layout Shift (CLS)
  CLS: { good: 0.1, poor: 0.25 },
  
  // First Contentful Paint (FCP)
  FCP: { good: 1800, poor: 3000 },
  
  // Time to First Byte (TTFB)
  TTFB: { good: 800, poor: 1800 },
  
  // Interaction to Next Paint (INP)
  INP: { good: 200, poor: 500 },
}

/**
 * Get rating based on metric value
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Format metric value for display
 */
function formatValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3)
  }
  return `${Math.round(value)}ms`
}

/**
 * Send metrics to analytics
 */
async function sendToAnalytics(metric: Metric) {
  try {
    // Send to your analytics endpoint
    await fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        navigationType: metric.navigationType,
        timestamp: Date.now(),
      }),
      keepalive: true,
    })
  } catch (error) {
    console.error('Failed to send web vitals:', error)
  }
}

/**
 * Web Vitals Monitor Component
 */
export function WebVitalsMonitor() {
  useReportWebVitals((metric) => {
    const { name, value, id, navigationType, delta } = metric
    
    const rating = getRating(name, value)
    const formattedValue = formatValue(name, value)
    
    const enhancedMetric: Metric = {
      id,
      name,
      value,
      rating,
      delta,
      navigationType,
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌'
      console.log(`${emoji} ${name}: ${formattedValue} (${rating})`)
    }
    
    // Send to analytics
    sendToAnalytics(enhancedMetric)
  })
  
  return null
}

/**
 * Performance observer hook
 */
export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }
    
    // Monitor long tasks (> 50ms)
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('⚠️ Long task detected:', {
            duration: `${Math.round(entry.duration)}ms`,
            startTime: `${Math.round(entry.startTime)}ms`,
          })
        }
      }
    })
    
    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      // Long task API not supported
    }
    
    // Monitor layout shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      let clsScore = 0
      
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsScore += (entry as any).value
        }
      }
      
      if (clsScore > 0.1) {
        console.warn('⚠️ Layout shift detected:', {
          score: clsScore.toFixed(3),
        })
      }
    })
    
    try {
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      // Layout shift API not supported
    }
    
    return () => {
      longTaskObserver.disconnect()
      layoutShiftObserver.disconnect()
    }
  }, [])
}

/**
 * Resource timing monitor
 */
export function useResourceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming
        
        // Warn about slow resources (> 1s)
        if (resource.duration > 1000) {
          console.warn('⚠️ Slow resource:', {
            name: resource.name,
            duration: `${Math.round(resource.duration)}ms`,
            size: resource.transferSize ? `${Math.round(resource.transferSize / 1024)}KB` : 'cached',
          })
        }
        
        // Warn about large resources (> 500KB)
        if (resource.transferSize > 500 * 1024) {
          console.warn('⚠️ Large resource:', {
            name: resource.name,
            size: `${Math.round(resource.transferSize / 1024)}KB`,
          })
        }
      }
    })
    
    try {
      observer.observe({ entryTypes: ['resource'] })
    } catch (e) {
      // Resource timing API not supported
    }
    
    return () => observer.disconnect()
  }, [])
}

/**
 * Example usage:
 * 
 * // Add to root layout
 * <WebVitalsMonitor />
 * 
 * // Use hooks in components
 * function MyComponent() {
 *   usePerformanceMonitor()
 *   useResourceMonitor()
 *   
 *   return <div>...</div>
 * }
 */
