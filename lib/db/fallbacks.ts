export const FALLBACK_CATEGORIES = [
    { id: 'cat_1', name: 'Streetwear', slug: 'streetwear', description: 'Le meilleur du streetwear tunisien', image: '/assets/photo_2026-01-19_05-59-10.jpg', products: 12 },
    { id: 'cat_2', name: 'Accessoires', slug: 'accessoires', description: 'Complétez votre drip', image: '/assets/photo_2026-01-19_06-00-44.jpg', products: 8 },
    { id: 'cat_3', name: 'Ensembles', slug: 'ensembles', description: 'Looks complets pour un style impeccable', image: '/assets/photo_2026-01-19_06-00-20.jpg', products: 5 }
]

export const FALLBACK_PRODUCTS = [
    {
        id: 'fallback_1',
        name: 'Hoodie Premium "Drip"',
        slug: 'hoodie-premium-drip',
        description: 'Coton haute qualité, coupe oversize premium.',
        price: 89.900,
        image: '/assets/photo_2026-01-19_05-59-10.jpg',
        rating: 4.9,
        reviewCount: 128,
        stock: 25,
        featured: true,
        categoryId: 'cat_1',
        category: { id: 'cat_1', name: 'Streetwear', slug: 'streetwear' }
    },
    {
        id: 'fallback_2',
        name: 'Pantalon Cargo Street',
        slug: 'pantalon-cargo-street',
        description: 'Multi-poches, style urbain authentique.',
        price: 75.000,
        image: '/assets/photo_2026-01-19_06-00-06.jpg',
        rating: 4.7,
        reviewCount: 85,
        stock: 30,
        featured: true,
        categoryId: 'cat_1',
        category: { id: 'cat_1', name: 'Streetwear', slug: 'streetwear' }
    },
    {
        id: 'fallback_3',
        name: 'Ensemble Tracksuit Pro',
        slug: 'ensemble-tracksuit-pro',
        description: 'Confort ultime et style percutant.',
        price: 145.000,
        image: '/assets/photo_2026-01-19_06-00-20.jpg',
        rating: 5.0,
        reviewCount: 42,
        stock: 15,
        featured: true,
        categoryId: 'cat_3',
        category: { id: 'cat_3', name: 'Ensembles', slug: 'ensembles' }
    },
    {
        id: 'fallback_4',
        name: 'T-shirt Logo Reflective',
        slug: 't-shirt-logo-reflective',
        description: 'Brille dans le noir, drip 24/7.',
        price: 45.000,
        image: '/assets/photo_2026-01-19_06-00-51.jpg',
        rating: 4.8,
        reviewCount: 215,
        stock: 50,
        featured: true,
        categoryId: 'cat_1',
        category: { id: 'cat_1', name: 'Streetwear', slug: 'streetwear' }
    },
    {
        id: 'fallback_5',
        name: 'Sneakers Urban Flow',
        slug: 'sneakers-urban-flow',
        description: 'Confort et style sur le bitume.',
        price: 180.000,
        image: '/assets/photo_2026-01-19_06-01-56.jpg',
        rating: 4.9,
        reviewCount: 67,
        stock: 10,
        featured: true,
        categoryId: 'cat_2',
        category: { id: 'cat_2', name: 'Accessoires', slug: 'accessoires' }
    }
]
