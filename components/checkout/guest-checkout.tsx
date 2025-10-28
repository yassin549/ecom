"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Lock, Check } from "lucide-react"
import { showSuccess } from "@/lib/utils/toast"

type GuestCheckoutProps = {
  onContinue: (email: string, createAccount: boolean, password?: string) => void
}

export function GuestCheckout({ onContinue }: GuestCheckoutProps) {
  const [email, setEmail] = useState("")
  const [createAccount, setCreateAccount] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email invalide"
    }

    if (createAccount) {
      if (!password) {
        newErrors.password = "Le mot de passe est requis"
      } else if (password.length < 8) {
        newErrors.password = "Minimum 8 caractères"
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      onContinue(email, createAccount, password)
      if (createAccount) {
        showSuccess("Compte créé avec succès!")
      }
    }
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Informations de contact
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.email
                  ? "border-red-300 focus:border-red-600"
                  : "border-gray-200 focus:border-indigo-600"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Create Account Toggle */}
        <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
          <input
            type="checkbox"
            id="createAccount"
            checked={createAccount}
            onChange={(e) => setCreateAccount(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
          <label htmlFor="createAccount" className="flex-1 cursor-pointer">
            <div className="font-semibold text-indigo-900">
              Créer un compte après la commande
            </div>
            <p className="text-sm text-indigo-700 mt-1">
              Suivez vos commandes et profitez d'une expérience personnalisée
            </p>
          </label>
        </div>

        {/* Password Fields (Conditional) */}
        <AnimatePresence>
          {createAccount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.password
                        ? "border-red-300 focus:border-red-600"
                        : "border-gray-200 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-600"
                        : "border-gray-200 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length > i * 2 + 2
                            ? password.length < 8
                              ? "bg-red-500"
                              : password.length < 12
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {password.length < 8
                      ? "Faible"
                      : password.length < 12
                      ? "Moyen"
                      : "Fort"}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {createAccount ? (
            <>
              <User className="h-5 w-5" />
              Créer un compte et continuer
            </>
          ) : (
            <>
              <Check className="h-5 w-5" />
              Continuer en tant qu'invité
            </>
          )}
        </motion.button>

        {/* Guest Benefits */}
        {!createAccount && (
          <div className="text-center text-sm text-gray-600">
            Vous pourrez créer un compte après votre commande
          </div>
        )}
      </form>
    </div>
  )
}
