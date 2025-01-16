'use client'

import { useFormStore } from '@/store/form-store'
import { Form, FormQuestion } from '@/types/form'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface FormViewProps {
  form: Form
  onSubmit: (answers: { question_id: string; value: any }[]) => void
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
          rating < (question.settings?.min || 1) ||
          rating > (question.settings?.max || 5)
        ) {
          setError(`Please enter a rating between ${question.settings?.min || 1} and ${question.settings?.max || 5}`)
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
      // Transform answers from Record to array format
      const formattedAnswers = Object.entries(answers).map(([question_id, value]) => ({
        question_id,
        value,
      }))
      await onSubmit(formattedAnswers)
      // Reset form after successful submission
      resetForm()
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderInput = () => {
    if (!currentQuestion) return null

    const value = answers[currentQuestion.id] || ''

    switch (currentQuestion.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={currentQuestion.type}
            value={value}
            onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type your answer here..."
          />
        )

      case 'long_text':
        return (
          <textarea
            value={value}
            onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
            placeholder="Type your answer here..."
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter a number..."
          />
        )

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type={currentQuestion.settings?.multiple ? 'checkbox' : 'radio'}
                  name={currentQuestion.id}
                  checked={
                    currentQuestion.settings?.multiple
                      ? (value as string[])?.includes(option)
                      : value === option
                  }
                  onChange={() => {
                    if (currentQuestion.settings?.multiple) {
                      const currentValues = (value as string[]) || []
                      const newValues = currentValues.includes(option)
                        ? currentValues.filter((v) => v !== option)
                        : [...currentValues, option]
                      setAnswer(currentQuestion.id, newValues)
                    } else {
                      setAnswer(currentQuestion.id, option)
                    }
                  }}
                  className="h-4 w-4 text-primary"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )

      case 'yes_no':
        return (
          <div className="flex space-x-4">
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                onClick={() => setAnswer(currentQuestion.id, option)}
                className={cn(
                  'px-6 py-3 rounded-lg border border-gray-300 font-medium',
                  value === option && 'bg-primary text-white border-primary'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )

      default:
        return <div>Unsupported question type: {currentQuestion.type}</div>
    }
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
        <p className="text-gray-600">Your response has been recorded.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      {form.settings?.showProgressBar && (
        <div className="mb-8">
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-primary rounded-full transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / form.questions.length) * 100}%`,
              }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500 text-right">
            {currentQuestionIndex + 1} of {form.questions.length}
          </div>
        </div>
      )}

      {/* Question */}
      <div className="space-y-6">
        <div>
          {form.settings?.showQuestionNumbers && (
            <div className="text-sm font-medium text-gray-500 mb-2">
              Question {currentQuestionIndex + 1}
            </div>
          )}
          <h2 className="text-2xl font-medium mb-2">{currentQuestion.title}</h2>
          {currentQuestion.description && (
            <p className="text-gray-600">{currentQuestion.description}</p>
          )}
        </div>

        {/* Input */}
        <div className="py-4">{renderInput()}</div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={cn(
              'px-6 py-2 rounded-lg font-medium',
              currentQuestionIndex === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === form.questions.length - 1
              ? isSubmitting
                ? 'Submitting...'
                : 'Submit'
              : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
