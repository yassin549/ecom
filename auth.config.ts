import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role?: string
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        
        if (!parsed.success) {
          return null
        }

        const { email, password } = parsed.data

        try {
          // Look up user in database
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            return null
          }

          // Verify password (using simple comparison for now - in production use bcrypt)
          // TODO: Implement proper password hashing with bcrypt
          const isValidPassword = password === user.password
          
          if (!isValidPassword) {
            return null
          }

          // Return user object with role for session
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: null,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to JWT token on sign in
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      // Add user id and role to session for client-side access
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/profile')
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      
      if (isOnAdmin) {
        // Admin routes require authentication and admin role
        if (isLoggedIn && auth?.user?.role === 'admin') return true
        return false
      }
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      
      return true
    },
  },
} satisfies NextAuthConfig
