import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireSession, withErrorHandling } from '@/lib/authorization'
import { usuarioMeUpdateSchema } from '@/lib/validation'

export const GET = withErrorHandling(async () => {
  const session = await requireSession()

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      nombre: true,
      correo: true,
      avatarUrl: true,
      telefono: true,
      comunaResidencia: true,
      fechaIngreso: true,
      fechaRegistro: true,
      activo: true,
      rol: true,
      tallaPolera: true,
      tallaPantalon: true,
      alturaCm: true,
      pesoKg: true,
      proyectos: {
        select: { proyecto: { select: { id: true, nombre: true, activo: true } } },
      },
    },
  })

  return NextResponse.json(usuario)
})

export const PATCH = withErrorHandling(async (req: Request) => {
  const session = await requireSession()

  const body = await req.json()
  const data = usuarioMeUpdateSchema.parse(body)

  let passwordHash: string | undefined

  if (data.passwordNueva) {
    if (!data.passwordActual) {
      return NextResponse.json(
        { error: 'Debes indicar tu contraseña actual para cambiarla' },
        { status: 400 }
      )
    }
    const usuario = await prisma.usuario.findUnique({ where: { id: session.id } })
    const valida = usuario && (await bcrypt.compare(data.passwordActual, usuario.passwordHash))
    if (!valida) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 })
    }
    passwordHash = await bcrypt.hash(data.passwordNueva, 10)
  }

  const usuario = await prisma.usuario.update({
    where: { id: session.id },
    data: {
      nombre: data.nombre,
      telefono: data.telefono ?? undefined,
      comunaResidencia: data.comunaResidencia ?? undefined,
      avatarUrl: data.avatarUrl,
      tallaPolera: data.tallaPolera ?? undefined,
      tallaPantalon: data.tallaPantalon ?? undefined,
      alturaCm: data.alturaCm ?? undefined,
      pesoKg: data.pesoKg ?? undefined,
      passwordHash,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      avatarUrl: true,
      telefono: true,
      comunaResidencia: true,
      rol: true,
      tallaPolera: true,
      tallaPantalon: true,
      alturaCm: true,
      pesoKg: true,
    },
  })

  return NextResponse.json(usuario)
})
