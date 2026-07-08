import { NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireSession, revisoresPara, withErrorHandling, AuthError } from '@/lib/authorization'
import {
  usuarioCreateSchema,
  proyectoCreateSchema,
  proyectoUnirseSchema,
  publicacionCreateSchema,
  propuestaRevisarSchema,
} from '@/lib/validation'

type Ctx = { params: { id: string } }

export const POST = withErrorHandling(async (req: Request, { params }: Ctx) => {
  const user = await requireSession()

  const propuesta = await prisma.propuesta.findUnique({ where: { id: params.id } })
  if (!propuesta) return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
  if (propuesta.estado !== 'PENDIENTE') {
    return NextResponse.json({ error: 'La propuesta ya fue revisada' }, { status: 409 })
  }

  if (!revisoresPara(propuesta.tipo, propuesta.datos).includes(user.rol)) {
    throw new AuthError('No tienes permisos para aprobar este tipo de propuesta', 403)
  }

  const body = await req.json().catch(() => ({}))
  const { comentario } = propuestaRevisarSchema.parse(body)

  let passwordTemporal: string | undefined

  const entidadCreada = await prisma.$transaction(async (tx) => {
    if (propuesta.tipo === 'USUARIO') {
      const datos = usuarioCreateSchema
        .omit({ password: true })
        .extend({ password: usuarioCreateSchema.shape.password.optional() })
        .parse(propuesta.datos)

      passwordTemporal = datos.password ?? crypto.randomBytes(9).toString('base64url')
      const passwordHash = await bcrypt.hash(passwordTemporal, 10)

      return tx.usuario.create({
        data: {
          nombre: datos.nombre,
          correo: datos.correo.toLowerCase().trim(),
          passwordHash,
          telefono: datos.telefono ?? undefined,
          comunaResidencia: datos.comunaResidencia ?? undefined,
          fechaIngreso: datos.fechaIngreso ?? undefined,
          activo: datos.activo ?? true,
          rol: datos.rol ?? 'ALT',
          proyectos: datos.proyectoIds
            ? { create: datos.proyectoIds.map((proyectoId) => ({ proyectoId })) }
            : undefined,
        },
        select: { id: true, nombre: true, correo: true, rol: true },
      })
    }

    if (propuesta.tipo === 'PROYECTO' && (propuesta.datos as any)?.accion === 'unirse') {
      const datos = proyectoUnirseSchema.parse(propuesta.datos)
      await tx.proyectoUsuario.upsert({
        where: { usuarioId_proyectoId: { usuarioId: datos.usuarioId, proyectoId: datos.proyectoId } },
        create: { usuarioId: datos.usuarioId, proyectoId: datos.proyectoId },
        update: {},
      })
      return tx.proyecto.findUnique({ where: { id: datos.proyectoId } })
    }

    if (propuesta.tipo === 'PROYECTO') {
      const datos = proyectoCreateSchema.parse(propuesta.datos)
      return tx.proyecto.create({
        data: {
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          fechaInicio: datos.fechaInicio,
          fechaTermino: datos.fechaTermino ?? undefined,
          insumosNecesarios: datos.insumosNecesarios,
          cantidadPersonasNecesarias: datos.cantidadPersonasNecesarias,
          organizacionesInvitadas: datos.organizacionesInvitadas ?? [],
          activo: datos.activo ?? true,
          usuarios: datos.usuarioIds
            ? { create: datos.usuarioIds.map((usuarioId) => ({ usuarioId })) }
            : undefined,
        },
      })
    }

    // PUBLICACION
    const datos = publicacionCreateSchema.parse(propuesta.datos)
    return tx.publicacion.create({
      data: {
        titulo: datos.titulo,
        contenido: datos.contenido,
        resumen: datos.resumen ?? undefined,
        imagenUrl: datos.imagenUrl ?? undefined,
        estado: datos.estado ?? 'BORRADOR',
        autorId: propuesta.creadorId,
        publicadaEn: datos.estado === 'PUBLICADA' ? new Date() : undefined,
      },
    })
  })

  const propuestaActualizada = await prisma.propuesta.update({
    where: { id: params.id },
    data: {
      estado: 'APROBADA',
      revisorId: user.id,
      revisadaEn: new Date(),
      comentario,
    },
  })

  return NextResponse.json({
    propuesta: propuestaActualizada,
    entidadCreada,
    passwordTemporal,
  })
})
