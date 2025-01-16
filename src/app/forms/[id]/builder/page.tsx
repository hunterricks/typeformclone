import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import FormBuilder from '@/components/FormBuilder'

export const dynamic = 'force-dynamic'

export default async function BuilderPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  const { data: form } = await supabase
    .from('forms')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!form || form.user_id !== session.user.id) {
    redirect('/forms')
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border bg-muted/30">
        <div className="p-4 border-b border-border">
          <h2 className="font-medium">Content</h2>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                1
              </span>
              Multiple Choice
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium">Create</button>
            <button className="text-sm text-muted-foreground">Logic</button>
            <button className="text-sm text-muted-foreground">Connect</button>
            <button className="text-sm text-muted-foreground">Share</button>
            <button className="text-sm text-muted-foreground">Results</button>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium px-4 py-1.5 rounded-full bg-primary text-primary-foreground">
              Publish
            </button>
          </div>
        </div>

        {/* Form Preview */}
        <div className="flex-1 bg-background">
          <div className="max-w-3xl mx-auto py-8">
            <FormBuilder form={form} />
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border bg-muted/30">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium">Content</button>
            <button className="text-sm text-muted-foreground">Design</button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Question</h3>
              <div className="flex gap-2">
                <button className="flex-1 p-2 rounded-lg border border-border text-sm text-center">
                  Text
                </button>
                <button className="flex-1 p-2 rounded-lg border border-border text-sm text-center">
                  Video
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Required</span>
                  <input type="checkbox" className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Multiple selection</span>
                  <input type="checkbox" className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Randomize</span>
                  <input type="checkbox" className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">"Other" option</span>
                  <input type="checkbox" className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Vertical alignment</span>
                  <input type="checkbox" className="toggle" />
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Image or video</h3>
              <button className="w-full p-2 rounded-lg border border-border text-sm text-center">
                Add media
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
