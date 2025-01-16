'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Plus, GripVertical, Trash2, ChevronDown, Settings, Layout, Image } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import QuestionCard from './QuestionCard'
import QuestionSettings from './QuestionSettings'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface FormQuestion {
  id: string
  type: string
  title: string
  description?: string
  required?: boolean
  options?: string[]
  settings?: {
    multiple?: boolean
    randomize?: boolean
    allowOther?: boolean
    verticalAlign?: boolean
    buttonText?: string
    redirectUrl?: string
    imageUrl?: string
  }
  min?: number
  max?: number
}

interface FormBuilderProps {
  form: {
    id: string
    title: string
    description?: string
    questions: FormQuestion[]
    settings?: {
      showProgressBar?: boolean
      showQuestionNumbers?: boolean
      theme?: string
    }
  }
}

const questionTypes = [
  {
    category: 'Popular',
    items: [
      { type: 'multiple_choice', label: 'Multiple Choice', description: 'Let people choose from multiple options' },
      { type: 'text', label: 'Short Text', description: 'Collect brief text responses' },
      { type: 'long_text', label: 'Long Text', description: 'Collect longer text responses' },
      { type: 'email', label: 'Email', description: 'Collect email addresses' },
    ],
  },
  {
    category: 'Choice',
    items: [
      { type: 'dropdown', label: 'Dropdown', description: 'Show choices in a compact menu' },
      { type: 'yes_no', label: 'Yes/No', description: 'Simple binary choice' },
      { type: 'picture_choice', label: 'Picture Choice', description: 'Let people choose between images' },
      { type: 'ranking', label: 'Ranking', description: 'Let people order options' },
    ],
  },
  {
    category: 'Contact',
    items: [
      { type: 'phone', label: 'Phone Number', description: 'Collect phone numbers' },
      { type: 'website', label: 'Website', description: 'Collect website URLs' },
      { type: 'address', label: 'Address', description: 'Collect postal addresses' },
    ],
  },
  {
    category: 'Date & Time',
    items: [
      { type: 'date', label: 'Date', description: 'Ask for a date' },
      { type: 'time', label: 'Time', description: 'Ask for a time' },
    ],
  },
  {
    category: 'Layout',
    items: [
      { type: 'welcome_screen', label: 'Welcome Screen', description: 'Add an introduction' },
      { type: 'end_screen', label: 'End Screen', description: 'Add a thank you message' },
      { type: 'statement', label: 'Statement', description: 'Show text without a question' },
    ],
  },
]

