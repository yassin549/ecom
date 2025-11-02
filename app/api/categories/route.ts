/**
 * PUBLIC CATEGORIES API
 * Fetches all categories for the storefront
 */

import { NextRequest, NextResponse } from 'next/server'
import { categoryDB } from '@/lib/database'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache for 60 seconds

// Get all categories (public)
export async function GET(request: NextRequest) {
  try {
    const categories = await categoryDB.getAll()
    
    const response = NextResponse.json(categories)
    
    // Add cache headers for better performance
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    
    return response
  } catch (error: any) {
    console.error('[GET /api/categories] ERROR:', error.message)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: error.message
      },
      { status: 500 }
    )
  }
}
