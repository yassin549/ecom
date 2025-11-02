/**
 * FILE UPLOAD API
 * Handles image uploads and stores them in public/uploads folder
 */

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check authorization
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Invalid file type',
          details: `Allowed types: ${ALLOWED_TYPES.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'File too large',
          details: `Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
        },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = path.extname(file.name)
    const filename = `${timestamp}_${randomStr}${ext}`

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = path.join(uploadsDir, filename)
    
    await writeFile(filepath, buffer)

    const duration = Date.now() - startTime
    console.log(`[POST /api/upload] Success - ${filename} (${file.size} bytes, ${duration}ms)`)

    // Return public URL
    const url = `/uploads/${filename}`
    
    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type
    }, { status: 201 })

  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error('[POST /api/upload] ERROR:', {
      message: error.message,
      duration: `${duration}ms`,
      stack: error.stack?.substring(0, 500)
    })

    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove uploaded files
export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      )
    }

    // Security: Only allow deletion from uploads folder
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      )
    }

    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
    
    if (existsSync(filepath)) {
      const { unlink } = await import('fs/promises')
      await unlink(filepath)
      console.log(`[DELETE /api/upload] Deleted: ${filename}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[DELETE /api/upload] ERROR:', error.message)
    return NextResponse.json(
      { error: 'Failed to delete file', details: error.message },
      { status: 500 }
    )
  }
}
