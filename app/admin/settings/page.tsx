"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Bell, Shield, Database, Mail } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "ShopHub",
    siteEmail: "admin@shophub.com",
    notifications: true,
    emailNotifications: true,
    maintenanceMode: false,
    maxOrdersPerDay: 1000,
  })

  const handleSave = () => {
    // TODO: Implement save functionality
    alert("Paramètres sauvegardés!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">Gérer les paramètres de l'administration</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Paramètres Généraux</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Site
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email du Site
              </label>
              <input
                type="email"
                value={settings.siteEmail}
                onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commandes Max par Jour
              </label>
              <input
                type="number"
                value={settings.maxOrdersPerDay}
                onChange={(e) =>
                  setSettings({ ...settings, maxOrdersPerDay: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">
                Activer les notifications
              </span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  setSettings({ ...settings, notifications: e.target.checked })
                }
                className="w-12 h-6 rounded-full bg-gray-200 appearance-none checked:bg-indigo-600 relative transition-colors"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">
                Notifications par email
              </span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotifications: e.target.checked })
                }
                className="w-12 h-6 rounded-full bg-gray-200 appearance-none checked:bg-indigo-600 relative transition-colors"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">
                Mode Maintenance
              </span>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMode: e.target.checked })
                }
                className="w-12 h-6 rounded-full bg-gray-200 appearance-none checked:bg-indigo-600 relative transition-colors"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors"
        >
          Enregistrer les Paramètres
        </motion.button>
      </div>
    </div>
  )
}

