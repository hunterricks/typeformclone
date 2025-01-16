'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { Button } from './ui/button'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg tracking-tight">TypeForm Clone</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button
                onClick={signOut}
                variant="default"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              asChild
              variant="default"
              size="sm"
            >
              <Link href="/auth">
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
