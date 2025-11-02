import { NextRequest, NextResponse } from 'next/server'
import { categories } from '@/lib/db/simple-db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Get all categories
export async function GET(request: NextRequest) {
  try {
    const allCategories = await categories.getAll()
    return NextResponse.json(allCategories)
  } catch (error: any) {
    console.error('Error fetching categories:', {
      message: error?.message,
      code: error?.code
    })
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
