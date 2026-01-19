import { prisma } from "@/lib/db/prisma"
import { getSql } from "@/lib/vercel-db"
import { ProductGrid } from "@/components/products/product-grid"
import { CategoriesSidebar } from "@/components/categories/categories-sidebar"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: "Boutique - Drip Shop",
  description: "Parcourez notre catalogue complet de streetwear premium",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  // Await searchParams in Next.js 16
  const params = await searchParams
  const isVercel = process.env.VERCEL === '1'

  // Fetch categories with product counts
  let categories: any[] = []
  if (isVercel) {
    try {
      const sql = await getSql()
      const { rows } = await sql`
        SELECT c.id, c.name, c.slug, c.image,
               COUNT(p.id)::int AS products
        FROM "Category" c
        LEFT JOIN "Product" p ON p."categoryId" = c.id
        GROUP BY c.id
        ORDER BY c.name ASC
      `
      categories = rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        image: r.image,
        _count: { products: r.products },
      }))
    } catch {
      categories = []
    }
  } else {
    categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    })
  }

  // Get current category if specified
  let currentCategoryId: string | undefined
  if (params.category) {
    if (isVercel) {
      try {
        const sql = await getSql()
        const { rows } = await sql`SELECT id FROM "Category" WHERE slug = ${params.category}`
        currentCategoryId = rows[0]?.id
      } catch {
        currentCategoryId = undefined
      }
    } else {
      const category = await prisma.category.findUnique({
        where: { slug: params.category },
        select: { id: true },
      })
      currentCategoryId = category?.id
    }
  }

  // Fetch initial products
  let initialProducts: any[] = []
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

  if (isVercel) {
    try {
      const sql = await getSql()
      const { rows } = await sql`
        SELECT * FROM "Product" 
        WHERE (${currentCategoryId ? ` "categoryId" = ${currentCategoryId} ` : '1=1'})
        AND (${params.search ? `(name ILIKE ${'%' + params.search + '%'} OR description ILIKE ${'%' + params.search + '%'})` : '1=1'})
        LIMIT 12
      `
      initialProducts = rows
    } catch {
      initialProducts = []
    }
  } else {
    initialProducts = await prisma.product.findMany({
      where,
      take: 12,
      orderBy: { createdAt: 'desc' },
    })
  }

  // Unified Fallback Logic
  if (initialProducts.length === 0) {
    try {
      const { FALLBACK_PRODUCTS } = await import('@/lib/db/fallbacks')
      initialProducts = FALLBACK_PRODUCTS as any
    } catch {
      initialProducts = []
    }
  }

  if (categories.length === 0) {
    try {
      const { FALLBACK_CATEGORIES } = await import('@/lib/db/fallbacks')
      categories = FALLBACK_CATEGORIES.map(c => ({
        ...c,
        image: c.image || null,
        _count: { products: (c as any).products || 0 }
      }))
    } catch {
      categories = []
    }
  }

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    productCount: cat._count?.products ?? (cat as any).products ?? 0,
  }))

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase italic tracking-tighter text-foreground drop-shadow-sm">
          {params.search ? (
            <>Recherche: <span className="text-primary">"{params.search}"</span></>
          ) : params.category ? (
            categoriesWithCount.find((c) => c.slug === params.category)?.name || "Boutique"
          ) : (
            <>Le <span className="text-primary italic">Drip</span> Shop</>
          )}
        </h1>
        <p className="text-muted-foreground text-lg font-medium max-w-2xl border-l-4 border-primary pl-6 py-2">
          Découvrez notre collection exclusive de streetwear premium. Pièces limitées, style illimité.
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
