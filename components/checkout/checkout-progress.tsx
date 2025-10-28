"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

type Step = {
  id: string
  label: string
  number: number
}

type CheckoutProgressProps = {
  steps: Step[]
  currentStep: string
  completedSteps: string[]
}

export function CheckoutProgress({ steps, currentStep, completedSteps }: CheckoutProgressProps) {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
        <motion.div
          className="h-full bg-indigo-600 rounded-full"
          initial={{ width: "0%" }}
          animate={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id
          const isPast = index < currentStepIndex

          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Circle */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  isCompleted || isPast
                    ? "bg-indigo-600 text-white"
                    : isCurrent
                    ? "bg-white border-4 border-indigo-600 text-indigo-600"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isCompleted || isPast ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {step.number}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`mt-3 text-sm font-medium whitespace-nowrap ${
                  isCurrent
                    ? "text-indigo-600"
                    : isCompleted || isPast
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
