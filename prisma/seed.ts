import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronic devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Furniture and home decor',
        image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and fitness gear',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books',
        slug: 'books',
        description: 'Wide selection of books and magazines',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
      },
    }),
  ])

  console.log('✅ Categories created')

  // Create products
  const products = [
    {
      name: 'Wireless Headphones Pro',
      slug: 'wireless-headphones-pro',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      ]),
      stock: 50,
      featured: true,
      rating: 4.8,
      reviewCount: 124,
      categoryId: categories[0].id,
    },
    {
      name: 'Smart Watch Ultra',
      slug: 'smart-watch-ultra',
      description: 'Advanced fitness tracking with heart rate monitor and GPS',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      ]),
      stock: 35,
      featured: true,
      rating: 4.6,
      reviewCount: 89,
      categoryId: categories[0].id,
    },
    {
      name: '4K Laptop 15"',
      slug: '4k-laptop-15',
      description: 'High-performance laptop with 4K display and 16GB RAM',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      ]),
      stock: 20,
      featured: true,
      rating: 4.9,
      reviewCount: 203,
      categoryId: categories[0].id,
    },
    {
      name: 'Bluetooth Speaker',
      slug: 'bluetooth-speaker',
      description: 'Portable waterproof speaker with 360° sound',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
      ]),
      stock: 100,
      featured: false,
      rating: 4.4,
      reviewCount: 67,
      categoryId: categories[0].id,
    },
    {
      name: 'Designer Sunglasses',
      slug: 'designer-sunglasses',
      description: 'UV protection polarized sunglasses with premium frame',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
      ]),
      stock: 75,
      featured: false,
      rating: 4.5,
      reviewCount: 45,
      categoryId: categories[1].id,
    },
    {
      name: 'Leather Jacket',
      slug: 'leather-jacket',
      description: 'Genuine leather jacket with modern fit',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      ]),
      stock: 30,
      featured: true,
      rating: 4.7,
      reviewCount: 92,
      categoryId: categories[1].id,
    },
    {
      name: 'Running Shoes',
      slug: 'running-shoes',
      description: 'Lightweight running shoes with cushioned sole',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      ]),
      stock: 60,
      featured: false,
      rating: 4.6,
      reviewCount: 156,
      categoryId: categories[1].id,
    },
    {
      name: 'Canvas Backpack',
      slug: 'canvas-backpack',
      description: 'Durable canvas backpack with laptop compartment',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      ]),
      stock: 85,
      featured: false,
      rating: 4.3,
      reviewCount: 78,
      categoryId: categories[1].id,
    },
    {
      name: 'Modern Desk Lamp',
      slug: 'modern-desk-lamp',
      description: 'LED desk lamp with adjustable brightness and color temperature',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      ]),
      stock: 120,
      featured: false,
      rating: 4.4,
      reviewCount: 34,
      categoryId: categories[2].id,
    },
    {
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description: 'Comfortable office chair with lumbar support',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
      ]),
      stock: 25,
      featured: true,
      rating: 4.8,
      reviewCount: 167,
      categoryId: categories[2].id,
    },
    {
      name: 'Coffee Maker Deluxe',
      slug: 'coffee-maker-deluxe',
      description: 'Programmable coffee maker with thermal carafe',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
      ]),
      stock: 45,
      featured: false,
      rating: 4.5,
      reviewCount: 112,
      categoryId: categories[2].id,
    },
    {
      name: 'Decorative Wall Art',
      slug: 'decorative-wall-art',
      description: 'Modern abstract canvas wall art set of 3',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
      ]),
      stock: 40,
      featured: false,
      rating: 4.2,
      reviewCount: 56,
      categoryId: categories[2].id,
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Non-slip yoga mat with carrying strap',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      ]),
      stock: 90,
      featured: false,
      rating: 4.6,
      reviewCount: 143,
      categoryId: categories[3].id,
    },
    {
      name: 'Dumbbell Set',
      slug: 'dumbbell-set',
      description: 'Adjustable dumbbell set 5-50 lbs',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      ]),
      stock: 35,
      featured: true,
      rating: 4.7,
      reviewCount: 98,
      categoryId: categories[3].id,
    },
    {
      name: 'Tennis Racket Pro',
      slug: 'tennis-racket-pro',
      description: 'Professional tennis racket with carbon fiber frame',
      price: 179.99,
      image: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800',
      ]),
      stock: 28,
      featured: false,
      rating: 4.5,
      reviewCount: 71,
      categoryId: categories[3].id,
    },
    {
      name: 'Cycling Helmet',
      slug: 'cycling-helmet',
      description: 'Lightweight cycling helmet with ventilation',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800',
      ]),
      stock: 55,
      featured: false,
      rating: 4.4,
      reviewCount: 82,
      categoryId: categories[3].id,
    },
    {
      name: 'The Great Novel',
      slug: 'the-great-novel',
      description: 'Bestselling fiction novel of the year',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
      ]),
      stock: 150,
      featured: false,
      rating: 4.8,
      reviewCount: 234,
      categoryId: categories[4].id,
    },
    {
      name: 'Programming Guide',
      slug: 'programming-guide',
      description: 'Complete guide to modern web development',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
      ]),
      stock: 80,
      featured: true,
      rating: 4.9,
      reviewCount: 189,
      categoryId: categories[4].id,
    },
    {
      name: 'Cookbook Collection',
      slug: 'cookbook-collection',
      description: 'Collection of 500 delicious recipes',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      ]),
      stock: 65,
      featured: false,
      rating: 4.6,
      reviewCount: 145,
      categoryId: categories[4].id,
    },
    {
      name: 'Travel Journal',
      slug: 'travel-journal',
      description: 'Leather-bound travel journal with world map',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
      ]),
      stock: 110,
      featured: false,
      rating: 4.3,
      reviewCount: 67,
      categoryId: categories[4].id,
    },
  ]

  await prisma.product.createMany({ data: products })
  console.log('✅ Products created')

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ecom.com',
      name: 'Admin User',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', // password: admin123
      role: 'admin',
    },
  })

  // Create regular users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John Doe',
        password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', // password: admin123
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', // password: admin123
        role: 'user',
      },
    }),
  ])

  console.log('✅ Users created')

  // Create some sample orders
  const allProducts = await prisma.product.findMany()

  await prisma.order.create({
    data: {
      userId: users[0].id,
      total: 429.98,
      status: 'delivered',
      shippingAddress: '123 Main St, New York, NY 10001',
      paymentMethod: 'pay-on-delivery',
      items: {
        create: [
          {
            productId: allProducts[0].id,
            quantity: 1,
            price: allProducts[0].price,
          },
          {
            productId: allProducts[4].id,
            quantity: 1,
            price: allProducts[4].price,
          },
        ],
      },
    },
  })

  await prisma.order.create({
    data: {
      userId: users[1].id,
      total: 1299.99,
      status: 'processing',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
      paymentMethod: 'pay-on-delivery',
      items: {
        create: [
          {
            productId: allProducts[2].id,
            quantity: 1,
            price: allProducts[2].price,
          },
        ],
      },
    },
  })

  console.log('✅ Orders created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
