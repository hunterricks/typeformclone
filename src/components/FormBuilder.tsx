'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { PlusCircle, Trash2, GripVertical, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type QuestionType =
  | 'contact'
  | 'email'
  | 'phone'
  | 'address'
  | 'website'
  | 'multiple_choice'
  | 'dropdown'
  | 'picture_choice'
  | 'yes_no'
  | 'legal'
  | 'long_text'
  | 'short_text'
  | 'number'
  | 'date'
  | 'rating'
  | 'ranking'
  | 'matrix'
  | 'file_upload'
  | 'payment'
  | 'welcome_screen'
  | 'end_screen'
  | 'statement'
  | 'group'

interface FormQuestion {
  id: string
  type: QuestionType
  title: string
  description?: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
  settings?: {
    multiple?: boolean
    randomize?: boolean
    allowOther?: boolean
    verticalAlign?: boolean
    imageUrl?: string
    buttonText?: string
    redirectUrl?: string
  }
}

interface FormBuilderProps {
  form: any // Replace with proper type
}

const questionTypes = [
  {
    category: 'Contact info',
    items: [
      { type: 'contact', label: 'Contact Info', icon: '👤' },
      { type: 'email', label: 'Email', icon: '📧' },
      { type: 'phone', label: 'Phone Number', icon: '📞' },
      { type: 'address', label: 'Address', icon: '📍' },
      { type: 'website', label: 'Website', icon: '🌐' },
    ],
  },
  {
    category: 'Choice',
    items: [
      { type: 'multiple_choice', label: 'Multiple Choice', icon: '☑️' },
      { type: 'dropdown', label: 'Dropdown', icon: '▼' },
      { type: 'picture_choice', label: 'Picture Choice', icon: '🖼️' },
      { type: 'yes_no', label: 'Yes/No', icon: '✓' },
      { type: 'legal', label: 'Legal', icon: '⚖️' },
    ],
  },
  {
    category: 'Text & Media',
    items: [
      { type: 'long_text', label: 'Long Text', icon: '📝' },
      { type: 'short_text', label: 'Short Text', icon: '✏️' },
    ],
  },
  {
    category: 'Rating & Ranking',
    items: [
      { type: 'rating', label: 'Rating', icon: '⭐' },
      { type: 'ranking', label: 'Ranking', icon: '📊' },
      { type: 'matrix', label: 'Matrix', icon: '🔲' },
    ],
  },
  {
    category: 'Other',
    items: [
      { type: 'number', label: 'Number', icon: '#️⃣' },
      { type: 'date', label: 'Date', icon: '📅' },
      { type: 'file_upload', label: 'File Upload', icon: '📎' },
      { type: 'payment', label: 'Payment', icon: '💳' },
    ],
  },
  {
    category: 'Layout',
    items: [
      { type: 'welcome_screen', label: 'Welcome Screen', icon: '👋' },
      { type: 'end_screen', label: 'End Screen', icon: '🏁' },
      { type: 'statement', label: 'Statement', icon: '💭' },
      { type: 'group', label: 'Question Group', icon: '📑' },
    ],
  },
]

