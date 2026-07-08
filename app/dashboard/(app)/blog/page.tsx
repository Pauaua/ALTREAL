import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import PublicacionesClient from '@/components/dashboard/PublicacionesClient'

export default async function BlogPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.rol === 'ALT') redirect('/dashboard')

  return <PublicacionesClient tipo="BLOG" titulo="Blog" />
}
