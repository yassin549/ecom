"use client"

import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Package, ShoppingBag, User, MapPin, Calendar, Terminal, CheckCircle, XCircle, Clock } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import { useCartStore } from "@/lib/store/cart-store"
import toast from "react-hot-toast"

type Order = {
  id: string
  date: string
  status: string
  total: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    image?: string
  }>
}

type Command = {
  id: string
  name: string
  description?: string
  action: string
  status: string
  metadata: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"orders" | "info" | "commands">("orders")
  const addItem = useCartStore((state) => state.addItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const parentRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Fetch user orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => {
      try {
        const response = await fetch('/api/user/orders')
        if (!response.ok) {
          if (response.status === 401) {
            // User not authenticated, return empty array
            return []
          }
          throw new Error('Failed to fetch orders')
        }
        const orders = await response.json()
        return orders as Order[]
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Erreur lors du chargement des commandes')
        return []
      }
    },
  })

  // Fetch user commands
  const { data: commandsData, isLoading: commandsLoading } = useQuery({
    queryKey: ["user-commands"],
    queryFn: async () => {
      const response = await fetch('/api/commands')
      if (!response.ok) throw new Error('Failed to fetch commands')
      return response.json() as Promise<Command[]>
    },
  })

  // Update command status mutation
  const updateCommandMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch('/api/commands', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!response.ok) throw new Error('Failed to update command')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-commands'] })
      toast.success('Commande mise à jour')
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour')
    },
  })

  const orders = ordersData || []
  const commands = commandsData || []

  // Virtualization for long order lists
  const rowVirtualizer = useVirtualizer({
    count: orders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  })

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      // Add item once, then update quantity
      addItem({
        id: item.id,
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image || '',
      })
      // Update to correct quantity if more than 1
      if (item.quantity > 1) {
        updateQuantity(item.id, item.quantity)
      }
    })

    // Show success toast
    alert(`${order.items.length} article(s) ajouté(s) au panier!`)
  }

  const statusColors = {
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    processing: "bg-yellow-100 text-yellow-700",
    pending: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  }

  const statusLabels = {
    delivered: "Livré",
    shipped: "Expédié",
    processing: "En cours",
    pending: "En attente",
    cancelled: "Annulé",
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600 mt-1">demo@example.com</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-4 px-4 sm:px-6 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "orders"
                  ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="h-5 w-5" />
                <span className="hidden sm:inline">Mes Commandes</span>
                <span className="sm:hidden">Commandes</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("commands")}
              className={`flex-1 py-4 px-4 sm:px-6 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "commands"
                  ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Terminal className="h-5 w-5" />
                <span className="hidden sm:inline">Actions</span>
                <span className="sm:hidden">Actions</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-4 px-4 sm:px-6 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "info"
                  ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Informations</span>
                <span className="sm:hidden">Info</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === "orders" ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Historique des Commandes
                </h2>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Chargement...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune commande pour le moment</p>
                  </div>
                ) : (
                  <div
                    ref={parentRef}
                    className="h-[600px] overflow-auto"
                    style={{ contain: "strict" }}
                  >
                    <div
                      style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const order = orders[virtualRow.index]
                        return (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: `${virtualRow.size}px`,
                              transform: `translateY(${virtualRow.start}px)`,
                            }}
                          >
                            <div className="p-4 bg-gray-50 rounded-xl mb-4">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <div className="font-bold text-gray-900 mb-1">
                                    {order.id}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {new Date(order.date).toLocaleDateString("fr-FR")}
                                    </span>
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        statusColors[order.status as keyof typeof statusColors]
                                      }`}
                                    >
                                      {statusLabels[order.status as keyof typeof statusLabels]}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-indigo-600 text-lg">
                                    {formatPrice(order.total)}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {order.items.length} article(s)
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 mb-4">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex justify-between items-center text-sm"
                                  >
                                    <span className="text-gray-700">{item.name}</span>
                                    <span className="text-gray-600">
                                      x{item.quantity} - {formatPrice(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleReorder(order)}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                              >
                                Commander à nouveau
                              </motion.button>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === "commands" ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Mes Actions
                </h2>

                {commandsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Chargement...</p>
                  </div>
                ) : commands.length === 0 ? (
                  <div className="text-center py-12">
                    <Terminal className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune action pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {commands.map((command) => {
                      const statusIcon = {
                        pending: <Clock className="h-5 w-5 text-yellow-600" />,
                        completed: <CheckCircle className="h-5 w-5 text-green-600" />,
                        cancelled: <XCircle className="h-5 w-5 text-red-600" />,
                      }[command.status]

                      const statusColor = {
                        pending: "bg-yellow-100 text-yellow-700",
                        completed: "bg-green-100 text-green-700",
                        cancelled: "bg-red-100 text-red-700",
                      }[command.status]

                      const statusLabel = {
                        pending: "En attente",
                        completed: "Terminé",
                        cancelled: "Annulé",
                      }[command.status]

                      return (
                        <motion.div
                          key={command.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-1">{command.name}</h3>
                              {command.description && (
                                <p className="text-sm text-gray-600">{command.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                {new Date(command.createdAt).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {statusIcon}
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                {statusLabel}
                              </span>
                            </div>
                          </div>
                          {command.status === "pending" && (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateCommandMutation.mutate({ id: command.id, status: "completed" })}
                                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Marquer comme terminé
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateCommandMutation.mutate({ id: command.id, status: "cancelled" })}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Annuler
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Informations Personnelles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      defaultValue="Jean Dupont"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      defaultValue="demo@example.com"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                      type="tel"
                      defaultValue="+216 12 345 678"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ville</label>
                    <input
                      type="text"
                      defaultValue="Tunis"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="123 Avenue Habib Bourguiba, Tunis 1000"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.success('Modifications enregistrées!')}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors"
                  >
                    Enregistrer les modifications
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast('Fonctionnalité à venir', { icon: 'ℹ️' })}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
                  >
                    Annuler
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
