import lunr from 'lunr'

export type SearchableProduct = {
  id: string
  name: string
  description: string
  category: string
  price: number
  image?: string
}

let searchIndex: lunr.Index | null = null
let productsMap: Map<string, SearchableProduct> = new Map()

export function buildSearchIndex(products: SearchableProduct[]) {
  // Store products in map for quick lookup
  productsMap = new Map(products.map((p) => [p.id, p]))

  // Build Lunr index
  searchIndex = lunr(function () {
    this.ref('id')
    this.field('name', { boost: 10 })
    this.field('description', { boost: 5 })
    this.field('category', { boost: 3 })

    products.forEach((product) => {
      this.add(product)
    })
  })

  return searchIndex
}

export function search(query: string, limit: number = 10): SearchableProduct[] {
  if (!searchIndex || !query.trim()) {
    return []
  }

  try {
    // Perform search with wildcard for partial matches
    const results = searchIndex.search(`${query}* ${query}~1`)

    // Map results to products and limit
    return results
      .slice(0, limit)
      .map((result) => productsMap.get(result.ref))
      .filter((product): product is SearchableProduct => product !== undefined)
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

export function getSearchIndex() {
  return searchIndex
}

export function clearSearchIndex() {
  searchIndex = null
  productsMap.clear()
}
