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
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: "Produit - ShopHub",
      description: "Découvrez nos produits",
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
    notFound()
  }

  // Fetch related products with error handling
  let relatedProducts: Array<{
    id: string
    name: string
    slug: string
    price: number
    image: string
    rating: number
    reviewCount: number
  }> = []
  
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
    // Continue without related products rather than failing
  }

  // Parse images from JSON string
  let galleryImages: string[] = []
  try {
    const parsedImages = typeof product.images === 'string' 
      ? JSON.parse(product.images) 
      : product.images
    galleryImages = Array.isArray(parsedImages) && parsedImages.length > 0
      ? parsedImages
      : [product.image, product.image, product.image].filter(Boolean)
  } catch {
    galleryImages = [product.image, product.image, product.image].filter(Boolean)
  }

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
