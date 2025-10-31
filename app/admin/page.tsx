"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Package, ShoppingCart, TrendingUp, Users, DollarSign } from "lucide-react"
import { KPICard } from "@/components/admin/kpi-card"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { StatusDonutChart } from "@/components/admin/status-donut-chart"
import { OrdersTable } from "@/components/admin/orders-table"

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<{
    start: string | null
    end: string | null
  }>({ start: null, end: null })
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Fetch orders with TanStack Query
  const { data, isLoading } = useQuery({
    queryKey: ["orders", dateRange, selectedStatus],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: "1",
        limit: "20",
        ...(selectedStatus !== "all" && { status: selectedStatus }),
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end }),
      })

      const response = await fetch(`/api/orders?${params}` , {
        headers: {
          "x-user-role": "admin",
        },
      })
      return response.json()
    },
    refetchInterval: 30000, // Poll every 30 seconds
  })

  // Fetch admin stats for revenue chart (last 12 months)
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/stats`, {
        headers: {
          "x-user-role": "admin",
        },
        cache: "no-store",
      })
      return res.json()
    },
    refetchInterval: 60000,
  })

  const revenueData = useMemo(() => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]

    if (!stats?.revenueByMonth || stats.revenueByMonth.length === 0) {
      return { labels: months, values: new Array(12).fill(0) }
    }

    // revenueByMonth comes ordered DESC by month in the API; map to last 12 months ascending
    const ordered = [...stats.revenueByMonth].reverse()
    const labels = ordered.map((m: any) => {
      const date = new Date(m.month as string)
      return months[date.getMonth()]
    })
    const values = ordered.map((m: any) => Number(m.revenue) || 0)
    return { labels, values }
  }, [stats])

  const statusData = data?.stats
    ? {
        labels: ["En attente", "En cours", "Expédié", "Livré", "Annulé"],
        values: [
          data.stats.pending,
          data.stats.processing,
          data.stats.shipped,
          data.stats.delivered,
          data.stats.cancelled,
        ],
      }
    : { labels: [], values: [] }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de votre boutique en ligne
        </p>
      </div>

      {/* KPI Cards */}
      {data?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Commandes Totales"
            value={data.stats.total}
            icon={ShoppingCart}
            color="blue"
            trend={{ value: 12.5, isPositive: true }}
          />
          <KPICard
            title="Revenu Total"
            value={data.stats.revenue}
            suffix=" TND"
            icon={DollarSign}
            color="green"
            decimals={2}
            trend={{ value: 8.3, isPositive: true }}
          />
          <KPICard
            title="En Attente"
            value={data.stats.pending}
            icon={Package}
            color="yellow"
          />
          <KPICard
            title="Livrées"
            value={data.stats.delivered}
            icon={TrendingUp}
            color="purple"
            trend={{ value: 15.2, isPositive: true }}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <StatusDonutChart data={statusData} />
      </div>

      {/* Orders Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Commandes Récentes
        </h2>
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
            <p className="text-gray-600">Aucune commande trouvée</p>
          </div>
        )}
      </div>

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
