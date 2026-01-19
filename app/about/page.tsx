"use client"

import { motion } from "framer-motion"
import { ShoppingBag, Truck, Shield, HeadphonesIcon, Award, Users, Globe, Heart } from "lucide-react"

export default function AboutPage() {
	const features = [
		{
			icon: ShoppingBag,
			title: "Large Sélection",
			description: "Des milliers de produits de qualité dans toutes les catégories"
		},
		{
			icon: Truck,
			title: "Livraison Rapide",
			description: "Livraison express dans toute la Tunisie en 24-48h"
		},
		{
			icon: Shield,
			title: "Paiement Sécurisé",
			description: "Transactions 100% sécurisées et protection des données"
		},
		{
			icon: HeadphonesIcon,
			title: "Support 24/7",
			description: "Une équipe dédiée pour répondre à toutes vos questions"
		},
		{
			icon: Award,
			title: "Qualité Garantie",
			description: "Produits authentiques avec garantie constructeur"
		},
		{
			icon: Heart,
			title: "Satisfaction Client",
			description: "Plus de 50,000 clients satisfaits nous font confiance"
		}
	]

	const stats = [
		{ value: "50K+", label: "Clients Satisfaits" },
		{ value: "10K+", label: "Produits" },
		{ value: "99%", label: "Satisfaction" },
		{ value: "24/7", label: "Support" }
	]

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Hero Section */}
			<section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
				<div className="container mx-auto relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center max-w-4xl mx-auto"
					>
						<h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase italic">
							À Propos de <span className="text-primary">Drip Shop</span>
						</h1>
						<p className="text-xl text-gray-600 mb-8 leading-relaxed">
							Votre destination shopping ultime en Tunisie. Nous offrons une expérience d'achat en ligne
							exceptionnelle avec des produits de qualité, des prix compétitifs et un service client irréprochable.
						</p>
						<div className="flex items-center justify-center gap-4 text-sm text-gray-500">
							<div className="flex items-center gap-2">
								<Globe className="h-5 w-5 text-primary" />
								<span>Fondé en 2024</span>
							</div>
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-primary" />
								<span>50,000+ Clients</span>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
				<div className="container mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								className="text-center"
							>
								<div className="text-4xl md:text-5xl font-black text-primary mb-2 italic">
									{stat.value}
								</div>
								<div className="text-gray-600 font-medium">{stat.label}</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
							Pourquoi Choisir Drip Shop ?
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Nous nous engageons à offrir la meilleure expérience d'achat en ligne
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => {
							const Icon = feature.icon
							return (
								<motion.div
									key={feature.title}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									whileHover={{ y: -5 }}
									className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all"
								>
									<div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
										<Icon className="h-7 w-7 text-primary" />
									</div>
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600">
										{feature.description}
									</p>
								</motion.div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center max-w-3xl mx-auto"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
							Notre Mission
						</h2>
						<p className="text-xl text-indigo-100 leading-relaxed">
							Rendre le shopping en ligne accessible, pratique et agréable pour tous les Tunisiens.
							Nous croyons que chacun mérite d'avoir accès à des produits de qualité à des prix justes,
							avec un service client exceptionnel.
						</p>
					</motion.div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-gray-200"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Prêt à Commencer ?
						</h2>
						<p className="text-gray-600 mb-8 max-w-2xl mx-auto">
							Découvrez notre large sélection de produits et profitez d'une expérience d'achat exceptionnelle
						</p>
						<motion.a
							href="/shop"
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
							className="inline-block px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wider"
						>
							Explorer la Boutique
						</motion.a>
					</motion.div>
				</div>
			</section>
		</div>
	)
}


