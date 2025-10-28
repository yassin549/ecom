"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/lib/theme/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const themes = [
    { value: "light" as const, icon: Sun, label: "Clair" },
    { value: "dark" as const, icon: Moon, label: "Sombre" },
    { value: "system" as const, icon: Monitor, label: "Système" },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
      {themes.map((t) => {
        const Icon = t.icon
        const isActive = theme === t.value

        return (
          <motion.button
            key={t.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(t.value)}
            className={`relative px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? "text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
            title={t.label}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 bg-indigo-600 rounded-lg"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Icon className="h-5 w-5 relative z-10" />
          </motion.button>
        )
      })}
    </div>
  )
}

export function ThemeToggleCompact() {
  const { resolvedTheme, setTheme, theme } = useTheme()

  const handleToggle = () => {
    if (theme === "system") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    } else {
      setTheme(theme === "dark" ? "light" : "dark")
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title="Changer le thème"
    >
      <AnimatePresence mode="wait">
        {resolvedTheme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5 text-gray-900 dark:text-gray-100" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5 text-gray-900 dark:text-gray-100" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
