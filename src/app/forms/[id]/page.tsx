import { getForm } from '@/app/actions'
import FormView from '@/components/FormView'
import { submitFormResponse } from '@/app/actions'

interface FormPageProps {
  params: {
    id: string
  }
}

export default async function FormPage({ params }: FormPageProps) {
  const form = await getForm(params.id)

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Form not found</h1>
          <p className="mt-2 text-gray-600">The form you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (answers: Record<string, any>) => {
    'use server'
    await submitFormResponse({
      formId: form.id,
      answers,
    })
  }

  return <FormView form={form} onSubmit={handleSubmit} />
}
