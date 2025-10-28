import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

// Client-side Pusher instance
let pusherClient: PusherClient | null = null

export const getPusherClient = () => {
  if (!pusherClient) {
    pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })
  }
  return pusherClient
}

// Event types
export const PUSHER_EVENTS = {
  CART_UPDATED: 'cart-updated',
  ORDER_STATUS_CHANGED: 'order-status-changed',
  NEW_ORDER: 'new-order',
  PRODUCT_UPDATED: 'product-updated',
  PRODUCT_DELETED: 'product-deleted',
  NOTIFICATION: 'notification',
} as const

// Channels
export const PUSHER_CHANNELS = {
  CART: (userId: string) => `private-cart-${userId}`,
  ORDERS: (userId: string) => `private-orders-${userId}`,
  ADMIN: 'private-admin',
  PUBLIC: 'public',
} as const

// Broadcast helpers
export const broadcastCartUpdate = async (userId: string, cart: any) => {
  await pusherServer.trigger(
    PUSHER_CHANNELS.CART(userId),
    PUSHER_EVENTS.CART_UPDATED,
    cart
  )
}

export const broadcastOrderStatusChange = async (
  userId: string,
  order: any
) => {
  await pusherServer.trigger(
    PUSHER_CHANNELS.ORDERS(userId),
    PUSHER_EVENTS.ORDER_STATUS_CHANGED,
    order
  )
}

export const broadcastNewOrder = async (order: any) => {
  await pusherServer.trigger(
    PUSHER_CHANNELS.ADMIN,
    PUSHER_EVENTS.NEW_ORDER,
    order
  )
}

export const broadcastProductUpdate = async (product: any) => {
  await pusherServer.trigger(
    PUSHER_CHANNELS.PUBLIC,
    PUSHER_EVENTS.PRODUCT_UPDATED,
    product
  )
}

export const broadcastProductDelete = async (productId: string) => {
  await pusherServer.trigger(
    PUSHER_CHANNELS.PUBLIC,
    PUSHER_EVENTS.PRODUCT_DELETED,
    { productId }
  )
}

export const broadcastNotification = async (userId: string, notification: any) => {
  await pusherServer.trigger(
    PUSHER_CHANNELS.ORDERS(userId),
    PUSHER_EVENTS.NOTIFICATION,
    notification
  )
}
