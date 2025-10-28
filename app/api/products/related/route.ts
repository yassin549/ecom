import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '4')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get the product to find its category
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Find related products in the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: {
          not: productId, // Exclude current product
        },
      },
      take: limit,
      orderBy: {
        rating: 'desc', // Show highest rated first
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    const response = NextResponse.json(relatedProducts)

    // Cache for 5 minutes
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=300'
    )

    return response
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch related products' },
      { status: 500 }
    )
  }
}
