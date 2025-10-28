"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import CountUp from "react-countup"
import { LucideIcon } from "lucide-react"

type KPICardProps = {
  title: string
  value: number
  prefix?: string
  suffix?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color: "blue" | "green" | "yellow" | "red" | "purple"
  decimals?: number
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-600",
    text: "text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    icon: "bg-green-600",
    text: "text-green-600",
  },
  yellow: {
    bg: "bg-yellow-50",
    icon: "bg-yellow-600",
    text: "text-yellow-600",
  },
  red: {
    bg: "bg-red-50",
    icon: "bg-red-600",
    text: "text-red-600",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-600",
    text: "text-purple-600",
  },
}

export function KPICard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon: Icon,
  trend,
  color,
  decimals = 0,
}: KPICardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const colors = colorClasses[color]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {isVisible ? (
                <CountUp
                  start={0}
                  end={value}
                  duration={2}
                  decimals={decimals}
                  prefix={prefix}
                  suffix={suffix}
                  separator=","
                  useEasing={true}
                  easingFn={(t, b, c, d) => {
                    // Ease out cubic
                    return c * ((t = t / d - 1) * t * t + 1) + b
                  }}
                />
              ) : (
                "0"
              )}
            </span>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`p-3 ${colors.icon} rounded-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
      </div>

      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            {trend.isPositive ? "Augmentation" : "Diminution"} par rapport au mois
            dernier
          </p>
        </div>
      )}
    </motion.div>
  )
}
