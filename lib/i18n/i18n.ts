/**
 * Internationalization stubs
 * Expand with full i18n library in production (next-intl, react-i18next)
 */

type Language = 'fr' | 'en' | 'ar'

const translations = {
  fr: {
    common: {
      welcome: 'Bienvenue',
      search: 'Rechercher',
      cart: 'Panier',
      checkout: 'Commander',
      total: 'Total',
      loading: 'Chargement...',
    },
    product: {
      addToCart: 'Ajouter au panier',
      outOfStock: 'Rupture de stock',
      inStock: 'En stock',
    },
  },
  en: {
    common: {
      welcome: 'Welcome',
      search: 'Search',
      cart: 'Cart',
      checkout: 'Checkout',
      total: 'Total',
      loading: 'Loading...',
    },
    product: {
      addToCart: 'Add to cart',
      outOfStock: 'Out of stock',
      inStock: 'In stock',
    },
  },
  ar: {
    common: {
      welcome: 'مرحبا',
      search: 'بحث',
      cart: 'عربة التسوق',
      checkout: 'الدفع',
      total: 'المجموع',
      loading: 'جار التحميل...',
    },
    product: {
      addToCart: 'أضف إلى السلة',
      outOfStock: 'نفذ من المخزون',
      inStock: 'متوفر',
    },
  },
}

let currentLanguage: Language = 'fr'

export function t(key: string, variables?: Record<string, string>): string {
  const keys = key.split('.')
  let value: any = translations[currentLanguage]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  if (!value) {
    return key
  }
  
  // Replace variables
  if (variables) {
    return Object.entries(variables).reduce(
      (str, [key, val]) => str.replace(`{{${key}}}`, val),
      value
    )
  }
  
  return value
}

export function setLanguage(lang: Language) {
  currentLanguage = lang
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }
}

export function getLanguage(): Language {
  return currentLanguage
}
