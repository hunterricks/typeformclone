'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Form, FormResponse } from '@/types/form'

export async function createForm(formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
  const supabase = createServerActionClient({ cookies })

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
  const supabase = createServerActionClient({ cookies })

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
  const supabase = createServerActionClient({ cookies })

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
  const supabase = createServerActionClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (error) throw error
  return data
}

export async function updateForm(formId: string, updates: Partial<Form>) {
  try {
    console.log('Updating form with ID:', formId)
    console.log('Update data:', updates)
    
    const supabase = createServerActionClient({ cookies })

    // First verify the user is authenticated using getUser()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('Authentication error:', userError)
      throw new Error('Not authenticated')
    }
    console.log('Authenticated as user:', user.id)

    // First check if the form exists and belongs to the user
    const { data: existingForm, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .eq('user_id', user.id)
      .single()

    if (formError) {
      console.log('Form lookup error:', formError)
      throw new Error('Form not found or you do not have permission to edit it')
    }

    if (!existingForm) {
      console.log('No existing form found')
      throw new Error('Form not found')
    }

    console.log('Found existing form:', existingForm)

    // Prepare the update data - only include fields that are actually being updated
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Only include fields that are actually being updated
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    
    // Handle JSONB fields
    if (updates.questions !== undefined) {
      updateData.questions = Array.isArray(updates.questions) 
        ? JSON.stringify(updates.questions)
        : updates.questions
    }
    
    if (updates.settings !== undefined) {
      updateData.settings = typeof updates.settings === 'object'
        ? JSON.stringify(updates.settings)
        : updates.settings
    }

    console.log('Prepared update data:', updateData)

    // First perform the update
    const { error: updateError } = await supabase
      .from('forms')
      .update(updateData)
      .eq('id', formId)
      .eq('user_id', user.id)

    if (updateError) {
      console.log('Update error:', updateError)
      throw new Error(`Failed to update form: ${updateError.message}`)
    }

    // Then fetch the updated form
    const { data: updatedForm, error: fetchError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !updatedForm) {
      console.log('Error fetching updated form:', fetchError)
      throw new Error('Failed to fetch updated form')
    }

    console.log('Update successful, returned data:', updatedForm)

    // Parse the JSONB fields back to objects
    const parsedResult = {
      ...updatedForm,
      questions: typeof updatedForm.questions === 'string'
        ? JSON.parse(updatedForm.questions)
        : updatedForm.questions || [],
      settings: typeof updatedForm.settings === 'string'
        ? JSON.parse(updatedForm.settings)
        : updatedForm.settings || {}
    }

    console.log('Parsed result:', parsedResult)
    return parsedResult
  } catch (error) {
    console.error('Error updating form:', error)
    throw error instanceof Error ? error : new Error('An unknown error occurred')
  }
}
