import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import UsuariosClient from './UsuariosClient'

export default async function UsuariosPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.rol !== 'ADMIN') redirect('/dashboard')

  return <UsuariosClient />
}
