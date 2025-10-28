import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Get all promo codes - Admin only
export async function GET(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(promoCodes)
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promo codes' },
      { status: 500 }
    )
  }
}

// Create promo code - Admin only
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
    const { code, discount, type, minPurchase, maxUses, expiresAt } = body

    if (!code || !discount || !type) {
      return NextResponse.json(
        { error: 'Code, discount, and type are required' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existing = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Promo code already exists' },
        { status: 400 }
      )
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discount: parseFloat(discount),
        type,
        minPurchase: parseFloat(minPurchase) || 0,
        maxUses: parseInt(maxUses) || 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: true,
      },
    })

    return NextResponse.json(promoCode, { status: 201 })
  } catch (error) {
    console.error('Error creating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to create promo code' },
      { status: 500 }
    )
  }
}

// Update promo code - Admin only
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
    const { id, active, maxUses } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Promo code ID is required' },
        { status: 400 }
      )
    }

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(active !== undefined && { active }),
        ...(maxUses !== undefined && { maxUses: parseInt(maxUses) }),
      },
    })

    return NextResponse.json(promoCode)
  } catch (error) {
    console.error('Error updating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to update promo code' },
      { status: 500 }
    )
  }
}

// Delete promo code - Admin only
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Promo code ID is required' },
        { status: 400 }
      )
    }

    await prisma.promoCode.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promo code:', error)
    return NextResponse.json(
      { error: 'Failed to delete promo code' },
      { status: 500 }
    )
  }
}
