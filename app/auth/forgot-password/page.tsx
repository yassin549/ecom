"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Mail, Lock, ArrowLeft, Clock } from "lucide-react"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"username" | "otp" | "reset">("username")
  const [username, setUsername] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)

  // OTP Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (timer === 0 && step === "otp") {
      setCanResend(true)
    }
  }, [timer, step])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setStep("otp")
      setTimer(120) // 2 minutes
      setCanResend(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setStep("reset")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Success - redirect to signin
      window.location.href = "/auth/signin"
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTimer(120)
      setCanResend(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOTP = [...otp]
    newOTP[index] = value
    setOtp(newOTP)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl p-8">
          {/* Back Button */}
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>

          <AnimatePresence mode="wait">
            {/* Step 1: Username */}
            {step === "username" && (
              <motion.div
                key="username"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Mot de passe oublié?
                </h1>
                <p className="text-gray-600 mb-6">
                  Entrez votre nom d'utilisateur pour recevoir un code de vérification
                </p>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nom d'utilisateur"
                      required
                      minLength={3}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Envoi..." : "Envoyer le code"}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Vérification
                </h1>
                <p className="text-gray-600 mb-6">
                  Entrez le code à 6 chiffres envoyé pour <strong>{username}</strong>
                </p>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  {/* OTP Inputs */}
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        className="w-12 h-14 text-center text-2xl font-bold bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                      />
                    ))}
                  </div>

                  {/* Timer */}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {timer > 0 ? (
                        <>Code expire dans <strong>{formatTime(timer)}</strong></>
                      ) : (
                        "Code expiré"
                      )}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || otp.some((d) => !d)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Vérification..." : "Vérifier"}
                  </motion.button>

                  {canResend && (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Renvoyer le code
                    </button>
                  )}
                </form>
              </motion.div>
            )}

            {/* Step 3: Reset Password */}
            {step === "reset" && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Nouveau mot de passe
                </h1>
                <p className="text-gray-600 mb-6">
                  Choisissez un nouveau mot de passe sécurisé
                </p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      required
                      minLength={8}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmer le mot de passe"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || newPassword !== confirmPassword}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Réinitialisation..." : "Réinitialiser"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
