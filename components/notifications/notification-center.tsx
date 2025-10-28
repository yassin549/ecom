"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Package, ShoppingCart, Tag, X, Check } from "lucide-react"

type NotificationType = "order" | "promo" | "cart" | "general"

type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Commande expédiée",
    message: "Votre commande #ORD-000123 a été expédiée",
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: "2",
    type: "promo",
    title: "Nouvelle promotion",
    message: "20% de réduction avec le code SAVE20",
    timestamp: new Date(Date.now() - 7200000),
    read: false,
  },
  {
    id: "3",
    type: "cart",
    title: "Article en stock",
    message: "Le produit dans votre panier est de nouveau disponible",
    timestamp: new Date(Date.now() - 86400000),
    read: true,
  },
]

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState<"all" | NotificationType>("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab)

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "order":
        return Package
      case "promo":
        return Tag
      case "cart":
        return ShoppingCart
      default:
        return Bell
    }
  }

  const getColor = (type: NotificationType) => {
    switch (type) {
      case "order":
        return "text-blue-600 bg-blue-100"
      case "promo":
        return "text-green-600 bg-green-100"
      case "cart":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${days}j`
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-xl border-2 border-gray-200 shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto">
                  {[
                    { key: "all", label: "Tout" },
                    { key: "order", label: "Commandes" },
                    { key: "promo", label: "Promos" },
                    { key: "cart", label: "Panier" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.key
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => {
                      const Icon = getIcon(notification.type)
                      const colorClass = getColor(notification.type)

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          drag="x"
                          dragConstraints={{ left: -100, right: 0 }}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -50) {
                              removeNotification(notification.id)
                            }
                          }}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                            !notification.read ? "bg-indigo-50/50" : ""
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                ) : (
                  <div className="p-8 text-center text-gray-600">
                    <Bell className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Aucune notification</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
