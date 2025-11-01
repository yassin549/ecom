// Unified database connection - works with Supabase PostgreSQL
import { neon } from '@neondatabase/serverless'

// Get connection string - must be set in Vercel environment variables
function getConnectionString(): string {
  // Priority order for connection strings
  const connectionString = 
    process.env.DATABASE_URL ||           // Primary Supabase connection
    process.env.POSTGRES_URL ||           // Vercel Postgres (if using)
    process.env.POSTGRES_PRISMA_URL ||    // Vercel Postgres Prisma URL
    process.env.POSTGRES_URL_NON_POOLING || // Direct connection
    process.env.DIRECT_URL                // Fallback direct URL

  if (!connectionString) {
    console.error('CRITICAL: No database connection string found!')
    console.error('Please set DATABASE_URL in Vercel environment variables')
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please set DATABASE_URL with your Supabase PostgreSQL connection string in Vercel.'
    )
  }

  // Log connection info (without sensitive data)
  const url = new URL(connectionString)
  console.log(`Database connection: ${url.protocol}//${url.hostname}:${url.port || 'default'}/${url.pathname.split('/').pop()}`)
  
  return connectionString
}

// Create neon client - single instance
const connectionString = getConnectionString()
export const sql = neon(connectionString)

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1 as test`
    console.log('✅ Database connection successful')
    return true
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

