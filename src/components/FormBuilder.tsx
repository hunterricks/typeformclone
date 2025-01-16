'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'

export default function FormBuilder() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast({
          title: 'Error',
          description: 'You must be logged in to create a form',
          variant: 'destructive',
        })
        return
      }

      const { data, error } = await supabase
        .from('forms')
        .insert([
          {
            title,
            description,
            user_id: session.user.id,
            questions: [],
          },
        ])
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Form created successfully',
      })

      router.refresh()
      setTitle('')
      setDescription('')

      if (data) {
        router.push(`/forms/${data.id}`)
      }
    } catch (error) {
      console.error('Error creating form:', error)
      toast({
        title: 'Error',
        description: 'Failed to create form. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Form</CardTitle>
          <CardDescription>
            Create a new form to collect responses from your users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Form Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter your form title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Form Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for your form"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              'Creating...'
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Form
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
