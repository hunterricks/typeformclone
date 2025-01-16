'use client'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { FormQuestion, QuestionType } from '@/types/form'
import { Copy, Grip, Trash2 } from 'lucide-react'

interface QuestionListProps {
  questions: FormQuestion[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  onDelete: (index: number) => void
  onDuplicate: (index: number) => void
  onMove: (fromIndex: number, toIndex: number) => void
}

const getQuestionIcon = (type: QuestionType) => {
  switch (type) {
    case 'welcome_screen':
    case 'end_screen':
      return '📄'
    case 'multiple_choice':
    case 'dropdown':
      return '⭕'
    case 'text':
    case 'long_text':
      return '📝'
    case 'email':
      return '📧'
    case 'phone':
      return '📱'
    case 'website':
      return '🌐'
    case 'date':
    case 'time':
      return '📅'
    case 'number':
      return '🔢'
    case 'rating':
      return '⭐'
    case 'yes_no':
      return '✅'
    case 'picture_choice':
      return '🖼️'
    case 'ranking':
      return '📊'
    case 'statement':
      return '💭'
    default:
      return '❓'
  }
}

export default function QuestionList({
  questions,
  selectedIndex,
  onSelect,
  onDelete,
  onDuplicate,
  onMove,
}: QuestionListProps) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    onMove(result.source.index, result.destination.index)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="questions">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {questions.map((question, index) => (
              <Draggable
                key={question.id}
                draggableId={question.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`group flex items-center gap-2 rounded-lg border p-4 hover:border-primary ${
                      selectedIndex === index ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="cursor-grab opacity-0 group-hover:opacity-100"
                    >
                      <Grip className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => onSelect(index)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {getQuestionIcon(question.type)}
                        </span>
                        <span className="font-medium">
                          {question.title || 'Untitled Question'}
                        </span>
                      </div>
                      {question.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {question.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDuplicate(index)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
