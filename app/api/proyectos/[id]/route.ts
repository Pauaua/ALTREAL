import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole, requireSession, permisos, withErrorHandling } from '@/lib/authorization'
import { proyectoUpdateSchema } from '@/lib/validation'

type Ctx = { params: { id: string } }

export const GET = withErrorHandling(async (_req: Request, { params }: Ctx) => {
  await requireSession()

  const proyecto = await prisma.proyecto.findUnique({
    where: { id: params.id },
    include: {
      usuarios: { select: { usuario: { select: { id: true, nombre: true, correo: true } } } },
      adjuntos: true,
    },
  })

  if (!proyecto) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
  return NextResponse.json(proyecto)
})

export const PATCH = withErrorHandling(async (req: Request, { params }: Ctx) => {
  await requireRole(...permisos.proyectos.editar)

  const body = await req.json()
  const data = proyectoUpdateSchema.parse(body)

  const proyecto = await prisma.proyecto.update({
    where: { id: params.id },
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      fechaInicio: data.fechaInicio,
      fechaTermino: data.fechaTermino,
      insumosNecesarios: data.insumosNecesarios,
      cantidadPersonasNecesarias: data.cantidadPersonasNecesarias,
      organizacionesInvitadas: data.organizacionesInvitadas,
      activo: data.activo,
    },
    include: {
      usuarios: { select: { usuario: { select: { id: true, nombre: true } } } },
    },
  })

  return NextResponse.json(proyecto)
})

export const DELETE = withErrorHandling(async (_req: Request, { params }: Ctx) => {
  await requireRole(...permisos.proyectos.eliminar)

  await prisma.proyecto.delete({ where: { id: params.id } })

  return NextResponse.json({ ok: true })
})
