"use client"

import { motion, AnimatePresence } from "framer-motion"
import { WifiOff, Wifi, RefreshCw } from "lucide-react"
import { useOnlineStatus } from "@/lib/offline/offline-manager"

export function OfflineIndicator() {
  const { isOnline, showNotification } = useOnlineStatus()

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${
              isOnline
                ? "bg-green-600 text-white"
                : "bg-gray-900 text-white"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5" />
                <span className="font-medium">Connexion rétablie</span>
                <RefreshCw className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5" />
                <span className="font-medium">Mode hors ligne</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
