import { create } from 'zustand'
import { Form, FormQuestion } from '@/types/form'

interface FormStore {
  currentForm: Form | null
  currentQuestionIndex: number
  answers: Record<string, any>
  setForm: (form: Form) => void
  setCurrentQuestionIndex: (index: number) => void
  setAnswer: (questionId: string, answer: any) => void
  resetForm: () => void
}

export const useFormStore = create<FormStore>((set) => ({
  currentForm: null,
  currentQuestionIndex: 0,
  answers: {},
  setForm: (form) => set({ currentForm: form }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  resetForm: () => set({ currentForm: null, currentQuestionIndex: 0, answers: {} }),
}))
