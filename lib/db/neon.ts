import { neon } from '@neondatabase/serverless'

// Direct SQL connection - no Prisma needed!
export const sql = neon(process.env.DATABASE_URL!)

// Helper to get categories
export async function getCategories() {
  return await sql`SELECT * FROM "Category" ORDER BY name ASC`
}

// Helper to create category
export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  image?: string
}) {
  const [category] = await sql`
    INSERT INTO "Category" (id, name, slug, description, image, "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid(),
      ${data.name},
      ${data.slug},
      ${data.description || null},
      ${data.image || null},
      NOW(),
      NOW()
    )
    RETURNING *
  `
  return category
}

// Helper to update category
export async function updateCategory(id: string, data: {
  name: string
  slug: string
  description?: string
  image?: string
}) {
  const [category] = await sql`
    UPDATE "Category"
    SET 
      name = ${data.name},
      slug = ${data.slug},
      description = ${data.description || null},
      image = ${data.image || null},
      "updatedAt" = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return category
}

// Helper to delete category
export async function deleteCategory(id: string) {
  await sql`DELETE FROM "Category" WHERE id = ${id}`
}

// Helper to get category by slug
export async function getCategoryBySlug(slug: string) {
  const [category] = await sql`SELECT * FROM "Category" WHERE slug = ${slug}`
  return category
}
