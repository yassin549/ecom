const SUPABASE_URL = "https://pumbdvvzrpqpheefietj.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bWJkdnZ6cnBxcGhlZWZpZXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzQ1MDYsImV4cCI6MjA3NzIxMDUwNn0.DvEnqdn4zMaTIfkdxxx9BvDHrmsWkIb9wgRodltDfcg"

async function seedTable(table, data) {
    console.log(`📁 Seeding ${table}...`)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const error = await response.text()
        console.error(`❌ Failed to seed ${table}:`, error)
    } else {
        console.log(`✅ ${table} seeded successfully`)
    }
}

async function main() {
    console.log('🚀 Starting Supabase HTTP Seed...')

    const categories = [
        { id: 'cat_1', name: 'Streetwear', slug: 'streetwear', description: 'Le meilleur du streetwear tunisien', image: '/assets/photo_2026-01-19_05-59-10.jpg' },
        { id: 'cat_2', name: 'Accessoires', slug: 'accessoires', description: 'Complétez votre drip', image: '/assets/photo_2026-01-19_06-00-44.jpg' },
        { id: 'cat_3', name: 'Ensembles', slug: 'ensembles', description: 'Looks complets pour un style impeccable', image: '/assets/photo_2026-01-19_06-00-20.jpg' }
    ]

    const products = [
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
        }
    ]

    await seedTable('Category', categories)
    await seedTable('Product', products)

    console.log('🎉 Seed finished!')
}

main()
