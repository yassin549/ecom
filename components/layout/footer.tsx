"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Facebook, Twitter, Instagram, Youtube, Mail, ChevronDown, Phone, MapPin } from "lucide-react"

export function Footer() {
  const pathname = usePathname()
  // Do not render the public footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Check if desktop on mount and window resize
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitting(false)
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const footerLinks = {
    shop: [
      { name: "Tous les Produits", href: "/shop" },
      { name: "En Vedette", href: "/shop?featured=true" },
      { name: "Nouveautés", href: "/shop?sort=newest" },
      { name: "Meilleures Ventes", href: "/shop?sort=popular" },
    ],
    company: [
      { name: "À Propos", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Carrières", href: "/careers" },
      { name: "Blog", href: "/blog" },
    ],
    support: [
      { name: "Centre d'Aide", href: "/help" },
      { name: "Info Livraison", href: "/shipping" },
      { name: "Retours", href: "/returns" },
      { name: "Suivre Commande", href: "/track" },
    ],
    legal: [
      { name: "Politique de Confidentialité", href: "/privacy" },
      { name: "Conditions d'Utilisation", href: "/terms" },
      { name: "Politique des Cookies", href: "/cookies" },
      { name: "Politique de Remboursement", href: "/refund" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-500" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-600" },
  ]

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ShopHub
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Votre destination unique pour des produits de qualité à des prix incroyables.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotateY: 180 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center justify-center w-9 h-9 rounded-full bg-accent text-muted-foreground transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <button
              onClick={() => toggleSection('shop')}
              className="md:cursor-default flex items-center justify-between w-full md:pointer-events-none"
            >
              <h3 className="font-semibold mb-4">Boutique</h3>
              <ChevronDown className={`h-5 w-5 md:hidden transition-transform ${
                expandedSection === 'shop' ? 'rotate-180' : ''
              }`} />
            </button>
            <AnimatePresence>
              {(expandedSection === 'shop' || isDesktop) && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 md:block"
                >
                  {footerLinks.shop.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Company Links */}
          <div>
            <button
              onClick={() => toggleSection('company')}
              className="md:cursor-default flex items-center justify-between w-full md:pointer-events-none"
            >
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ChevronDown className={`h-5 w-5 md:hidden transition-transform ${
                expandedSection === 'company' ? 'rotate-180' : ''
              }`} />
            </button>
            <AnimatePresence>
              {(expandedSection === 'company' || isDesktop) && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 md:block"
                >
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Support Links */}
          <div>
            <button
              onClick={() => toggleSection('support')}
              className="md:cursor-default flex items-center justify-between w-full md:pointer-events-none"
            >
              <h3 className="font-semibold mb-4">Support</h3>
              <ChevronDown className={`h-5 w-5 md:hidden transition-transform ${
                expandedSection === 'support' ? 'rotate-180' : ''
              }`} />
            </button>
            <AnimatePresence>
              {(expandedSection === 'support' || isDesktop) && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 md:block"
                >
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Abonnez-vous pour recevoir des offres spéciales et des mises à jour.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre email"
                  className="w-full px-4 py-2 pr-10 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  aria-label="Email pour la newsletter"
                />
                <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || isSubscribed}
                className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : isSubscribed ? (
                  "Abonné ! ✓"
                ) : (
                  "S'abonner"
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ShopHub. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