function SortableQuestion({ question, index, currentEditingIndex, updateQuestion, removeQuestion, setCurrentEditingIndex }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        currentEditingIndex === index && 'ring-2 ring-primary',
        question.type === 'welcome_screen' && 'bg-primary/5',
        question.type === 'end_screen' && 'bg-primary/5',
        question.type === 'statement' && 'bg-accent/5'
      )}
    >
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            value={question.title}
            onChange={(e) =>
              updateQuestion(index, { title: e.target.value })
            }
            placeholder="Question title"
            className="font-medium"
          />
          {currentEditingIndex === index && (
            <Input
              value={question.description || ''}
              onChange={(e) =>
                updateQuestion(index, {
                  description: e.target.value,
                })
              }
              placeholder="Question description (optional)"
              className="text-sm text-muted-foreground"
            />
          )}
        </div>

        {(question.type === 'multiple_choice' || 
          question.type === 'dropdown' || 
          question.type === 'picture_choice') && (
          <div className="space-y-4">
            <div className="space-y-2">
              {question.options?.map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) =>
                      updateQuestion(index, {
                        options: question.options?.map((opt: string, i: number) =>
                          i === optionIndex ? e.target.value : opt
                        ),
                      })
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  {question.type === 'picture_choice' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Add image upload functionality
                      }}
                    >
                      Add Image
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateQuestion(index, {
                        options: question.options?.filter(
                          (_: string, i: number) => i !== optionIndex
                        ),
                      })
                    }
                    disabled={question.options?.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateQuestion(index, {
                    options: [
                      ...(question.options || []),
                      `Option ${question.options?.length + 1}`,
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`multiple-${index}`}
                    checked={question.settings?.multiple}
                    onChange={(e) =>
                      updateQuestion(index, {
                        settings: {
                          ...question.settings,
                          multiple: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`multiple-${index}`}>Allow multiple selections</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`randomize-${index}`}
                    checked={question.settings?.randomize}
                    onChange={(e) =>
                      updateQuestion(index, {
                        settings: {
                          ...question.settings,
                          randomize: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`randomize-${index}`}>Randomize options</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`other-${index}`}
                    checked={question.settings?.allowOther}
                    onChange={(e) =>
                      updateQuestion(index, {
                        settings: {
                          ...question.settings,
                          allowOther: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`other-${index}`}>Allow "Other" option</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`vertical-${index}`}
                    checked={question.settings?.verticalAlign}
                    onChange={(e) =>
                      updateQuestion(index, {
                        settings: {
                          ...question.settings,
                          verticalAlign: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`vertical-${index}`}>Vertical alignment</Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {question.type === 'rating' && (
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <Label>Min Rating</Label>
              <Input
                type="number"
                value={question.min || 1}
                onChange={(e) =>
                  updateQuestion(index, {
                    min: parseInt(e.target.value),
                  })
                }
                min="1"
                max={question.max || 5}
                className="w-24"
              />
            </div>
            <div className="space-y-1">
              <Label>Max Rating</Label>
              <Input
                type="number"
                value={question.max || 5}
                onChange={(e) =>
                  updateQuestion(index, {
                    max: parseInt(e.target.value),
                  })
                }
                min={question.min || 1}
                max="10"
                className="w-24"
              />
            </div>
          </div>
        )}

        {(question.type === 'welcome_screen' || question.type === 'end_screen') && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={question.settings?.buttonText || 'Continue'}
                onChange={(e) =>
                  updateQuestion(index, {
                    settings: {
                      ...question.settings,
                      buttonText: e.target.value,
                    },
                  })
                }
                placeholder="Button text"
              />
            </div>

            {question.type === 'end_screen' && (
              <div className="space-y-2">
                <Label>Redirect URL (optional)</Label>
                <Input
                  value={question.settings?.redirectUrl || ''}
                  onChange={(e) =>
                    updateQuestion(index, {
                      settings: {
                        ...question.settings,
                        redirectUrl: e.target.value,
                      },
                    })
                  }
                  placeholder="https://..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Background Image (optional)</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // TODO: Add image upload functionality
                }}
              >
                {question.settings?.imageUrl ? 'Change Image' : 'Add Image'}
              </Button>
            </div>
          </div>
        )}

        {question.type !== 'welcome_screen' && 
         question.type !== 'end_screen' && 
         question.type !== 'statement' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-${index}`}
              checked={question.required}
              onChange={(e) =>
                updateQuestion(index, {
                  required: e.target.checked,
                })
              }
              className="h-4 w-4"
            />
            <Label htmlFor={`required-${index}`}>Required</Label>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function FormBuilder({ form }: FormBuilderProps) {
  const [title, setTitle] = useState(form?.title || '')
  const [description, setDescription] = useState(form?.description || '')
  const [questions, setQuestions] = useState<Array<Omit<FormQuestion, 'id'> & { id: string }>>(
    form?.questions || []
  )
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [showQuestionTypes, setShowQuestionTypes] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Save form changes automatically
    const saveForm = async () => {
      if (!form?.id) return

      try {
        const { error } = await supabase
          .from('forms')
          .update({
            title,
            description,
            questions: questions.map(q => ({
              ...q,
              id: undefined,
            })),
          })
          .eq('id', form.id)

        if (error) throw error
      } catch (error) {
        console.error('Error saving form:', error)
      }
    }

    const debounceTimer = setTimeout(saveForm, 1000)
    return () => clearTimeout(debounceTimer)
  }, [title, description, questions, form?.id])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addQuestion = (type: QuestionType) => {
    const newQuestion = {
      id: crypto.randomUUID(),
      type,
      title: '',
      description: '',
      required: true,
      ...(type === 'multiple_choice' ? { options: ['Option 1'] } : {}),
      ...(type === 'rating' ? { min: 1, max: 5 } : {}),
      ...(type === 'welcome_screen' || type === 'end_screen' ? { settings: { buttonText: 'Continue' } } : {}),
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="w-full">
      <div className="space-y-8">
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your question here. Recall information with @"
            className="text-xl font-medium border-none bg-transparent px-0 focus-visible:ring-0"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="border-none bg-transparent px-0 focus-visible:ring-0 min-h-[100px] text-muted-foreground"
          />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {questions.map((question, index) => (
                <SortableQuestion
                  key={question.id}
                  question={question}
                  index={index}
                  currentEditingIndex={currentEditingIndex}
                  updateQuestion={updateQuestion}
                  removeQuestion={removeQuestion}
                  setCurrentEditingIndex={setCurrentEditingIndex}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
