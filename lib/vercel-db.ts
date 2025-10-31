import { createClient } from '@vercel/postgres'

// Use a lazy client that relies on Vercel's pooled connection automatically.
// This avoids validating/connecting at import time and works across regions.
export const db = createClient()
