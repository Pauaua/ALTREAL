import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole, permisos, withErrorHandling } from '@/lib/authorization'
import { publicacionUpdateSchema } from '@/lib/validation'

type Ctx = { params: { id: string } }

export const GET = withErrorHandling(async (_req: Request, { params }: Ctx) => {
  const publicacion = await prisma.publicacion.findUnique({
    where: { id: params.id },
    include: { autor: { select: { id: true, nombre: true } } },
  })

  if (!publicacion) return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 })
  return NextResponse.json(publicacion)
})

export const PATCH = withErrorHandling(async (req: Request, { params }: Ctx) => {
  await requireRole(...permisos.publicaciones.editar)

  const body = await req.json()
  const data = publicacionUpdateSchema.parse(body)

  const existente = await prisma.publicacion.findUnique({ where: { id: params.id } })
  const pasaAPublicada = data.estado === 'PUBLICADA' && existente?.estado !== 'PUBLICADA'

  const publicacion = await prisma.publicacion.update({
    where: { id: params.id },
    data: {
      titulo: data.titulo,
      contenido: data.contenido,
      resumen: data.resumen ?? undefined,
      imagenUrl: data.imagenUrl ?? undefined,
      tipo: data.tipo,
      estado: data.estado,
      publicadaEn: pasaAPublicada ? new Date() : undefined,
    },
  })

  return NextResponse.json(publicacion)
})

export const DELETE = withErrorHandling(async (_req: Request, { params }: Ctx) => {
  await requireRole(...permisos.publicaciones.eliminar)

  await prisma.publicacion.delete({ where: { id: params.id } })

  return NextResponse.json({ ok: true })
})
