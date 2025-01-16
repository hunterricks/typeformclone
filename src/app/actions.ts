'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Form, FormResponse } from '@/types/form'

export async function createForm(formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('forms')
    .insert({
      ...formData,
      user_id: session.user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function submitFormResponse(formResponse: Omit<FormResponse, 'id' | 'submittedAt'>) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const { data, error } = await supabase
    .from('form_responses')
    .insert({
      ...formResponse,
      user_id: session?.user?.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getForms() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getForm(id: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updateForm(formId: string, updates: Partial<Form>) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('forms')
    .update(updates)
    .eq('id', formId)
    .eq('user_id', session.user.id)
    .select()
    .single()

  if (error) throw error
  return data
}
