export type QuestionType = 'text' | 'number' | 'choice' | 'email' | 'date' | 'rating'

export interface FormQuestion {
  id: string
  type: QuestionType
  title: string
  description?: string
  required: boolean
  options?: string[] // For choice questions
  min?: number // For rating questions
  max?: number // For rating questions
}

export interface Form {
  id: string
  title: string
  description?: string
  questions: FormQuestion[]
  createdAt: string
  updatedAt: string
  userId: string
}

export interface FormResponse {
  id: string
  formId: string
  answers: Record<string, any> // question_id: answer
  submittedAt: string
  userId?: string
}
