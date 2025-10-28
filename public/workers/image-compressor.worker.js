// Image compression web worker
self.addEventListener('message', async (e) => {
  const { file, maxWidth, maxHeight, quality } = e.data

  try {
    // Create bitmap from file
    const bitmap = await createImageBitmap(file)
    
    // Calculate new dimensions
    let width = bitmap.width
    let height = bitmap.height
    
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      width = Math.floor(width * ratio)
      height = Math.floor(height * ratio)
    }

    // Create canvas and resize
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, width, height)

    // Convert to blob
    const blob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: quality || 0.8,
    })

    // Send back compressed image
    self.postMessage({
      success: true,
      blob,
      originalSize: file.size,
      compressedSize: blob.size,
      width,
      height,
    })
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message,
    })
  }
})
