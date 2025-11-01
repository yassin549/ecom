// Test endpoint to verify SQL-only client works
import { NextResponse } from 'next/server'
import { sql } from '@/lib/db/sql-only'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('[TEST-SQL] Starting SQL test...')
    
    // Test 1: Simple query
    const result = await sql`SELECT 1 as test, NOW() as timestamp`
    
    console.log('[TEST-SQL] Query result:', result)
    
    return NextResponse.json({ 
      success: true, 
      result,
      message: 'SQL client is working correctly'
    })
  } catch (error: any) {
    console.error('[TEST-SQL] Error:', {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack?.substring(0, 500)
    })
    
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Unknown error',
      code: error?.code,
      name: error?.name,
      hint: 'Check server logs for details'
    }, { status: 500 })
  }
}

