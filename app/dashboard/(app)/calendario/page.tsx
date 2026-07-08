import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import CalendarioClient from './CalendarioClient'

export default async function CalendarioPage() {
  const session = await getServerSession(authOptions)

  return <CalendarioClient rol={session!.user.rol} />
}
