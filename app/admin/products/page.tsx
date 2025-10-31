"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Search, Plus, Edit, Trash2, ArrowUpDown } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import toast from "react-hot-toast"
import { ProductFormModal } from "@/components/admin/product-form-modal"

type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  category: {
    id: string
    name: string
  }
  image: string
  images: string
  featured: boolean
}

type Category = {
  id: string
  name: string
}

export default function AdminProductsPage() {
  const [data, setData] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/products', {
        headers: {
          'x-user-role': 'admin',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const products = await response.json()
      setData(products)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Erreur lors du chargement des produits')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const cats = await response.json()
        setCategories(cats)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': 'admin',
        },
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Produit supprimé')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
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
        cell: (info) => (
          <div className="font-medium text-gray-900">{info.getValue() as string}</div>
        ),
      },
      {
        accessorKey: "category",
        header: "Catégorie",
        cell: (info) => {
          const category = info.getValue() as { name: string }
          return (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
              {category.name}
            </span>
          )
        },
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
        cell: (info) => (
          <div className="font-semibold text-indigo-600">
            {formatPrice(info.getValue() as number)}
          </div>
        ),
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
          >
            Stock
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
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
        accessorKey: "featured",
        header: "Statut",
        cell: (info) => {
          const featured = info.getValue() as boolean
          return (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                featured
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {featured ? "En vedette" : "Standard"}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleEdit(row.original)}
              className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(row.original.id)}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data,
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
          <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-600 mt-1">
            {isLoading ? 'Chargement...' : `${data.length} produits au total`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Nouveau Produit</span>
          <span className="sm:hidden">Nouveau</span>
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Rechercher des produits..."
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
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
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
        )}

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

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={() => {
          fetchProducts()
          handleModalClose()
        }}
        product={selectedProduct}
        categories={categories}
      />
    </div>
  )
}
