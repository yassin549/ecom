"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Package, Search } from "lucide-react"
import { OrdersTable } from "@/components/admin/orders-table"

export default function AdminOrdersPage() {
  const [dateRange, setDateRange] = useState<{
    start: string | null
    end: string | null
  }>({ start: null, end: null })
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Fetch orders with TanStack Query
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", dateRange, selectedStatus],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: "1",
        limit: "50",
        ...(selectedStatus !== "all" && { status: selectedStatus }),
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end }),
      })

      const response = await fetch(`/api/orders?${params}`, {
        headers: {
          "x-user-role": "admin",
        },
      })
      return response.json()
    },
    refetchInterval: 30000, // Poll every 30 seconds
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-600 mt-1">
            {data?.stats ? `${data.stats.total} commandes au total` : "Gérer toutes les commandes"}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      ) : data?.orders ? (
        <OrdersTable
          orders={data.orders}
          onDateRangeChange={(start, end) => setDateRange({ start, end })}
          onStatusChange={setSelectedStatus}
          selectedStatus={selectedStatus}
        />
      ) : (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucune commande trouvée</p>
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.pagination.totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                data.pagination.page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

