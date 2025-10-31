import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Resetting database to a clean state (no demo data)...')

  // Order of deletion respects FK constraints
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.promoCode.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ All tables cleared. Database is empty.')
}

main()
  .catch((e) => {
    console.error('❌ Failed to reset database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


