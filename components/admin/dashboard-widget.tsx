"use client"

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { GripVertical, Maximize2, Minimize2 } from 'lucide-react'

type WidgetSize = 'small' | 'medium' | 'large'

type DashboardWidgetProps = {
  title: string
  children: React.ReactNode
  defaultSize?: WidgetSize
  onResize?: (width: number, height: number) => void
  className?: string
}

export function DashboardWidget({
  title,
  children,
  defaultSize = 'medium',
  onResize,
  className = '',
}: DashboardWidgetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<WidgetSize>(defaultSize)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // ResizeObserver for fluid layouts
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width, height })
        onResize?.(width, height)

        // Auto-adjust content based on size
        if (width < 300) {
          element.classList.add('widget-compact')
        } else {
          element.classList.remove('widget-compact')
        }
      }
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [onResize])

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-2 row-span-1',
    large: 'col-span-2 row-span-2',
  }

  return (
    <motion.div
      ref={ref}
      layout
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 
        ${isExpanded ? 'fixed inset-4 z-50' : sizeClasses[size]}
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Size toggles */}
          {!isExpanded && (
            <div className="flex gap-1">
              <button
                onClick={() => setSize('small')}
                className={`px-2 py-1 text-xs rounded ${
                  size === 'small'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title="Petit"
              >
                S
              </button>
              <button
                onClick={() => setSize('medium')}
                className={`px-2 py-1 text-xs rounded ${
                  size === 'medium'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title="Moyen"
              >
                M
              </button>
              <button
                onClick={() => setSize('large')}
                className={`px-2 py-1 text-xs rounded ${
                  size === 'large'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title="Grand"
              >
                L
              </button>
            </div>
          )}

          {/* Expand/collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isExpanded ? 'Réduire' : 'Agrandir'}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="widget-content overflow-auto" style={{ maxHeight: isExpanded ? 'calc(100vh - 200px)' : 'auto' }}>
        {children}
      </div>

      {/* Dimensions indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-400">
          {dimensions.width}x{dimensions.height}px
        </div>
      )}
    </motion.div>
  )
}

/**
 * Dashboard grid container
 */
export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
      {children}
    </div>
  )
}

/**
 * Responsive widget hook
 */
export function useWidgetResize(callback: (width: number, height: number) => void) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        callback(width, height)
      }
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [callback])

  return ref
}

/**
 * Example usage:
 * 
 * <DashboardGrid>
 *   <DashboardWidget title="Revenue" defaultSize="medium">
 *     <RevenueChart />
 *   </DashboardWidget>
 *   
 *   <DashboardWidget 
 *     title="Orders" 
 *     defaultSize="small"
 *     onResize={(w, h) => console.log('Resized:', w, h)}
 *   >
 *     <OrdersTable />
 *   </DashboardWidget>
 * </DashboardGrid>
 */
