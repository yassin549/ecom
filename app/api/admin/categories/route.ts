/**
 * CATEGORY API ROUTES
 * Clean, reliable implementation with proper error handling
 */

import { NextRequest, NextResponse } from 'next/server'
import { categoryDB } from '@/lib/database'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ============================================================================
// GET - Fetch all categories
// ============================================================================
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check authorization
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    if (!isAdmin) {
      console.warn('[GET /api/admin/categories] Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    console.log('[GET /api/admin/categories] Fetching all categories...')
    
    const categories = await categoryDB.getAll()
    
    const duration = Date.now() - startTime
    console.log(`[GET /api/admin/categories] Success - ${categories.length} categories (${duration}ms)`)
    
    return NextResponse.json(categories)
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error('[GET /api/admin/categories] ERROR:', {
      message: error.message,
      duration: `${duration}ms`,
      stack: error.stack?.substring(0, 500)
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// POST - Create new category
// ============================================================================
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check authorization
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    if (!isAdmin) {
      console.warn('[POST /api/admin/categories] Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('[POST /api/admin/categories] Invalid JSON:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { name, slug, description, image } = body

    console.log('[POST /api/admin/categories] Request:', { 
      name, 
      slug,
      hasDescription: !!description,
      hasImage: !!image,
      imageLength: image?.length || 0
    })

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    if (!slug?.trim()) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      )
    }

    // Validate slug format (lowercase, alphanumeric, hyphens only)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { 
          error: 'Invalid slug format',
          details: 'Slug must contain only lowercase letters, numbers, and hyphens'
        },
        { status: 400 }
      )
    }

    // Validate image URL if provided
    if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
      return NextResponse.json(
        { 
          error: 'Invalid image URL',
          details: 'Image must be a valid HTTP/HTTPS URL'
        },
        { status: 400 }
      )
    }

    // Create category in database
    const category = await categoryDB.create({
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim() || null,
      image: image?.trim() || null
    })

    const duration = Date.now() - startTime
    console.log(`[POST /api/admin/categories] Success - Created category ${category.id} (${duration}ms)`)

    return NextResponse.json(category, { status: 201 })
    
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error('[POST /api/admin/categories] ERROR:', {
      message: error.message,
      duration: `${duration}ms`,
      stack: error.stack?.substring(0, 500)
    })

    // Return user-friendly error message
    return NextResponse.json(
      { 
        error: 'Failed to create category',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
