"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { showSuccess, showError } from "@/lib/utils/toast"

type UserRole = "admin" | "moderator" | "user"

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: "active" | "suspended"
  createdAt: Date
  lastLogin: Date
}

// Mock data
const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `Utilisateur ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i < 2 ? "admin" : i < 10 ? "moderator" : "user",
  status: i % 15 === 0 ? "suspended" : "active",
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
  lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
}))

const roleConfig = {
  admin: {
    label: "Administrateur",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
  },
  moderator: {
    label: "Modérateur",
    icon: ShieldCheck,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
  },
  user: {
    label: "Utilisateur",
    icon: Shield,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
  },
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)

  const itemsPerPage = 10

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // Paginate
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    )
    showSuccess("Rôle mis à jour")
    setShowRoleModal(false)
  }

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      )
    )
    showSuccess("Statut mis à jour")
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      showSuccess("Utilisateur supprimé")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as UserRole | "all")
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="moderator">Modérateur</option>
                <option value="user">Utilisateur</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as "all" | "active" | "suspended")
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence mode="popLayout">
                  {paginatedUsers.map((user) => {
                    const roleInfo = roleConfig[user.role]
                    const RoleIcon = roleInfo.icon

                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* User Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowRoleModal(true)
                            }}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border-2 ${roleInfo.bgColor} ${roleInfo.color} ${roleInfo.borderColor} hover:opacity-80 transition-opacity`}
                          >
                            <RoleIcon className="h-4 w-4" />
                            {roleInfo.label}
                          </button>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status === "active" ? "Actif" : "Suspendu"}
                          </button>
                        </td>

                        {/* Last Login */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.lastLogin.toLocaleDateString("fr-FR")}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Role Change Modal */}
        <AnimatePresence>
          {showRoleModal && selectedUser && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowRoleModal(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Changer le rôle
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Sélectionnez un nouveau rôle pour {selectedUser.name}
                  </p>
                  <div className="space-y-3">
                    {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                      const config = roleConfig[role]
                      const RoleIcon = config.icon
                      return (
                        <motion.button
                          key={role}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChangeRole(selectedUser.id, role)}
                          className={`w-full p-4 rounded-xl border-2 transition-all ${
                            selectedUser.role === role
                              ? `${config.bgColor} ${config.borderColor}`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RoleIcon className={`h-6 w-6 ${config.color}`} />
                            <div className="text-left">
                              <div className="font-semibold text-gray-900">
                                {config.label}
                              </div>
                              <div className="text-sm text-gray-600">
                                {role === "admin" &&
                                  "Accès complet à toutes les fonctionnalités"}
                                {role === "moderator" &&
                                  "Peut modérer le contenu et les utilisateurs"}
                                {role === "user" && "Accès standard à la plateforme"}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowRoleModal(false)}
                    className="w-full mt-6 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
