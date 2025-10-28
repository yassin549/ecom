"use client"

import { forwardRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

type FloatingLabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  showError?: boolean
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, showError = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value !== "")
      props.onChange?.(e)
    }

    const isFloating = isFocused || hasValue

    return (
      <div className="relative">
        <div className="relative">
          <input
            ref={ref}
            {...props}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            className={`peer w-full px-4 pt-6 pb-2 text-gray-900 bg-white border-2 rounded-xl transition-all outline-none ${
              error && showError
                ? "border-red-500 focus:border-red-600"
                : "border-gray-200 focus:border-indigo-600"
            }`}
            placeholder=" "
          />
          <motion.label
            animate={{
              top: isFloating ? "0.5rem" : "50%",
              fontSize: isFloating ? "0.75rem" : "1rem",
              y: isFloating ? 0 : "-50%",
            }}
            transition={{ duration: 0.2 }}
            className={`absolute left-4 pointer-events-none ${
              isFloating
                ? "text-gray-600"
                : "text-gray-400"
            }`}
          >
            {label}
          </motion.label>
        </div>

        {/* Error Message with Shake Animation */}
        <AnimatePresence>
          {error && showError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                x: [0, -10, 10, -10, 10, 0],
              }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                x: { duration: 0.4 },
                opacity: { duration: 0.2 }
              }}
              className="flex items-center gap-2 mt-2 text-sm text-red-600"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

FloatingLabelInput.displayName = "FloatingLabelInput"
