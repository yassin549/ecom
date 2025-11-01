import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Get all products (Admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const products = await sql`
      SELECT 
        p.*,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'description', c.description,
          'image', c.image
        ) as category
      FROM "Product" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      ORDER BY p."createdAt" DESC
    `

    // Parse images JSON and transform category
    const formattedProducts = products.map((product: any) => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      category: product.category || null,
    }))

    return NextResponse.json(formattedProducts)
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/products - Starting request')
    
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    
    if (!isAdmin) {
      console.log('POST /api/admin/products - Unauthorized')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log('POST /api/admin/products - Body received:', {
      name: body.name,
      hasDescription: !!body.description,
      price: body.price,
      categoryId: body.categoryId
    })

    const { name, description, price, stock, categoryId, image, images, featured } = body

    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      console.log('POST /api/admin/products - Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, and categoryId are required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingSlug = await sql`
      SELECT id FROM "Product" WHERE slug = ${slug} LIMIT 1
    `
    
    if (Array.isArray(existingSlug) && existingSlug.length > 0) {
      // Append random string if slug exists
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      slug = `${slug}-${randomSuffix}`
    }

    // Generate unique ID
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 15)
    const id = `clx${timestamp}${random}`

    console.log('POST /api/admin/products - Creating product with id:', id)

    // Create product
    const productResult = await sql`
      INSERT INTO "Product" (
        id, name, slug, description, price, stock, "categoryId", 
        image, images, featured, "createdAt", "updatedAt"
      )
      VALUES (
        ${id},
        ${name},
        ${slug},
        ${description},
        ${parseFloat(price)},
        ${parseInt(stock) || 0},
        ${categoryId},
        ${image || '/placeholder.jpg'},
        ${JSON.stringify(images || [])},
        ${featured || false},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    console.log('POST /api/admin/products - Insert result:', productResult)

    if (!Array.isArray(productResult) || productResult.length === 0) {
      throw new Error('Failed to create product: no data returned from database')
    }

    const product = productResult[0]

    // Get category info
    const categoryResult = await sql`
      SELECT * FROM "Category" WHERE id = ${categoryId} LIMIT 1
    `
    
    const category = Array.isArray(categoryResult) && categoryResult.length > 0 
      ? categoryResult[0] 
      : null

    // Format product with category
    const formattedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
      } : null,
    }

    console.log('POST /api/admin/products - Success! Product created:', formattedProduct.id)

    return NextResponse.json(formattedProduct, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/admin/products - ERROR:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: error?.message || 'Unknown error',
        code: error?.code
      },
      { status: 500 }
    )
  }
}

// Bulk delete products (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')?.split(',') || []

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'No product IDs provided' },
        { status: 400 }
      )
    }

    // Delete products using SQL
    // Delete products one by one for compatibility across different PostgreSQL clients
    for (const id of ids) {
      await sql`DELETE FROM "Product" WHERE id = ${id}`
    }

    return NextResponse.json({ 
      success: true, 
      deleted: ids.length 
    })
  } catch (error: any) {
    console.error('Error deleting products:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete products',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
