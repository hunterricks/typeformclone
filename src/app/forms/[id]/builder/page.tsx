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

  // Parse questions array from JSONB
  const parsedForm = {
    ...form,
    questions: form.questions || [],
    settings: form.settings || {
      showProgressBar: true,
      showQuestionNumbers: true,
      theme: 'system',
    },
  }

  return <FormBuilder form={parsedForm} />
}
