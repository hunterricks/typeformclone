import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthUI from './auth-ui'

export default async function AuthPage() {
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

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8 px-4">
        <div>
          <h1 className="text-center text-3xl font-bold">Welcome to TypeForm Clone</h1>
          <p className="mt-2 text-center text-gray-600">
            Please sign in to continue
          </p>
        </div>
        <AuthUI />
      </div>
    </div>
  )
}
