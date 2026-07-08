import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SolicitudesClient from './SolicitudesClient'

export default async function SolicitudesPage() {
  const session = await getServerSession(authOptions)

  return <SolicitudesClient rol={session!.user.rol} usuarioId={session!.user.id} />
}
