import { HeroModern } from "@/components/home/hero-modern"
import { FeaturedProducts } from "@/components/home/featured-products"
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Product = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  rating: number
  reviewCount: number
  stock: number
  category?: {
    id: string
    name: string
    slug: string
  }
}

export default async function Home() {
  // Fetch featured products dynamically using Vercel Postgres
  const { rows } = await sql`
    SELECT p.id, p.name, p.slug, p.price, p.image, p.rating, 
           p."reviewCount", p.stock,
           json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as category
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE p.featured = true
    ORDER BY p.rating DESC
    LIMIT 8
  `

  // Cast to proper type
  const featuredProducts = rows as unknown as Product[]

  return (
    <>
      <HeroModern />
      <FeaturedProducts products={featuredProducts} />
    </>
  )
}
