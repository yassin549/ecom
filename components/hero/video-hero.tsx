"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useConnectionQuality } from "@/lib/utils/bandwidth"

export function VideoHero() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { shouldLoadVideo } = useConnectionQuality()
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 1.1])

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        setVideoError(true)
      })
    }
  }, [shouldLoadVideo])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Video Background */}
      {shouldLoadVideo && !videoError ? (
        <motion.video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          style={{ scale }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-41481-large.mp4"
            type="video/mp4"
          />
        </motion.video>
      ) : (
        // Fallback Image
        <motion.div style={{ scale }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
            alt="Hero"
            fill
            className="object-cover"
            priority
            quality={shouldLoadVideo ? 85 : 75}
          />
        </motion.div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative h-full flex flex-col items-center justify-center text-white px-4"
      >
        {/* Headline with stagger animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Découvrez l'Excellence
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            Des produits premium pour un style unique
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl shadow-2xl hover:shadow-white/20 transition-shadow"
              >
                Découvrir la collection
              </motion.button>
            </Link>
            
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                En savoir plus
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1.2 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <span className="text-sm font-medium">Défiler</span>
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </motion.div>

      {/* Loading Indicator */}
      {shouldLoadVideo && !videoLoaded && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
          />
        </div>
      )}
    </div>
  )
}
