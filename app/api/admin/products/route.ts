import { NextRequest, NextResponse } from 'next/server'
// Simple database layer - NO PRISMA
import { products, categories } from '@/lib/db/simple-db'

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

    const allProducts = await products.getWithCategory()

    // Parse images JSON and transform category
    const formattedProducts = allProducts.map((product: any) => ({
      ...product,
      images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [],
      category: product.category ? (typeof product.category === 'string' ? JSON.parse(product.category) : product.category) : null,
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
    const existingProduct = await products.getBySlug(slug)
    
    if (existingProduct) {
      // Append random string if slug exists
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      slug = `${slug}-${randomSuffix}`
    }

    // Generate unique ID
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    console.log('POST /api/admin/products - Creating product with id:', id)

    // Parse and validate price
    const parsedPrice = typeof price === 'string' ? parseFloat(price) : price
    const validPrice = isNaN(parsedPrice) ? 0 : parsedPrice

    console.log('POST /api/admin/products - Price parsing:', {
      original: price,
      parsed: parsedPrice,
      valid: validPrice
    })

    // Create product using simple DB helper
    const product = await products.create({
      id,
      name,
      slug,
      description,
      price: validPrice,
      stock: parseInt(stock) || 0,
      categoryId,
      image: image || '/placeholder.svg',
      images: JSON.stringify(images || []),
      featured: featured || false
    })

    if (!product) {
      throw new Error('Failed to create product: no data returned from database')
    }

    // Get category info
    const category = await categories.getById?.(categoryId) || 
                     await categories.getBySlug(categoryId)

    // Format product with category
    const formattedProduct = {
      ...product,
      images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [],
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

    // Delete products using simple DB helper
    await products.deleteMany(ids)

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
