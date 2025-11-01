import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db/supabase'

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
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Create new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, slug, description, image } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name and slug are required' },
        { status: 400 }
      )
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.' },
        { status: 400 }
      )
    }
    
    // Check if slug already exists
    const existingResult = await sql`
      SELECT id FROM "Category" WHERE slug = ${slug} LIMIT 1
    `
    
    // neon returns an array directly
    const existing = Array.isArray(existingResult) ? existingResult : [existingResult]

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      )
    }

    // Generate a unique ID (CUID-like format)
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 15)
    const id = `clx${timestamp}${random}`

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

    // neon returns an array directly - get first element
    const category = Array.isArray(categoryResult) 
      ? (categoryResult.length > 0 ? categoryResult[0] : null)
      : categoryResult
    
    if (!category) {
      throw new Error('Failed to create category: no data returned from database')
    }

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    
    // Provide more detailed error information
    const errorMessage = error?.message || 'Unknown error'
    const errorCode = error?.code
    
    return NextResponse.json(
      { 
        error: 'Failed to create category',
        details: errorMessage,
        code: errorCode
      },
      { status: 500 }
    )
  }
}
