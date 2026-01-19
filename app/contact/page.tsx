"use client"
import { motion } from "framer-motion"
import { Mail, Instagram, MessageCircle, Send, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
	return (
		<div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
			<div className="container mx-auto max-w-5xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-16"
				>
					<h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter uppercase italic">
						Contactez <span className="text-primary">Le Drip</span>
					</h1>
					<p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
						Besoin d'aide pour votre commande ? Contactez-nous par DM ou email.
						<br />
						<span className="text-primary font-bold">Livraison dans toute la Tunisie 🇹🇳</span>
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					{/* Contact Info */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="space-y-8"
					>
						<div className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-100 shadow-xl">
							<h2 className="text-2xl font-black mb-6 uppercase italic">Nos Réseaux</h2>
							<div className="space-y-6">
								<a href="https://tiktok.com/@drip.shop.tn" className="flex items-center gap-4 group">
									<div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
										<Send className="h-6 w-6" />
									</div>
									<div>
										<p className="text-sm text-gray-500 font-bold uppercase">TikTok</p>
										<p className="text-lg font-black italic">drip.shop.tn</p>
									</div>
								</a>
								<a href="#" className="flex items-center gap-4 group">
									<div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
										<Instagram className="h-6 w-6" />
									</div>
									<div>
										<p className="text-sm text-gray-500 font-bold uppercase">Instagram</p>
										<p className="text-lg font-black italic">@drip_shop_tn</p>
									</div>
								</a>
								<a href="#" className="flex items-center gap-4 group">
									<div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
										<MessageCircle className="h-6 w-6" />
									</div>
									<div>
										<p className="text-sm text-gray-500 font-bold uppercase">Facebook</p>
										<p className="text-lg font-black italic">Drip Shop Tn</p>
									</div>
								</a>
							</div>
						</div>

						<div className="bg-primary text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
							<div className="absolute top-0 right-0 p-8 opacity-10">
								<Truck className="h-32 w-32 rotate-12" />
							</div>
							<h3 className="text-xl font-black mb-2 uppercase">Livraison Partout</h3>
							<p className="font-bold opacity-90">Nous expédions dans tous les gouvernorats de Tunisie. Livraison rapide en 24/48h.</p>
						</div>
					</motion.div>

					{/* Simple Form or Direct Message CTA */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-black text-white p-10 rounded-3xl shadow-2xl flex flex-col justify-center items-center text-center space-y-6"
					>
						<div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
							<Mail className="h-10 w-10 text-primary" />
						</div>
						<h2 className="text-3xl font-black uppercase italic tracking-tighter">Écrivez-nous</h2>
						<p className="text-gray-400 font-bold">Pour toute question ou commande directe :</p>
						<a
							href="mailto:contact@dripshop.tn"
							className="text-2xl font-black text-primary hover:underline transition-all"
						>
							contact@dripshop.tn
						</a>
						<div className="pt-8">
							<p className="text-sm text-gray-500 mb-4 font-bold uppercase">Ou commandez directement via DM</p>
							<div className="flex gap-4">
								<div className="px-6 py-3 bg-white text-black font-black rounded-xl uppercase tracking-wider text-sm">Prêt à commander ?</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}

import { Truck } from "lucide-react"


