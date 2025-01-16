import { headers } from 'next/headers'
import AuthUI from './auth-ui'

export const dynamic = 'force-dynamic'

export default async function AuthPage() {
  return <AuthUI />
}
