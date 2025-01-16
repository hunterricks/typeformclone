'use client'

import { createForm, getForms } from './actions'
import { useAuth } from '@/components/AuthProvider'
import FormBuilder from '@/components/FormBuilder'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
        <div className="max-w-[600px] space-y-4 px-4">
          <h1 className="text-4xl font-bold sm:text-6xl">
            Create beautiful forms
          </h1>
          <p className="text-muted-foreground sm:text-xl">
            Build and share forms with a sleek, minimalist design. Sign in to get started.
          </p>
          <div className="pt-4">
            <Button asChild size="lg">
              <Link href="/auth">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const forms = getForms()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Forms</h1>
        <p className="mt-2 text-muted-foreground">
          Create and manage your forms
        </p>
      </div>
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
                className="block p-6 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <h3 className="text-xl font-medium">{form.title}</h3>
                {form.description && (
                  <p className="mt-2 text-muted-foreground">{form.description}</p>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  Created: {new Date(form.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
            {forms?.length === 0 && (
              <p className="text-center text-muted-foreground">No forms created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
