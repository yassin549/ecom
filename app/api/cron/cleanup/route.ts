import { NextResponse } from 'next/server'

export async function GET() {
	// Placeholder: implement cleanup tasks (e.g., purge expired sessions, carts)
	return NextResponse.json({ ok: true, task: 'cleanup' })
}

export const dynamic = 'force-dynamic'
export const revalidate = 0


