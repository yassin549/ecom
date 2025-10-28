"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Package, Calendar } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"

type Order = {
  id: string
  customer: string
  email: string
  status: string
  total: number
  date: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    street: string
    city: string
    postalCode: string
    country: string
  }
}

type OrdersTableProps = {
  orders: Order[]
  onDateRangeChange: (start: string | null, end: string | null) => void
  onStatusChange: (status: string) => void
  selectedStatus: string
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

const statusLabels = {
  pending: "En attente",
  processing: "En cours",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé",
}

export function OrdersTable({
  orders,
  onDateRangeChange,
  onStatusChange,
  selectedStatus,
}: OrdersTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const datePickerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (datePickerRef.current) {
      flatpickr(datePickerRef.current, {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            onDateRangeChange(
              selectedDates[0].toISOString(),
              selectedDates[1].toISOString()
            )
          } else if (selectedDates.length === 0) {
            onDateRangeChange(null, null)
          }
        },
        animate: true,
      })
    }
  }, [onDateRangeChange])

  const toggleRow = (orderId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={datePickerRef}
            type="text"
            placeholder="Sélectionner une période..."
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="processing">En cours</option>
          <option value="shipped">Expédié</option>
          <option value="delivered">Livré</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Commande
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.customer}
                        </div>
                        <div className="text-sm text-gray-600">{order.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[order.status as keyof typeof statusColors]
                        }`}
                      >
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-indigo-600">
                        {formatPrice(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString("fr-FR")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleRow(order.id)}
                        className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                      >
                        {expandedRows.has(order.id) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </motion.button>
                    </td>
                  </motion.tr>

                  {/* Expandable Row */}
                  <AnimatePresence>
                    {expandedRows.has(order.id) && (
                      <motion.tr
                        key={`${order.id}-expanded`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            {/* Items */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Articles
                              </h4>
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex justify-between items-center p-3 bg-white rounded-lg"
                                  >
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {item.name}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Quantité: {item.quantity}
                                      </div>
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                      {formatPrice(item.price * item.quantity)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">
                                Adresse de Livraison
                              </h4>
                              <div className="p-3 bg-white rounded-lg text-sm text-gray-700">
                                <p>{order.shippingAddress.street}</p>
                                <p>
                                  {order.shippingAddress.postalCode}{" "}
                                  {order.shippingAddress.city}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
