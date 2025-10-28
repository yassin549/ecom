"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  X,
  Flag,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  Keyboard,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { showSuccess, showError } from "@/lib/utils/toast"

type Review = {
  id: string
  productId: string
  productName: string
  author: string
  rating: number
  title: string
  content: string
  date: Date
  status: "pending" | "approved" | "rejected"
  reports: number
}

// Mock data
const mockReviews: Review[] = [
  {
    id: "1",
    productId: "p1",
    productName: "T-shirt Premium",
    author: "Marie Dubois",
    rating: 5,
    title: "Excellent produit!",
    content: "Très satisfaite de mon achat. La qualité est au rendez-vous et la livraison rapide.",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "pending",
    reports: 0,
  },
  {
    id: "2",
    productId: "p2",
    productName: "Jean Slim Fit",
    author: "Pierre Martin",
    rating: 4,
    title: "Bon rapport qualité-prix",
    content: "Produit conforme à la description. Taille bien.",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "pending",
    reports: 0,
  },
  {
    id: "3",
    productId: "p3",
    productName: "Veste en Cuir",
    author: "Sophie Laurent",
    rating: 1,
    title: "Déçu",
    content: "Mauvaise qualité, ne correspond pas aux photos.",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "pending",
    reports: 2,
  },
]

export default function ModerationPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const currentReview = reviews[currentIndex]
  const pendingReviews = reviews.filter((r) => r.status === "pending")

  const handleApprove = () => {
    if (!currentReview) return

    setReviews((prev) =>
      prev.map((r) =>
        r.id === currentReview.id ? { ...r, status: "approved" as const } : r
      )
    )
    showSuccess("Avis approuvé")
    goToNext()
  }

  const handleReject = () => {
    if (!currentReview) return

    setReviews((prev) =>
      prev.map((r) =>
        r.id === currentReview.id ? { ...r, status: "rejected" as const } : r
      )
    )
    showError("Avis rejeté")
    goToNext()
  }

  const handleSkip = () => {
    goToNext()
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(pendingReviews.length - 1, prev + 1))
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case "a":
          e.preventDefault()
          handleApprove()
          break
        case "r":
          e.preventDefault()
          handleReject()
          break
        case "s":
          e.preventDefault()
          handleSkip()
          break
        case "arrowleft":
          e.preventDefault()
          goToPrevious()
          break
        case "arrowright":
          e.preventDefault()
          goToNext()
          break
        case "?":
          e.preventDefault()
          setShowShortcuts(!showShortcuts)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, currentReview, showShortcuts])

  if (pendingReviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center max-w-md"
        >
          <Check className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tout est à jour!
          </h2>
          <p className="text-gray-600">
            Aucun avis en attente de modération
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Modération des Avis
              </h1>
              <p className="text-gray-600 mt-2">
                {pendingReviews.length} avis en attente
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Keyboard className="h-5 w-5" />
              Raccourcis
            </motion.button>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progression</span>
              <span>
                {currentIndex + 1} / {pendingReviews.length}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentIndex + 1) / pendingReviews.length) * 100}%`,
                }}
                className="h-full bg-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Shortcuts Modal */}
        <AnimatePresence>
          {showShortcuts && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowShortcuts(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Raccourcis Clavier
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: "A", action: "Approuver l'avis" },
                      { key: "R", action: "Rejeter l'avis" },
                      { key: "S", action: "Passer" },
                      { key: "←", action: "Avis précédent" },
                      { key: "→", action: "Avis suivant" },
                      { key: "?", action: "Afficher/masquer les raccourcis" },
                    ].map((shortcut) => (
                      <div
                        key={shortcut.key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700">{shortcut.action}</span>
                        <kbd className="px-3 py-1 bg-gray-100 border-2 border-gray-300 rounded-lg font-mono text-sm font-semibold">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowShortcuts(false)}
                    className="w-full mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Fermer
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Review Card */}
        <AnimatePresence mode="wait">
          {currentReview && (
            <motion.div
              key={currentReview.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-xl border-2 border-gray-200 p-8"
            >
              {/* Product Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentReview.productName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Par {currentReview.author} •{" "}
                  {formatDistanceToNow(currentReview.date, {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < currentReview.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {currentReview.title}
                </h4>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {currentReview.content}
                </p>
              </div>

              {/* Reports */}
              {currentReview.reports > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <Flag className="h-5 w-5" />
                    <span className="font-semibold">
                      {currentReview.reports} signalement
                      {currentReview.reports > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApprove}
                  className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Approuver (A)
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReject}
                  className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <X className="h-5 w-5" />
                  Rejeter (R)
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSkip}
                  className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="h-5 w-5" />
                  Passer (S)
                </motion.button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Précédent
                </motion.button>

                <span className="text-sm text-gray-600">
                  Utilisez ← → pour naviguer
                </span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToNext}
                  disabled={currentIndex === pendingReviews.length - 1}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
