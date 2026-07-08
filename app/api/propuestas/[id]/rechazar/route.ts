import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSession, revisoresPara, withErrorHandling, AuthError } from '@/lib/authorization'
import { propuestaRevisarSchema } from '@/lib/validation'

type Ctx = { params: { id: string } }

export const POST = withErrorHandling(async (req: Request, { params }: Ctx) => {
  const user = await requireSession()

  const propuesta = await prisma.propuesta.findUnique({ where: { id: params.id } })
  if (!propuesta) return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
  if (propuesta.estado !== 'PENDIENTE') {
    return NextResponse.json({ error: 'La propuesta ya fue revisada' }, { status: 409 })
  }

  if (!revisoresPara(propuesta.tipo, propuesta.datos).includes(user.rol)) {
    throw new AuthError('No tienes permisos para rechazar este tipo de propuesta', 403)
  }

  const body = await req.json().catch(() => ({}))
  const { comentario } = propuestaRevisarSchema.parse(body)

  const propuestaActualizada = await prisma.propuesta.update({
    where: { id: params.id },
    data: {
      estado: 'RECHAZADA',
      revisorId: user.id,
      revisadaEn: new Date(),
      comentario,
    },
  })

  return NextResponse.json(propuestaActualizada)
})
