import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole, permisos, withErrorHandling } from '@/lib/authorization'
import { eventoUpdateSchema } from '@/lib/validation'

type Ctx = { params: { id: string } }

export const PATCH = withErrorHandling(async (req: Request, { params }: Ctx) => {
  await requireRole(...permisos.eventos.editar)

  const body = await req.json()
  const data = eventoUpdateSchema.parse(body)

  const evento = await prisma.evento.update({
    where: { id: params.id },
    data: {
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha: data.fecha,
      tipo: data.tipo,
    },
    include: { creador: { select: { id: true, nombre: true } } },
  })

  return NextResponse.json(evento)
})

export const DELETE = withErrorHandling(async (_req: Request, { params }: Ctx) => {
  await requireRole(...permisos.eventos.eliminar)

  await prisma.evento.delete({ where: { id: params.id } })

  return NextResponse.json({ ok: true })
})
