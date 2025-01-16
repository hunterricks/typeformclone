'use client'

import { useState } from 'react'
import { Form, FormQuestion, QuestionType } from '@/types/form'
import { cn } from '@/lib/utils'

interface FormBuilderProps {
  onSave: (form: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void
}

const questionTypes: { type: QuestionType; label: string; icon: string }[] = [
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'choice', label: 'Multiple Choice', icon: '☑️' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'rating', label: 'Rating', icon: '⭐' },
]

export default function FormBuilder({ onSave }: FormBuilderProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<Omit<FormQuestion, 'id'>[]>([])
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null)

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Omit<FormQuestion, 'id'> = {
      type,
      title: '',
      description: '',
      required: true,
      ...(type === 'choice' ? { options: ['Option 1'] } : {}),
      ...(type === 'rating' ? { min: 1, max: 5 } : {}),
    }

    setQuestions([...questions, newQuestion])
    setCurrentEditingIndex(questions.length)
  }

  const updateQuestion = (index: number, updates: Partial<Omit<FormQuestion, 'id'>>) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...updates } : q))
    )
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
    setCurrentEditingIndex(null)
  }

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex]
    if (question.type === 'choice' && question.options) {
      updateQuestion(questionIndex, {
        options: [...question.options, `Option ${question.options.length + 1}`],
      })
    }
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const question = questions[questionIndex]
    if (question.type === 'choice' && question.options) {
      const newOptions = [...question.options]
      newOptions[optionIndex] = value
      updateQuestion(questionIndex, { options: newOptions })
    }
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex]
    if (question.type === 'choice' && question.options) {
      updateQuestion(questionIndex, {
        options: question.options.filter((_, i) => i !== optionIndex),
      })
    }
  }

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a form title')
      return
    }

    if (questions.length === 0) {
      alert('Please add at least one question')
      return
    }

    onSave({
      title,
      description,
      questions: questions.map((q, index) => ({
        ...q,
        id: `q${index + 1}`,
      })),
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
      {/* Form Details */}
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-bold border-none focus:outline-none focus:ring-0 p-2"
          placeholder="Enter form title..."
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-gray-600 border-none focus:outline-none focus:ring-0 resize-none p-2"
          placeholder="Enter form description..."
          rows={2}
        />
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={index}
            className={cn(
              'p-6 rounded-lg border-2 transition-all',
              currentEditingIndex === index
                ? 'border-indigo-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{questionTypes.find(t => t.type === question.type)?.icon}</span>
                <input
                  type="text"
                  value={question.title}
                  onChange={(e) => updateQuestion(index, { title: e.target.value })}
                  className="text-lg font-medium focus:outline-none"
                  placeholder="Question title"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentEditingIndex(currentEditingIndex === index ? null : index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {currentEditingIndex === index ? '✕' : '✎'}
                </button>
                <button
                  onClick={() => removeQuestion(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            </div>

            {currentEditingIndex === index && (
              <div className="space-y-4 mt-4">
                <textarea
                  value={question.description || ''}
                  onChange={(e) => updateQuestion(index, { description: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Question description (optional)"
                  rows={2}
                />

                {question.type === 'choice' && (
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          className="flex-1 p-2 border rounded-md"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <button
                          onClick={() => removeOption(index, optionIndex)}
                          className="text-red-500 hover:text-red-700"
                          disabled={question.options?.length === 1}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(index)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm"
                    >
                      + Add Option
                    </button>
                  </div>
                )}

                {question.type === 'rating' && (
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-sm text-gray-600">Min</label>
                      <input
                        type="number"
                        value={question.min || 1}
                        onChange={(e) => updateQuestion(index, { min: parseInt(e.target.value) })}
                        className="w-20 p-2 border rounded-md"
                        min="1"
                        max={question.max || 5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Max</label>
                      <input
                        type="number"
                        value={question.max || 5}
                        onChange={(e) => updateQuestion(index, { max: parseInt(e.target.value) })}
                        className="w-20 p-2 border rounded-md"
                        min={question.min || 1}
                        max="10"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <label className="text-sm text-gray-600">Required</label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Question Button */}
      <div className="flex flex-wrap gap-2">
        {questionTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => addQuestion(type)}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Form
        </button>
      </div>
    </div>
  )
}
