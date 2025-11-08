// SQL-only database access - completely independent of Prisma
// This file ensures admin routes work even if Prisma binaries are missing
// ZERO dependency on Prisma - will never import or use Prisma

// Lazy-load Vercel Postgres SQL client
let _sql: any = null

async function getSqlClient() {
  if (!_sql) {
    try {
      console.log('[SQL-ONLY] Loading Vercel Postgres...')
      const vercelPostgres = await import('@vercel/postgres')
      _sql = vercelPostgres.sql
      console.log('[SQL-ONLY] ✅ Successfully loaded Vercel Postgres client')
    } catch (error: any) {
      console.error('[SQL-ONLY] ❌ Failed to load Vercel Postgres:', error?.message || error)
      const dbError = new Error(
        'Failed to load Vercel Postgres. ' +
        'Please ensure DATABASE_URL is set in your environment variables.'
      )
      throw dbError
    }
  }
  return _sql
}

// Type definition for tagged template
type TemplateStringsArray = readonly string[]

// Export sql function that works as a tagged template
// Returns array of rows from Vercel Postgres
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
      // Vercel Postgres returns { rows }
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

