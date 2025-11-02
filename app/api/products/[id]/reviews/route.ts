import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if Review table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Review'
      )
    `

    if (!tableCheck.rows[0]?.exists) {
      console.log('[GET /api/products/[id]/reviews] Review table does not exist yet')
      return NextResponse.json([]) // Return empty array if table doesn't exist
    }

    const result = await sql`
      SELECT 
        r.*,
        u.name as "userName",
        u.email as "userEmail"
      FROM "Review" r
      LEFT JOIN "User" u ON r."userId" = u.id
      WHERE r."productId" = ${id}
      AND r.approved = true
      ORDER BY r."createdAt" DESC
    `

    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error('[GET /api/products/[id]/reviews] ERROR:', error.message)
    // Return empty array on error instead of 500
    return NextResponse.json([])
  }
}

// POST - Create a new review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const body = await request.json()
    const { userId, rating, comment, userName, userEmail } = body

    // Check if Review table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Review'
      )
    `

    if (!tableCheck.rows[0]?.exists) {
      return NextResponse.json(
        { error: 'Review system not yet initialized. Please run: npx prisma db push' },
        { status: 503 }
      )
    }

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      )
    }

    if (!userName || !userEmail) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Generate review ID
    const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Create or get user
    let user
    const existingUser = await sql`
      SELECT * FROM "User" WHERE email = ${userEmail} LIMIT 1
    `

    if (existingUser.rows.length > 0) {
      user = existingUser.rows[0]
    } else {
      // Create guest user
      const newUser = await sql`
        INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
        VALUES (
          ${`user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`},
          ${userEmail},
          ${userName},
          ${'guest'},
          ${'user'},
          NOW(),
          NOW()
        )
        RETURNING *
      `
      user = newUser.rows[0]
    }

    // Create review
    const review = await sql`
      INSERT INTO "Review" (
        id, "productId", "userId", rating, comment, approved, "createdAt", "updatedAt"
      )
      VALUES (
        ${reviewId},
        ${productId},
        ${user.id},
        ${rating},
        ${comment},
        ${true},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    // Update product rating and review count
    await sql`
      UPDATE "Product"
      SET 
        "reviewCount" = "reviewCount" + 1,
        rating = (
          SELECT AVG(rating)::float
          FROM "Review"
          WHERE "productId" = ${productId} AND approved = true
        ),
        "updatedAt" = NOW()
      WHERE id = ${productId}
    `

    return NextResponse.json({
      ...review.rows[0],
      userName: user.name,
      userEmail: user.email
    }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/products/[id]/reviews] ERROR:', error.message)
    return NextResponse.json(
      { error: 'Failed to create review', details: error.message },
      { status: 500 }
    )
  }
}
