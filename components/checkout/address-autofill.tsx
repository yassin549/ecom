"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Loader2, AlertCircle, CheckCircle } from "lucide-react"

type AddressData = {
  street: string
  city: string
  postalCode: string
  country: string
}

type AddressAutofillProps = {
  onAddressFound: (address: AddressData) => void
}

export function AddressAutofill({ onAddressFound }: AddressAutofillProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleGetLocation = async () => {
    setIsLoading(true)
    setError("")
    setSuccess(false)

    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur")
      setIsLoading(false)
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      const { latitude, longitude } = position.coords

      // Simulate reverse geocoding API call
      // In production, use a service like Google Maps Geocoding API, OpenStreetMap Nominatim, etc.
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock address based on coordinates
      const mockAddress: AddressData = {
        street: "123 Avenue Habib Bourguiba",
        city: "Tunis",
        postalCode: "1000",
        country: "Tunisie",
      }

      onAddressFound(mockAddress)
      setSuccess(true)

      // Reset success state after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Autorisation de localisation refusée")
            break
          case err.POSITION_UNAVAILABLE:
            setError("Position non disponible")
            break
          case err.TIMEOUT:
            setError("Délai d'attente dépassé")
            break
          default:
            setError("Erreur de géolocalisation")
        }
      } else {
        setError("Impossible de récupérer votre position")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Autofill Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGetLocation}
        disabled={isLoading || success}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-xl border-2 border-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Localisation en cours...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle className="h-5 w-5" />
            <span>Adresse remplie automatiquement</span>
          </>
        ) : (
          <>
            <MapPin className="h-5 w-5" />
            <span>Utiliser ma position actuelle</span>
          </>
        )}
      </motion.button>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Erreur de géolocalisation</p>
              <p className="mt-1">{error}</p>
              <p className="mt-2 text-xs">
                Assurez-vous d'avoir autorisé l'accès à votre position dans les
                paramètres de votre navigateur.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">
              Adresse remplie avec succès! Vérifiez les informations ci-dessous.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Text */}
      <p className="text-xs text-gray-600 text-center">
        Nous utilisons votre position pour remplir automatiquement votre adresse de
        livraison
      </p>
    </div>
  )
}
