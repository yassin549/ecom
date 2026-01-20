import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Drip Shop database...')

  // Clear existing data first
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Streetwear',
        slug: 'streetwear',
        description: 'Le meilleur du streetwear tunisien',
        image: '/assets/photo_2026-01-19_05-59-10.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Accessoires',
        slug: 'accessoires',
        description: 'Complétez votre drip',
        image: '/assets/photo_2026-01-19_06-00-44.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Ensembles',
        slug: 'ensembles',
        description: 'Looks complets pour un style impeccable',
        image: '/assets/photo_2026-01-19_06-00-20.jpg',
      },
    }),
  ])

  console.log('✅ Categories created')

  // Create products
  const products = [
    {
      name: 'Hoodie "ESSENTIAL" Midnight Black',
      slug: 'hoodie-essential-midnight',
      description: 'Coton premium 450GSM, coupe oversize structurée. Broderie ton-sur-ton sur la poitrine. Le basique ultime du vestiaire Drip Shop.',
      price: 115.00,
      image: '/assets/photo_2026-01-19_05-59-10.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_05-59-10.jpg']),
      stock: 50,
      featured: true,
      rating: 4.9,
      reviewCount: 156,
      categoryId: categories[0].id,
    },
    {
      name: 'Cargo Pant "URBAN VORTEX"',
      slug: 'cargo-urban-vortex',
      description: 'Nylon tactique déperlant, 8 poches cargo asymétriques. Système de serrage aux chevilles. Conçu pour la mobilité urbaine.',
      price: 135.00,
      image: '/assets/photo_2026-01-19_06-00-06.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-00-06.jpg']),
      stock: 35,
      featured: true,
      rating: 4.8,
      reviewCount: 92,
      categoryId: categories[0].id,
    },
    {
      name: 'Tracksuit "PRO-LINE" Ghost Grey',
      slug: 'tracksuit-ghost-grey',
      description: 'Ensemble complet veste + pantalon. Tissu technique respirant, détails réfléchissants 3M. Style athleisure futuriste.',
      price: 210.00,
      image: '/assets/photo_2026-01-19_06-00-20.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-00-20.jpg']),
      stock: 20,
      featured: true,
      rating: 5.0,
      reviewCount: 45,
      categoryId: categories[2].id,
    },
    {
      name: 'Veste "CYBER-SHELL" Limited',
      slug: 'veste-cyber-shell',
      description: 'Veste technique multi-couches, zippers étanches. Édition limitée à 50 exemplaires numérotés. Un condensé de technologie.',
      price: 245.00,
      image: '/assets/photo_2026-01-19_06-00-30.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-00-30.jpg']),
      stock: 12,
      featured: true,
      rating: 4.9,
      reviewCount: 18,
      categoryId: categories[0].id,
    },
    {
      name: 'Beanies "DRIP" Heavy Knit',
      slug: 'beanie-drip-knit',
      description: 'Laine mérinos mélangée, mailles épaisses pour un confort thermique optimal. Idéal pour finir un look hivernal.',
      price: 45.00,
      image: '/assets/photo_2026-01-19_06-00-44.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-00-44.jpg']),
      stock: 120,
      featured: false,
      rating: 4.7,
      reviewCount: 210,
      categoryId: categories[1].id,
    },
    {
      name: 'T-Shirt "CHROME" Reflective',
      slug: 'tshirt-chrome-reflective',
      description: 'Jersey de coton lourd, impression graphique réfléchissante haute intensité. Coupe boxy pour un drapé parfait.',
      price: 65.00,
      image: '/assets/photo_2026-01-19_06-00-51.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-00-51.jpg']),
      stock: 80,
      featured: true,
      rating: 4.8,
      reviewCount: 88,
      categoryId: categories[0].id,
    },
    {
      name: 'Sneakers "FLOW-O1" Phantom',
      slug: 'sneakers-flow-01',
      description: 'Semelle ergonomique, mélange de cuir suédé et mesh technique. Une chaussure hybride entre performance et lifestyle.',
      price: 185.00,
      image: '/assets/photo_2026-01-19_06-01-56.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-01-56.jpg']),
      stock: 15,
      featured: true,
      rating: 4.9,
      reviewCount: 64,
      categoryId: categories[1].id,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log('✅ Products created')

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@dripshop.tn',
      name: 'Admin Drip',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', // password: admin123
      role: 'admin',
    },
  })

  console.log('✅ Admin user created')
  console.log('🎉 Drip Shop Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
