"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { ArrowRight, ArrowLeft, CreditCard, Banknote } from "lucide-react"

const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "cash"]),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === "card") {
    return (
      data.cardNumber &&
      data.cardName &&
      data.expiryDate &&
      data.cvv &&
      data.cardNumber.length >= 16 &&
      data.cvv.length >= 3
    )
  }
  return true
}, {
  message: "Veuillez remplir tous les champs de la carte",
})

type PaymentFormData = z.infer<typeof paymentSchema>

type PaymentFormProps = {
  onComplete: (data: PaymentFormData) => void
  onBack: () => void
  initialData?: PaymentFormData | null
}

export function PaymentForm({ onComplete, onBack, initialData }: PaymentFormProps) {
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">(
    initialData?.paymentMethod || "cash"
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
    defaultValues: initialData || {
      paymentMethod: "cash",
    },
  })

  const onSubmit = (data: PaymentFormData) => {
    setAttemptedSubmit(true)
    onComplete(data)
  }

  const handlePaymentMethodChange = (method: "card" | "cash") => {
    setPaymentMethod(method)
    setValue("paymentMethod", method)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Méthode de Paiement
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Payment Method Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePaymentMethodChange("cash")}
            className={`p-6 rounded-xl border-2 transition-all ${
              paymentMethod === "cash"
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full ${
                paymentMethod === "cash" ? "bg-indigo-600" : "bg-gray-100"
              }`}>
                <Banknote className={`h-6 w-6 ${
                  paymentMethod === "cash" ? "text-white" : "text-gray-600"
                }`} />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  Paiement à la Livraison
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Payez en espèces lors de la réception
                </div>
              </div>
            </div>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePaymentMethodChange("card")}
            className={`p-6 rounded-xl border-2 transition-all ${
              paymentMethod === "card"
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full ${
                paymentMethod === "card" ? "bg-indigo-600" : "bg-gray-100"
              }`}>
                <CreditCard className={`h-6 w-6 ${
                  paymentMethod === "card" ? "text-white" : "text-gray-600"
                }`} />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  Carte Bancaire
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Paiement sécurisé en ligne
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Card Details (shown only if card is selected) */}
        {paymentMethod === "card" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4"
          >
            <FloatingLabelInput
              {...register("cardNumber")}
              type="text"
              label="Numéro de Carte"
              error={errors.cardNumber?.message}
              showError={attemptedSubmit}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
            />

            <FloatingLabelInput
              {...register("cardName")}
              type="text"
              label="Nom sur la Carte"
              error={errors.cardName?.message}
              showError={attemptedSubmit}
            />

            <div className="grid grid-cols-2 gap-4">
              <FloatingLabelInput
                {...register("expiryDate")}
                type="text"
                label="Date d'Expiration"
                error={errors.expiryDate?.message}
                showError={attemptedSubmit}
                placeholder="MM/AA"
                maxLength={5}
              />

              <FloatingLabelInput
                {...register("cvv")}
                type="text"
                label="CVV"
                error={errors.cvv?.message}
                showError={attemptedSubmit}
                maxLength={4}
              />
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-900 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            Continuer
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
