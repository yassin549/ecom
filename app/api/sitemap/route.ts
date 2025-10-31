import { NextResponse } from 'next/server'

export async function GET() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'
	const urls = ['/', '/shop', '/profile']
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
		urls
			.map(
				(path) =>
					`<url><loc>${baseUrl}${path}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`
			)
			.join('') +
		`</urlset>`

	return new NextResponse(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
		},
	})
}

export const dynamic = 'force-dynamic'
export const revalidate = 0


