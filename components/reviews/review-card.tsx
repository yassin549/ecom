"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ThumbsUp, Heart, Smile, Flag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

type EmojiReaction = {
  emoji: string
  label: string
  count: number
  userReacted: boolean
}

type Review = {
  id: string
  author: string
  avatar?: string
  rating: number
  title: string
  content: string
  date: Date
  verified: boolean
  helpful: number
  userHelpful: boolean
  reactions: EmojiReaction[]
}

type ReviewCardProps = {
  review: Review
  onReaction?: (reviewId: string, emoji: string) => void
  onHelpful?: (reviewId: string) => void
  onReport?: (reviewId: string) => void
}

export function ReviewCard({
  review,
  onReaction,
  onHelpful,
  onReport,
}: ReviewCardProps) {
  const [showReactions, setShowReactions] = useState(false)

  const emojiOptions = [
    { emoji: "👍", label: "Utile" },
    { emoji: "❤️", label: "J'adore" },
    { emoji: "😊", label: "Content" },
    { emoji: "🔥", label: "Top" },
    { emoji: "👏", label: "Bravo" },
  ]

  const handleReaction = (emoji: string) => {
    onReaction?.(review.id, emoji)
    setShowReactions(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-gray-300 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {review.author.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.author}</h4>
              {review.verified && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Achat vérifié
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {formatDistanceToNow(review.date, { addSuffix: true, locale: fr })}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
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

      {/* Content */}
      <div className="mb-4">
        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
      </div>

      {/* Emoji Reactions */}
      {review.reactions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.reactions.map((reaction, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReaction(reaction.emoji)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                reaction.userReacted
                  ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-300"
                  : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300"
              }`}
            >
              <span className="mr-1">{reaction.emoji}</span>
              <span>{reaction.count}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
        {/* Helpful */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onHelpful?.(review.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            review.userHelpful
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${review.userHelpful ? "fill-current" : ""}`} />
          <span>Utile ({review.helpful})</span>
        </motion.button>

        {/* Add Reaction */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReactions(!showReactions)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Smile className="h-4 w-4" />
            <span>Réagir</span>
          </motion.button>

          {/* Reaction Picker */}
          <AnimatePresence>
            {showReactions && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowReactions(false)}
                />

                {/* Picker */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-2 flex gap-1 z-20"
                >
                  {emojiOptions.map((option) => (
                    <motion.button
                      key={option.emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReaction(option.emoji)}
                      className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center text-2xl transition-colors"
                      title={option.label}
                    >
                      {option.emoji}
                    </motion.button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Report */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onReport?.(review.id)}
          className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Flag className="h-4 w-4" />
          <span className="hidden sm:inline">Signaler</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
