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
            name: 'Hoodie "ESSENTIAL" Midnight Black',
            slug: 'hoodie-essential-midnight',
            description: 'Coton premium 450GSM, coupe oversize structurée. Broderie ton-sur-ton sur la poitrine. Le basique ultime du vestiaire Drip Shop.',
            price: 115.000,
            image: '/assets/photo_2026-01-19_05-59-10.jpg',
            images: JSON.stringify(['/assets/photo_2026-01-19_05-59-10.jpg']),
            stock: 50,
            featured: true,
            categoryId: 'cat_1'
        },
        {
            id: 'prod_2',
            name: 'Cargo Pant "URBAN VORTEX"',
            slug: 'cargo-urban-vortex',
            description: 'Nylon tactique déperlant, 8 poches cargo asymétriques. Système de serrage aux chevilles. Conçu pour la mobilité urbaine.',
            price: 135.000,
            image: '/assets/photo_2026-01-19_06-00-06.jpg',
            images: JSON.stringify(['/assets/photo_2026-01-19_06-00-06.jpg']),
            stock: 35,
            featured: true,
            categoryId: 'cat_1'
        },
        {
            id: 'prod_3',
            name: 'Tracksuit "PRO-LINE" Ghost Grey',
            slug: 'tracksuit-ghost-grey',
            description: 'Ensemble complet veste + pantalon. Tissu technique respirant, détails réfléchissants 3M. Style athleisure futuriste.',
            price: 210.000,
            image: '/assets/photo_2026-01-19_06-00-20.jpg',
            images: JSON.stringify(['/assets/photo_2026-01-19_06-00-20.jpg']),
            stock: 20,
            featured: true,
            categoryId: 'cat_3'
        },
        {
            id: 'prod_4',
            name: 'Veste "CYBER-SHELL" Limited',
            slug: 'veste-cyber-shell',
            description: 'Veste technique multi-couches, zippers étanches. Édition limitée à 50 exemplaires numérotés. Un condensé de technologie.',
            price: 245.000,
            image: '/assets/photo_2026-01-19_06-00-30.jpg',
            images: JSON.stringify(['/assets/photo_2026-01-19_06-00-30.jpg']),
            stock: 12,
            featured: true,
            categoryId: 'cat_1'
        },
        {
            id: 'prod_5',
            name: 'Beanies "DRIP" Heavy Knit',
            slug: 'beanie-drip-knit',
            description: 'Laine mérinos mélangée, mailles épaisses pour un confort thermique optimal. Idéal pour finir un look hivernal.',
            price: 45.000,
            image: '/assets/photo_2026-01-19_06-00-44.jpg',
            images: JSON.stringify(['/assets/photo_2026-01-19_06-00-44.jpg']),
            stock: 120,
            featured: false,
            categoryId: 'cat_2'
        },
        {
            id: 'prod_6',
            name: 'T-Shirt "CHROME" Reflective',
            slug: 'tshirt-chrome-reflective',
            description: 'Jersey de coton lourd, impression graphique réfléchissante haute intensité. Coupe boxy pour un drapé parfait.',
            price: 65.000,
            image: '/assets/photo_2026-01-19_06-00-51.jpg',
            images: JSON.stringify(['/assets/photo_2026-01-19_06-00-51.jpg']),
            stock: 80,
            featured: true,
            categoryId: 'cat_1'
        },
        {
            id: 'prod_7',
            name: 'Sneakers "FLOW-O1" Phantom',
            slug: 'sneakers-flow-01',
            description: 'Semelle ergonomique, mélange de cuir suédé et mesh technique. Une chaussure hybride entre performance et lifestyle.',
            price: 185.000,
            image: '/assets/photo_2026-01-19_06-01-56.jpg',
            images: JSON.stringify(['/assets/photo_2026-01-19_06-01-56.jpg']),
            stock: 15,
            featured: true,
            categoryId: 'cat_2'
        }
    ]

    await seedTable('Category', categories)
    await seedTable('Product', products)

    console.log('🎉 Seed finished!')
}

main()
