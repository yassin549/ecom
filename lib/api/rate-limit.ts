import { NextRequest, NextResponse } from 'next/server'

type RateLimitStore = Map<string, { count: number; resetTime: number }>

const rateLimitStore: RateLimitStore = new Map()

type RateLimitConfig = {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

/**
 * Rate limiting middleware for API routes
 * Uses in-memory store (use Redis in production)
 */
export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig = { interval: 60000, uniqueTokenPerInterval: 10 }) {
    this.config = config
  }

  async check(request: NextRequest, limit: number = this.config.uniqueTokenPerInterval) {
    const identifier = this.getIdentifier(request)
    const now = Date.now()
    const resetTime = now + this.config.interval

    // Clean up expired entries
    this.cleanup()

    // Get or create rate limit entry
    const record = rateLimitStore.get(identifier)

    if (!record) {
      rateLimitStore.set(identifier, { count: 1, resetTime })
      return { success: true, remaining: limit - 1, reset: resetTime }
    }

    // Check if reset time has passed
    if (now > record.resetTime) {
      rateLimitStore.set(identifier, { count: 1, resetTime })
      return { success: true, remaining: limit - 1, reset: resetTime }
    }

    // Check if limit exceeded
    if (record.count >= limit) {
      return {
        success: false,
        remaining: 0,
        reset: record.resetTime,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      }
    }

    // Increment count
    record.count++
    return {
      success: true,
      remaining: limit - record.count,
      reset: record.resetTime,
    }
  }

  private getIdentifier(request: NextRequest): string {
    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'
    
    // Include user agent for better uniqueness
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    return `${ip}-${userAgent}`
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }
}

/**
 * Rate limit response helper
 */
export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    {
      error: 'Trop de requêtes. Veuillez réessayer plus tard.',
      retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': '0',
      },
    }
  )
}

/**
 * Example usage in API route:
 * 
 * const limiter = new RateLimiter({ interval: 60000, uniqueTokenPerInterval: 10 })
 * 
 * export async function GET(request: NextRequest) {
 *   const result = await limiter.check(request, 10)
 *   
 *   if (!result.success) {
 *     return rateLimitResponse(result.retryAfter!)
 *   }
 *   
 *   // Your API logic here
 *   return NextResponse.json({ data: 'success' })
 * }
 */
