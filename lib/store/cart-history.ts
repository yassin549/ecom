import { create } from 'zustand'
import { showSuccess } from '@/lib/utils/toast'

type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

type CartAction = {
  type: 'add' | 'remove' | 'update' | 'clear'
  item?: CartItem
  previousQuantity?: number
  items?: CartItem[]
}

type CartHistoryState = {
  past: CartAction[]
  future: CartAction[]
  canUndo: boolean
  canRedo: boolean
  recordAction: (action: CartAction) => void
  undo: () => CartAction | null
  redo: () => CartAction | null
  clear: () => void
}

export const useCartHistory = create<CartHistoryState>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  recordAction: (action: CartAction) => {
    set((state) => ({
      past: [...state.past, action],
      future: [], // Clear future when new action is recorded
      canUndo: true,
      canRedo: false,
    }))
  },

  undo: () => {
    const { past } = get()
    if (past.length === 0) return null

    const action = past[past.length - 1]
    
    set((state) => ({
      past: state.past.slice(0, -1),
      future: [action, ...state.future],
      canUndo: state.past.length > 1,
      canRedo: true,
    }))

    showSuccess('Action annulée')
    return action
  },

  redo: () => {
    const { future } = get()
    if (future.length === 0) return null

    const action = future[0]
    
    set((state) => ({
      past: [...state.past, action],
      future: state.future.slice(1),
      canUndo: true,
      canRedo: state.future.length > 1,
    }))

    showSuccess('Action rétablie')
    return action
  },

  clear: () => {
    set({
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    })
  },
}))

/**
 * Hook to use cart undo/redo functionality
 * 
 * @example
 * const { undo, redo, canUndo, canRedo } = useCartUndoRedo()
 * 
 * // In your cart actions:
 * const addToCart = (item) => {
 *   recordCartAction({ type: 'add', item })
 *   // ... add item to cart
 * }
 */
export function useCartUndoRedo() {
  const { undo, redo, canUndo, canRedo, recordAction } = useCartHistory()

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    recordCartAction: recordAction,
  }
}

/**
 * Keyboard shortcuts for undo/redo
 * Add this to your layout or cart component
 */
export function useCartKeyboardShortcuts() {
  const { undo, redo, canUndo, canRedo } = useCartHistory()

  if (typeof window === 'undefined') return

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) undo()
      }
      
      // Ctrl+Shift+Z or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        if (canRedo) redo()
      }
      
      // Ctrl+Y or Cmd+Y for redo (alternative)
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        if (canRedo) redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])
}

import React from 'react'
