import { createForm, getForms } from './actions'
import FormBuilder from '@/components/FormBuilder'
import Link from 'next/link'

export default async function Home() {
  const forms = await getForms()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          TypeForm Clone
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Create beautiful, interactive forms with ease
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Create New Form</h2>
            <FormBuilder onSave={createForm} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Forms</h2>
            <div className="space-y-4">
              {forms?.map((form) => (
                <Link
                  key={form.id}
                  href={`/forms/${form.id}`}
                  className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-medium">{form.title}</h3>
                  {form.description && (
                    <p className="mt-2 text-gray-600">{form.description}</p>
                  )}
                  <p className="mt-4 text-sm text-gray-500">
                    Created: {new Date(form.created_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
              {forms?.length === 0 && (
                <p className="text-center text-gray-500">No forms created yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
