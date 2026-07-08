import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireRole, requireSession, permisos, withErrorHandling } from '@/lib/authorization'
import { usuarioUpdateSchema } from '@/lib/validation'

type Ctx = { params: { id: string } }

export const GET = withErrorHandling(async (_req: Request, { params }: Ctx) => {
  await requireSession()

  const usuario = await prisma.usuario.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      nombre: true,
      correo: true,
      telefono: true,
      comunaResidencia: true,
      fechaIngreso: true,
      fechaRegistro: true,
      activo: true,
      rol: true,
      proyectos: {
        select: { proyecto: { select: { id: true, nombre: true, activo: true } } },
      },
    },
  })

  if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  return NextResponse.json(usuario)
})

export const PATCH = withErrorHandling(async (req: Request, { params }: Ctx) => {
  await requireRole(...permisos.usuarios.editar)

  const body = await req.json()
  const data = usuarioUpdateSchema.parse(body)

  const usuario = await prisma.usuario.update({
    where: { id: params.id },
    data: {
      nombre: data.nombre,
      correo: data.correo ? data.correo.toLowerCase().trim() : undefined,
      passwordHash: data.password ? await bcrypt.hash(data.password, 10) : undefined,
      telefono: data.telefono ?? undefined,
      comunaResidencia: data.comunaResidencia ?? undefined,
      fechaIngreso: data.fechaIngreso ?? undefined,
      activo: data.activo,
      rol: data.rol,
      proyectos: data.proyectoIds
        ? {
            deleteMany: {},
            create: data.proyectoIds.map((proyectoId) => ({ proyectoId })),
          }
        : undefined,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      telefono: true,
      comunaResidencia: true,
      fechaIngreso: true,
      fechaRegistro: true,
      activo: true,
      rol: true,
    },
  })

  return NextResponse.json(usuario)
})

export const DELETE = withErrorHandling(async (_req: Request, { params }: Ctx) => {
  await requireRole(...permisos.usuarios.eliminar)

  await prisma.usuario.delete({ where: { id: params.id } })

  return NextResponse.json({ ok: true })
})
