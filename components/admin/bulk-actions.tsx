"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Loader2 } from "lucide-react"

type BulkActionsProps = {
  selectedCount: number
  onUpdateStatus: (status: string) => Promise<void>
  onClear: () => void
}

export function BulkActions({ selectedCount, onUpdateStatus, onClear }: BulkActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  const handleAction = async (newStatus: string) => {
    setIsProcessing(true)
    setStatus("processing")
    setProgress(0)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await onUpdateStatus(newStatus)
      
      clearInterval(interval)
      setProgress(100)
      setStatus("success")

      // Reset after 2 seconds
      setTimeout(() => {
        setIsProcessing(false)
        setStatus("idle")
        setProgress(0)
        onClear()
      }, 2000)
    } catch (error) {
      setStatus("error")
      setTimeout(() => {
        setIsProcessing(false)
        setStatus("idle")
        setProgress(0)
      }, 3000)
    }
  }

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-2xl p-4 min-w-[500px]">
            {isProcessing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {status === "processing" && "Traitement en cours..."}
                    {status === "success" && "Terminé avec succès!"}
                    {status === "error" && "Erreur lors du traitement"}
                  </span>
                  <div className="flex items-center gap-2">
                    {status === "processing" && (
                      <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                    )}
                    {status === "success" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="h-5 w-5 text-white" />
                      </motion.div>
                    )}
                    {status === "error" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="h-5 w-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      status === "success"
                        ? "bg-green-500"
                        : status === "error"
                        ? "bg-red-500"
                        : "bg-indigo-600"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="text-xs text-gray-600 text-center">
                  {progress}% - {selectedCount} commande(s)
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{selectedCount}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction("processing")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Traiter
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction("shipped")}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Expédier
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction("cancelled")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Annuler
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClear}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    Effacer
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
