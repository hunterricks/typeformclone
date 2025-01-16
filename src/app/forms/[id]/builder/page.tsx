import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import FormBuilder from '@/components/FormBuilder/index'

export const dynamic = 'force-dynamic'

export default async function BuilderPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth')
  }

  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (formError || !form) {
    redirect('/forms')
  }

  // Parse questions and settings from JSONB
  const parsedForm = {
    ...form,
    questions: typeof form.questions === 'string' 
      ? JSON.parse(form.questions) 
      : form.questions || [],
    settings: typeof form.settings === 'string'
      ? JSON.parse(form.settings)
      : form.settings || {
          showProgressBar: true,
          showQuestionNumbers: true,
          theme: 'system',
        },
  }

  return <FormBuilder form={parsedForm} />
}
