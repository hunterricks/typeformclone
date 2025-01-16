import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import FormBuilder from '@/components/FormBuilder'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  const { data: forms } = await supabase
    .from('forms')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Forms</h1>
        <p className="mt-2 text-muted-foreground">
          Create and manage your forms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <FormBuilder />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Forms</h2>
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
            {(!forms || forms.length === 0) && (
              <div className="text-center p-6 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No forms created yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first form using the form builder
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
