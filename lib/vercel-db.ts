// Lazy accessors to avoid requiring database env vars at import/build time
// Prefer pooled connections. If only a direct URL exists, convert to pooled at runtime.

let cachedSql: any = null
let connectPromise: Promise<void> | null = null

function buildPooledConnectionString(): string | null {
	const pooled = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || null
	if (pooled) return pooled

	const direct = process.env.POSTGRES_URL_NON_POOLING || process.env.DIRECT_URL || process.env.DATABASE_URL || null
	if (!direct) return null

	try {
		const parsed = new URL(direct)
		// Supabase direct hosts look like db.<ref>.supabase.co (or aws-1-...supabase.co)
		// Pooled hosts are *.pooler.supabase.com on port 6543
		const isSupabase = /\.supabase\.co$/i.test(parsed.hostname)
		if (isSupabase) {
			const ref = parsed.hostname.split('.')[0] // e.g., db-*** or aws-1-***
			const poolerHost = `${ref}.pooler.supabase.com`
			parsed.hostname = poolerHost
			parsed.port = '6543'
		} else {
			// Generic conversion: 5432 -> 6543 on same host
			if (parsed.port === '5432' || parsed.port === '') parsed.port = '6543'
		}
		const params = parsed.searchParams
		if (!params.has('pgbouncer')) params.set('pgbouncer', 'true')
		if (!params.has('sslmode')) params.set('sslmode', 'require')
		parsed.search = params.toString()
		return parsed.toString()
	} catch {
		// Fallback basic replacement
		let url = direct.replace(':5432', ':6543')
		if (!/pgbouncer=true/.test(url)) {
			url += url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true'
		}
		if (!/sslmode=/.test(url)) {
			url += url.includes('?') ? '&sslmode=require' : '?sslmode=require'
		}
		return url
	}
}

export async function getSql() {
	if (cachedSql) return cachedSql

	const pooledUrl = buildPooledConnectionString()
	if (pooledUrl) {
		// If we have a (real or converted) pooled URL, instantiate a client against it
		const { createClient } = await import('@vercel/postgres')
		const client = createClient({ connectionString: pooledUrl })
		if (!connectPromise) {
			connectPromise = client.connect().catch((e: unknown) => {
				connectPromise = null
				throw e
			})
		}
		await connectPromise
		cachedSql = client.sql
		return cachedSql
	}

	// Fallback: use the default pooled sql helper (will throw with clear error if env is missing)
	const { sql } = await import('@vercel/postgres')
	cachedSql = sql
	return cachedSql
}
