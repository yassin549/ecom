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
      name: 'Hoodie Premium "Drip"',
      slug: 'hoodie-premium-drip',
      description: 'Coton haute qualité, coupe oversize premium.',
      price: 89.90,
      image: '/assets/photo_2026-01-19_05-59-10.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_05-59-10.jpg']),
      stock: 25,
      featured: true,
      rating: 4.9,
      reviewCount: 42,
      categoryId: categories[0].id,
    },
    {
      name: 'Pantalon Cargo Street',
      slug: 'pantalon-cargo-street',
      description: 'Multi-poches, style urbain authentique.',
      price: 75.00,
      image: '/assets/photo_2026-01-19_06-00-06.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-00-06.jpg']),
      stock: 30,
      featured: true,
      rating: 4.7,
      reviewCount: 28,
      categoryId: categories[0].id,
    },
    {
      name: 'Ensemble Tracksuit Pro',
      slug: 'ensemble-tracksuit-pro',
      description: 'Confort ultime et style percutant.',
      price: 145.00,
      image: '/assets/photo_2026-01-19_06-00-20.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-00-20.jpg']),
      stock: 15,
      featured: true,
      rating: 5.0,
      reviewCount: 15,
      categoryId: categories[2].id,
    },
    {
      name: 'Veste Oversize Graphique',
      slug: 'veste-oversize-graphique',
      description: 'Design exclusif, édition limitée.',
      price: 120.00,
      image: '/assets/photo_2026-01-19_06-00-30.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-00-30.jpg']),
      stock: 12,
      featured: false,
      rating: 4.8,
      reviewCount: 20,
      categoryId: categories[0].id,
    },
    {
      name: 'Bonnet Drip Signature',
      slug: 'bonnet-drip-signature',
      description: 'L\'accessoire indispensable pour l\'hiver.',
      price: 35.00,
      image: '/assets/photo_2026-01-19_06-00-44.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-00-44.jpg']),
      stock: 100,
      featured: false,
      rating: 4.5,
      reviewCount: 110,
      categoryId: categories[1].id,
    },
    {
      name: 'T-shirt Logo Reflective',
      slug: 't-shirt-logo-reflective',
      description: 'Brille dans le noir, drip 24/7.',
      price: 45.00,
      image: '/assets/photo_2026-01-19_06-00-51.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-00-51.jpg']),
      stock: 50,
      featured: true,
      rating: 4.6,
      reviewCount: 55,
      categoryId: categories[0].id,
    },
    {
      name: 'Sweat à Capuche "Midnight"',
      slug: 'sweat-capuche-midnight',
      description: 'Noir profond, broderie premium.',
      price: 95.00,
      image: '/assets/photo_2026-01-19_06-01-48.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-01-48.jpg']),
      stock: 20,
      featured: false,
      rating: 4.9,
      reviewCount: 33,
      categoryId: categories[0].id,
    },
    {
      name: 'Sneakers Urban Flow',
      slug: 'sneakers-urban-flow',
      description: 'Confort et style sur le bitume.',
      price: 180.00,
      image: '/assets/photo_2026-01-19_06-01-56.jpg',
      images: JSON.stringify(['/assets/photo_2026-01-19_06-01-56.jpg']),
      stock: 10,
      featured: true,
      rating: 4.8,
      reviewCount: 12,
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
