"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, Star, Trophy, Zap, Gift } from "lucide-react"
import confetti from "canvas-confetti"

type Badge = {
  id: string
  label: string
  icon: typeof Star
  color: string
  bgColor: string
  earned: boolean
}

type GamifiedProgressProps = {
  currentStep: number
  totalSteps: number
  completedSteps: string[]
}

export function GamifiedProgress({
  currentStep,
  totalSteps,
  completedSteps,
}: GamifiedProgressProps) {
  const progress = (completedSteps.length / totalSteps) * 100

  const badges: Badge[] = [
    {
      id: "started",
      label: "Démarrage",
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      earned: completedSteps.length >= 1,
    },
    {
      id: "halfway",
      label: "À mi-chemin",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      earned: completedSteps.length >= Math.ceil(totalSteps / 2),
    },
    {
      id: "almost",
      label: "Presque là",
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      earned: completedSteps.length >= totalSteps - 1,
    },
    {
      id: "completed",
      label: "Champion",
      icon: Gift,
      color: "text-green-600",
      bgColor: "bg-green-100",
      earned: completedSteps.length === totalSteps,
    },
  ]

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progression: {completedSteps.length}/{totalSteps}
          </span>
          <span className="text-sm font-bold text-indigo-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
          />
          {/* Sparkle effect */}
          {progress > 0 && (
            <motion.div
              animate={{
                x: [`${progress - 10}%`, `${progress}%`],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          )}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Badges de progression
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            const wasJustEarned =
              badge.earned &&
              completedSteps.length === index + 1

            if (wasJustEarned) {
              triggerConfetti()
            }

            return (
              <motion.div
                key={badge.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="relative"
              >
                <div
                  className={`relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all ${
                    badge.earned
                      ? `${badge.bgColor} border-transparent shadow-lg`
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {/* Icon */}
                  <motion.div
                    animate={
                      badge.earned
                        ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.5,
                      repeat: badge.earned ? Infinity : 0,
                      repeatDelay: 3,
                    }}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        badge.earned ? badge.color : "text-gray-400"
                      }`}
                    />
                  </motion.div>

                  {/* Checkmark */}
                  <AnimatePresence>
                    {badge.earned && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Lock overlay */}
                  {!badge.earned && (
                    <div className="absolute inset-0 bg-gray-100/50 rounded-xl flex items-center justify-center">
                      <div className="w-4 h-5 border-2 border-gray-400 rounded-sm relative">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-gray-400 border-b-0 rounded-t-full" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Label */}
                <p
                  className={`text-xs text-center mt-2 font-medium ${
                    badge.earned ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {badge.label}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Motivational Message */}
      <AnimatePresence mode="wait">
        {progress < 100 ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-center"
          >
            <p className="text-sm text-indigo-900">
              {progress < 25 && "Excellent début! Continuez comme ça! 🚀"}
              {progress >= 25 && progress < 50 && "Vous êtes sur la bonne voie! 💪"}
              {progress >= 50 && progress < 75 && "Plus que quelques étapes! 🎯"}
              {progress >= 75 && "Presque terminé! Vous y êtes presque! 🏁"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="p-4 bg-green-50 border border-green-200 rounded-xl text-center"
          >
            <p className="text-sm font-semibold text-green-900">
              🎉 Félicitations! Vous avez terminé toutes les étapes!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
