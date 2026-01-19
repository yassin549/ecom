"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

const showcaseImages = [
    { src: "/assets/photo_2026-01-19_05-59-10.jpg", alt: "Drip Shop Item 1", className: "col-span-2 row-span-2" },
    { src: "/assets/photo_2026-01-19_06-00-06.jpg", alt: "Drip Shop Item 2", className: "col-span-1 row-span-1" },
    { src: "/assets/photo_2026-01-19_06-00-20.jpg", alt: "Drip Shop Item 3", className: "col-span-1 row-span-1" },
    { src: "/assets/photo_2026-01-19_06-00-30.jpg", alt: "Drip Shop Item 4", className: "col-span-1 row-span-2" },
    { src: "/assets/photo_2026-01-19_06-00-44.jpg", alt: "Drip Shop Item 5", className: "col-span-1 row-span-1" },
    { src: "/assets/photo_2026-01-19_06-00-51.jpg", alt: "Drip Shop Item 6", className: "col-span-1 row-span-1" },
]

export function ProductShowcase() {
    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-4">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">Notre Collection Exclusive</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tighter">
                        LE <span className="text-primary">DRIP</span> ULTIME
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explorez notre nouvelle gamme de produits sélectionnés avec soin pour votre style unique.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-4 h-[600px] md:h-[800px]">
                    {showcaseImages.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative overflow-hidden rounded-3xl group ${image.className}`}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="px-4 py-2 bg-background/90 backdrop-blur text-foreground font-bold rounded-full text-sm shadow-xl">
                                    Voir Plus
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
