/**
 * Detect network bandwidth and connection quality
 */

export type ConnectionQuality = 'high' | 'medium' | 'low' | 'offline'

export function getConnectionQuality(): ConnectionQuality {
  if (typeof window === 'undefined') return 'high'

  // Check if offline
  if (!navigator.onLine) return 'offline'

  // Use Network Information API if available
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection

  if (connection) {
    const { effectiveType, downlink, rtt, saveData } = connection

    // If data saver is enabled, treat as low bandwidth
    if (saveData) return 'low'

    // Check effective connection type
    if (effectiveType === '4g' && downlink > 5) return 'high'
    if (effectiveType === '4g' || effectiveType === '3g') return 'medium'
    if (effectiveType === '2g' || effectiveType === 'slow-2g') return 'low'

    // Check downlink speed (Mbps)
    if (downlink > 5) return 'high'
    if (downlink > 1.5) return 'medium'
    return 'low'
  }

  // Fallback: assume high bandwidth if API not available
  return 'high'
}

export function shouldLoadVideo(): boolean {
  const quality = getConnectionQuality()
  return quality === 'high' || quality === 'medium'
}

export function shouldLoadHighResImages(): boolean {
  const quality = getConnectionQuality()
  return quality === 'high'
}

export function getImageQuality(): 'high' | 'medium' | 'low' {
  const quality = getConnectionQuality()
  if (quality === 'high') return 'high'
  if (quality === 'medium') return 'medium'
  return 'low'
}

/**
 * Hook to monitor connection quality
 */
export function useConnectionQuality() {
  if (typeof window === 'undefined') {
    return { quality: 'high' as ConnectionQuality, shouldLoadVideo: true }
  }

  const [quality, setQuality] = React.useState<ConnectionQuality>(getConnectionQuality())

  React.useEffect(() => {
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection

    if (!connection) return

    const updateQuality = () => {
      setQuality(getConnectionQuality())
    }

    connection.addEventListener('change', updateQuality)
    return () => connection.removeEventListener('change', updateQuality)
  }, [])

  return {
    quality,
    shouldLoadVideo: quality === 'high' || quality === 'medium',
    shouldLoadHighRes: quality === 'high',
  }
}

// Import React for the hook
import React from 'react'
