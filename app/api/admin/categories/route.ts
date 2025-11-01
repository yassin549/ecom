import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/vercel-db'

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

    const sql = await getSql()
    const categories = await sql`
      SELECT * FROM "Category" 
      ORDER BY name ASC
    `
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
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
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const sql = await getSql()
    
    // Check if slug already exists
    const existing = await sql`
      SELECT * FROM "Category" WHERE slug = ${slug}
    `

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      )
    }

    // Generate a unique ID (similar to CUID format)
    const id = `clx${Date.now().toString(36)}${Math.random().toString(36).substring(2)}`

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

    const category = categoryResult[0]
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
