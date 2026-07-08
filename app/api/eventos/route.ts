import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole, requireSession, permisos, withErrorHandling } from '@/lib/authorization'
import { eventoCreateSchema } from '@/lib/validation'

export const GET = withErrorHandling(async (req: Request) => {
  await requireSession()

  const { searchParams } = new URL(req.url)
  const desde = searchParams.get('desde')
  const hasta = searchParams.get('hasta')

  const eventos = await prisma.evento.findMany({
    where: {
      fecha: {
        gte: desde ? new Date(desde) : undefined,
        lte: hasta ? new Date(hasta) : undefined,
      },
    },
    include: { creador: { select: { id: true, nombre: true } } },
    orderBy: { fecha: 'asc' },
  })

  return NextResponse.json(eventos)
})

export const POST = withErrorHandling(async (req: Request) => {
  const user = await requireRole(...permisos.eventos.crear)

  const body = await req.json()
  const data = eventoCreateSchema.parse(body)

  const evento = await prisma.evento.create({
    data: {
      titulo: data.titulo,
      descripcion: data.descripcion ?? undefined,
      fecha: data.fecha,
      tipo: data.tipo ?? 'EVENTO',
      creadorId: user.id,
    },
    include: { creador: { select: { id: true, nombre: true } } },
  })

  return NextResponse.json(evento, { status: 201 })
})
