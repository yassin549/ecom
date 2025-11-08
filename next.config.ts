import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Critical: External packages for Vercel serverless
  serverExternalPackages: ['@prisma/client', '@prisma/engines'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@tanstack/react-table'],
    // serverComponentsExternalPackages: ['@prisma/client', '@prisma/engines'],
  },
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Webpack config for Prisma
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client', '@prisma/engines')
    }
    return config
  },
  
  // Turbopack config (empty to silence warning)
  turbopack: {},
};

export default nextConfig;
