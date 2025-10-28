import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Données invalides',
        details: error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    )
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Cette ressource existe déjà' },
        { status: 409 }
      )
    }

    // Record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Ressource non trouvée' },
        { status: 404 }
      )
    }

    // Foreign key constraint
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Référence invalide' },
        { status: 400 }
      )
    }
  }

  // Custom API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  // Generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  // Unknown errors
  return NextResponse.json(
    { error: 'Une erreur est survenue' },
    { status: 500 }
  )
}

// Common error responses
export const ErrorResponses = {
  unauthorized: () =>
    NextResponse.json({ error: 'Non autorisé' }, { status: 401 }),

  forbidden: () =>
    NextResponse.json({ error: 'Accès interdit' }, { status: 403 }),

  notFound: (resource = 'Ressource') =>
    NextResponse.json({ error: `${resource} non trouvée` }, { status: 404 }),

  badRequest: (message = 'Requête invalide') =>
    NextResponse.json({ error: message }, { status: 400 }),

  conflict: (message = 'Conflit') =>
    NextResponse.json({ error: message }, { status: 409 }),

  tooManyRequests: (retryAfter?: number) => {
    const response = NextResponse.json(
      { error: 'Trop de requêtes' },
      { status: 429 }
    )
    if (retryAfter) {
      response.headers.set('Retry-After', retryAfter.toString())
    }
    return response
  },

  internalError: (message = 'Erreur interne du serveur') =>
    NextResponse.json({ error: message }, { status: 500 }),
}
