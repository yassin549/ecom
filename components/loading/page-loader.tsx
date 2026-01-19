"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function PageLoader() {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 300)
          return 100
        }
        // Faster initial load, slower at the end
        const increment = prev < 50 ? 15 : prev < 80 ? 8 : 4
        return Math.min(prev + increment, 100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 200
            }}
            className="mb-8"
          >
            <img
              src="/assets/logo.jpg"
              alt="Drip Shop Logo"
              className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover shadow-2xl border-4 border-primary/20"
            />
          </motion.div>

          {/* Progress Bar Container */}
          <div className="w-64 md:w-80 relative">
            {/* Background Track */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              {/* Animated Progress */}
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Progress Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-center"
            >
              <span className="text-sm font-bold text-white tracking-widest">
                {progress}%
              </span>
            </motion.div>
          </div>

          {/* Loading Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-sm text-gray-500"
          >
            Préparation du Drip...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
