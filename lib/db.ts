import { prisma } from './prisma'

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
    return await prisma.category.findMany()
  },

  async getCategoryBySlug(slug: string) {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`SELECT * FROM "Category" WHERE slug = ${slug}`
      return rows[0] || null
    }
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
    return await prisma.user.create({
      data,
    })
  },
}
