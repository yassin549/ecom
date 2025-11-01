import { neon } from '@neondatabase/serverless'

// Lazy initialization to avoid build-time errors
let sqlClient: ReturnType<typeof neon> | null = null

// Get connection string from environment
function getConnectionString(): string {
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

// Create neon client lazily - works perfectly with Supabase
export function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any> {
  if (!sqlClient) {
    const connectionString = getConnectionString()
    sqlClient = neon(connectionString)
  }
  return sqlClient(strings, ...values)
}

