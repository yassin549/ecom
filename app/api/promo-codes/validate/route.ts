import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Validate promo code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, cartTotal } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      )
    }

    // Find promo code
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Invalid promo code', valid: false },
        { status: 404 }
      )
    }

    // Check if active
    if (!promoCode.active) {
      return NextResponse.json(
        { error: 'This promo code is no longer active', valid: false },
        { status: 400 }
      )
    }

    // Check expiration
    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      return NextResponse.json(
        { error: 'This promo code has expired', valid: false },
        { status: 400 }
      )
    }

    // Check usage limit
    if (promoCode.maxUses > 0 && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json(
        { error: 'This promo code has reached its usage limit', valid: false },
        { status: 400 }
      )
    }

    // Check minimum purchase
    if (cartTotal < promoCode.minPurchase) {
      return NextResponse.json(
        { 
          error: `Minimum purchase of ${promoCode.minPurchase} TND required`, 
          valid: false 
        },
        { status: 400 }
      )
    }

    // Calculate discount
    let discount = 0
    if (promoCode.type === 'percentage') {
      discount = (cartTotal * promoCode.discount) / 100
    } else {
      discount = promoCode.discount
    }

    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      discount,
      type: promoCode.type,
      discountValue: promoCode.discount,
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to validate promo code', valid: false },
      { status: 500 }
    )
  }
}
