import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export type AuthUser = {
  id: string
  email: string
  name: string | null
  role: string
}

/**
 * Get authenticated user from request headers
 * In production, this should validate JWT tokens
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  // For now, get from headers (will be replaced with NextAuth)
  const userId = request.headers.get('x-user-id')
  
  if (!userId) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

/**
 * Require authentication for API route
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | NextResponse> {
  const user = await getAuthUser(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }

  return user
}

/**
 * Require admin role for API route
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser | NextResponse> {
  const user = await getAuthUser(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Accès interdit - Admin requis' },
      { status: 403 }
    )
  }

  return user
}

/**
 * Check if user is authenticated (boolean)
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const user = await getAuthUser(request)
  return user !== null
}

/**
 * Check if user is admin (boolean)
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const user = await getAuthUser(request)
  return user?.role === 'admin'
}
