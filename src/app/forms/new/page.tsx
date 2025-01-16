import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewFormPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  // Create a new form
  const { data: form } = await supabase
    .from('forms')
    .insert([
      {
        title: 'Untitled Form',
        user_id: session.user.id,
        questions: [],
      },
    ])
    .select()
    .single()

  if (form) {
    redirect(`/forms/${form.id}/builder`)
  }

  redirect('/forms')
}
