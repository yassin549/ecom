import { HeroModern } from "@/components/home/hero-modern"
import { FeaturedProducts } from "@/components/home/featured-products"
import { ProductShowcase } from "@/components/home/product-showcase"
import { getSql } from '@/lib/vercel-db'

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
  let featuredProducts: Product[] = []
  try {
    const sql = await getSql()
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
    featuredProducts = rows as unknown as Product[]
  } catch (error) {
    console.error('Error fetching featured products:', error)
  }

  // Fallback products if DB is empty or unreachable
  if (featuredProducts.length === 0) {
    featuredProducts = [
      {
        id: 'fallback_1',
        name: 'Hoodie Premium "Drip"',
        slug: 'hoodie-premium-drip',
        price: 89.900,
        image: '/assets/photo_2026-01-19_05-59-10.jpg',
        rating: 4.9,
        reviewCount: 128,
        stock: 25,
        category: { id: 'cat_1', name: 'Streetwear', slug: 'streetwear' }
      },
      {
        id: 'fallback_2',
        name: 'Pantalon Cargo Street',
        slug: 'pantalon-cargo-street',
        price: 75.000,
        image: '/assets/photo_2026-01-19_06-00-06.jpg',
        rating: 4.7,
        reviewCount: 85,
        stock: 30,
        category: { id: 'cat_1', name: 'Streetwear', slug: 'streetwear' }
      },
      {
        id: 'fallback_3',
        name: 'Ensemble Tracksuit Pro',
        slug: 'ensemble-tracksuit-pro',
        price: 145.000,
        image: '/assets/photo_2026-01-19_06-00-20.jpg',
        rating: 5.0,
        reviewCount: 42,
        stock: 15,
        category: { id: 'cat_3', name: 'Ensembles', slug: 'ensembles' }
      },
      {
        id: 'fallback_4',
        name: 'T-shirt Logo Reflective',
        slug: 't-shirt-logo-reflective',
        price: 45.000,
        image: '/assets/photo_2026-01-19_06-00-51.jpg',
        rating: 4.8,
        reviewCount: 215,
        stock: 50,
        category: { id: 'cat_1', name: 'Streetwear', slug: 'streetwear' }
      },
      {
        id: 'fallback_5',
        name: 'Sneakers Urban Flow',
        slug: 'sneakers-urban-flow',
        price: 180.000,
        image: '/assets/photo_2026-01-19_06-01-56.jpg',
        rating: 4.9,
        reviewCount: 67,
        stock: 10,
        category: { id: 'cat_2', name: 'Accessoires', slug: 'accessoires' }
      }
    ]
  }

  return (
    <>
      <HeroModern />
      <ProductShowcase />
      <FeaturedProducts products={featuredProducts} />
    </>
  )
}
