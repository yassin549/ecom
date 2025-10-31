// Lazy accessors to avoid requiring database env vars at import/build time
// Next/Turbopack can import modules during "collecting page data"; dynamic import defers env validation

let _sql: any = null

export async function getSql() {
  if (!_sql) {
    const { sql } = await import('@vercel/postgres')
    _sql = sql
  }
  return _sql
}
