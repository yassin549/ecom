import { neon } from '@neondatabase/serverless'

// Get connection string from environment
const getConnectionString = (): string => {
  const connectionString = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL || 
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DIRECT_URL

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please set DATABASE_URL with your Supabase PostgreSQL connection string.'
    )
  }

  return connectionString
}

// Create neon client - works perfectly with Supabase
// Using the same pattern as lib/db/neon.ts which works
export const sql = neon(getConnectionString())

