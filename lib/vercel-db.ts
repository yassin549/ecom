import { createPool } from '@vercel/postgres'

// Get connection string from environment
let connectionString = process.env.POSTGRES_URL_POOLED 
  || process.env.POSTGRES_URL 
  || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('No database connection string found. Please set POSTGRES_URL or DATABASE_URL environment variable.')
}

console.log('🔍 Original connection string port:', connectionString.includes(':5432') ? '5432 (direct)' : connectionString.includes(':6543') ? '6543 (pooled)' : 'unknown')

// Convert direct connection (port 5432) to pooled connection (port 6543)
if (connectionString.includes(':5432')) {
  console.log('⚠️ Converting direct connection to pooled connection')
  connectionString = connectionString.replace(':5432', ':6543')
  
  // Add pgbouncer parameter if not present
  if (!connectionString.includes('pgbouncer=true')) {
    connectionString += connectionString.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true'
  }
  
  console.log('✅ Converted to pooled connection (port 6543)')
}

// Verify the connection string is now pooled
if (!connectionString.includes(':6543')) {
  console.warn('⚠️ Warning: Connection string does not use port 6543. This may cause issues with Vercel Postgres.')
}

// Create and export the database pool
export const db = createPool({
  connectionString,
})

console.log('✅ Database pool created successfully')
