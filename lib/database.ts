/**
 * CLEAN DATABASE LAYER
 * Single source of truth for all database operations
 * Uses @vercel/postgres directly - no Prisma complexity
 */

import { sql } from '@vercel/postgres'

// ============================================================================
// TYPES
// ============================================================================

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  images: string // JSON array
  stock: number
  featured: boolean
  rating: number
  reviewCount: number
  categoryId: string
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// CATEGORY OPERATIONS
// ============================================================================

export const categoryDB = {
  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    try {
      const result = await sql<Category>`
        SELECT * FROM "Category" 
        ORDER BY name ASC
      `
      return result.rows
    } catch (error: any) {
      console.error('[categoryDB.getAll] Error:', error)
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }
  },

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<Category | null> {
    try {
      const result = await sql<Category>`
        SELECT * FROM "Category" 
        WHERE id = ${id}
        LIMIT 1
      `
      return result.rows[0] || null
    } catch (error: any) {
      console.error('[categoryDB.getById] Error:', error)
      throw new Error(`Failed to fetch category: ${error.message}`)
    }
  },

  /**
   * Get category by slug
   */
  async getBySlug(slug: string): Promise<Category | null> {
    try {
      const result = await sql<Category>`
        SELECT * FROM "Category" 
        WHERE slug = ${slug}
        LIMIT 1
      `
      return result.rows[0] || null
    } catch (error: any) {
      console.error('[categoryDB.getBySlug] Error:', error)
      throw new Error(`Failed to fetch category: ${error.message}`)
    }
  },

  /**
   * Create a new category
   */
  async create(data: {
    name: string
    slug: string
    description?: string | null
    image?: string | null
  }): Promise<Category> {
    try {
      // Generate unique ID
      const id = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      
      const result = await sql<Category>`
        INSERT INTO "Category" (
          id, name, slug, description, image, "createdAt", "updatedAt"
        )
        VALUES (
          ${id},
          ${data.name},
          ${data.slug},
          ${data.description || null},
          ${data.image || null},
          NOW(),
          NOW()
        )
        RETURNING *
      `
      
      if (!result.rows[0]) {
        throw new Error('Category creation failed: no data returned')
      }
      
      return result.rows[0]
    } catch (error: any) {
      console.error('[categoryDB.create] Error:', error)
      
      // Handle unique constraint violations
      if (error.code === '23505') {
        if (error.message.includes('slug')) {
          throw new Error('A category with this slug already exists')
        }
        if (error.message.includes('name')) {
          throw new Error('A category with this name already exists')
        }
      }
      
      throw new Error(`Failed to create category: ${error.message}`)
    }
  },

  /**
   * Update a category
   */
  async update(
    id: string,
    data: {
      name?: string
      slug?: string
      description?: string | null
      image?: string | null
    }
  ): Promise<Category> {
    try {
      const updates: string[] = []
      const values: any[] = []
      let paramCount = 1

      if (data.name !== undefined) {
        updates.push(`name = $${paramCount++}`)
        values.push(data.name)
      }
      if (data.slug !== undefined) {
        updates.push(`slug = $${paramCount++}`)
        values.push(data.slug)
      }
      if (data.description !== undefined) {
        updates.push(`description = $${paramCount++}`)
        values.push(data.description)
      }
      if (data.image !== undefined) {
        updates.push(`image = $${paramCount++}`)
        values.push(data.image)
      }

      if (updates.length === 0) {
        throw new Error('No fields to update')
      }

      updates.push(`"updatedAt" = NOW()`)
      values.push(id)

      const query = `
        UPDATE "Category" 
        SET ${updates.join(', ')} 
        WHERE id = $${paramCount}
        RETURNING *
      `

      const result = await sql.query(query, values)
      
      if (!result.rows[0]) {
        throw new Error('Category not found')
      }
      
      return result.rows[0] as Category
    } catch (error: any) {
      console.error('[categoryDB.update] Error:', error)
      
      if (error.code === '23505') {
        if (error.message.includes('slug')) {
          throw new Error('A category with this slug already exists')
        }
        if (error.message.includes('name')) {
          throw new Error('A category with this name already exists')
        }
      }
      
      throw new Error(`Failed to update category: ${error.message}`)
    }
  },

  /**
   * Delete a category
   */
  async delete(id: string): Promise<void> {
    try {
      // Check if category has products
      const productCount = await sql`
        SELECT COUNT(*) as count 
        FROM "Product" 
        WHERE "categoryId" = ${id}
      `
      
      const count = parseInt(productCount.rows[0]?.count || '0', 10)
      
      if (count > 0) {
        throw new Error(`Cannot delete category with ${count} product(s). Please reassign or delete the products first.`)
      }

      await sql`
        DELETE FROM "Category" 
        WHERE id = ${id}
      `
    } catch (error: any) {
      console.error('[categoryDB.delete] Error:', error)
      throw new Error(`Failed to delete category: ${error.message}`)
    }
  },
}

