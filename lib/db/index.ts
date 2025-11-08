// Unified database connection using Vercel Postgres
// Re-export from vercel-db for consistency
export { getSql } from '../vercel-db'

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const { getSql } = await import('../vercel-db')
    const sql = await getSql()
    await sql`SELECT 1 as test`
    console.log('✅ Database connection successful')
    return true
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

