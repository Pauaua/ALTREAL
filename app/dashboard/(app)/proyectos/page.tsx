import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ProyectosClient from './ProyectosClient'

export default async function ProyectosPage() {
  const session = await getServerSession(authOptions)

  return <ProyectosClient rol={session!.user.rol} usuarioId={session!.user.id} />
}
