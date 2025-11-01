import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

// Lazy initialization to avoid Prisma errors during serverless function startup
let prismaInstance: PrismaClient | null = null

function getPrisma(): PrismaClient {
  if (prismaInstance) {
    return prismaInstance
  }

  // In production on Vercel, create new instance each time if global doesn't exist
  if (process.env.VERCEL === '1' && !globalForPrisma.prisma) {
    try {
      prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
      return prismaInstance
    } catch (error) {
      console.error('Failed to initialize Prisma Client:', error)
      // Return a mock instance that will fail gracefully
      throw new Error('Prisma Client initialization failed. Please check your deployment configuration.')
    }
  }

  // Development or when global exists
  if (!globalForPrisma.prisma) {
    try {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    } catch (error) {
      console.error('Failed to initialize Prisma Client in development:', error)
      throw error
    }
  }

  prismaInstance = globalForPrisma.prisma
  return prismaInstance
}

// LAZY EXPORT: Use getter to avoid immediate initialization
// This ensures Prisma is only initialized when actually accessed
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const instance = getPrisma()
    const value = (instance as any)[prop]
    // If it's a function, bind it to the instance
    if (typeof value === 'function') {
      return value.bind(instance)
    }
    return value
  }
}) as PrismaClient

// Connection pool configuration
export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

// Graceful shutdown
export const disconnectDB = async () => {
  await prisma.$disconnect()
}

// Health check
export const checkDBHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    return false
  }
}
