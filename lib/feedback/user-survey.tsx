"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'

type SurveyQuestion = {
  id: string
  type: 'rating' | 'boolean' | 'text'
  question: string
  options?: string[]
}

const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'satisfaction',
    type: 'rating',
    question: 'Comment évaluez-vous votre expérience globale?',
  },
  {
    id: 'recommend',
    type: 'boolean',
    question: 'Recommanderiez-vous notre site à un ami?',
  },
  {
    id: 'feedback',
    type: 'text',
    question: 'Que pouvons-nous améliorer?',
  },
]

export function UserSurvey() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Show survey after 2 minutes on site
    const timer = setTimeout(() => {
      const hasSeenSurvey = localStorage.getItem('survey_shown')
      if (!hasSeenSurvey) {
        setIsVisible(true)
        localStorage.setItem('survey_shown', 'true')
      }
    }, 120000) // 2 minutes

    return () => clearTimeout(timer)
  }, [])

  const handleResponse = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
    
    if (currentQuestion < SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handleSubmit = async () => {
    try {
      await fetch('/api/feedback/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          timestamp: Date.now(),
          page: window.location.pathname,
        }),
      })
      
      setIsSubmitted(true)
      setTimeout(() => setIsVisible(false), 2000)
    } catch (error) {
      console.error('Failed to submit survey:', error)
    }
  }

  const question = SURVEY_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / SURVEY_QUESTIONS.length) * 100

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
        >
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>

          {!isSubmitted ? (
            <>
              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Question {currentQuestion + 1} sur {SURVEY_QUESTIONS.length}
                </p>
              </div>

              {/* Question */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {question.question}
              </h3>

              {/* Rating */}
              {question.type === 'rating' && (
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleResponse(question.id, rating)}
                      className={`w-12 h-12 rounded-full font-semibold transition-colors ${
                        responses[question.id] === rating
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {rating}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Boolean */}
              {question.type === 'boolean' && (
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleResponse(question.id, true)}
                    className="flex-1 py-3 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ThumbsUp className="h-5 w-5" />
                    Oui
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleResponse(question.id, false)}
                    className="flex-1 py-3 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ThumbsDown className="h-5 w-5" />
                    Non
                  </motion.button>
                </div>
              )}

              {/* Text */}
              {question.type === 'text' && (
                <div>
                  <textarea
                    value={responses[question.id] || ''}
                    onChange={(e) =>
                      setResponses((prev) => ({
                        ...prev,
                        [question.id]: e.target.value,
                      }))
                    }
                    placeholder="Votre feedback..."
                    className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="w-full mt-4 py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Envoyer
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Merci!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Votre feedback nous aide à améliorer
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Feedback button for continuous feedback
 */
export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    try {
      await fetch('/api/feedback/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback,
          page: window.location.pathname,
          timestamp: Date.now(),
        }),
      })
      
      setIsSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitted(false)
        setFeedback('')
      }, 2000)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
  }

  return (
    <>
      {/* Feedback button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 px-4 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="font-medium">Feedback</span>
      </motion.button>

      {/* Feedback modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              {!isSubmitted ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Partagez votre feedback
                  </h3>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Qu'aimeriez-vous nous dire?"
                    className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none mb-4"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!feedback.trim()}
                      className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Envoyer
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ThumbsUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Merci!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Votre feedback a été envoyé
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * Example usage:
 * 
 * // Add to root layout
 * <UserSurvey />
 * <FeedbackButton />
 */
