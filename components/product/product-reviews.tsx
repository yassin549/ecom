"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp, User } from "lucide-react"

type Review = {
  id: string
  author: string
  rating: number
  comment: string
  date: string
  helpful: number
  sentiment: "positive" | "neutral" | "negative"
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: "1",
    author: "Marie Dupont",
    rating: 5,
    comment: "Excellent produit ! La qualité est au rendez-vous et la livraison était rapide. Je recommande vivement.",
    date: "2024-10-15",
    helpful: 12,
    sentiment: "positive",
  },
  {
    id: "2",
    author: "Jean Martin",
    rating: 4,
    comment: "Très bon rapport qualité-prix. Le produit correspond à la description. Petit bémol sur l'emballage.",
    date: "2024-10-10",
    helpful: 8,
    sentiment: "positive",
  },
  {
    id: "3",
    author: "Sophie Bernard",
    rating: 5,
    comment: "Parfait ! Exactement ce que je cherchais. Service client très réactif.",
    date: "2024-10-05",
    helpful: 15,
    sentiment: "positive",
  },
]

type ProductReviewsProps = {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(mockReviews)
  const [visibleCount, setVisibleCount] = useState(3)

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }))

  const getSentimentColor = (sentiment: Review["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "border-green-200 bg-green-50"
      case "neutral":
        return "border-gray-200 bg-gray-50"
      case "negative":
        return "border-red-200 bg-red-50"
    }
  }

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Avis Clients</h2>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">Basé sur {reviews.length} avis</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: rating * 0.1 }}
                    className="h-full bg-yellow-400"
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.slice(0, visibleCount).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`p-6 rounded-xl border-2 ${getSentimentColor(review.sentiment)}`}
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{review.author}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(review.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

              {/* Helpful Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Utile ({review.helpful})</span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < reviews.length && (
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="px-8 py-3 bg-white border-2 border-gray-200 hover:border-indigo-600 text-gray-900 font-semibold rounded-xl transition-all"
            >
              Voir plus d'avis
            </motion.button>
          </div>
        )}
      </div>
    </section>
  )
}
