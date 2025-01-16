'use client'

import { useFormStore } from '@/store/form-store'
import { Form, FormQuestion } from '@/types/form'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface FormViewProps {
  form: Form
  onSubmit: (answers: Record<string, any>) => void
}

export default function FormView({ form, onSubmit }: FormViewProps) {
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswer,
    resetForm,
  } = useFormStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Reset form state when component mounts
    resetForm()
  }, [resetForm])

  const currentQuestion = form.questions[currentQuestionIndex]

  const validateAnswer = (question: FormQuestion, answer: any): boolean => {
    if (question.required && (!answer || (typeof answer === 'string' && !answer.trim()))) {
      setError('This question requires an answer')
      return false
    }

    switch (question.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(answer)) {
          setError('Please enter a valid email address')
          return false
        }
        break
      case 'number':
        if (isNaN(Number(answer))) {
          setError('Please enter a valid number')
          return false
        }
        break
      case 'rating':
        const rating = Number(answer)
        if (
          isNaN(rating) ||
          rating < (question.min || 1) ||
          rating > (question.max || 5)
        ) {
          setError(`Please enter a rating between ${question.min || 1} and ${question.max || 5}`)
          return false
        }
        break
    }

    return true
  }

  const handleNext = () => {
    const answer = answers[currentQuestion.id]
    
    if (!validateAnswer(currentQuestion, answer)) {
      return
    }

    setError(null)
    if (currentQuestionIndex < form.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    setError(null)
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit(answers)
      // Reset form after successful submission
      resetForm()
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleNext()
    }
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{form.title}</h2>
          {form.description && (
            <p className="mt-2 text-sm text-gray-600">{form.description}</p>
          )}
        </div>

        <div className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900">
              {currentQuestion.title}
            </h3>
            {currentQuestion.description && (
              <p className="text-sm text-gray-500">{currentQuestion.description}</p>
            )}

            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}

            <div className="mt-4">
              {currentQuestion.type === 'text' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Type your answer here..."
                />
              )}

              {currentQuestion.type === 'email' && (
                <input
                  type="email"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                />
              )}

              {currentQuestion.type === 'number' && (
                <input
                  type="number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter a number"
                />
              )}

              {currentQuestion.type === 'date' && (
                <input
                  type="date"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              )}

              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setAnswer(currentQuestion.id, option)}
                      className={cn(
                        'w-full text-left px-4 py-3 border rounded-md transition-colors',
                        answers[currentQuestion.id] === option
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-indigo-500'
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'rating' && (
                <div className="flex justify-center space-x-2">
                  {Array.from(
                    { length: (currentQuestion.max || 5) - (currentQuestion.min || 1) + 1 },
                    (_, i) => i + (currentQuestion.min || 1)
                  ).map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setAnswer(currentQuestion.id, rating)}
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-colors',
                        answers[currentQuestion.id] === rating
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              )}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Submitting...'
                : currentQuestionIndex === form.questions.length - 1
                ? 'Submit'
                : 'Next'}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{
                  width: `${((currentQuestionIndex + 1) / form.questions.length) * 100}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-300"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-center text-gray-500">
            Question {currentQuestionIndex + 1} of {form.questions.length}
          </p>
        </div>
      </div>
    </div>
  )
}
