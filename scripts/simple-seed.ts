import { categories, products, query } from '../lib/db/simple-db'

async function main() {
    console.log('🌱 Seeding Drip Shop database (Simple SQL Mode)...')

    try {
        console.log('🔗 Testing connection...')
        const testResult = await query('SELECT 1 as test')
        console.log('✅ Connection test OK:', testResult)

        // Clear existing data - order is important
        console.log('🧹 Clearing old data...')
        await query('DELETE FROM "OrderItem"')
        await query('DELETE FROM "Order"')
        await query('DELETE FROM "CartItem"')
        await query('DELETE FROM "Cart"')
        await query('DELETE FROM "Review"')
        await query('DELETE FROM "Product"')
        await query('DELETE FROM "Category"')
        await query('DELETE FROM "User"')
        console.log('✅ Base tables cleared')

        // Create categories
        const catData = [
            { id: 'cat_1', name: 'Streetwear', slug: 'streetwear', description: 'Le meilleur du streetwear tunisien', image: '/assets/photo_2026-01-19_05-59-10.jpg' },
            { id: 'cat_2', name: 'Accessoires', slug: 'accessoires', description: 'Complétez votre drip', image: '/assets/photo_2026-01-19_06-00-44.jpg' },
            { id: 'cat_3', name: 'Ensembles', slug: 'ensembles', description: 'Looks complets pour un style impeccable', image: '/assets/photo_2026-01-19_06-00-20.jpg' }
        ]

        console.log('📁 Creating categories...')
        for (const cat of catData) {
            await categories.create(cat)
            console.log(`   - Category ${cat.name} created`)
        }

        // Create products
        const productData = [
            {
                id: 'prod_1',
                name: 'Hoodie Premium "Drip"',
                slug: 'hoodie-premium-drip',
                description: 'Coton haute qualité, coupe oversize premium.',
                price: 89.900,
                image: '/assets/photo_2026-01-19_05-59-10.jpg',
                images: JSON.stringify(['/assets/photo_2026-01-19_05-59-10.jpg']),
                stock: 25,
                featured: true,
                categoryId: 'cat_1'
            },
            {
                id: 'prod_2',
                name: 'Pantalon Cargo Street',
                slug: 'pantalon-cargo-street',
                description: 'Multi-poches, style urbain authentique.',
                price: 75.000,
                image: '/assets/photo_2026-01-19_06-00-06.jpg',
                images: JSON.stringify(['/assets/photo_2026-01-19_06-00-06.jpg']),
                stock: 30,
                featured: true,
                categoryId: 'cat_1'
            },
            {
                id: 'prod_3',
                name: 'Ensemble Tracksuit Pro',
                slug: 'ensemble-tracksuit-pro',
                description: 'Confort ultime et style percutant.',
                price: 145.000,
                image: '/assets/photo_2026-01-19_06-00-20.jpg',
                images: JSON.stringify(['/assets/photo_2026-01-19_06-00-20.jpg']),
                stock: 15,
                featured: true,
                categoryId: 'cat_3'
            },
            {
                id: 'prod_4',
                name: 'Veste Oversize Graphique',
                slug: 'veste-oversize-graphique',
                description: 'Design exclusif, édition limitée.',
                price: 120.000,
                image: '/assets/photo_2026-01-19_06-00-30.jpg',
                images: JSON.stringify(['/assets/photo_2026-01-19_06-00-30.jpg']),
                stock: 12,
                featured: false,
                categoryId: 'cat_1'
            },
            {
                id: 'prod_5',
                name: 'Bonnet Drip Signature',
                slug: 'bonnet-drip-signature',
                description: "L'accessoire indispensable pour l'hiver.",
                price: 35.000,
                image: '/assets/photo_2026-01-19_06-00-44.jpg',
                images: JSON.stringify(['/assets/photo_2026-01-19_06-00-44.jpg']),
                stock: 100,
                featured: false,
                categoryId: 'cat_2'
            },
            {
                id: 'prod_6',
                name: 'T-shirt Logo Reflective',
                slug: 't-shirt-logo-reflective',
                description: 'Brille dans le noir, drip 24/7.',
                price: 45.000,
                image: '/assets/photo_2026-01-19_06-00-51.jpg',
                images: JSON.stringify(['/assets/photo_2026-01-19_06-00-51.jpg']),
                stock: 50,
                featured: true,
                categoryId: 'cat_1'
            },
            {
                id: 'prod_7',
                name: 'Sweat à Capuche "Midnight"',
                slug: 'sweat-capuche-midnight',
                description: 'Noir profond, broderie premium.',
                price: 95.000,
                image: '/assets/photo_2026-01-19_06-01-48.jpg',
                images: JSON.stringify(['/assets/photo_2026-01-19_06-01-48.jpg']),
                stock: 20,
                featured: false,
                categoryId: 'cat_1'
            },
            {
                id: 'prod_8',
                name: 'Sneakers Urban Flow',
                slug: 'sneakers-urban-flow',
                description: 'Confort et style sur le bitume.',
                price: 180.000,
                image: '/assets/photo_2026-01-19_06-01-56.jpg',
                images: JSON.stringify(['/assets/photo_2026-01-19_06-01-56.jpg']),
                stock: 10,
                featured: true,
                categoryId: 'cat_2'
            },
        ]

        console.log('👕 Creating products...')
        for (const prod of productData) {
            await products.create(prod)
            console.log(`   - Product ${prod.name} created`)
        }

        // Create admin user
        console.log('👤 Creating admin user...')
        const adminPass = '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u'
        await query(`
      INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    `, ['admin_1', 'admin@dripshop.tn', 'Admin Drip', adminPass, 'admin'])

        console.log('🎉 Drip Shop Database seeded successfully!')

    } catch (error) {
        console.error('❌ Seeding failed:', error)
        process.exit(1)
    }
}

main()
