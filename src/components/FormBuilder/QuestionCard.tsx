'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { GripVertical, Trash2, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormQuestion } from '@/types/form'

interface QuestionCardProps {
  question: FormQuestion
  index: number
  isEditing: boolean
  onEdit: () => void
  onUpdate: (updates: Partial<FormQuestion>) => void
  onRemove: () => void
}

export default function QuestionCard({
  question,
  index,
  isEditing,
  onEdit,
  onUpdate,
  onRemove,
}: QuestionCardProps) {
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
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        isDragging && 'z-50 opacity-50',
        !question.title && 'border-dashed',
        question.type === 'welcome_screen' && 'bg-primary/5',
        question.type === 'end_screen' && 'bg-primary/5',
        question.type === 'statement' && 'bg-accent/5'
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-move mt-1"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Input
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder={
                  question.type === 'welcome_screen'
                    ? 'Welcome Screen Title'
                    : question.type === 'end_screen'
                    ? 'Thank You Screen Title'
                    : question.type === 'statement'
                    ? 'Statement Text'
                    : 'Question Title'
                }
                className={cn(
                  'font-medium border-transparent hover:border-border focus:border-input',
                  isEditing ? 'bg-background' : 'bg-transparent'
                )}
              />
              {isEditing && (
                <Textarea
                  value={question.description || ''}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder={
                    question.type === 'welcome_screen'
                      ? 'Add a welcome message'
                      : question.type === 'end_screen'
                      ? 'Add a thank you message'
                      : question.type === 'statement'
                      ? 'Add additional text'
                      : 'Question description (optional)'
                  }
                  className="min-h-[100px] bg-background"
                />
              )}
            </div>

            {isEditing && (
              <div className="space-y-4">
                {/* Question type specific inputs */}
                {(question.type === 'multiple_choice' ||
                  question.type === 'dropdown' ||
                  question.type === 'picture_choice') && (
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) =>
                            onUpdate({
                              options: question.options?.map((opt, i) =>
                                i === optionIndex ? e.target.value : opt
                              ),
                            })
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className="bg-background"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onUpdate({
                              options: question.options?.filter(
                                (_, i) => i !== optionIndex
                              ),
                            })
                          }
                          disabled={question.options?.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onUpdate({
                          options: [
                            ...(question.options || []),
                            `Option ${(question.options?.length || 0) + 1}`,
                          ],
                        })
                      }
                    >
                      Add Option
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
