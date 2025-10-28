"use client"

import React, { useEffect, useRef, useState } from 'react'

type ParallaxOptions = {
  speed?: number // 0.1 to 1.0 (slower to faster)
  direction?: 'vertical' | 'horizontal'
  threshold?: number // 0 to 1
  rootMargin?: string
  throttle?: number // ms
}

/**
 * Parallax hook with Intersection Observer throttling
 * Optimized for performance with requestAnimationFrame
 */
export function useParallax(options: ParallaxOptions = {}) {
  const {
    speed = 0.5,
    direction = 'vertical',
    threshold = 0,
    rootMargin = '0px',
    throttle = 16, // ~60fps
  } = options

  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const lastScrollTime = useRef(0)
  const rafId = useRef<number | undefined>(undefined)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Intersection Observer for visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    // Scroll handler with throttling
    const handleScroll = () => {
      if (!isVisible) return

      const now = Date.now()
      if (now - lastScrollTime.current < throttle) return

      lastScrollTime.current = now

      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }

      rafId.current = requestAnimationFrame(() => {
        if (!element) return

        const rect = element.getBoundingClientRect()
        const scrolled = window.scrollY
        const elementTop = rect.top + scrolled
        const windowHeight = window.innerHeight
        const elementVisible = scrolled + windowHeight - elementTop

        // Calculate parallax offset
        const offset = elementVisible * speed

        if (direction === 'vertical') {
          element.style.transform = `translateY(${offset}px)`
        } else {
          element.style.transform = `translateX(${offset}px)`
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial position

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [speed, direction, threshold, rootMargin, throttle, isVisible])

  return ref
}

/**
 * Parallax component wrapper
 * Note: Commented out to avoid JSX in .ts file. Convert to .tsx if needed.
 */
// export function Parallax({
//   children,
//   speed = 0.5,
//   direction = 'vertical',
//   className = '',
// }: {
//   children: React.ReactNode
//   speed?: number
//   direction?: 'vertical' | 'horizontal'
//   className?: string
// }) {
//   const ref = useParallax({ speed, direction })
//   return (
//     <div ref={ref as any} className={className}>
//       {children}
//     </div>
//   )
// }

/**
 * Optimized scroll-based parallax for backgrounds
 */
export function useBackgroundParallax(speed: number = 0.3) {
  const ref = useRef<HTMLElement>(null)
  const rafId = useRef<number | undefined>(undefined)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }

      rafId.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        
        // Only update if scroll changed significantly (> 1px)
        if (Math.abs(scrollY - lastScrollY.current) < 1) return
        
        lastScrollY.current = scrollY
        const offset = scrollY * speed

        element.style.transform = `translateY(${offset}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [speed])

  return ref
}

/**
 * Performance monitoring for parallax
 */
export function useParallaxPerformance() {
  const [fps, setFps] = useState(60)
  const frameCount = useRef(0)
  const lastTime = useRef(Date.now())

  useEffect(() => {
    const measureFps = () => {
      frameCount.current++

      const now = Date.now()
      const elapsed = now - lastTime.current

      if (elapsed >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / elapsed))
        frameCount.current = 0
        lastTime.current = now
      }

      requestAnimationFrame(measureFps)
    }

    const rafId = requestAnimationFrame(measureFps)

    return () => cancelAnimationFrame(rafId)
  }, [])

  return fps
}

/**
 * Example usage:
 * 
 * // Hook
 * const parallaxRef = useParallax({ speed: 0.5, direction: 'vertical' })
 * <div ref={parallaxRef}>Content</div>
 * 
 * // Component
 * <Parallax speed={0.3}>
 *   <img src="..." alt="..." />
 * </Parallax>
 * 
 * // Background parallax
 * const bgRef = useBackgroundParallax(0.2)
 * <div ref={bgRef} className="bg-image" />
 * 
 * // Performance monitoring
 * const fps = useParallaxPerformance()
 * console.log(`FPS: ${fps}`)
 */
