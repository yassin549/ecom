"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tag, Check, X, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"

type PromoCode = {
  code: string
  discount: number
  type: "percentage" | "fixed"
  description: string
}

const VALID_PROMO_CODES: PromoCode[] = [
  {
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
    description: "10% de réduction sur votre première commande",
  },
  {
    code: "SAVE20",
    discount: 20,
    type: "percentage",
    description: "20% de réduction",
  },
  {
    code: "FREESHIP",
    discount: 15,
    type: "fixed",
    description: "15 TND de réduction sur la livraison",
  },
]

type PromoCodeProps = {
  onApply: (promo: PromoCode) => void
  onRemove: () => void
  appliedPromo?: PromoCode | null
}

export function PromoCode({ onApply, onRemove, appliedPromo }: PromoCodeProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  const triggerConfetti = () => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    fire(0.2, {
      spread: 60,
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }

  const handleApply = async () => {
    if (!code.trim()) return

    setIsValidating(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const promo = VALID_PROMO_CODES.find(
      (p) => p.code.toLowerCase() === code.trim().toLowerCase()
    )

    if (promo) {
      onApply(promo)
      setCode("")
      triggerConfetti()
    } else {
      setError("Code promo invalide")
    }

    setIsValidating(false)
  }

  const handleRemove = () => {
    onRemove()
    setError("")
  }

  return (
    <div className="space-y-3">
      {/* Applied Promo */}
      <AnimatePresence>
        {appliedPromo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <Check className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <div className="font-semibold text-green-900 flex items-center gap-2">
                      Code appliqué: {appliedPromo.code}
                      <Sparkles className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      {appliedPromo.description}
                    </div>
                    <div className="text-sm font-medium text-green-800 mt-2">
                      Économie:{" "}
                      {appliedPromo.type === "percentage"
                        ? `${appliedPromo.discount}%`
                        : `${appliedPromo.discount} TND`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRemove}
                  className="text-green-600 hover:text-green-700 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      {!appliedPromo && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  setError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                placeholder="Code promo"
                className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none transition-colors ${
                  error
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-600"
                }`}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApply}
              disabled={!code.trim() || isValidating}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                "Appliquer"
              )}
            </motion.button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm text-red-600"
              >
                <X className="h-4 w-4" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Available Codes Hint */}
          <div className="text-xs text-gray-600">
            Codes disponibles: WELCOME10, SAVE20, FREESHIP
          </div>
        </div>
      )}
    </div>
  )
}
