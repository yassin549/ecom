// Simple Database Layer - NO PRISMA, NO COMPLEXITY
// Direct SQL queries with simple helper functions
// Works with any PostgreSQL database (Neon, Supabase, Vercel Postgres, etc.)

// Lazy-load SQL client to avoid build-time issues
let _sqlClient: any = null

async function getSqlClient() {
  if (!_sqlClient) {
    try {
      // Try Vercel Postgres first (it's installed and works on Vercel)
      const { sql } = await import('@vercel/postgres')
      _sqlClient = sql
      console.log('[SIMPLE-DB] Using Vercel Postgres')
    } catch (error) {
      // Fallback to Neon if Vercel Postgres fails
      try {
        // @ts-ignore - Optional dependency, may not be installed
        const { neon } = await import('@neondatabase/serverless')
        const connectionString = getConnectionString()
        _sqlClient = neon(connectionString)
        console.log('[SIMPLE-DB] Using Neon as fallback')
      } catch (fallbackError) {
        throw new Error('No SQL client available. Please install @vercel/postgres or @neondatabase/serverless')
      }
    }
  }
  return _sqlClient
}

// Get database connection
function getConnectionString(): string {
  const connectionString = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL || 
    process.env.POSTGRES_PRISMA_URL ||
    process.env.SUPABASE_DB_URL

  if (!connectionString) {
    throw new Error(
      'Database connection string not found! ' +
      'Please set DATABASE_URL in your environment variables.'
    )
  }

  return connectionString
}

// Simple query helper - always returns array of rows
export async function query<T = any>(
  queryText: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const sql = await getSqlClient()
    // Neon uses parameterized queries with $1, $2, etc.
    if (params.length > 0) {
      // Query already has $1, $2 placeholders
      const result = await sql(queryText, params) as any
      
      // Normalize response
      if (Array.isArray(result)) {
        return result as T[]
      }
      if (result && typeof result === 'object' && 'rows' in result) {
        return result.rows as T[]
      }
      return []
    }
    
    // Direct query without params
    const result = await sql(queryText) as any
    
    // Normalize response
    if (Array.isArray(result)) {
      return result as T[]
    }
    if (result && typeof result === 'object' && 'rows' in result) {
      return result.rows as T[]
    }
    return []
  } catch (error: any) {
    console.error('[SIMPLE-DB] Query error:', {
      query: queryText.substring(0, 100),
      error: error?.message,
      code: error?.code
    })
    throw error
  }
}

// Tagged template SQL helper (like sql`SELECT * FROM users`)
export const sqlTemplate = async (strings: TemplateStringsArray, ...values: any[]): Promise<any[]> => {
  try {
    const sqlClient = await getSqlClient()
    const result = await sqlClient(strings, ...values) as any
    
    // Normalize response
    if (Array.isArray(result)) {
      return result
    }
    if (result && typeof result === 'object' && 'rows' in result) {
      return result.rows
    }
    return []
  } catch (error: any) {
    console.error('[SIMPLE-DB] SQL template error:', error?.message)
    throw error
  }
}

