import { NextRequest, NextResponse } from 'next/server'
// Import SQL-only client - completely independent of Prisma
import { sql } from '@/lib/db/sql-only'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Get all categories (Admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const categories = await sql`
      SELECT * FROM "Category" 
      ORDER BY name ASC
    `
    
    return NextResponse.json(categories || [])
  } catch (error: any) {
    console.error('[CATEGORIES GET] Error:', {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack?.substring(0, 500)
    })
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: error?.message || 'Unknown error',
        code: error?.code,
        name: error?.name
      },
      { status: 500 }
    )
  }
}

// Create new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/categories - Starting request')
    
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    
    if (!isAdmin) {
      console.log('POST /api/admin/categories - Unauthorized')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log('POST /api/admin/categories - Body received:', { 
      name: body.name, 
      slug: body.slug,
      hasDescription: !!body.description,
      hasImage: !!body.image
    })

    const { name, slug, description, image } = body

    // Validate required fields
    if (!name || !slug) {
      console.log('POST /api/admin/categories - Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: name and slug are required' },
        { status: 400 }
      )
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(slug)) {
      console.log('POST /api/admin/categories - Invalid slug format')
      return NextResponse.json(
        { error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.' },
        { status: 400 }
      )
    }
    
    console.log('POST /api/admin/categories - Checking for existing slug:', slug)
    
    // Check if slug already exists
    const existingResult = await sql`
      SELECT id FROM "Category" WHERE slug = ${slug} LIMIT 1
    `
    
    console.log('POST /api/admin/categories - Existing check result:', existingResult)
    
    // neon always returns an array
    if (Array.isArray(existingResult) && existingResult.length > 0) {
      console.log('POST /api/admin/categories - Slug already exists')
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      )
    }

    // Generate a unique ID (CUID-like format)
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 15)
    const id = `clx${timestamp}${random}`

    console.log('POST /api/admin/categories - Creating category with id:', id)

    // Create category
    const categoryResult = await sql`
      INSERT INTO "Category" (id, name, slug, description, image, "createdAt", "updatedAt")
      VALUES (
        ${id},
        ${name},
        ${slug},
        ${description || null},
        ${image || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    console.log('POST /api/admin/categories - Insert result:', categoryResult)

    // neon always returns an array - get first element
    if (!Array.isArray(categoryResult) || categoryResult.length === 0) {
      console.error('POST /api/admin/categories - No data returned from insert')
      throw new Error('Failed to create category: no data returned from database')
    }

    const category = categoryResult[0]
    
    console.log('POST /api/admin/categories - Success! Category created:', category.id)

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('[CATEGORIES POST] Full error:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack?.substring(0, 1000),
      name: error?.name,
      cause: error?.cause
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to create category',
        details: error?.message || 'Unknown error',
        code: error?.code,
        name: error?.name,
        hint: 'Check server logs for full error details'
      },
      { status: 500 }
    )
  }
}
