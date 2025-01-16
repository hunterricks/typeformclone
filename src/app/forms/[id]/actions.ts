'use server'

import { submitFormResponse } from '@/app/actions'

export async function handleFormSubmit(formId: string, answers: { question_id: string; value: any }[]) {
  await submitFormResponse({
    form_id: formId,
    answers,
  })
}
