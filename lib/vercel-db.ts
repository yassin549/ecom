import { createPool } from '@vercel/postgres'

// Force use of pooled connection string
// Vercel Postgres requires a pooled connection (port 6543 with pgbouncer)
const connectionString = process.env.POSTGRES_URL_POOLED 
  || process.env.POSTGRES_URL 
  || process.env.DATABASE_URL?.replace(':5432/', ':6543/') + '?pgbouncer=true'

if (!connectionString) {
  throw new Error('No database connection string found')
}

// Ensure we're using the pooled connection
if (!connectionString.includes(':6543') && !connectionString.includes('pgbouncer=true')) {
  console.warn('⚠️ Converting direct connection to pooled connection')
  const pooledConnection = connectionString
    .replace(':5432/', ':6543/')
    .concat(connectionString.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true')
  
  export const db = createPool({
    connectionString: pooledConnection,
  })
} else {
  export const db = createPool({
    connectionString,
  })
}

console.log('✅ Database pool created with pooled connection')
