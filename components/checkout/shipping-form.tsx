"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { ArrowRight } from "lucide-react"

const shippingSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  address: z.string().min(5, "Adresse invalide"),
  city: z.string().min(2, "Ville invalide"),
  postalCode: z.string().min(4, "Code postal invalide"),
  country: z.string().min(2, "Pays invalide"),
})

type ShippingFormData = z.infer<typeof shippingSchema>

type ShippingFormProps = {
  onComplete: (data: ShippingFormData) => void
  initialData?: ShippingFormData | null
}

export function ShippingForm({ onComplete, initialData }: ShippingFormProps) {
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: "onChange",
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Tunisie",
    },
  })

  // Auto-focus chaining
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const nextInput = inputRefs.current[index + 1]
      if (nextInput) {
        nextInput.focus()
      } else {
        handleSubmit(onSubmit)()
      }
    }
  }

  const onSubmit = (data: ShippingFormData) => {
    setAttemptedSubmit(true)
    onComplete(data)
  }

  const fields = [
    { name: "firstName" as const, label: "Prénom", type: "text" },
    { name: "lastName" as const, label: "Nom", type: "text" },
    { name: "email" as const, label: "Email", type: "email" },
    { name: "phone" as const, label: "Téléphone", type: "tel" },
    { name: "address" as const, label: "Adresse", type: "text" },
    { name: "city" as const, label: "Ville", type: "text" },
    { name: "postalCode" as const, label: "Code Postal", type: "text" },
    { name: "country" as const, label: "Pays", type: "text" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Informations de Livraison
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, index) => (
            <div
              key={field.name}
              className={field.name === "address" ? "md:col-span-2" : ""}
            >
              <FloatingLabelInput
                {...register(field.name)}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type={field.type}
                label={field.label}
                error={errors[field.name]?.message}
                showError={attemptedSubmit}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          Continuer vers le Paiement
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </form>
    </motion.div>
  )
}
