import { prisma } from "@/lib/db/prisma"
import { getSql } from "@/lib/vercel-db"
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
  const isVercel = process.env.VERCEL === '1'

  // Fetch categories with product counts
  let categories: Array<{ id: string; name: string; slug: string; image: string | null; _count: { products: number } }> = []
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

  let initialProducts: Array<{ id: string; name: string; slug: string; price: number; image: string; rating: number; reviewCount: number; stock: number }> = []
  if (isVercel) {
    try {
      const sql = await getSql()
      const clauses: any[] = []
      if (currentCategoryId) {
        clauses.push(sql`p."categoryId" = ${currentCategoryId}`)
      }
      if (params.search) {
        const q = `%${params.search}%`
        clauses.push(sql`(p.name ILIKE ${q} OR p.description ILIKE ${q})`)
      }
      const whereSql = clauses.length ? sql`WHERE ${sql.join(clauses, sql` AND `)}` : sql``
      const { rows } = await sql`
        SELECT p.id, p.name, p.slug, p.price, p.image, p.rating, p."reviewCount", p.stock
        FROM "Product" p
        ${whereSql}
        ORDER BY p."createdAt" DESC
        LIMIT 12
      `
      initialProducts = rows
      if (initialProducts.length === 0) {
        const { FALLBACK_PRODUCTS } = await import('@/lib/db/fallbacks')
        initialProducts = FALLBACK_PRODUCTS as any
      }

      if (categories.length === 0) {
        const { FALLBACK_CATEGORIES } = await import('@/lib/db/fallbacks')
        categories = FALLBACK_CATEGORIES.map(c => ({
          ...c,
          image: c.image || null,
          _count: { products: (c as any).products || 0 }
        }))
      }
    } catch (error) {
      console.error("Error fetching products on Vercel:", error)
      initialProducts = []
    }
  } else {
    initialProducts = await prisma.product.findMany({
      where,
      take: 12,
      orderBy: { createdAt: 'desc' },
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
  }

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    productCount: cat._count.products,
  }))

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {params.search
            ? `Résultats de recherche pour "${params.search}"`
            : params.category
              ? categoriesWithCount.find((c) => c.slug === params.category)?.name || "Boutique"
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
