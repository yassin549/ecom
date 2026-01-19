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
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group transition-all">
              <span className="text-3xl font-black italic uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors drop-shadow-[0_0_8px_rgba(147,51,234,0.3)]">
                Drip <span className="text-primary">Shop</span>
              </span>
            </Link>
            <p className="text-lg text-muted-foreground mb-8 max-w-sm leading-relaxed font-medium">
              Le numéro 1 du <span className="text-foreground font-bold">streetwear premium</span> en Tunisie. Pièces limitées, style illimité.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -4 }}
                    className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-muted border-2 border-border text-foreground transition-all hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/20 shadow-inner`}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <button
              onClick={() => toggleSection('shop')}
              className="md:cursor-default flex items-center justify-between w-full md:pointer-events-none mb-6"
            >
              <h3 className="font-black uppercase italic tracking-tighter text-lg">Boutique</h3>
              <ChevronDown className={`h-5 w-5 md:hidden transition-transform ${expandedSection === 'shop' ? 'rotate-180' : ''
                }`} />
            </button>
            <AnimatePresence>
              {(expandedSection === 'shop' || isDesktop) && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3"
                >
                  {footerLinks.shop.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-0 h-[2px] bg-primary group-hover:w-3 transition-all" />
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
              className="md:cursor-default flex items-center justify-between w-full md:pointer-events-none mb-6"
            >
              <h3 className="font-black uppercase italic tracking-tighter text-lg">Entreprise</h3>
              <ChevronDown className={`h-5 w-5 md:hidden transition-transform ${expandedSection === 'company' ? 'rotate-180' : ''
                }`} />
            </button>
            <AnimatePresence>
              {(expandedSection === 'company' || isDesktop) && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3"
                >
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-0 h-[2px] bg-primary group-hover:w-3 transition-all" />
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
              className="md:cursor-default flex items-center justify-between w-full md:pointer-events-none mb-6"
            >
              <h3 className="font-black uppercase italic tracking-tighter text-lg">Support</h3>
              <ChevronDown className={`h-5 w-5 md:hidden transition-transform ${expandedSection === 'support' ? 'rotate-180' : ''
                }`} />
            </button>
            <AnimatePresence>
              {(expandedSection === 'support' || isDesktop) && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3"
                >
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-0 h-[2px] bg-primary group-hover:w-3 transition-all" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-black uppercase italic tracking-tighter text-lg mb-6">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-6 font-medium">
              Abonnez-vous pour recevoir les prochains <span className="text-primary italic font-bold">drops</span>.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-6 py-4 pr-12 text-sm border-2 border-border rounded-2xl bg-muted/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold placeholder:opacity-30"
                  required
                  aria-label="Email pour la newsletter"
                />
                <Mail className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || isSubscribed}
                className="w-full px-6 py-4 text-sm font-black uppercase italic tracking-tighter text-white bg-primary rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : isSubscribed ? (
                  "REJOINT ! ✓"
                ) : (
                  "S'abonner"
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-border pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              © {new Date().getFullYear()} DRIP SHOP TN. CRÉÉ POUR LES VRAIS.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
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
