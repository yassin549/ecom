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
		} catch (error) {
			console.error("Error fetching categories on Vercel:", error)
			categories = []
		}
	} else {
		try {
			const dbCategories = await prisma.category.findMany({
				select: {
					id: true,
					name: true,
					slug: true,
					image: true,
					_count: { select: { products: true } },
				},
				orderBy: { name: 'asc' },
			})
			categories = dbCategories.map((c: any) => ({
				...c,
				products: c._count?.products ?? 0
			}))
		} catch (error) {
			console.error("Error fetching categories with Prisma:", error)
			categories = []
		}
	}

	if (categories.length === 0) {
		try {
			const { FALLBACK_CATEGORIES } = await import('@/lib/db/fallbacks')
			categories = FALLBACK_CATEGORIES as any
		} catch {
			categories = []
		}
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="mb-12">
				<h1 className="text-5xl md:text-7xl font-black mb-4 uppercase italic tracking-tighter text-foreground drop-shadow-sm">
					Nos <span className="text-primary italic">Catégories</span>
				</h1>
				<p className="text-muted-foreground text-lg font-medium max-w-2xl border-l-4 border-primary pl-6 py-2">
					Explorez nos différents styles et trouvez le drip qui vous correspond.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{categories.map((cat) => (
					<Link
						key={cat.id}
						href={`/shop?category=${cat.slug}`}
						className="group block relative overflow-hidden rounded-3xl border-2 border-border bg-card transition-all hover:border-primary hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]"
					>
						<div className="aspect-[4/5] relative overflow-hidden">
							{cat.image ? (
								<img
									src={cat.image}
									alt={cat.name}
									className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>
							) : (
								<div className="w-full h-full bg-muted flex items-center justify-center">
									<span className="text-4xl font-bold opacity-20">{cat.name.charAt(0)}</span>
								</div>
							)}
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
							<div className="absolute bottom-6 left-6 right-6">
								<h2 className="text-2xl font-black text-white uppercase italic leading-none mb-1">
									{cat.name}
								</h2>
								<div className="text-sm font-bold text-primary flex items-center gap-2">
									<span>{cat.products ?? 0} PRODUITS</span>
									<span className="w-8 h-[2px] bg-primary group-hover:w-12 transition-all" />
								</div>
							</div>
						</div>
					</Link>
				))}
				{categories.length === 0 && (
					<div className="text-muted-foreground py-20 text-center col-span-full">
						<p className="text-xl italic">Aucune catégorie trouvée.</p>
					</div>
				)}
			</div>
		</div>
	)

