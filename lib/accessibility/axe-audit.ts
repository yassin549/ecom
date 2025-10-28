/**
 * Accessibility audits with axe-core (dev only)
 * Install: npm install --save-dev @axe-core/react
 */

export async function runAccessibilityAudit() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  try {
    // Dynamic import to avoid production bundle
    // @ts-ignore - Optional dev dependency
    const axe = await import('@axe-core/react')
    const React = await import('react')
    const ReactDOM = await import('react-dom')

    // Run audit
    axe.default(React, ReactDOM, 1000)

    console.log('♿ Accessibility audit running...')
  } catch (error) {
    console.warn('axe-core not installed. Run: npm install --save-dev @axe-core/react')
  }
}

/**
 * Hook to run audit on mount
 */
export function useAccessibilityAudit() {
  if (typeof window === 'undefined') return

  React.useEffect(() => {
    runAccessibilityAudit()
  }, [])
}

/**
 * Manual audit function
 */
export async function auditElement(element: HTMLElement) {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  try {
    // @ts-ignore - Optional dev dependency
    const axeCore = await import('axe-core')
    const results = await axeCore.default.run(element)

    console.group('♿ Accessibility Audit Results')
    console.log('Violations:', results.violations.length)
    console.log('Passes:', results.passes.length)
    
    if (results.violations.length > 0) {
      console.group('Violations')
      results.violations.forEach((violation) => {
        console.group(`${violation.impact}: ${violation.help}`)
        console.log('Description:', violation.description)
        console.log('Help URL:', violation.helpUrl)
        console.log('Nodes:', violation.nodes.length)
        console.groupEnd()
      })
      console.groupEnd()
    }
    
    console.groupEnd()

    return results
  } catch (error) {
    console.warn('Failed to run accessibility audit:', error)
    return null
  }
}

import React from 'react'
