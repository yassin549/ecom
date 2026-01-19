export const translations = {
  // Navigation
  home: "Accueil",
  shop: "Boutique",
  categories: "Catégories",
  about: "À propos",
  profile: "Profil",
  cart: "Panier",

  // Hero Section
  heroTitle: "Découvrez des Produits Incroyables",
  heroSubtitle: "Achetez les dernières tendances en électronique, mode, décoration et plus encore. Produits de qualité à des prix imbattables.",
  searchPlaceholder: "Rechercher des produits...",
  searchButton: "Rechercher",
  shopNow: "Acheter Maintenant",
  browseCategories: "Parcourir les Catégories",

  // Stats
  products: "Produits",
  customers: "Clients",
  reviews: "Avis",

  // Product Grid
  featuredProducts: "Produits en Vedette",
  featuredSubtitle: "Découvrez notre sélection de produits premium",
  allProducts: "Tous les Produits",
  viewAll: "Voir Tous les Produits",
  addToCart: "Ajouter au Panier",
  addedToCart: "Ajouté au Panier",
  outOfStock: "Rupture de Stock",
  onlyLeft: "Seulement {count} restant",

  // Categories
  categoriesTitle: "Catégories",
  allProductsCategory: "Tous les Produits",
  viewEverything: "Tout voir",
  productsCount: "{count} produits",

  // Footer
  footerTagline: "Votre destination unique pour des produits de qualité à des prix incroyables.",
  newsletter: "Newsletter",
  newsletterText: "Abonnez-vous pour recevoir des offres spéciales et des mises à jour.",
  emailPlaceholder: "Entrez votre email",
  subscribe: "S'abonner",
  subscribed: "Abonné ! ✓",

  // Footer Links
  shopLinks: "Boutique",
  allProductsLink: "Tous les Produits",
  featured: "En Vedette",
  newArrivals: "Nouveautés",
  bestSellers: "Meilleures Ventes",

  companyLinks: "Entreprise",
  aboutUs: "À Propos",
  contact: "Contact",
  careers: "Carrières",
  blog: "Blog",

  supportLinks: "Support",
  helpCenter: "Centre d'Aide",
  shippingInfo: "Info Livraison",
  returns: "Retours",
  trackOrder: "Suivre Commande",

  legalLinks: "Légal",
  privacyPolicy: "Politique de Confidentialité",
  termsOfService: "Conditions d'Utilisation",
  cookiePolicy: "Politique des Cookies",
  refundPolicy: "Politique de Remboursement",

  copyright: "© {year} Drip Shop. Tous droits réservés.",

  // Shop Page
  searchResults: "Résultats de recherche pour \"{query}\"",
  discoverProducts: "Découvrez des produits incroyables à des prix imbattables",
  loadingMore: "Chargement de plus de produits...",
  endOfResults: "Vous avez atteint la fin du catalogue",
  noProducts: "Aucun produit trouvé",

  // Loading & Errors
  loading: "Chargement...",
  error: "Erreur",
  tryAgain: "Veuillez réessayer",
  failedToLoad: "Échec du chargement des produits. Veuillez réessayer.",

  // Accessibility
  toggleTheme: "Changer le thème",
  toggleMenu: "Basculer le menu",
  searchLabel: "Rechercher des produits",
  addToWishlist: "Ajouter aux favoris",
  shoppingCartWith: "Panier avec {count} articles",
  userProfile: "Profil utilisateur",
}

export type TranslationKey = keyof typeof translations

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  let text = translations[key]

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, String(value))
    })
  }

  return text
}
