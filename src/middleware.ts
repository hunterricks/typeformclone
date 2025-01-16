import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedDomains = [
  'localhost:3000',
  'typeformclone-3v0q57x2d-whateverapp.vercel.app',
  'typeformclone-git-main-whateverapp.vercel.app'
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const hostname = req.headers.get('host') || ''
  
  // Verify the hostname is allowed
  if (!allowedDomains.includes(hostname) && !hostname.endsWith('.vercel.app')) {
    return new NextResponse('Not Authorized', { status: 403 })
  }

  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /auth,
  // redirect the user to /auth
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and the current path is /auth,
  // redirect the user to /forms
  if (session && req.nextUrl.pathname === '/auth') {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/forms'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
