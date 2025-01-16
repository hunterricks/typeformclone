export type QuestionType =
  | 'multiple_choice'
  | 'text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'website'
  | 'date'
  | 'time'
  | 'number'
  | 'rating'
  | 'yes_no'
  | 'dropdown'
  | 'picture_choice'
  | 'ranking'
  | 'welcome_screen'
  | 'end_screen'
  | 'statement'

export interface FormQuestion {
  id: string
  type: QuestionType
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
    min?: number
    max?: number
  }
}

export interface Form {
  id: string
  title: string
  description?: string
  user_id: string
  questions: FormQuestion[]
  settings?: {
    showProgressBar?: boolean
    showQuestionNumbers?: boolean
    theme?: string
  }
  created_at?: string
  updated_at?: string
  published?: boolean
  responses_count?: number
}

export interface FormResponse {
  id?: string
  form_id: string
  answers: {
    question_id: string
    value: any
  }[]
  submitted_at?: string
  user_id?: string
}
