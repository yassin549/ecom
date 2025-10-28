"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import zxcvbn from "zxcvbn"
import { Check, X } from "lucide-react"

type PasswordStrengthProps = {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    if (!password) {
      setStrength(0)
      setFeedback([])
      return
    }

    // Calculate strength with zxcvbn
    const result = zxcvbn(password)
    setStrength(result.score)
    
    // Get feedback
    const suggestions = result.feedback.suggestions || []
    setFeedback(suggestions)

    // Check requirements
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    })
  }, [password])

  const strengthColors = [
    { bg: "bg-red-500", text: "text-red-700", label: "Très faible" },
    { bg: "bg-orange-500", text: "text-orange-700", label: "Faible" },
    { bg: "bg-yellow-500", text: "text-yellow-700", label: "Moyen" },
    { bg: "bg-blue-500", text: "text-blue-700", label: "Bon" },
    { bg: "bg-green-500", text: "text-green-700", label: "Excellent" },
  ]

  const currentStrength = strengthColors[strength]

  if (!password) return null

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Force du mot de passe
          </span>
          <span className={`text-sm font-medium ${currentStrength.text}`}>
            {currentStrength.label}
          </span>
        </div>

        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
            >
              <motion.div
                className={`h-full ${
                  index <= strength ? currentStrength.bg : "bg-gray-200"
                }`}
                initial={{ width: 0 }}
                animate={{ width: index <= strength ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-2">
        <RequirementItem
          met={requirements.length}
          text="Au moins 8 caractères"
        />
        <RequirementItem
          met={requirements.uppercase}
          text="Une lettre majuscule"
        />
        <RequirementItem
          met={requirements.lowercase}
          text="Une lettre minuscule"
        />
        <RequirementItem met={requirements.number} text="Un chiffre" />
        <RequirementItem
          met={requirements.special}
          text="Un caractère spécial"
        />
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-sm font-medium text-blue-900 mb-1">
            Suggestions:
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            {feedback.map((suggestion, index) => (
              <li key={index}>• {suggestion}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2"
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center ${
          met ? "bg-green-500" : "bg-gray-200"
        }`}
      >
        {met ? (
          <Check className="h-3 w-3 text-white" />
        ) : (
          <X className="h-3 w-3 text-gray-400" />
        )}
      </div>
      <span
        className={`text-sm ${
          met ? "text-green-700 font-medium" : "text-gray-600"
        }`}
      >
        {text}
      </span>
    </motion.div>
  )
}
