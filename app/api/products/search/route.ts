import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Full-text search
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        image: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    })

    const response = NextResponse.json({
      results: products,
      query,
      count: products.length,
    })

    // Cache for 2 minutes (shorter for search)
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=120, stale-while-revalidate=120'
    )

    return response
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}
