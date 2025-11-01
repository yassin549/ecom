// SQL-only database access - completely independent of Prisma
// This file ensures admin routes work even if Prisma binaries are missing
// ZERO dependency on Prisma - will never import or use Prisma

// Lazy-load Vercel Postgres SQL client
let _sql: any = null

async function getSqlClient() {
  if (!_sql) {
    // Try Vercel Postgres first (if available)
    try {
      console.log('[SQL-ONLY] Attempting to load Vercel Postgres...')
      const vercelPostgres = await import('@vercel/postgres')
      _sql = vercelPostgres.sql
      console.log('[SQL-ONLY] ✅ Successfully loaded Vercel Postgres client')
    } catch (error: any) {
      console.log('[SQL-ONLY] ⚠️ Vercel Postgres not available:', error?.message || error)
      console.log('[SQL-ONLY] Falling back to Neon...')
      
      // Fallback to Neon if Vercel Postgres fails
      try {
        const { neon } = await import('@neondatabase/serverless')
        const connectionString = 
          process.env.DATABASE_URL || 
          process.env.POSTGRES_URL || 
          process.env.POSTGRES_PRISMA_URL
        
        if (!connectionString) {
          const error = new Error(
            'DATABASE_URL, POSTGRES_URL, or POSTGRES_PRISMA_URL environment variable is not set. ' +
            'Please set one of these in your Vercel environment variables.'
          )
          console.error('[SQL-ONLY] ❌ Missing connection string:', error.message)
          throw error
        }
        
        _sql = neon(connectionString)
        console.log('[SQL-ONLY] ✅ Successfully loaded Neon client as fallback')
      } catch (fallbackError: any) {
        console.error('[SQL-ONLY] ❌ Failed to load Neon fallback:', {
          message: fallbackError?.message,
          code: fallbackError?.code,
          name: fallbackError?.name
        })
        const error = new Error(
          'No SQL client available. ' +
          'Failed to load both Vercel Postgres and Neon. ' +
          'Please ensure DATABASE_URL is set in your Vercel environment variables.'
        )
        throw error
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
      
      if (!sqlFn) {
        throw new Error('SQL client not initialized. Check DATABASE_URL environment variable.')
      }
      
      // Execute query
      const result = await sqlFn(strings, ...values)
      
      // Normalize response format
      // Vercel Postgres returns { rows }, Neon returns array directly
      if (result && typeof result === 'object' && 'rows' in result) {
        if (Array.isArray(result.rows)) {
          resolve(result.rows)
        } else {
          // Single row result wrapped in rows object
          resolve([result.rows])
        }
      } else if (Array.isArray(result)) {
        resolve(result)
      } else if (result) {
        // Single value result - wrap in array
        resolve([result])
      } else {
        // Empty result
        resolve([])
      }
    } catch (error: any) {
      console.error('[SQL-ONLY] Query execution error:', {
        message: error?.message,
        code: error?.code,
        name: error?.name,
        hint: 'Check database connection and query syntax'
      })
      reject(error)
    }
  })
}

