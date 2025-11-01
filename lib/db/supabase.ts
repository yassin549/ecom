import { neon } from '@neondatabase/serverless'

// Lazy initialization to avoid issues at module load time
let sqlClient: ReturnType<typeof neon> | null = null

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

// Create neon client lazily - only when first used
function getSqlClient() {
  if (!sqlClient) {
    const connectionString = getConnectionString()
    sqlClient = neon(connectionString)
  }
  return sqlClient
}

// Export sql function that initializes client on first use
export const sql: ReturnType<typeof neon> = ((strings: TemplateStringsArray, ...values: any[]) => {
  return getSqlClient()(strings, ...values)
}) as ReturnType<typeof neon>

