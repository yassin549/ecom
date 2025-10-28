"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Save, AlertCircle } from "lucide-react"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { ImageUpload } from "@/components/admin/image-upload"
import { useDebounce } from "@/lib/hooks/use-debounce"

const productSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  price: z.number().min(0, "Le prix doit être positif"),
  stock: z.number().int().min(0, "Le stock doit être positif"),
  category: z.string().min(1, "Sélectionnez une catégorie"),
  status: z.enum(["active", "draft"]),
})

type ProductFormData = z.infer<typeof productSchema>

type ProductModalProps = {
  isOpen: boolean
  onClose: () => void
  product?: ProductFormData | null
  onSave: (data: ProductFormData) => void
}

export function ProductModal({ isOpen, onClose, product, onSave }: ProductModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      status: "draft",
    },
  })

  const formData = watch()
  const debouncedFormData = useDebounce(formData, 2000)

  // Autosave draft
  useEffect(() => {
    if (isDirty && debouncedFormData) {
      saveDraft(debouncedFormData)
    }
  }, [debouncedFormData, isDirty])

  // Track changes
  useEffect(() => {
    const subscription = watch(() => setIsDirty(true))
    return () => subscription.unsubscribe()
  }, [watch])

  // Load draft from localStorage
  useEffect(() => {
    if (isOpen && !product) {
      const draft = localStorage.getItem("product-draft")
      if (draft) {
        try {
          const parsedDraft = JSON.parse(draft)
          reset(parsedDraft)
        } catch (error) {
          console.error("Failed to load draft:", error)
        }
      }
    }
  }, [isOpen, product, reset])

  const saveDraft = useCallback((data: ProductFormData) => {
    try {
      localStorage.setItem("product-draft", JSON.stringify(data))
      setLastSaved(new Date())
    } catch (error) {
      console.error("Failed to save draft:", error)
    }
  }, [])

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    onSave(data)
    localStorage.removeItem("product-draft")
    setIsSaving(false)
    onClose()
  }

  const handleClose = () => {
    if (isDirty) {
      const confirm = window.confirm(
        "Vous avez des modifications non enregistrées. Voulez-vous vraiment fermer?"
      )
      if (!confirm) return
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {product ? "Modifier le Produit" : "Nouveau Produit"}
                  </h2>
                  {lastSaved && (
                    <p className="text-sm text-gray-600 mt-1">
                      Brouillon sauvegardé {lastSaved.toLocaleTimeString("fr-FR")}
                    </p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Image du Produit
                  </label>
                  <ImageUpload onUpload={(file) => console.log("Uploaded:", file)} />
                </div>

                {/* Name */}
                <FloatingLabelInput
                  {...register("name")}
                  label="Nom du Produit"
                  error={errors.name?.message}
                  showError={true}
                />

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors resize-none"
                    placeholder="Décrivez le produit..."
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <FloatingLabelInput
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    label="Prix (TND)"
                    error={errors.price?.message}
                    showError={true}
                  />

                  <FloatingLabelInput
                    {...register("stock", { valueAsNumber: true })}
                    type="number"
                    label="Stock"
                    error={errors.stock?.message}
                    showError={true}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Catégorie
                  </label>
                  <select
                    {...register("category")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="electronics">Électronique</option>
                    <option value="fashion">Mode</option>
                    <option value="home">Maison</option>
                    <option value="sports">Sports</option>
                    <option value="beauty">Beauté</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Statut
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        {...register("status")}
                        type="radio"
                        value="active"
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span>Actif</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        {...register("status")}
                        type="radio"
                        value="draft"
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span>Brouillon</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-900 font-semibold rounded-xl transition-colors"
                  >
                    Annuler
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Save className="h-5 w-5" />
                        </motion.div>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Enregistrer
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
