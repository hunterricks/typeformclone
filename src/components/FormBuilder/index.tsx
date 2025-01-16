'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Settings2, Pencil, Eye, Share2, BarChart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateForm } from '@/app/actions'
import { Form, FormQuestion, QuestionType } from '@/types/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import QuestionList from './QuestionList'
import QuestionTypeMenu from './QuestionTypeMenu'
import QuestionEditor from './QuestionEditor'

interface FormBuilderProps {
  form: Form
}

export default function FormBuilder({ form }: FormBuilderProps) {
  const [questions, setQuestions] = useState<FormQuestion[]>(form?.questions || [])
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const saveForm = useCallback(async (updates: Partial<Form>) => {
    if (!form?.id) return

    try {
      startTransition(async () => {
        await updateForm(form.id, updates)
        router.refresh()
      })
    } catch (error) {
      console.error('Error saving form:', error)
      toast({
        title: 'Error',
        description: 'Failed to save changes',
        variant: 'destructive',
      })
    }
  }, [form?.id, router, toast])

  const addQuestion = useCallback((type: QuestionType) => {
    const newQuestion: FormQuestion = {
      id: crypto.randomUUID(),
      type,
      title: '',
      description: '',
      required: false,
    }
    
    const newQuestions = [...questions, newQuestion]
    setQuestions(newQuestions)
    setSelectedQuestionIndex(newQuestions.length - 1)
    saveForm({ questions: newQuestions })
  }, [questions, saveForm])

  const updateQuestion = useCallback((index: number, updates: Partial<FormQuestion>) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], ...updates }
    setQuestions(newQuestions)
    saveForm({ questions: newQuestions })
  }, [questions, saveForm])

  const deleteQuestion = useCallback((index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    setQuestions(newQuestions)
    setSelectedQuestionIndex(null)
    saveForm({ questions: newQuestions })
  }, [questions, saveForm])

  const duplicateQuestion = useCallback((index: number) => {
    const questionToDuplicate = questions[index]
    const newQuestion = {
      ...questionToDuplicate,
      id: crypto.randomUUID(),
      title: `${questionToDuplicate.title} (copy)`,
    }
    const newQuestions = [...questions]
    newQuestions.splice(index + 1, 0, newQuestion)
    setQuestions(newQuestions)
    setSelectedQuestionIndex(index + 1)
    saveForm({ questions: newQuestions })
  }, [questions, saveForm])

  const moveQuestion = useCallback((fromIndex: number, toIndex: number) => {
    const newQuestions = [...questions]
    const [movedQuestion] = newQuestions.splice(fromIndex, 1)
    newQuestions.splice(toIndex, 0, movedQuestion)
    setQuestions(newQuestions)
    setSelectedQuestionIndex(toIndex)
    saveForm({ questions: newQuestions })
  }, [questions, saveForm])

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Question List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="h-14 border-b border-border flex items-center px-4">
          <Input
            value={form.title}
            onChange={(e) => saveForm({ title: e.target.value })}
            className="h-9"
            placeholder="Form title"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-4 space-y-4">
            <QuestionList
              questions={questions}
              selectedIndex={selectedQuestionIndex}
              onSelect={setSelectedQuestionIndex}
              onDelete={deleteQuestion}
              onDuplicate={duplicateQuestion}
              onMove={moveQuestion}
            />
            <QuestionTypeMenu onSelect={addQuestion} />
          </div>
        </div>
      </div>

      {/* Main Content - Question Editor */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Pencil className="w-4 h-4 mr-2" />
              Create
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Settings2 className="w-4 h-4 mr-2" />
              Logic
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <BarChart className="w-4 h-4 mr-2" />
              Results
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/forms/${form.id}`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">Publish</Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto py-8 px-4">
              {selectedQuestionIndex !== null ? (
                <QuestionEditor
                  question={questions[selectedQuestionIndex]}
                  onChange={(updates) => updateQuestion(selectedQuestionIndex, updates)}
                  onDelete={() => deleteQuestion(selectedQuestionIndex)}
                  onDuplicate={() => duplicateQuestion(selectedQuestionIndex)}
                />
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Start building your form</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first question from the menu on the left
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
