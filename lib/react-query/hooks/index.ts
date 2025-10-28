// Product hooks
export {
  useProducts,
  useProduct,
  useRelatedProducts,
  useSearchProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from './useProducts'

// Cart hooks
export {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from './useCart'

// Order hooks
export {
  useOrders,
  useCreateOrder,
  useUpdateOrderStatus,
  useBulkUpdateOrders,
} from './useOrders'

// Review hooks
export {
  useProductReviews,
  useSubmitReview,
} from './useReviews'

// Admin hooks
export {
  useAdminStats,
  useReviews,
  useApproveReview,
  useDeleteReview,
  usePromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
  useValidatePromoCode,
} from './useAdmin'
