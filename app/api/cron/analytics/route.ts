import { NextResponse } from 'next/server'

export async function GET() {
	// Placeholder: implement analytics aggregation task
	return NextResponse.json({ ok: true, task: 'analytics' })
}

export const dynamic = 'force-dynamic'
export const revalidate = 0