// Category helpers
export const categories = {
  async getAll() {
    return sqlTemplate`SELECT * FROM "Category" ORDER BY name ASC`
  },
  
  async getById(id: string) {
    const result = await sqlTemplate`SELECT * FROM "Category" WHERE id = ${id} LIMIT 1`
    return result[0] || null
  },
  
  async getBySlug(slug: string) {
    const result = await sqlTemplate`SELECT * FROM "Category" WHERE slug = ${slug} LIMIT 1`
    return result[0] || null
  },
  
  async create(data: { id: string; name: string; slug: string; description?: string | null; image?: string | null }) {
    const result = await sqlTemplate`
      INSERT INTO "Category" (id, name, slug, description, image, "createdAt", "updatedAt")
      VALUES (${data.id}, ${data.name}, ${data.slug}, ${data.description || null}, ${data.image || null}, NOW(), NOW())
      RETURNING *
    `
    return result[0]
  },
  
  async update(id: string, data: { name?: string; slug?: string; description?: string | null; image?: string | null }) {
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(data.name)
    }
    if (data.slug !== undefined) {
      updates.push(`slug = $${paramIndex++}`)
      values.push(data.slug)
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`)
      values.push(data.description)
    }
    if (data.image !== undefined) {
      updates.push(`image = $${paramIndex++}`)
      values.push(data.image)
    }
    
    updates.push(`"updatedAt" = NOW()`)
    values.push(id)
    
    const queryText = `UPDATE "Category" SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`
    const result = await query(queryText, values)
    return result[0] || null
  },
  
  async delete(id: string) {
    await query(`DELETE FROM "Category" WHERE id = $1`, [id])
    return { success: true }
  },
  
  async countProducts(categoryId: string) {
    const result = await query(`SELECT COUNT(*) as count FROM "Product" WHERE "categoryId" = $1`, [categoryId])
    return parseInt(result[0]?.count || '0', 10)
  }
}

// Product helpers
export const products = {
  async getAll(limit?: number) {
    if (limit) {
      return sqlTemplate`SELECT * FROM "Product" ORDER BY "createdAt" DESC LIMIT ${limit}`
    }
    return sqlTemplate`SELECT * FROM "Product" ORDER BY "createdAt" DESC`
  },
  
  async getById(id: string) {
    const result = await sqlTemplate`SELECT * FROM "Product" WHERE id = ${id} LIMIT 1`
    return result[0] || null
  },
  
  async getBySlug(slug: string) {
    const result = await sqlTemplate`SELECT * FROM "Product" WHERE slug = ${slug} LIMIT 1`
    return result[0] || null
  },
  
  async create(data: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    stock: number
    categoryId: string
    image: string
    images?: string
    featured?: boolean
  }) {
    const result = await sqlTemplate`
      INSERT INTO "Product" (
        id, name, slug, description, price, stock, "categoryId", 
        image, images, featured, "createdAt", "updatedAt"
      )
      VALUES (
        ${data.id},
        ${data.name},
        ${data.slug},
        ${data.description},
        ${data.price},
        ${data.stock},
        ${data.categoryId},
        ${data.image},
        ${data.images || '[]'},
        ${data.featured || false},
        NOW(),
        NOW()
      )
      RETURNING *
    `
    return result[0]
  },
  
  async update(id: string, data: {
    name?: string
    slug?: string
    description?: string
    price?: number
    stock?: number
    categoryId?: string
    image?: string
    images?: string
    featured?: boolean
  }) {
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    const fields = ['name', 'slug', 'description', 'price', 'stock', 'categoryId', 'image', 'images', 'featured'] as const
    for (const field of fields) {
      if (data[field] !== undefined) {
        const dbField = field === 'categoryId' ? '"categoryId"' : field
        updates.push(`${dbField} = $${paramIndex++}`)
        values.push(data[field])
      }
    }
    
    updates.push(`"updatedAt" = NOW()`)
    values.push(id)
    
    const queryText = `UPDATE "Product" SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`
    const result = await query(queryText, values)
    return result[0] || null
  },
  
  async delete(id: string) {
    await query(`DELETE FROM "Product" WHERE id = $1`, [id])
    return { success: true }
  },
  
  async deleteMany(ids: string[]) {
    if (ids.length === 0) return { deleted: 0 }
    
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')
    await query(`DELETE FROM "Product" WHERE id IN (${placeholders})`, ids)
    return { deleted: ids.length }
  },
  
  async getWithCategory(productId?: string) {
    if (productId) {
      const result = await sqlTemplate`
        SELECT 
          p.*,
          json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'description', c.description,
            'image', c.image
          ) as category
        FROM "Product" p
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        WHERE p.id = ${productId}
        LIMIT 1
      `
      return result[0] || null
    }
    
    return sqlTemplate`
      SELECT 
        p.*,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'description', c.description,
          'image', c.image
        ) as category
      FROM "Product" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      ORDER BY p."createdAt" DESC
    `
  }
}

// Export everything
export { sqlTemplate as sql }
export default {
  query,
  sql: sqlTemplate,
  categories,
  products
}

