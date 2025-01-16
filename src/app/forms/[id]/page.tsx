'use client'

import { getForm } from '@/app/actions'
import FormView from '@/components/FormView'
import { handleFormSubmit } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-xl font-medium">{form.title}</h1>
          <Link href={`/forms/${params.id}/builder`}>
            <Button>Edit Form</Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 container py-8">
        <FormView 
          form={form} 
          onSubmit={(answers) => handleFormSubmit(form.id, answers)} 
        />
      </div>
    </div>
  )
}
