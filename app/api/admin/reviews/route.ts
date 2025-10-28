import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Get all reviews (including unapproved) - Admin only
export async function GET(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const approved = searchParams.get('approved')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    const where: any = {}
    if (approved !== null && approved !== undefined) {
      where.approved = approved === 'true'
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.review.count({ where }),
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// Approve/reject review - Admin only
export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { reviewId, approved } = body

    if (!reviewId || approved === undefined) {
      return NextResponse.json(
        { error: 'Review ID and approved status are required' },
        { status: 400 }
      )
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { approved },
    })

    // If approved, update product rating
    if (approved) {
      const productReviews = await prisma.review.findMany({
        where: {
          productId: review.productId,
          approved: true,
        },
        select: {
          rating: true,
        },
      })

      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: avgRating,
          reviewCount: productReviews.length,
        },
      })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// Delete review - Admin only
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
    const reviewId = searchParams.get('reviewId')

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    await prisma.review.delete({
      where: { id: reviewId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
