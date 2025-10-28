"use client"

import { useState, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  ColumnResizeMode,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import Fuse, { FuseResultMatch } from "fuse.js"
import { Search, ArrowUpDown, Edit, Trash2, GripVertical } from "lucide-react"
import { formatPrice } from "@/lib/currency"

type Product = {
  id: string
  name: string
  price: number
  stock: number
  category: string
  status: "active" | "draft"
}

// Generate large dataset for virtualization demo
const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Produit ${i + 1}`,
    price: Math.random() * 1000 + 50,
    stock: Math.floor(Math.random() * 100),
    category: ["Électronique", "Mode", "Maison", "Sports", "Beauté"][
      Math.floor(Math.random() * 5)
    ],
    status: Math.random() > 0.3 ? "active" : "draft",
  }))
}

export function VirtualizedProductTable() {
  const [data] = useState<Product[]>(() => generateMockProducts(1000))
  const [searchQuery, setSearchQuery] = useState("")
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange")
  
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Fuzzy search with Fuse.js
  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: ["name", "category"],
        threshold: 0.3,
        includeMatches: true,
      }),
    [data]
  )

  const filteredData = useMemo(() => {
    if (!searchQuery) return data
    return fuse.search(searchQuery).map((result) => result.item)
  }, [searchQuery, fuse, data])

  // Highlight matched text
  const highlightMatch = (text: string, matches?: readonly FuseResultMatch[]) => {
    if (!matches || matches.length === 0) return text

    const match = matches[0]
    const indices = match.indices[0]
    
    if (!indices) return text

    const [start, end] = indices
    return (
      <>
        {text.slice(0, start)}
        <mark className="bg-yellow-200 text-gray-900 px-1 rounded">
          {text.slice(start, end + 1)}
        </mark>
        {text.slice(end + 1)}
      </>
    )
  }

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "drag",
        header: "",
        size: 40,
        cell: () => (
          <div className="cursor-move text-gray-400 hover:text-gray-600">
            <GripVertical className="h-4 w-4" />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
          >
            Nom
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        size: 250,
        cell: (info) => {
          const searchResult = searchQuery
            ? fuse.search(searchQuery).find((r) => r.item.id === info.row.original.id)
            : null
          
          return (
            <div className="font-medium text-gray-900">
              {searchResult?.matches
                ? highlightMatch(info.getValue() as string, searchResult.matches)
                : (info.getValue() as string)}
            </div>
          )
        },
      },
      {
        accessorKey: "category",
        header: "Catégorie",
        size: 150,
        cell: (info) => (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
          >
            Prix
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        size: 120,
        cell: (info) => (
          <div className="font-semibold text-indigo-600">
            {formatPrice(info.getValue() as number)}
          </div>
        ),
      },
      {
        accessorKey: "stock",
        header: "Stock",
        size: 100,
        cell: (info) => {
          const stock = info.getValue() as number
          return (
            <div
              className={`font-medium ${
                stock < 10 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {stock}
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Statut",
        size: 120,
        cell: (info) => {
          const status = info.getValue() as string
          return (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {status === "active" ? "Actif" : "Brouillon"}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        cell: () => (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </div>
        ),
      },
    ],
    [searchQuery, fuse]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
    enableColumnResizing: true,
  })

  // Virtualization
  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60,
    overscan: 10,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Recherche fuzzy (nom, catégorie)..."
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
        />
        {searchQuery && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-600">
            {filteredData.length} résultat{filteredData.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Virtualized Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div
          ref={tableContainerRef}
          className="overflow-auto"
          style={{ height: "600px" }}
        >
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 relative"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      
                      {/* Resize Handle */}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-indigo-600 ${
                            header.column.getIsResizing() ? "bg-indigo-600" : ""
                          }`}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody style={{ height: `${totalSize}px` }} className="relative">
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <tr
                    key={row.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className="px-6 py-4 text-sm"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Info */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
          Affichage de {virtualRows.length} sur {filteredData.length} produits
          (Total: {data.length})
        </div>
      </div>
    </div>
  )
}
