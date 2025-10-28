import { prisma } from "@/lib/db/prisma"
import { ProductGrid } from "@/components/products/product-grid"
import { CategoriesSidebar } from "@/components/categories/categories-sidebar"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: "Boutique - ShopHub",
  description: "Parcourez notre catalogue complet de produits",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  // Await searchParams in Next.js 16
  const params = await searchParams
  // Fetch categories with product counts
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    productCount: cat._count.products,
  }))

  // Get current category if specified
  let currentCategoryId: string | undefined
  if (params.category) {
    const category = await prisma.category.findUnique({
      where: { slug: params.category },
      select: { id: true },
    })
    currentCategoryId = category?.id
  }

  // Fetch initial products
  const where: any = {}
  if (currentCategoryId) {
    where.categoryId = currentCategoryId
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  const initialProducts = await prisma.product.findMany({
    where,
    take: 12,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      image: true,
      rating: true,
      reviewCount: true,
      stock: true,
    },
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {params.search
            ? `Résultats de recherche pour "${params.search}"`
            : params.category
            ? categories.find((c) => c.slug === params.category)?.name || "Boutique"
            : "Tous les Produits"}
        </h1>
        <p className="text-muted-foreground">
          Découvrez des produits incroyables à des prix imbattables
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <CategoriesSidebar
          categories={categoriesWithCount}
          currentCategoryId={currentCategoryId}
        />

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid
            initialProducts={initialProducts}
            categoryId={currentCategoryId}
          />
        </div>
      </div>
    </div>
  )
}
