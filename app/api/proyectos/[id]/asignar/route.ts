import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole, permisos, withErrorHandling } from '@/lib/authorization'
import { asignarUsuariosSchema } from '@/lib/validation'

type Ctx = { params: { id: string } }

// Asigna (agrega) usuarios a un proyecto existente. No elimina asignaciones previas.
export const POST = withErrorHandling(async (req: Request, { params }: Ctx) => {
  await requireRole(...permisos.proyectos.asignar)

  const body = await req.json()
  const { usuarioIds } = asignarUsuariosSchema.parse(body)

  await prisma.proyectoUsuario.createMany({
    data: usuarioIds.map((usuarioId) => ({ usuarioId, proyectoId: params.id })),
    skipDuplicates: true,
  })

  const proyecto = await prisma.proyecto.findUnique({
    where: { id: params.id },
    include: {
      usuarios: { select: { usuario: { select: { id: true, nombre: true, correo: true } } } },
    },
  })

  return NextResponse.json(proyecto)
})

// Quita usuarios de un proyecto.
export const DELETE = withErrorHandling(async (req: Request, { params }: Ctx) => {
  await requireRole(...permisos.proyectos.asignar)

  const body = await req.json()
  const { usuarioIds } = asignarUsuariosSchema.parse(body)

  await prisma.proyectoUsuario.deleteMany({
    where: { proyectoId: params.id, usuarioId: { in: usuarioIds } },
  })

  return NextResponse.json({ ok: true })
})
