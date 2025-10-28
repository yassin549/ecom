"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, Package, MapPin, CreditCard, Check } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { formatPrice } from "@/lib/currency"
import { ConfirmationModal } from "@/components/checkout/confirmation-modal"

type ReviewOrderProps = {
  shippingData: any
  paymentData: any
  onBack: () => void
}

export function ReviewOrder({ shippingData, paymentData, onBack }: ReviewOrderProps) {
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const shippingCost = 7.0 // 7 TND flat rate
  const total = getTotalPrice() + shippingCost

  const handleConfirmOrder = () => {
    if (paymentData.paymentMethod === "cash") {
      setShowConfirmation(true)
    } else {
      // Handle card payment
      processOrder()
    }
  }

  const processOrder = async () => {
    // TODO: Implement order creation API call
    console.log("Processing order:", {
      items,
      shipping: shippingData,
      payment: paymentData,
      total,
    })
    
    // Clear cart and redirect
    useCartStore.getState().clearCart()
    window.location.href = "/order-success"
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Order Summary */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Récapitulatif de la Commande
          </h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantité: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span>{formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span className="text-indigo-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MapPin className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Adresse de Livraison
            </h3>
          </div>
          <div className="text-gray-700 space-y-1">
            <p className="font-medium">
              {shippingData.firstName} {shippingData.lastName}
            </p>
            <p>{shippingData.address}</p>
            <p>
              {shippingData.city}, {shippingData.postalCode}
            </p>
            <p>{shippingData.country}</p>
            <p className="pt-2">{shippingData.phone}</p>
            <p>{shippingData.email}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Méthode de Paiement
            </h3>
          </div>
          <div className="text-gray-700">
            {paymentData.paymentMethod === "cash" ? (
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Paiement à la Livraison</span>
              </div>
            ) : (
              <div>
                <p className="font-medium">Carte Bancaire</p>
                <p className="text-sm text-gray-600 mt-1">
                  •••• •••• •••• {paymentData.cardNumber?.slice(-4)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
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
            onClick={handleConfirmOrder}
            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <Check className="h-5 w-5" />
            Confirmer la Commande
          </motion.button>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={processOrder}
        orderData={{
          items,
          shipping: shippingData,
          total,
        }}
      />
    </>
  )
}
