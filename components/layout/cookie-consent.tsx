"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X, Settings } from "lucide-react"

type CookiePreferences = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) {
      // Show banner after 1 second
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    savePreferences(allAccepted)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    savePreferences(onlyNecessary)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    savePreferences(preferences)
    setShowPreferences(false)
    setShowBanner(false)
  }

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie_consent", JSON.stringify(prefs))
    localStorage.setItem("cookie_consent_date", new Date().toISOString())
    
    // In production, initialize analytics/marketing scripts based on preferences
    console.log("Cookie preferences saved:", prefs)
  }

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="max-w-6xl mx-auto bg-white rounded-xl border-2 border-gray-200 shadow-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Cookie className="h-8 w-8 text-indigo-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Nous utilisons des cookies
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Nous utilisons des cookies pour améliorer votre expérience, analyser le
                      trafic et personnaliser le contenu. Vous pouvez choisir vos préférences
                      ci-dessous.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAcceptAll}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Tout accepter
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRejectAll}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
                      >
                        Tout refuser
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPreferences(true)}
                        className="px-6 py-2 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Personnaliser
                      </motion.button>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBanner(false)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreferences(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Préférences des cookies
                    </h2>
                    <button
                      onClick={() => setShowPreferences(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="mt-1 w-5 h-5 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Cookies nécessaires
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ces cookies sont essentiels au fonctionnement du site et ne peuvent
                        pas être désactivés. Ils sont généralement définis en réponse à des
                        actions que vous effectuez.
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Cookies analytiques
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ces cookies nous permettent de compter les visites et les sources de
                        trafic afin de mesurer et d'améliorer les performances de notre site.
                      </p>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({ ...preferences, marketing: e.target.checked })
                      }
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Cookies marketing
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ces cookies peuvent être définis par nos partenaires publicitaires
                        pour créer un profil de vos intérêts et vous montrer des publicités
                        pertinentes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSavePreferences}
                    className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Enregistrer les préférences
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPreferences(false)}
                    className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold rounded-lg transition-colors"
                  >
                    Annuler
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
