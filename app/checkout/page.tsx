"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckoutProgress } from "@/components/checkout/checkout-progress"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { ReviewOrder } from "@/components/checkout/review-order"
import { useCartStore } from "@/lib/store/cart-store"

type CheckoutStep = "shipping" | "payment" | "review"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const items = useCartStore((state) => state.items)
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([])
  const [shippingData, setShippingData] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<any>(null)

  // Sync URL params with state
  useEffect(() => {
    const step = searchParams.get("step") as CheckoutStep
    if (step && ["shipping", "payment", "review"].includes(step)) {
      setCurrentStep(step)
    }
  }, [searchParams])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/shop")
    }
  }, [items, router])

  const updateStep = (step: CheckoutStep) => {
    setCurrentStep(step)
    router.push(`/checkout?step=${step}`, { scroll: false })
  }

  const handleShippingComplete = (data: any) => {
    setShippingData(data)
    setCompletedSteps((prev) => [...new Set<CheckoutStep>([...prev, "shipping"])])
    updateStep("payment")
  }

  const handlePaymentComplete = (data: any) => {
    setPaymentData(data)
    setCompletedSteps((prev) => [...new Set<CheckoutStep>([...prev, "payment"])])
    updateStep("review")
  }

  const handleBack = () => {
    if (currentStep === "payment") {
      updateStep("shipping")
    } else if (currentStep === "review") {
      updateStep("payment")
    }
  }

  const steps: { id: CheckoutStep; label: string; number: number }[] = [
    { id: "shipping", label: "Livraison", number: 1 },
    { id: "payment", label: "Paiement", number: 2 },
    { id: "review", label: "Confirmation", number: 3 },
  ]

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Finaliser la Commande
            </h1>
            <p className="text-gray-600">
              Complétez votre commande en quelques étapes simples
            </p>
          </div>

          {/* Progress Bar */}
          <CheckoutProgress
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          {/* Step Content */}
          <div className="mt-12">
            <AnimatePresence mode="wait">
              {currentStep === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ShippingForm
                    onComplete={handleShippingComplete}
                    initialData={shippingData}
                  />
                </motion.div>
              )}

              {currentStep === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PaymentForm
                    onComplete={handlePaymentComplete}
                    onBack={handleBack}
                    initialData={paymentData}
                  />
                </motion.div>
              )}

              {currentStep === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReviewOrder
                    shippingData={shippingData}
                    paymentData={paymentData}
                    onBack={handleBack}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
