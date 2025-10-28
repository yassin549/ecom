import { NextRequest, NextResponse } from 'next/server'

type CorsOptions = {
  origin?: string | string[]
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

const defaultOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  credentials: true,
  maxAge: 86400, // 24 hours
}

/**
 * CORS middleware for API routes
 */
export function corsMiddleware(options: CorsOptions = {}) {
  const config = { ...defaultOptions, ...options }

  return (request: NextRequest, response: NextResponse) => {
    const origin = request.headers.get('origin') || ''

    // Check if origin is allowed
    const isAllowed = checkOrigin(origin, config.origin)

    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*')
    }

    if (config.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    if (config.methods) {
      response.headers.set('Access-Control-Allow-Methods', config.methods.join(', '))
    }

    if (config.allowedHeaders) {
      response.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '))
    }

    if (config.exposedHeaders) {
      response.headers.set('Access-Control-Expose-Headers', config.exposedHeaders.join(', '))
    }

    if (config.maxAge) {
      response.headers.set('Access-Control-Max-Age', config.maxAge.toString())
    }

    return response
  }
}

/**
 * Handle preflight OPTIONS request
 */
export function handleCorsPreflightRequest(request: NextRequest, options: CorsOptions = {}) {
  const config = { ...defaultOptions, ...options }
  const origin = request.headers.get('origin') || ''
  const isAllowed = checkOrigin(origin, config.origin)

  const headers: Record<string, string> = {}

  if (isAllowed) {
    headers['Access-Control-Allow-Origin'] = origin || '*'
  }

  if (config.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true'
  }

  if (config.methods) {
    headers['Access-Control-Allow-Methods'] = config.methods.join(', ')
  }

  if (config.allowedHeaders) {
    headers['Access-Control-Allow-Headers'] = config.allowedHeaders.join(', ')
  }

  if (config.maxAge) {
    headers['Access-Control-Max-Age'] = config.maxAge.toString()
  }

  return new NextResponse(null, { status: 204, headers })
}

/**
 * Check if origin is allowed
 */
function checkOrigin(origin: string, allowedOrigin?: string | string[]): boolean {
  if (!allowedOrigin || allowedOrigin === '*') {
    return true
  }

  if (typeof allowedOrigin === 'string') {
    return origin === allowedOrigin
  }

  return allowedOrigin.includes(origin)
}

/**
 * Create CORS-enabled response
 */
export function corsResponse(data: any, options: CorsOptions = {}) {
  const response = NextResponse.json(data)
  const config = { ...defaultOptions, ...options }

  if (config.origin) {
    response.headers.set(
      'Access-Control-Allow-Origin',
      typeof config.origin === 'string' ? config.origin : config.origin[0]
    )
  }

  if (config.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  if (config.methods) {
    response.headers.set('Access-Control-Allow-Methods', config.methods.join(', '))
  }

  if (config.allowedHeaders) {
    response.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '))
  }

  if (config.exposedHeaders) {
    response.headers.set('Access-Control-Expose-Headers', config.exposedHeaders.join(', '))
  }

  return response
}

/**
 * Example usage:
 * 
 * export async function GET(request: NextRequest) {
 *   // Handle preflight
 *   if (request.method === 'OPTIONS') {
 *     return handleCorsPreflightRequest(request, {
 *       origin: ['https://example.com', 'https://app.example.com'],
 *       credentials: true
 *     })
 *   }
 *   
 *   // Your API logic
 *   const data = { message: 'Hello' }
 *   
 *   return corsResponse(data, {
 *     origin: ['https://example.com'],
 *     credentials: true
 *   })
 * }
 */
