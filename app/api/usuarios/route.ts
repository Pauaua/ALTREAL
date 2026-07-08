import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireRole, requireSession, permisos, withErrorHandling } from '@/lib/authorization'
import { usuarioCreateSchema } from '@/lib/validation'

export const GET = withErrorHandling(async () => {
  await requireSession()

  const usuarios = await prisma.usuario.findMany({
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
        select: { proyecto: { select: { id: true, nombre: true } } },
      },
    },
    orderBy: { nombre: 'asc' },
  })

  return NextResponse.json(usuarios)
})

export const POST = withErrorHandling(async (req: Request) => {
  await requireRole(...permisos.usuarios.crear)

  const body = await req.json()
  const data = usuarioCreateSchema.parse(body)

  const existente = await prisma.usuario.findUnique({ where: { correo: data.correo.toLowerCase().trim() } })
  if (existente) {
    return NextResponse.json({ error: 'Ya existe un usuario con ese correo' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(data.password, 10)

  const usuario = await prisma.usuario.create({
    data: {
      nombre: data.nombre,
      correo: data.correo.toLowerCase().trim(),
      passwordHash,
      telefono: data.telefono ?? undefined,
      comunaResidencia: data.comunaResidencia ?? undefined,
      fechaIngreso: data.fechaIngreso ?? undefined,
      activo: data.activo ?? true,
      rol: data.rol ?? 'ALT',
      proyectos: data.proyectoIds
        ? { create: data.proyectoIds.map((proyectoId) => ({ proyectoId })) }
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

  return NextResponse.json(usuario, { status: 201 })
})
