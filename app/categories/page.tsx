import Link from "next/link"
import { getSql } from "@/lib/vercel-db"
import { prisma } from "@/lib/db/prisma"

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Category = {
	id: string
	name: string
	slug: string
	image: string | null
	products?: number
}

export default async function CategoriesPage() {
	const isVercel = process.env.VERCEL === '1'
	let categories: Category[] = []

	if (isVercel) {
		try {
			const sql = await getSql()
			const { rows } = await sql`
				SELECT c.id, c.name, c.slug, c.image, COUNT(p.id)::int AS products
				FROM "Category" c
				LEFT JOIN "Product" p ON p."categoryId" = c.id
				GROUP BY c.id
				ORDER BY c.name ASC
			`
			categories = rows
		} catch {
			categories = []
		}
	}

	if (categories.length === 0) {
		const { FALLBACK_CATEGORIES } = await import('@/lib/db/fallbacks')
		categories = FALLBACK_CATEGORIES as any
	}
	categories = await prisma.category.findMany({
		select: {
			id: true, name: true, slug: true, image: true,
			_count: { select: { products: true } },
		},
		orderBy: { name: 'asc' },
	}) as unknown as Category[]
	categories = categories.map((c: any) => ({ ...c, products: c._count?.products ?? 0 }))
}

return (
	<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<h1 className="text-3xl md:text-4xl font-bold mb-6">Catégories</h1>
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{categories.map((cat) => (
				<Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group block border rounded-xl p-5 hover:shadow-md transition">
					<div className="font-semibold mb-1">{cat.name}</div>
					<div className="text-sm text-muted-foreground">{cat.products ?? 0} produits</div>
				</Link>
			))}
			{categories.length === 0 && (
				<div className="text-muted-foreground">Aucune catégorie trouvée.</div>
			)}
		</div>
	</div>
)
}


