// DEPRECATED: This file is no longer used
// All database operations now use Prisma or lib/db/simple-db.ts
// Kept only for backwards compatibility - DO NOT USE

export async function getSql() {
  console.warn('WARNING: lib/db/neon.ts is deprecated. Use lib/vercel-db.ts instead')
  const { getSql } = await import('../vercel-db')
  return getSql()
}
