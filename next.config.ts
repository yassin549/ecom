import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
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
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Turbopack config (empty to silence warning)
  turbopack: {},
};

export default nextConfig;
