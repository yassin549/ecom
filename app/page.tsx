import { HeroModern } from "@/components/home/hero-modern"
import { FeaturedProducts } from "@/components/home/featured-products"
import { prisma } from "@/lib/db/prisma"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  // Fetch featured products dynamically
  const featuredProducts = await prisma.product.findMany({
    where: {
      featured: true,
    },
    take: 8,
    orderBy: {
      rating: 'desc',
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  return (
    <>
      <HeroModern />
      <FeaturedProducts products={featuredProducts} />
    </>
  )
}
