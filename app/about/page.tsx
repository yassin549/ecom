export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AboutPage() {
	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-3xl md:text-4xl font-bold mb-4">À propos</h1>
			<p className="text-muted-foreground max-w-2xl">
				ShopHub est une boutique en ligne moderne construite avec Next.js.
			</p>
		</div>
	)
}


