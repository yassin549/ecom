import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET user's favorites
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'guest'

    const result = await sql`
      SELECT 
        f.*,
        p.id as "productId",
        p.name as "productName",
        p.slug as "productSlug",
        p.price as "productPrice",
        p.image as "productImage",
        p.stock as "productStock"
      FROM "Favorite" f
      INNER JOIN "Product" p ON f."productId" = p.id
      WHERE f."userId" = ${userId}
      ORDER BY f."createdAt" DESC
    `

    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error('[GET /api/favorites] ERROR:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch favorites', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = 'guest', productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if already favorited
    const existing = await sql`
      SELECT * FROM "Favorite"
      WHERE "userId" = ${userId} AND "productId" = ${productId}
      LIMIT 1
    `

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { message: 'Already in favorites', favorite: existing.rows[0] },
        { status: 200 }
      )
    }

    // Add to favorites
    const favoriteId = `fav_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const result = await sql`
      INSERT INTO "Favorite" (id, "userId", "productId", "createdAt")
      VALUES (${favoriteId}, ${userId}, ${productId}, NOW())
      RETURNING *
    `

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/favorites] ERROR:', error.message)
    return NextResponse.json(
      { error: 'Failed to add favorite', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'guest'
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    await sql`
      DELETE FROM "Favorite"
      WHERE "userId" = ${userId} AND "productId" = ${productId}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[DELETE /api/favorites] ERROR:', error.message)
    return NextResponse.json(
      { error: 'Failed to remove favorite', details: error.message },
      { status: 500 }
    )
  }
}
