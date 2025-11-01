// Lazy-load sql to avoid build-time connection issues
// @vercel/postgres handles connection pooling automatically - no manual connection needed
let cachedSql: any = null

export async function getSql() {
	if (cachedSql) return cachedSql

	// @vercel/postgres automatically uses environment variables:
	// - POSTGRES_URL (pooled connection)
	// - POSTGRES_PRISMA_URL (for Prisma migrations)
	// - POSTGRES_URL_NON_POOLING (direct connection)
	// If none are set, it will fall back to DATABASE_URL
	const { sql } = await import('@vercel/postgres')
	cachedSql = sql
	return cachedSql
}
