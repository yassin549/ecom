"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'

type CursorState = 'default' | 'hover' | 'drag' | 'click'

export function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>('default')
  const [isVisible, setIsVisible] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  // Smooth cursor movement with springs
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 })
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 })

  useEffect(() => {
    // Only show on desktop
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    if (!isDesktop) return

    setIsVisible(true)

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    // Hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      if (target.matches('a, button, [role="button"], input, textarea, select')) {
        setCursorState('hover')
      } else if (target.matches('[draggable="true"], .draggable')) {
        setCursorState('drag')
      } else {
        setCursorState('default')
      }
    }

    // Click detection
    const handleMouseDown = () => setCursorState('click')
    const handleMouseUp = () => setCursorState('default')

    // Drag detection
    const handleDragStart = () => setCursorState('drag')
    const handleDragEnd = () => setCursorState('default')

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('dragend', handleDragEnd)

    // Hide default cursor
    document.body.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('dragend', handleDragEnd)
      document.body.style.cursor = 'auto'
    }
  }, [cursorX, cursorY])

  if (!isVisible) return null

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: cursorState === 'hover' ? 1.5 : cursorState === 'click' ? 0.8 : 1,
            rotate: cursorState === 'drag' ? 45 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* Outer ring */}
          <motion.div
            className="w-10 h-10 border-2 border-white rounded-full"
            animate={{
              scale: cursorState === 'hover' ? 1.2 : 1,
              opacity: cursorState === 'click' ? 0.5 : 1,
            }}
          />
          
          {/* Inner dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: cursorState === 'hover' ? 0 : cursorState === 'click' ? 1.5 : 1,
            }}
          />

          {/* Drag indicator */}
          {cursorState === 'drag' && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M9 3L5 7h3v10H5l4 4 4-4h-3V7h3L9 3z" />
                <path d="M15 3l4 4h-3v10h3l-4 4-4-4h3V7h-3l4-4z" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Trail effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="w-16 h-16 border border-white/30 rounded-full"
          animate={{
            scale: cursorState === 'hover' ? 1.5 : 1,
            opacity: cursorState === 'click' ? 0.3 : 0.5,
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        />
      </motion.div>
    </>
  )
}

/**
 * Hook to enable custom cursor on specific elements
 */
export function useCursorEffect(effect: 'hover' | 'drag' = 'hover') {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (effect === 'drag') {
      element.setAttribute('draggable', 'true')
      element.classList.add('draggable')
    }

    return () => {
      if (effect === 'drag') {
        element.removeAttribute('draggable')
        element.classList.remove('draggable')
      }
    }
  }, [effect])

  return ref
}

/**
 * Example usage:
 * 
 * // Add to root layout
 * <CustomCursor />
 * 
 * // Make element draggable
 * const dragRef = useCursorEffect('drag')
 * <div ref={dragRef}>Drag me</div>
 * 
 * // Hover effect (automatic for buttons/links)
 * <button>Hover me</button>
 */
