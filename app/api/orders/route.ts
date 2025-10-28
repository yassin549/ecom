import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Get orders (with filters for admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const userId = request.headers.get('x-user-id')
    const isAdmin = request.headers.get('x-user-role') === 'admin'

    const skip = (page - 1) * limit

    const where: any = {}

    // If not admin, only show user's orders
    if (!isAdmin && userId) {
      where.userId = userId
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Fetch orders and stats in parallel
    const [orders, total, stats] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  price: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
      // Get stats
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
        _sum: {
          total: true,
        },
      }),
    ])

    // Format stats
    const formattedStats = {
      total,
      pending: stats.find((s) => s.status === 'pending')?._count || 0,
      processing: stats.find((s) => s.status === 'processing')?._count || 0,
      shipped: stats.find((s) => s.status === 'shipped')?._count || 0,
      delivered: stats.find((s) => s.status === 'delivered')?._count || 0,
      cancelled: stats.find((s) => s.status === 'cancelled')?._count || 0,
      revenue: stats.reduce((sum, s) => {
        if (s.status !== 'cancelled') {
          return sum + (s._sum.total || 0)
        }
        return sum
      }, 0),
    }

    // Format orders with parsed shipping address
    const formattedOrders = orders.map((order) => ({
      ...order,
      customer: order.user.name || 'Guest',
      email: order.user.email,
      date: order.createdAt.toISOString(),
      shippingAddress: JSON.parse(order.shippingAddress),
    }))

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
      stats: formattedStats,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// Create new order
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { shippingAddress, paymentMethod } = await request.json()

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod,
        status: 'pending',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    // TODO: Send email notification
    // TODO: Broadcast WebSocket event

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
