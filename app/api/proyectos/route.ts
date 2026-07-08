import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole, requireSession, permisos, withErrorHandling } from '@/lib/authorization'
import { proyectoCreateSchema } from '@/lib/validation'

export const GET = withErrorHandling(async () => {
  await requireSession()

  const proyectos = await prisma.proyecto.findMany({
    include: {
      usuarios: { select: { usuario: { select: { id: true, nombre: true, correo: true } } } },
      adjuntos: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(proyectos)
})

export const POST = withErrorHandling(async (req: Request) => {
  await requireRole(...permisos.proyectos.crear)

  const body = await req.json()
  const data = proyectoCreateSchema.parse(body)

  const proyecto = await prisma.proyecto.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      fechaInicio: data.fechaInicio,
      fechaTermino: data.fechaTermino ?? undefined,
      insumosNecesarios: data.insumosNecesarios,
      cantidadPersonasNecesarias: data.cantidadPersonasNecesarias,
      organizacionesInvitadas: data.organizacionesInvitadas ?? [],
      activo: data.activo ?? true,
      usuarios: data.usuarioIds
        ? { create: data.usuarioIds.map((usuarioId) => ({ usuarioId })) }
        : undefined,
    },
    include: {
      usuarios: { select: { usuario: { select: { id: true, nombre: true } } } },
    },
  })

  return NextResponse.json(proyecto, { status: 201 })
})
