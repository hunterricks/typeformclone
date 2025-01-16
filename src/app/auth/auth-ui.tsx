'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@supabase/supabase-js'

export default function AuthUI() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-[400px] px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                  inputBackground: 'transparent',
                  inputText: 'white',
                  inputBorder: '#333333',
                  inputBorderFocus: 'white',
                  inputBorderHover: '#4d4d4d',
                  inputPlaceholder: '#666666',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'bg-white text-black hover:bg-white/90 w-full py-2 rounded-md font-medium',
              input: 'bg-transparent border border-border rounded-md w-full p-2 text-foreground',
              label: 'text-foreground',
              message: 'text-muted-foreground text-sm',
            }
          }}
          theme="dark"
          providers={['google']}
        />
      </div>
    </div>
  )
}
