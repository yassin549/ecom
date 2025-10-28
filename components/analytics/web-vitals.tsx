"use client"

import { useEffect } from "react"
import { useReportWebVitals } from "next/web-vitals"

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      })
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // Example: Send to Google Analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", metric.name, {
          value: Math.round(
            metric.name === "CLS" ? metric.value * 1000 : metric.value
          ),
          event_category: "Web Vitals",
          event_label: metric.id,
          non_interaction: true,
        })
      }

      // Example: Send to custom analytics endpoint
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        }),
      }).catch((error) => {
        console.error("Failed to send analytics:", error)
      })
    }
  })

  // Performance observer for custom metrics
  useEffect(() => {
    if (typeof window === "undefined") return

    // Monitor long tasks
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn("[Performance] Long task detected:", {
                duration: entry.duration,
                startTime: entry.startTime,
              })
            }
          }
        })

        observer.observe({ entryTypes: ["longtask"] })

        return () => observer.disconnect()
      } catch (error) {
        // Long task API not supported
      }
    }
  }, [])

  return null
}

// Helper to get performance metrics
export function getPerformanceMetrics() {
  if (typeof window === "undefined") return null

  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming

  if (!navigation) return null

  return {
    // Page load metrics
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,

    // Resource timing
    resources: performance.getEntriesByType("resource").length,
  }
}
