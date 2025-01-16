import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

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
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex-1 container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Forms</h1>
        <Link href="/forms/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Form
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms?.map((form) => (
          <Link
            key={form.id}
            href={`/forms/${form.id}/builder`}
            className="group block"
          >
            <div className="border border-border rounded-lg p-6 space-y-4 hover:border-foreground transition-colors">
              <h2 className="text-xl font-medium group-hover:text-primary transition-colors">
                {form.title || 'Untitled Form'}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {form.description || 'No description'}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {new Date(form.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>{form.responses || 0} responses</span>
              </div>
            </div>
          </Link>
        ))}

        {forms?.length === 0 && (
          <div className="col-span-full">
            <div className="border border-dashed border-border rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No forms yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first form to get started
              </p>
              <Link href="/forms/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Form
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
