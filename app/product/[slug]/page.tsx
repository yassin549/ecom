import { Suspense } from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductReviewsDynamic } from "@/components/product/product-reviews-dynamic"
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

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        name: true,
        description: true,
        image: true,
        price: true,
      },
    })

    const { FALLBACK_PRODUCTS } = await import('@/lib/db/fallbacks')
    const fallbackProduct = FALLBACK_PRODUCTS.find(p => p.slug === slug)

    if (fallbackProduct) {
      return {
        title: `${fallbackProduct.name} - Drip Shop`,
        description: fallbackProduct.description || `Achetez ${fallbackProduct.name} sur Drip Shop`,
        openGraph: {
          title: fallbackProduct.name,
          description: fallbackProduct.description || "",
          images: fallbackProduct.image ? [fallbackProduct.image] : [],
        },
      }
    }

    return {
      title: "Produit - Drip Shop",
      description: "Découvrez nos produits",
    }
  } catch (error) {
    return {
      title: "Drip Shop",
      description: "Streetwear Premium",
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  // Fetch product with related data with error handling
  let product
  try {
    product = await prisma.product.findUnique({
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
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to load product. Please try again.')
  }

  if (!product) {
    try {
      const { FALLBACK_PRODUCTS } = await import('@/lib/db/fallbacks')
      product = FALLBACK_PRODUCTS.find(p => p.slug === slug) as any
    } catch (e) {
      console.error('Fallback failed:', e)
    }
  }

  if (!product) {
    notFound()
  }

  // Fetch related products with error handling
  let relatedProducts: any[] = []

  try {
    relatedProducts = await prisma.product.findMany({
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
  } catch (error) {
    console.error('Error fetching related products:', error)
    // Try fallback related products
    try {
      const { FALLBACK_PRODUCTS } = await import('@/lib/db/fallbacks')
      relatedProducts = FALLBACK_PRODUCTS.filter(p => p.categoryId === product!.categoryId && p.id !== product!.id).slice(0, 4)
    } catch {
      relatedProducts = []
    }
  }

  // Parse images from JSON string
  let galleryImages: string[] = []
  try {
    const parsedImages = typeof product.images === 'string'
      ? JSON.parse(product.images)
      : product.images
    galleryImages = Array.isArray(parsedImages) && parsedImages.length > 0
      ? parsedImages
      : [product.image, product.image, product.image].filter(Boolean) as string[]
  } catch {
    galleryImages = [product.image, product.image, product.image].filter(Boolean) as string[]
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Boutique", href: "/shop" },
            { label: product.category?.name || "Catégorie", href: `/shop?category=${product.category?.slug || ''}` },
            { label: product.name, href: "#" },
          ]}
        />

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* Left: Gallery */}
          <ProductGallery images={galleryImages} productName={product.name} />

          {/* Right: Product Info */}
          <ProductInfo product={product as any} />
        </div>

        {/* Reviews Section */}
        <ProductReviewsDynamic productId={product.id} />

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
