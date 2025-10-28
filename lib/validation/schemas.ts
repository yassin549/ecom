import { z } from 'zod'

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.number().positive('Le prix doit être positif'),
  stock: z.number().int().min(0, 'Le stock ne peut pas être négatif'),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  image: z.string().url('URL d\'image invalide').optional(),
  images: z.array(z.string().url()).optional(),
  featured: z.boolean().optional(),
})

export const updateProductSchema = createProductSchema.partial()

// Order schemas
export const createOrderSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
    city: z.string().min(2, 'La ville est requise'),
    postalCode: z.string().min(4, 'Le code postal est requis'),
    country: z.string().min(2, 'Le pays est requis'),
  }),
  paymentMethod: z.enum(['pay-on-delivery', 'card']),
})

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, 'ID de commande requis'),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
})

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'ID de produit requis'),
  quantity: z.number().int().positive('La quantité doit être positive').default(1),
})

export const updateCartItemSchema = z.object({
  itemId: z.string().min(1, 'ID d\'article requis'),
  quantity: z.number().int().positive('La quantité doit être positive'),
})

// Review schemas
export const createReviewSchema = z.object({
  productId: z.string().min(1, 'ID de produit requis'),
  rating: z.number().int().min(1).max(5, 'La note doit être entre 1 et 5'),
  comment: z.string().min(10, 'Le commentaire doit contenir au moins 10 caractères'),
})

export const approveReviewSchema = z.object({
  reviewId: z.string().min(1, 'ID de revue requis'),
  approved: z.boolean(),
})

// Promo code schemas
export const createPromoCodeSchema = z.object({
  code: z.string().min(3, 'Le code doit contenir au moins 3 caractères').toUpperCase(),
  discount: z.number().positive('La réduction doit être positive'),
  type: z.enum(['percentage', 'fixed']),
  minPurchase: z.number().min(0).default(0),
  maxUses: z.number().int().min(0).default(0),
  expiresAt: z.string().datetime().optional(),
})

export const validatePromoCodeSchema = z.object({
  code: z.string().min(1, 'Code requis'),
  cartTotal: z.number().positive('Total du panier requis'),
})

// User schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
})

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

// Type exports
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type ApproveReviewInput = z.infer<typeof approveReviewSchema>
export type CreatePromoCodeInput = z.infer<typeof createPromoCodeSchema>
export type ValidatePromoCodeInput = z.infer<typeof validatePromoCodeSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
