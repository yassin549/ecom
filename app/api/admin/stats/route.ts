import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Get dashboard stats (Admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = request.headers.get('x-user-role') === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || '30' // days

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Fetch all stats in parallel
    const [
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders,
      topProducts,
      revenueByMonth,
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),

      // Total revenue (excluding cancelled)
      prisma.order.aggregate({
        where: {
          status: {
            not: 'cancelled',
          },
        },
        _sum: {
          total: true,
        },
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),

      // Recent orders
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),

      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
        },
        _count: true,
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 10,
      }),

      // Revenue by month (last 12 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM(total) as revenue,
          COUNT(*) as orders
        FROM "Order"
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
          AND status != 'cancelled'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `,
    ])

    // Get product details for top products
    const topProductIds = topProducts.map((p) => p.productId)
    const productDetails = await prisma.product.findMany({
      where: {
        id: {
          in: topProductIds,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
      },
    })

    // Combine top products with details
    const topProductsWithDetails = topProducts.map((item) => {
      const product = productDetails.find((p) => p.id === item.productId)
      return {
        ...product,
        totalSold: item._sum.quantity,
        orderCount: item._count,
      }
    })

    // Format stats
    const stats = {
      overview: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        averageOrderValue: totalOrders > 0 
          ? (totalRevenue._sum.total || 0) / totalOrders 
          : 0,
      },
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item.status] = item._count
        return acc
      }, {} as Record<string, number>),
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customer: order.user.name || 'Guest',
        email: order.user.email,
        total: order.total,
        status: order.status,
        date: order.createdAt,
      })),
      topProducts: topProductsWithDetails,
      revenueByMonth,
    }

    const response = NextResponse.json(stats)

    // Cache for 5 minutes
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=300'
    )

    return response
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
