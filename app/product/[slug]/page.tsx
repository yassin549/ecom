import { Suspense } from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductReviews } from "@/components/product/product-reviews"
import { RelatedProducts } from "@/components/product/related-products"
import { Breadcrumbs } from "@/components/product/breadcrumbs"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      image: true,
      price: true,
    },
  })

  if (!product) {
    return {
      title: "Produit non trouvé",
    }
  }

  return {
    title: `${product.name} - ShopHub`,
    description: product.description || `Achetez ${product.name} sur ShopHub`,
    openGraph: {
      title: product.name,
      description: product.description || "",
      images: product.image ? [product.image] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  // Fetch product with related data
  const product = await prisma.product.findUnique({
    where: { slug },
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

  if (!product) {
    notFound()
  }

  // Fetch related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 8,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      image: true,
      rating: true,
      reviewCount: true,
    },
  })

  // Generate gallery images (for now, using the main image multiple times)
  const galleryImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ].filter(Boolean) as string[]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Boutique", href: "/shop" },
            { label: product.category.name, href: `/shop?category=${product.category.slug}` },
            { label: product.name, href: "#" },
          ]}
        />

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* Left: Gallery */}
          <ProductGallery images={galleryImages} productName={product.name} />

          {/* Right: Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Reviews Section */}
        <Suspense fallback={<div className="py-12 text-center">Chargement des avis...</div>}>
          <ProductReviews productId={product.id} />
        </Suspense>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Suspense fallback={<div className="py-12 text-center">Chargement des produits similaires...</div>}>
            <RelatedProducts products={relatedProducts} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
