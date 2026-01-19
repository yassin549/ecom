"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Sparkles } from "lucide-react"
import toast from "react-hot-toast"

export default function ContactPage() {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		toast.success("Votre message a été envoyé avec succès ! Le drip arrive.")
	}

	return (
		<div className="min-h-screen bg-background py-32 pb-20 overflow-hidden text-foreground">
			<div className="container mx-auto px-4 relative z-10">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="max-w-6xl mx-auto"
				>
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 border border-primary/20 backdrop-blur-sm">
							<Sparkles className="h-4 w-4" />
							<span className="text-sm font-bold uppercase tracking-widest">On reste en contact</span>
						</div>
						<h1 className="text-6xl md:text-8xl font-black text-foreground mb-6 leading-none tracking-tighter uppercase italic">
							CONTACTEZ LE <span className="text-primary drop-shadow-[0_0_25px_rgba(147,51,234,0.5)]">STAFF</span>
						</h1>
						<p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
							Une question, une collab ou juste envie de nous dire à quel point le shop est lourd ? On vous répond en un éclair.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Contact Form */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-card p-10 rounded-[3rem] border-2 border-border shadow-2xl relative overflow-hidden group"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<form onSubmit={handleSubmit} className="relative space-y-8">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-3">
										<label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Prénom & Nom</label>
										<input
											required
											type="text"
											placeholder="Jean Dupont"
											className="w-full px-6 py-4 bg-muted/30 border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground placeholder:opacity-30"
										/>
									</div>
									<div className="space-y-3">
										<label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Email</label>
										<input
											required
											type="email"
											placeholder="jean@example.com"
											className="w-full px-6 py-4 bg-muted/30 border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground placeholder:opacity-30"
										/>
									</div>
								</div>

								<div className="space-y-3">
									<label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Sujet</label>
									<input
										required
										type="text"
										placeholder="Demande de partenariat / Question SAV"
										className="w-full px-6 py-4 bg-muted/30 border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground placeholder:opacity-30"
									/>
								</div>

								<div className="space-y-3">
									<label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Message</label>
									<textarea
										required
										rows={5}
										placeholder="Écrivez votre message ici..."
										className="w-full px-6 py-4 bg-muted/30 border-2 border-border rounded-2xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground resize-none placeholder:opacity-30"
									/>
								</div>

								<motion.button
									whileHover={{ scale: 1.02, y: -2 }}
									whileTap={{ scale: 0.98 }}
									className="w-full py-5 bg-primary text-white font-black uppercase italic tracking-tighter rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
								>
									<span>Envoyer au Staff</span>
									<Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
								</motion.button>
							</form>
						</motion.div>

						{/* Info Section */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
							className="flex flex-col gap-8"
						>
							{[
								{
									icon: Mail,
									label: "Email Support",
									value: "staff@dripshop.tn",
									desc: "Réponse en moins de 24h"
								},
								{
									icon: Phone,
									label: "Téléphone / WhatsApp",
									value: "+216 12 345 678",
									desc: "Lun - Sam, 9h - 18h"
								},
								{
									icon: MapPin,
									label: "Showroom",
									value: "Tunis, Berges du Lac 2",
									desc: "Passage sur RDV uniquement"
								}
							].map((info, idx) => (
								<div key={info.label} className="p-8 bg-card rounded-[2.5rem] border-2 border-border hover:border-primary/50 transition-all group shadow-xl">
									<div className="flex items-center gap-6">
										<div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all">
											<info.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
										</div>
										<div>
											<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{info.label}</p>
											<h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">{info.value}</h3>
											<p className="text-muted-foreground font-medium text-sm">{info.desc}</p>
										</div>
									</div>
								</div>
							))}

							<div className="flex-1 p-10 bg-gradient-to-br from-primary to-purple-800 rounded-[3rem] text-white overflow-hidden relative group">
								<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
								<h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 relative z-10">Rejoignez la <br />Communauté</h3>
								<p className="font-medium opacity-80 mb-8 relative z-10">Suivez nos drops en exclu et taguez-nous pour être reposté par le staff.</p>
								<div className="flex gap-4 relative z-10">
									<a href="#" className="p-5 bg-white/10 hover:bg-white/20 rounded-[1.25rem] transition-all">
										<Instagram className="h-6 w-6" />
									</a>
									<a href="#" className="p-5 bg-white/10 hover:bg-white/20 rounded-[1.25rem] transition-all">
										<Facebook className="h-6 w-6" />
									</a>
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</div>

			{/* Decorative Orbs */}
			<div className="fixed top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none -translate-x-1/2" />
			<div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[200px] pointer-events-none translate-x-1/4" />
		</div>
	)
}
