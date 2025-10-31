// Lazy accessors to avoid requiring database env vars at import/build time
// Prefer pooled connections. If only a direct URL exists, convert to pooled at runtime.

let cachedSql: any = null

function buildPooledConnectionString(): string | null {
	const pooled = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || null
	if (pooled) return pooled

	const direct = process.env.POSTGRES_URL_NON_POOLING || process.env.DIRECT_URL || process.env.DATABASE_URL || null
	if (!direct) return null

	// Convert common direct URL (5432) to pooled (6543) and enable pgbouncer
	let url = direct.replace(':5432', ':6543')
	if (!/pgbouncer=true/.test(url)) {
		url += url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true'
	}
	return url
}

export async function getSql() {
	if (cachedSql) return cachedSql

	const pooledUrl = buildPooledConnectionString()
	if (pooledUrl) {
		// If we have a (real or converted) pooled URL, instantiate a client against it
		const { createClient } = await import('@vercel/postgres')
		const client = createClient({ connectionString: pooledUrl })
		cachedSql = client.sql
		return cachedSql
	}

	// Fallback: use the default pooled sql helper (will throw with clear error if env is missing)
	const { sql } = await import('@vercel/postgres')
	cachedSql = sql
	return cachedSql
}
