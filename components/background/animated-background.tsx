"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function AnimatedBackground() {
  const { scrollY } = useScroll()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Parallax transforms for different layers
  const y1 = useTransform(scrollY, [0, 1000], [0, -200])
  const y2 = useTransform(scrollY, [0, 1000], [0, -150])
  const y3 = useTransform(scrollY, [0, 1000], [0, -100])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle system
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.3 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas!.width) this.x = 0
        if (this.x < 0) this.x = canvas!.width
        if (this.y > canvas!.height) this.y = 0
        if (this.y < 0) this.y = canvas!.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Canvas for particles */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Animated gradient orbs with parallax */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-40 right-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-20 left-1/4 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-40 right-1/3 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
