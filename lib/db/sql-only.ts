// SQL-only database access - completely independent of Prisma
// This file ensures admin routes work even if Prisma binaries are missing
// ZERO dependency on Prisma - will never import or use Prisma

// Lazy-load Vercel Postgres SQL client
let _sql: any = null

async function getSqlClient() {
  if (!_sql) {
    try {
      // Try Vercel Postgres first (if available)
      const { sql } = await import('@vercel/postgres')
      _sql = sql
      console.log('[SQL-ONLY] Using Vercel Postgres client')
    } catch (error) {
      console.log('[SQL-ONLY] Vercel Postgres not available, trying Neon fallback...')
      // Fallback to Neon if Vercel Postgres fails
      try {
        const { neon } = await import('@neondatabase/serverless')
        const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
        if (!connectionString) {
          throw new Error('DATABASE_URL or POSTGRES_URL environment variable is not set')
        }
        _sql = neon(connectionString)
        console.log('[SQL-ONLY] Using Neon client as fallback')
      } catch (fallbackError) {
        console.error('[SQL-ONLY] Failed to load Neon fallback:', fallbackError)
        throw new Error('No SQL client available. Please ensure DATABASE_URL is set.')
      }
    }
  }
  return _sql
}

// Type definition for tagged template
type TemplateStringsArray = readonly string[]

// Export sql function that works as a tagged template
// Returns array of rows (normalized for both Vercel Postgres and Neon)
export const sql = (strings: TemplateStringsArray, ...values: any[]): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlFn = await getSqlClient()
      const result = await sqlFn(strings, ...values)
      
      // Vercel Postgres returns { rows }, Neon returns array directly
      if (result && typeof result === 'object' && 'rows' in result && Array.isArray(result.rows)) {
        resolve(result.rows)
      } else if (Array.isArray(result)) {
        resolve(result)
      } else {
        // Single value result - wrap in array
        resolve([result])
      }
    } catch (error) {
      console.error('[SQL-ONLY] Query error:', error)
      reject(error)
    }
  })
}

