import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole, permisos, withErrorHandling } from '@/lib/authorization'
import { publicacionCreateSchema } from '@/lib/validation'

export const GET = withErrorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo')

  const publicaciones = await prisma.publicacion.findMany({
    where: tipo ? { tipo: tipo as any } : undefined,
    include: { autor: { select: { id: true, nombre: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(publicaciones)
})

export const POST = withErrorHandling(async (req: Request) => {
  const user = await requireRole(...permisos.publicaciones.crear)

  const body = await req.json()
  const data = publicacionCreateSchema.parse(body)

  const publicacion = await prisma.publicacion.create({
    data: {
      titulo: data.titulo,
      contenido: data.contenido,
      resumen: data.resumen ?? undefined,
      imagenUrl: data.imagenUrl ?? undefined,
      tipo: data.tipo ?? 'BLOG',
      estado: data.estado ?? 'BORRADOR',
      autorId: user.id,
      publicadaEn: data.estado === 'PUBLICADA' ? new Date() : undefined,
    },
  })

  return NextResponse.json(publicacion, { status: 201 })
})
