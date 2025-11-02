"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Loader2, FolderOpen, Link } from "lucide-react"
import toast from "react-hot-toast"

type Category = {
  id?: string
  name: string
  slug: string
  description: string
  image: string | null
}

type CategoryFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  category?: Category | null
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSuccess,
  category,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState<Category>({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    setFormData({ ...formData, name, slug })
  }

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url || null })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG, PNG, WebP ou GIF')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image trop grande. Maximum 5MB')
      return
    }

    setUploadingImage(true)
    try {
      // Upload to server
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-user-role': 'admin',
        },
        body: uploadFormData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Upload failed')
      }

      const data = await response.json()
      setFormData({ ...formData, image: data.url })
      toast.success('Image téléchargée avec succès')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Erreur lors du téléchargement')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsSubmitting(true)
    try {
      const url = category?.id
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories"
      
      const method = category?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "admin",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to save category")
      }

      toast.success(
        category?.id ? "Catégorie mise à jour" : "Catégorie créée avec succès"
      )
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error saving category:", error)
      toast.error(error.message || "Erreur lors de l'enregistrement")
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
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
              >
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {category?.id ? "Modifier la catégorie" : "Nouvelle catégorie"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de la catégorie *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                        placeholder="Ex: Électronique"
                        required
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (URL) *
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors font-mono text-sm"
                        placeholder="electronique"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Généré automatiquement depuis le nom
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors resize-none"
                        placeholder="Décrivez la catégorie..."
                      />
                    </div>

                    {/* Image Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Image de la catégorie
                      </label>

                      {/* Mode Tabs */}
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setImageInputMode('upload')}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                            imageInputMode === 'upload'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Upload className="h-4 w-4 inline mr-2" />
                          Télécharger
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode('url')}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                            imageInputMode === 'url'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Link className="h-4 w-4 inline mr-2" />
                          URL
                        </button>
                      </div>

                      {/* Upload Mode */}
                      {imageInputMode === 'upload' && (
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          {formData.image ? (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                              <img
                                src={formData.image}
                                alt="Aperçu"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg'
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: null })}
                                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingImage}
                              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 transition-colors flex flex-col items-center justify-center gap-3 disabled:opacity-50"
                            >
                              {uploadingImage ? (
                                <>
                                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                                  <span className="text-sm text-gray-600">Téléchargement...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-gray-400" />
                                  <span className="text-sm text-gray-600 font-medium">
                                    Cliquez pour télécharger une image
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    JPG, PNG, WebP, GIF (max 5MB)
                                  </span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* URL Mode */}
                      {imageInputMode === 'url' && (
                        <div>
                          <input
                            type="url"
                            value={formData.image || ""}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                            placeholder="https://example.com/image.jpg"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Collez l'URL d'une image (doit commencer par http:// ou https://)
                          </p>
                          
                          {/* Image Preview */}
                          {formData.image && formData.image.startsWith('http') && (
                            <div className="mt-3 relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                              <img
                                src={formData.image}
                                alt="Aperçu"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg'
                                  toast.error('Image invalide ou inaccessible')
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: null })}
                                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}

                          {/* Suggested Images */}
                          <div className="mt-3 bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                            <p className="text-xs font-medium text-indigo-900 mb-1">💡 Images gratuites:</p>
                            <p className="text-xs text-indigo-700">
                              <a href="https://unsplash.com" target="_blank" className="underline hover:text-indigo-900">Unsplash</a> · 
                              <a href="https://pexels.com" target="_blank" className="underline hover:text-indigo-900 ml-1">Pexels</a>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>{category?.id ? "Mettre à jour" : "Créer la catégorie"}</>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
