"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, RefreshCw } from "lucide-react"
import SignaturePad from "signature_pad"
import { formatPrice } from "@/lib/currency"

type ConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  orderData: {
    items: any[]
    shipping: any
    total: number
  }
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  orderData,
}: ConfirmationModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signaturePadRef = useRef<SignaturePad | null>(null)
  const [hasSignature, setHasSignature] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
      })

      signaturePadRef.current.addEventListener("endStroke", () => {
        setHasSignature(!signaturePadRef.current?.isEmpty())
      })

      // Resize canvas
      const resizeCanvas = () => {
        if (canvasRef.current && signaturePadRef.current) {
          const ratio = Math.max(window.devicePixelRatio || 1, 1)
          const canvas = canvasRef.current
          canvas.width = canvas.offsetWidth * ratio
          canvas.height = canvas.offsetHeight * ratio
          canvas.getContext("2d")?.scale(ratio, ratio)
          signaturePadRef.current.clear()
        }
      }

      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      return () => {
        window.removeEventListener("resize", resizeCanvas)
        signaturePadRef.current?.off()
      }
    }
  }, [isOpen])

  const handleClear = () => {
    signaturePadRef.current?.clear()
    setHasSignature(false)
  }

  const handleConfirm = async () => {
    if (!hasSignature) return

    setIsConfirming(true)
    
    // Simulate signature processing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    onConfirm()
    setIsConfirming(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Confirmation de Commande
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Order Preview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Résumé de la Commande
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Articles</span>
                      <span className="font-medium">{orderData.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison à</span>
                      <span className="font-medium">
                        {orderData.shipping.city}, {orderData.shipping.country}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-indigo-600">
                        {formatPrice(orderData.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Paiement à la Livraison:</span> Vous
                    paierez en espèces lors de la réception de votre commande.
                  </p>
                </div>

                {/* Signature Pad */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-semibold text-gray-900">
                      Signature de Confirmation
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClear}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Effacer
                    </motion.button>
                  </div>
                  <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-48 touch-none"
                      style={{ touchAction: "none" }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Signez ci-dessus pour confirmer votre commande
                  </p>
                </div>

                {/* Terms */}
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    En confirmant cette commande, vous acceptez nos{" "}
                    <a href="/terms" className="text-indigo-600 hover:underline">
                      conditions générales de vente
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-900 font-semibold rounded-xl transition-colors"
                >
                  Annuler
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  disabled={!hasSignature || isConfirming}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {isConfirming ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="h-5 w-5" />
                      </motion.div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      Confirmer la Commande
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
