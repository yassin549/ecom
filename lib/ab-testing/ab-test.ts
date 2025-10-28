import { useEffect, useState } from 'react'

export type Variant = 'A' | 'B' | 'C'

type ABTestConfig = {
  testId: string
  variants: Variant[]
  weights?: number[] // Optional weights for each variant (must sum to 1)
}

type ABTestResult = {
  variant: Variant
  isLoading: boolean
}

// Store user's assigned variants in localStorage
const STORAGE_KEY = 'ab_tests'

function getStoredVariants(): Record<string, Variant> {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function storeVariant(testId: string, variant: Variant) {
  if (typeof window === 'undefined') return
  
  try {
    const variants = getStoredVariants()
    variants[testId] = variant
    localStorage.setItem(STORAGE_KEY, JSON.stringify(variants))
  } catch (error) {
    console.error('Failed to store AB test variant:', error)
  }
}

function selectVariant(variants: Variant[], weights?: number[]): Variant {
  if (!weights || weights.length !== variants.length) {
    // Equal distribution
    const randomIndex = Math.floor(Math.random() * variants.length)
    return variants[randomIndex]
  }

  // Weighted distribution
  const random = Math.random()
  let cumulativeWeight = 0

  for (let i = 0; i < variants.length; i++) {
    cumulativeWeight += weights[i]
    if (random <= cumulativeWeight) {
      return variants[i]
    }
  }

  return variants[0]
}

/**
 * Hook for A/B testing
 * 
 * @example
 * const { variant, isLoading } = useABTest({
 *   testId: 'checkout-button-color',
 *   variants: ['A', 'B'],
 *   weights: [0.5, 0.5] // Optional: 50/50 split
 * })
 * 
 * if (variant === 'A') {
 *   return <button className="bg-blue-600">Checkout</button>
 * } else {
 *   return <button className="bg-green-600">Checkout</button>
 * }
 */
export function useABTest({ testId, variants, weights }: ABTestConfig): ABTestResult {
  const [variant, setVariant] = useState<Variant>('A')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user already has a variant assigned
    const storedVariants = getStoredVariants()
    
    if (storedVariants[testId]) {
      setVariant(storedVariants[testId])
    } else {
      // Assign new variant
      const newVariant = selectVariant(variants, weights)
      setVariant(newVariant)
      storeVariant(testId, newVariant)
    }

    setIsLoading(false)
  }, [testId, variants, weights])

  return { variant, isLoading }
}

/**
 * Track A/B test conversion
 * 
 * @example
 * trackConversion('checkout-button-color', 'purchase_completed')
 */
export function trackConversion(testId: string, eventName: string) {
  const storedVariants = getStoredVariants()
  const variant = storedVariants[testId]

  if (!variant) {
    console.warn(`No variant found for test: ${testId}`)
    return
  }

  // In production, send to analytics service
  console.log('AB Test Conversion:', {
    testId,
    variant,
    eventName,
    timestamp: new Date().toISOString(),
  })

  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      event_category: 'ab_test',
      event_label: `${testId}_${variant}`,
    })
  }
}

/**
 * Get current variant for a test (without hook)
 */
export function getVariant(testId: string): Variant | null {
  const storedVariants = getStoredVariants()
  return storedVariants[testId] || null
}

/**
 * Reset all A/B tests (useful for testing)
 */
export function resetABTests() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
