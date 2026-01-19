"use client"

import { motion } from "framer-motion"
import { Award, ShoppingBag, Truck, ShieldCheck, Sparkles, Instagram, Facebook } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
	const values = [
		{
			icon: Award,
			title: "Qualité Premium",
			desc: "Nous sélectionnons uniquement les meilleurs matériaux pour nos produits."
		},
		{
			icon: Truck,
			title: "Livraison Rapide",
			desc: "Partout en Tunisie, recevez votre colis en 24/48h."
		},
		{
			icon: ShieldCheck,
			title: "Service Client",
			desc: "Une équipe dédiée pour répondre à toutes vos questions."
		}
	]

	return (
		<div className="min-h-screen bg-background py-32 px-4 sm:px-6 lg:px-8">
			<div className="container mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-20"
				>
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 border border-primary/20 backdrop-blur-sm">
						<Sparkles className="h-4 w-4" />
						<span className="text-sm font-bold uppercase tracking-widest">L'essence du Drip</span>
					</div>
					<h1 className="text-6xl md:text-8xl font-black text-foreground mb-6 leading-none tracking-tighter uppercase italic">
						NOTRE <span className="text-primary drop-shadow-[0_0_25px_rgba(147,51,234,0.5)]">STORY</span>
					</h1>
					<p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto">
						Plus qu'une boutique, une culture. Drip Shop est né de la passion pour le streetwear authentique et le style sans compromis.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
					{values.map((v, idx) => (
						<motion.div
							key={v.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: idx * 0.1 }}
							className="p-10 bg-card rounded-[3rem] border-2 border-border hover:border-primary/50 transition-all group shadow-xl"
						>
							<div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary transition-all">
								<v.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
							</div>
							<h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter mb-4">{v.title}</h3>
							<p className="text-muted-foreground font-medium">{v.desc}</p>
						</motion.div>
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="relative"
					>
						<div className="aspect-square rounded-[3rem] overflow-hidden border-2 border-border shadow-2xl">
							<img
								src="/assets/logo.jpg"
								alt="Drip Shop Culture"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary rounded-full flex items-center justify-center p-8 text-white font-black uppercase italic tracking-tighter text-center rotate-12 shadow-2xl">
							EST. 2024
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="space-y-8"
					>
						<h2 className="text-4xl md:text-5xl font-black text-foreground uppercase italic tracking-tighter">
							LA <span className="text-primary italic">MISSION</span>
						</h2>
						<p className="text-lg text-muted-foreground font-medium leading-relaxed">
							Nous parcourons les tendances pour vous apporter les pièces les plus exclusives. Notre objectif est simple : permettre à chaque tunisien de s'exprimer à travers son style, sans barrière géographique.
						</p>
						<div className="flex gap-6 pt-4">
							<a href="#" className="p-4 bg-muted border-2 border-border rounded-2xl hover:border-primary hover:text-primary transition-all group">
								<Instagram className="h-6 w-6 group-hover:scale-110 transition-transform" />
							</a>
							<a href="#" className="p-4 bg-muted border-2 border-border rounded-2xl hover:border-primary hover:text-primary transition-all group">
								<Facebook className="h-6 w-6 group-hover:scale-110 transition-transform" />
							</a>
						</div>
						<div className="pt-8">
							<Link href="/shop">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="px-10 py-5 bg-primary text-white font-black uppercase italic tracking-tighter rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-3"
								>
									<ShoppingBag className="h-5 w-5" />
									Explorer la Collection
								</motion.button>
							</Link>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	)
}