// ============================================================================
// PRODUCT OPERATIONS
// ============================================================================

export const productDB = {
  /**
   * Get all products with category information
   */
  async getAll(): Promise<(Product & { category: Category | null })[]> {
    try {
      const result = await sql`
        SELECT 
          p.*,
          json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'description', c.description,
            'image', c.image,
            'createdAt', c."createdAt",
            'updatedAt', c."updatedAt"
          ) as category
        FROM "Product" p
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        ORDER BY p."createdAt" DESC
      `
      
      return result.rows.map(row => ({
        ...row,
        category: row.category || null
      })) as any
    } catch (error: any) {
      console.error('[productDB.getAll] Error:', error)
      throw new Error(`Failed to fetch products: ${error.message}`)
    }
  },

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<(Product & { category: Category | null }) | null> {
    try {
      const result = await sql`
        SELECT 
          p.*,
          json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'description', c.description,
            'image', c.image,
            'createdAt', c."createdAt",
            'updatedAt', c."updatedAt"
          ) as category
        FROM "Product" p
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        WHERE p.id = ${id}
        LIMIT 1
      `
      
      const row = result.rows[0]
      if (!row) return null
      
      return {
        ...row,
        category: row.category || null
      } as any
    } catch (error: any) {
      console.error('[productDB.getById] Error:', error)
      throw new Error(`Failed to fetch product: ${error.message}`)
    }
  },

  /**
   * Create a new product
   */
  async create(data: {
    name: string
    slug: string
    description: string
    price: number
    stock: number
    categoryId: string
    image: string
    images?: string[]
    featured?: boolean
  }): Promise<Product> {
    try {
      const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const imagesJson = JSON.stringify(data.images || [])
      
      const result = await sql<Product>`
        INSERT INTO "Product" (
          id, name, slug, description, price, stock, "categoryId",
          image, images, featured, "createdAt", "updatedAt"
        )
        VALUES (
          ${id},
          ${data.name},
          ${data.slug},
          ${data.description},
          ${data.price},
          ${data.stock},
          ${data.categoryId},
          ${data.image},
          ${imagesJson},
          ${data.featured || false},
          NOW(),
          NOW()
        )
        RETURNING *
      `
      
      if (!result.rows[0]) {
        throw new Error('Product creation failed: no data returned')
      }
      
      return result.rows[0]
    } catch (error: any) {
      console.error('[productDB.create] Error:', error)
      
      if (error.code === '23505') {
        throw new Error('A product with this slug already exists')
      }
      if (error.code === '23503') {
        throw new Error('Category not found')
      }
      
      throw new Error(`Failed to create product: ${error.message}`)
    }
  },

  /**
   * Delete product(s)
   */
  async deleteMany(ids: string[]): Promise<number> {
    try {
      if (ids.length === 0) return 0
      
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')
      const query = `DELETE FROM "Product" WHERE id IN (${placeholders})`
      
      const result = await sql.query(query, ids)
      return result.rowCount || 0
    } catch (error: any) {
      console.error('[productDB.deleteMany] Error:', error)
      throw new Error(`Failed to delete products: ${error.message}`)
    }
  },
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error('[Database] Connection check failed:', error)
    return false
  }
}
