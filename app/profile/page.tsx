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
    <div className="min-h-screen bg-background py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-[2rem] border-2 border-border p-8 sm:p-12 mb-8 relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
              <User className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-black text-foreground uppercase italic tracking-tighter mb-2">Mon <span className="text-primary italic">Profil</span></h1>
              <p className="text-muted-foreground text-lg font-medium">demo@example.com</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-card rounded-[2rem] border-border border-2 overflow-hidden shadow-2xl">
          <div className="flex border-b border-border p-2 gap-2 bg-muted/50 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase italic tracking-tighter transition-all whitespace-nowrap ${activeTab === "orders"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Package className="h-5 w-5" />
                <span>Commandes</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("commands")}
              className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase italic tracking-tighter transition-all whitespace-nowrap ${activeTab === "commands"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Terminal className="h-5 w-5" />
                <span>Actions</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase italic tracking-tighter transition-all whitespace-nowrap ${activeTab === "info"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <div className="flex items-center justify-center gap-3">
                <User className="h-5 w-5" />
                <span>Info</span>
              </div>
            </button>
          </div>

          <div className="p-8">
            {activeTab === "orders" ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter mb-8 flex items-center gap-4">
                  <Package className="h-8 w-8 text-primary" />
                  Historique <span className="text-primary italic">Commandes</span>
                </h2>

                {isLoading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6 shadow-[0_0_20px_rgba(147,51,234,0.3)]" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest">DRIPPING...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                    <ShoppingBag className="h-20 w-20 text-muted mx-auto mb-6" />
                    <p className="text-foreground font-black text-2xl uppercase italic tracking-tighter">Pas encore de drip ici</p>
                    <Link href="/shop" className="inline-block mt-6 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase italic tracking-tighter hover:scale-105 transition-transform">Explorer la boutique</Link>
                  </div>
                ) : (
                  <div
                    ref={parentRef}
                    className="h-[600px] overflow-auto pr-4 custom-scrollbar"
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
                              top: virtualRow.start,
                              left: 0,
                              width: "100%",
                              height: virtualRow.size,
                            }}
                          >
                            <div className="p-6 bg-muted/40 rounded-[2rem] border-2 border-border mb-6 group hover:border-primary/50 transition-all hover:shadow-xl">
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
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]
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
              </motion.div>
            ) : activeTab === "commands" ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter mb-8 flex items-center gap-4">
                  <Terminal className="h-8 w-8 text-primary" />
                  Mes <span className="text-primary italic">Actions</span>
                </h2>

                {commandsLoading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6 shadow-[0_0_20px_rgba(147,51,234,0.3)]" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest">LOADING ACTIONS...</p>
                  </div>
                ) : commands.length === 0 ? (
                  <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                    <Terminal className="h-20 w-20 text-muted mx-auto mb-6" />
                    <p className="text-foreground font-black text-2xl uppercase italic tracking-tighter">Aucune action disponible</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {commands.map((command) => {
                      const statusIcon = {
                        pending: <Clock className="h-6 w-6 text-yellow-500" />,
                        completed: <CheckCircle className="h-6 w-6 text-green-500" />,
                        cancelled: <XCircle className="h-6 w-6 text-red-500" />,
                      }[command.status as keyof typeof statusLabels] || <Clock className="h-6 w-6 text-gray-500" />

                      const statusColor = (({
                        pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                        completed: "bg-green-500/10 text-green-500 border-green-500/20",
                        cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
                      } as any)[command.status]) || "bg-gray-500/10 text-gray-500 border-gray-500/20"

                      return (
                        <motion.div
                          key={command.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 bg-muted/40 rounded-[2rem] border-2 border-border group hover:border-primary/50 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-6">
                            <div className="flex-1">
                              <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter mb-2 group-hover:text-primary transition-colors">{command.name}</h3>
                              {command.description && (
                                <p className="text-muted-foreground font-medium mb-4">{command.description}</p>
                              )}
                              <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <Calendar className="h-4 w-4" />
                                {new Date(command.createdAt).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-2 rounded-full border-2 font-black uppercase italic tracking-tighter text-sm shadow-inner overflow-hidden" style={{ backgroundColor: 'rgba(var(--primary), 0.1)' }}>
                              <div className="flex items-center gap-2">
                                {statusIcon}
                                <span className={statusColor.split(' ')[1]}>{command.status}</span>
                              </div>
                            </div>
                          </div>
                          {command.status === "pending" && (
                            <div className="flex flex-col sm:flex-row gap-4">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateCommandMutation.mutate({ id: command.id, status: "completed" })}
                                className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-black uppercase italic tracking-tighter rounded-2xl transition-all shadow-lg shadow-green-600/20"
                              >
                                Terminer
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateCommandMutation.mutate({ id: command.id, status: "cancelled" })}
                                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-tighter rounded-2xl transition-all shadow-lg shadow-red-600/20"
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
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter flex items-center gap-4">
                    <User className="h-8 w-8 text-primary" />
                    Mes <span className="text-primary italic">Données</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Nom Complet</label>
                    <input
                      type="text"
                      defaultValue="Jean Dupont"
                      className="w-full px-6 py-4 bg-muted/30 border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Email</label>
                    <input
                      type="email"
                      defaultValue="demo@example.com"
                      className="w-full px-6 py-4 bg-muted/30 border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Téléphone</label>
                    <input
                      type="tel"
                      defaultValue="+216 12 345 678"
                      className="w-full px-6 py-4 bg-muted/30 border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Ville</label>
                    <input
                      type="text"
                      defaultValue="Tunis"
                      className="w-full px-6 py-4 bg-muted/30 border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse de Livraison
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="123 Avenue Habib Bourguiba, Tunis 1000"
                    className="w-full px-6 py-4 bg-muted/30 border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.success('Drip mis à jour!')}
                    className="px-10 py-5 bg-primary text-white font-black uppercase italic tracking-tighter rounded-2xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:shadow-primary/50"
                  >
                    Enregistrer les modifications
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast('Fonctionnalité à venir', { icon: 'ℹ️' })}
                    className="px-10 py-5 bg-muted border-2 border-border text-foreground font-black uppercase italic tracking-tighter rounded-2xl transition-all hover:bg-muted/80"
                  >
                    Réinitialiser
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