export default function FormBuilder({ form }: FormBuilderProps) {
  const [title, setTitle] = useState(form?.title || '')
  const [description, setDescription] = useState(form?.description || '')
  const [questions, setQuestions] = useState<FormQuestion[]>(form?.questions || [])
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null)
  const [formSettings, setFormSettings] = useState(form?.settings || {
    showProgressBar: true,
    showQuestionNumbers: true,
    theme: 'system',
  })
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const saveForm = useCallback(async () => {
    if (!form?.id) return

    try {
      const { error } = await supabase
        .from('forms')
        .update({
          title,
          description,
          questions,
          settings: formSettings,
        })
        .eq('id', form.id)

      if (error) throw error

      toast({
        title: 'Changes saved',
        description: 'Your form has been updated',
      })
    } catch (error) {
      console.error('Error saving form:', error)
      toast({
        title: 'Error',
        description: 'Failed to save changes',
        variant: 'destructive',
      })
    }
  }, [title, description, questions, formSettings, form?.id])

  useEffect(() => {
    const debounceTimer = setTimeout(saveForm, 1000)
    return () => clearTimeout(debounceTimer)
  }, [saveForm])

  const addQuestion = (type: string) => {
    const newQuestion: FormQuestion = {
      id: Math.random().toString(36).substring(7),
      type,
      title: '',
      required: false,
      options: type === 'multiple_choice' || type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined,
      settings: {
        multiple: false,
        randomize: false,
        allowOther: false,
        verticalAlign: true,
      },
    }

    setQuestions([...questions, newQuestion])
    setCurrentEditingIndex(questions.length)
  }

  const updateQuestion = (index: number, updates: Partial<FormQuestion>) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], ...updates }
    setQuestions(newQuestions)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
    if (currentEditingIndex === index) {
      setCurrentEditingIndex(null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id)
      const newIndex = questions.findIndex((q) => q.id === over.id)

      setQuestions(arrayMove(questions, oldIndex, newIndex))
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border bg-muted/30">
        <div className="p-4 border-b border-border">
          <h2 className="font-medium">Content</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-57px)]">
          <div className="p-4 space-y-4">
            {questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => setCurrentEditingIndex(index)}
                className={cn(
                  'w-full text-left p-3 rounded-lg text-sm',
                  currentEditingIndex === index
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-background/20">
                    {index + 1}
                  </span>
                  <span className="truncate">
                    {question.title || `Untitled ${question.type.replace('_', ' ')}`}
                  </span>
                </div>
              </button>
            ))}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <ScrollArea className="h-96">
                  <div className="space-y-4 p-2">
                    {questionTypes.map((category) => (
                      <div key={category.category}>
                        <h4 className="font-medium mb-2">{category.category}</h4>
                        <div className="space-y-1">
                          {category.items.map((item) => (
                            <button
                              key={item.type}
                              onClick={() => addQuestion(item.type)}
                              className="w-full text-left p-2 rounded-lg hover:bg-accent text-sm"
                            >
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.description}
                              </div>
                            </button>
                          ))}
                        </div>
                        <Separator className="my-4" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium">Create</button>
            <button className="text-sm text-muted-foreground">Logic</button>
            <button className="text-sm text-muted-foreground">Connect</button>
            <button className="text-sm text-muted-foreground">Share</button>
            <button className="text-sm text-muted-foreground">Results</button>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push(`/forms/${form.id}`)}>
              Preview
            </Button>
            <Button variant="default">
              Publish
            </Button>
          </div>
        </div>

        {/* Form Preview */}
        <div className="flex-1 bg-background overflow-y-auto">
          <div className="max-w-3xl mx-auto py-8">
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
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      isEditing={currentEditingIndex === index}
                      onEdit={() => setCurrentEditingIndex(index)}
                      onUpdate={(updates) => updateQuestion(index, updates)}
                      onRemove={() => removeQuestion(index)}
                    />
                  ))}

                  {questions.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium mb-2">Start building your form</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add your first question to get started
                      </p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Question
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <ScrollArea className="h-96">
                            <div className="space-y-4 p-2">
                              {questionTypes.map((category) => (
                                <div key={category.category}>
                                  <h4 className="font-medium mb-2">{category.category}</h4>
                                  <div className="space-y-1">
                                    {category.items.map((item) => (
                                      <button
                                        key={item.type}
                                        onClick={() => addQuestion(item.type)}
                                        className="w-full text-left p-2 rounded-lg hover:bg-accent text-sm"
                                      >
                                        <div className="font-medium">{item.label}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {item.description}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                  <Separator className="my-4" />
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border bg-muted/30">
        <Tabs defaultValue="content">
          <div className="p-4 border-b border-border">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>
          </div>
          <ScrollArea className="h-[calc(100vh-105px)]">
            <TabsContent value="content" className="p-4 space-y-4">
              {currentEditingIndex !== null ? (
                <QuestionSettings
                  question={questions[currentEditingIndex]}
                  onChange={(updates) => updateQuestion(currentEditingIndex, updates)}
                />
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Select a question to edit its settings
                </div>
              )}
            </TabsContent>
            <TabsContent value="design" className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Form Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="progress-bar">Show progress bar</Label>
                      <Switch
                        id="progress-bar"
                        checked={formSettings.showProgressBar}
                        onCheckedChange={(checked) =>
                          setFormSettings({ ...formSettings, showProgressBar: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="question-numbers">Show question numbers</Label>
                      <Switch
                        id="question-numbers"
                        checked={formSettings.showQuestionNumbers}
                        onCheckedChange={(checked) =>
                          setFormSettings({ ...formSettings, showQuestionNumbers: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  )
}
