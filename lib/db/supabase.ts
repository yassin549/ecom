import { neon, neonConfig } from '@neondatabase/serverless'

// Configure neon for better compatibility
neonConfig.fetchConnectionCache = true

// Get connection string from environment
const getConnectionString = (): string => {
  // Try different environment variable names
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
const connectionString = getConnectionString()
export const sql = neon(connectionString)

// Helper function to execute queries safely
export async function executeQuery<T = any>(
  query: TemplateStringsArray,
  ...values: any[]
): Promise<T[]> {
  try {
    const result = await sql(query, ...values)
    // Handle both array and object results
    return Array.isArray(result) ? result : [result]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

