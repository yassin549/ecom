import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export default {
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        
        if (!parsed.success) {
          return null
        }

        const { username, password } = parsed.data

        // TODO: Replace with actual database lookup
        // For demo, accept any username with password "password123"
        if (password === 'password123') {
          return {
            id: '1',
            email: `${username}@example.com`,
            name: username,
            image: null,
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/profile')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      
      return true
    },
  },
} satisfies NextAuthConfig
