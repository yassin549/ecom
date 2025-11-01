// Lazy-load prisma to avoid initialization errors on Vercel when only using SQL
let _prisma: any = null
const getPrisma = () => {
  if (!_prisma) {
    try {
      _prisma = require('./prisma').prisma
    } catch (error) {
      console.error('Failed to load Prisma (this is OK if using SQL only):', error)
      // Return null if Prisma fails - routes using it will handle the error
      return null
    }
  }
  return _prisma
}

// Detect if running on Vercel
const isVercel = process.env.VERCEL === '1'

// Lazy-load sql to avoid build-time connection issues
let _sql: any = null
const getSql = async () => {
  if (!_sql) {
    const { sql } = await import('@vercel/postgres')
    _sql = sql
  }
  return _sql
}

// Export sql function that works as a tagged template
// This allows admin routes to use sql directly
// Note: sql is a synchronous function that returns a Promise
// Vercel Postgres returns { rows }, so we extract rows to match Neon's behavior
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  return getSql().then(async (sqlFn) => {
    const result = await sqlFn(strings, ...values)
    // Vercel Postgres returns { rows }, Neon returns array directly
    // Extract rows if it's a Vercel Postgres response
    if (result && typeof result === 'object' && 'rows' in result) {
      return result.rows
    }
    return result
  })
}

export const db = {
  // Products
  async getProducts(limit?: number) {
    if (isVercel) {
      const sql = await getSql()
      const query = limit 
        ? sql`SELECT * FROM "Product" LIMIT ${limit}`
        : sql`SELECT * FROM "Product"`
      const { rows } = await query
      return rows
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.product.findMany({
      take: limit,
    })
  },

  async getProductById(id: string) {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`SELECT * FROM "Product" WHERE id = ${id}`
      return rows[0] || null
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.product.findUnique({
      where: { id },
    })
  },

  async getProductBySlug(slug: string) {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`SELECT * FROM "Product" WHERE slug = ${slug}`
      return rows[0] || null
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.product.findUnique({
      where: { slug },
    })
  },

  async searchProducts(query: string) {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`
        SELECT * FROM "Product" 
        WHERE name ILIKE ${`%${query}%`} 
        OR description ILIKE ${`%${query}%`}
      `
      return rows
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    })
  },

  // Categories
  async getCategories() {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`SELECT * FROM "Category"`
      return rows
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.category.findMany()
  },

  async getCategoryBySlug(slug: string) {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`SELECT * FROM "Category" WHERE slug = ${slug}`
      return rows[0] || null
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.category.findUnique({
      where: { slug },
    })
  },

  // Orders
  async getOrders() {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`SELECT * FROM "Order" ORDER BY "createdAt" DESC`
      return rows
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  async getOrderById(id: string) {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`SELECT * FROM "Order" WHERE id = ${id}`
      return rows[0] || null
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.order.findUnique({
      where: { id },
    })
  },

  async createOrder(data: any) {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`
        INSERT INTO "Order" (id, "userId", total, status, "createdAt", "updatedAt")
        VALUES (${data.id}, ${data.userId}, ${data.total}, ${data.status}, NOW(), NOW())
        RETURNING *
      `
      return rows[0]
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.order.create({
      data,
    })
  },

  // Users
  async getUserByEmail(email: string) {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`SELECT * FROM "User" WHERE email = ${email}`
      return rows[0] || null
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.user.findUnique({
      where: { email },
    })
  },

  async createUser(data: any) {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`
        INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt")
        VALUES (${data.id}, ${data.email}, ${data.name}, ${data.password}, NOW(), NOW())
        RETURNING *
      `
      return rows[0]
    }
    const prisma = getPrisma()
    if (!prisma) throw new Error('Prisma not available')
    return await prisma.user.create({
      data,
    })
  },
}
