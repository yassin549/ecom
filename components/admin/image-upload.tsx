"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Check, AlertCircle, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

type ImageUploadProps = {
  onUpload: (file: File) => void
  maxSize?: number // in MB
  accept?: string
}

export function ImageUpload({ 
  onUpload, 
  maxSize = 5,
  accept = "image/jpeg,image/png,image/webp"
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [compressionStats, setCompressionStats] = useState<{
    original: number
    compressed: number
    savings: number
  } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const workerRef = useRef<Worker | null>(null)

  // Initialize web worker
  const initWorker = useCallback(() => {
    if (!workerRef.current && typeof window !== 'undefined') {
      workerRef.current = new Worker('/workers/image-compressor.worker.js')
      
      workerRef.current.onmessage = (e) => {
        const { success, blob, originalSize, compressedSize, error: workerError } = e.data
        
        if (success) {
          const file = new File([blob], 'compressed-image.jpg', { type: 'image/jpeg' })
          const savings = Math.round(((originalSize - compressedSize) / originalSize) * 100)
          
          setCompressionStats({
            original: originalSize,
            compressed: compressedSize,
            savings,
          })
          
          setProgress(100)
          setTimeout(() => {
            setIsProcessing(false)
            onUpload(file)
          }, 500)
        } else {
          setError(workerError || 'Erreur de compression')
          setIsProcessing(false)
        }
      }
    }
  }, [onUpload])

  const processImage = async (file: File) => {
    setError(null)
    setIsProcessing(true)
    setProgress(0)

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`La taille du fichier dépasse ${maxSize}MB`)
      setIsProcessing(false)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    // Initialize and use worker
    initWorker()
    
    if (workerRef.current) {
      workerRef.current.postMessage({
        file,
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
      })
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith('image/'))

    if (imageFile) {
      processImage(imageFile)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  const handleClear = () => {
    setPreview(null)
    setCompressionStats(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50'
            : preview
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
              />
              <div className="text-center">
                <p className="font-medium text-gray-900">Compression en cours...</p>
                <p className="text-sm text-gray-600 mt-1">{progress}%</p>
              </div>
              <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ) : preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {compressionStats && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">
                    Compressé: {(compressionStats.compressed / 1024).toFixed(1)}KB
                    ({compressionStats.savings}% économisé)
                  </span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="p-4 bg-white rounded-full">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Glissez une image ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  PNG, JPG, WebP jusqu'à {maxSize}MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
