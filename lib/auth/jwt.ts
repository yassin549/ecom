import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || 'your-access-token-secret-key-change-in-production'
)
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret-key-change-in-production'
)

const ACCESS_TOKEN_EXPIRY = '15m' // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d' // 7 days

export type TokenPayload = {
  userId: string
  email: string
  role: string
}

/**
 * Generate access token (short-lived)
 */
export async function generateAccessToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(ACCESS_TOKEN_SECRET)
}

/**
 * Generate refresh token (long-lived)
 */
export async function generateRefreshToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(REFRESH_TOKEN_SECRET)
}

/**
 * Verify access token
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET)
    return payload as TokenPayload
  } catch (error) {
    return null
  }
}

/**
 * Verify refresh token
 */
export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET)
    return payload as TokenPayload
  } catch (error) {
    return null
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.substring(7)
}

/**
 * Get token from cookie
 */
export function getTokenFromCookie(request: NextRequest, name: string): string | null {
  return request.cookies.get(name)?.value || null
}

/**
 * Refresh token rotation
 * Returns new access and refresh tokens
 */
export async function refreshTokens(refreshToken: string): Promise<{
  accessToken: string
  refreshToken: string
} | null> {
  const payload = await verifyRefreshToken(refreshToken)
  
  if (!payload) {
    return null
  }
  
  // Generate new tokens
  const newAccessToken = await generateAccessToken(payload)
  const newRefreshToken = await generateRefreshToken(payload)
  
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    const decoded = Buffer.from(payload, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  
  const now = Math.floor(Date.now() / 1000)
  return decoded.exp < now
}

/**
 * Example usage in API route:
 * 
 * // Login endpoint
 * export async function POST(request: NextRequest) {
 *   const { email, password } = await request.json()
 *   
 *   // Verify credentials...
 *   const user = { userId: '123', email, role: 'user' }
 *   
 *   const accessToken = await generateAccessToken(user)
 *   const refreshToken = await generateRefreshToken(user)
 *   
 *   return NextResponse.json({
 *     accessToken,
 *     refreshToken,
 *     expiresIn: 900 // 15 minutes
 *   })
 * }
 * 
 * // Protected endpoint
 * export async function GET(request: NextRequest) {
 *   const token = extractToken(request)
 *   
 *   if (!token) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 *   }
 *   
 *   const payload = await verifyAccessToken(token)
 *   
 *   if (!payload) {
 *     return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
 *   }
 *   
 *   // Your protected logic here
 *   return NextResponse.json({ data: 'Protected data', user: payload })
 * }
 * 
 * // Refresh endpoint
 * export async function POST(request: NextRequest) {
 *   const { refreshToken } = await request.json()
 *   
 *   const tokens = await refreshTokens(refreshToken)
 *   
 *   if (!tokens) {
 *     return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
 *   }
 *   
 *   return NextResponse.json(tokens)
 * }
 */
