import { HeroModern } from "@/components/home/hero-modern"
import { FeaturedProducts } from "@/components/home/featured-products"
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  // Fetch featured products dynamically using Vercel Postgres
  const { rows: featuredProducts } = await sql`
    SELECT p.*, 
           json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as category
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE p.featured = true
    ORDER BY p.rating DESC
    LIMIT 8
  `

  return (
    <>
      <HeroModern />
      <FeaturedProducts products={featuredProducts} />
    </>
  )
}
