import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const cats = await prisma.category.findMany()
  console.log('Existing categories:', cats.length)
  const prods = await prisma.product.findMany()
  console.log('Existing products:', prods.length)
  
  if (cats.length > 0 || prods.length > 0) {
    console.log('Database already has data. Clearing...')
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
    console.log('Database cleared')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
