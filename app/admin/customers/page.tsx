"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table"
import { Search, Mail, Calendar, ShoppingBag } from "lucide-react"

type Customer = {
  id: string
  name: string | null
  email: string
  ordersCount: number
  totalSpent: number
  lastOrderDate: string | null
}

export default function AdminCustomersPage() {
  const [globalFilter, setGlobalFilter] = useState("")

  // Fetch customers
  const { data, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users`, {
        headers: {
          "x-user-role": "admin",
        },
      })
      return response.json()
    },
  })

  const customers: Customer[] = data?.users || []

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nom",
        cell: (info) => (
          <div className="font-medium text-gray-900">
            {info.getValue() as string || "Sans nom"}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">{info.getValue() as string}</span>
          </div>
        ),
      },
      {
        accessorKey: "ordersCount",
        header: "Commandes",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900">{info.getValue() as number}</span>
          </div>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: "Total Dépensé",
        cell: (info) => (
          <div className="font-semibold text-indigo-600">
            {new Intl.NumberFormat("fr-TN", {
              style: "currency",
              currency: "TND",
            }).format(info.getValue() as number)}
          </div>
        ),
      },
      {
        accessorKey: "lastOrderDate",
        header: "Dernière Commande",
        cell: (info) => {
          const date = info.getValue() as string | null
          return (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              {date ? new Date(date).toLocaleDateString("fr-FR") : "Jamais"}
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">
            {isLoading ? "Chargement..." : `${customers.length} clients au total`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Rechercher des clients..."
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Chargement des clients...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} sur{" "}
              {table.getPageCount()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

