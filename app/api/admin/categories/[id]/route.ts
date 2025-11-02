/**
 * CATEGORY BY ID API ROUTES
 * Update and Delete operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { categoryDB } from '@/lib/database'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ============================================================================
// PUT - Update category
// ============================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, slug, description, image } = body

    console.log(`[PUT /api/admin/categories/${id}] Update request:`, { name, slug })

    // Validate required fields
    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      )
    }

    // Validate image URL/path if provided
    if (image) {
      const isValidUrl = image.startsWith('http://') || image.startsWith('https://')
      const isValidPath = image.startsWith('/uploads/') || image.startsWith('/placeholder')
      
      if (!isValidUrl && !isValidPath) {
        return NextResponse.json(
          { error: 'Image must be a valid HTTP/HTTPS URL or uploaded file path' },
          { status: 400 }
        )
      }
    }

    // Update category
    const category = await categoryDB.update(id, {
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim() || null,
      image: image?.trim() || null,
    })

    const duration = Date.now() - startTime
    console.log(`[PUT /api/admin/categories/${id}] Success (${duration}ms)`)

    return NextResponse.json(category)
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[PUT /api/admin/categories] ERROR (${duration}ms):`, error.message)
    
    return NextResponse.json(
      { 
        error: 'Failed to update category',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// DELETE - Delete category
// ============================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params

    console.log(`[DELETE /api/admin/categories/${id}] Deleting category...`)

    // Delete category (database layer checks for products)
    await categoryDB.delete(id)

    const duration = Date.now() - startTime
    console.log(`[DELETE /api/admin/categories/${id}] Success (${duration}ms)`)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[DELETE /api/admin/categories] ERROR (${duration}ms):`, error.message)
    
    return NextResponse.json(
      { 
        error: 'Failed to delete category',
        details: error.message
      },
      { status: 500 }
    )
  }
}
