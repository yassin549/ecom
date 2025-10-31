"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Image as ImageIcon, Trash2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

type Product = {
  id?: string
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  image: string
  images: string[]
  featured: boolean
}

type Category = {
  id: string
  name: string
}

type ProductFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  product?: Product | null
  categories: Category[]
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  product,
  categories,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<Product>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    categoryId: product?.categoryId || "",
    image: product?.image || "",
    images: product?.images || [],
    featured: product?.featured || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    try {
      // Convert files to base64 for demo purposes
      // In production, upload to cloud storage (Cloudinary, AWS S3, etc.)
      const imagePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      })

      const base64Images = await Promise.all(imagePromises)
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
        image: prev.image || base64Images[0], // Set first image as main if no main image
      }))

      toast.success(`${files.length} image(s) ajoutée(s)`)
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Erreur lors du téléchargement des images")
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index)
      return {
        ...prev,
        images: newImages,
        image: prev.image === prev.images[index] ? newImages[0] || "" : prev.image,
      }
    })
  }

  const setMainImage = (image: string) => {
    setFormData((prev) => ({ ...prev, image }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.categoryId) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (formData.price <= 0) {
      toast.error("Le prix doit être supérieur à 0")
      return
    }

    setIsSubmitting(true)
    try {
      const url = product?.id
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products"
      
      const method = product?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin",
        },
        body: JSON.stringify({
          ...formData,
          images: formData.images,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save product")
      }

      toast.success(
        product?.id ? "Produit mis à jour avec succès" : "Produit créé avec succès"
      )
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("Erreur lors de l'enregistrement du produit")
    } finally {
      setIsSubmitting(false)
    }
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {product?.id ? "Modifier le produit" : "Nouveau produit"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Informations de base
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du produit *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                          placeholder="Ex: iPhone 15 Pro"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors resize-none"
                          placeholder="Décrivez le produit en détail..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix (DT) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                            placeholder="0.00"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.stock}
                            onChange={(e) =>
                              setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie *
                        </label>
                        <select
                          value={formData.categoryId}
                          onChange={(e) =>
                            setFormData({ ...formData, categoryId: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                          required
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData({ ...formData, featured: e.target.checked })
                          }
                          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                          Mettre en vedette sur la page d'accueil
                        </label>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Images du produit</h3>

                      {/* Upload Button */}
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImages}
                          className="w-full sm:w-auto px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploadingImages ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Téléchargement...
                            </>
                          ) : (
                            <>
                              <Upload className="h-5 w-5" />
                              Ajouter des images
                            </>
                          )}
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                          Formats acceptés: JPG, PNG, WebP. Taille max: 5MB par image.
                        </p>
                      </div>

                      {/* Image Grid */}
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {formData.images.map((image, index) => (
                            <div
                              key={index}
                              className={`relative group aspect-square rounded-xl overflow-hidden border-2 ${
                                formData.image === image
                                  ? "border-indigo-600"
                                  : "border-gray-200"
                              }`}
                            >
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {formData.image !== image && (
                                  <button
                                    type="button"
                                    onClick={() => setMainImage(image)}
                                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                                    title="Définir comme image principale"
                                  >
                                    <ImageIcon className="h-4 w-4 text-gray-700" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4 text-white" />
                                </button>
                              </div>

                              {/* Main Badge */}
                              {formData.image === image && (
                                <div className="absolute top-2 left-2 px-2 py-1 bg-indigo-600 text-white text-xs font-semibold rounded">
                                  Principale
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {formData.images.length === 0 && (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Aucune image ajoutée</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Cliquez sur "Ajouter des images" pour commencer
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </form>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>{product?.id ? "Mettre à jour" : "Créer le produit"}</>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
