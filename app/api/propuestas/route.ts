import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSession, withErrorHandling } from '@/lib/authorization'
import { propuestaCreateSchema } from '@/lib/validation'

export const GET = withErrorHandling(async (req: Request) => {
  await requireSession()

  const { searchParams } = new URL(req.url)
  const estado = searchParams.get('estado')
  const tipo = searchParams.get('tipo')

  const propuestas = await prisma.propuesta.findMany({
    where: {
      estado: estado ? (estado as any) : undefined,
      tipo: tipo ? (tipo as any) : undefined,
    },
    include: {
      creador: { select: { id: true, nombre: true, rol: true } },
      revisor: { select: { id: true, nombre: true, rol: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(propuestas)
})

export const POST = withErrorHandling(async (req: Request) => {
  const user = await requireSession()

  const body = await req.json()
  const { tipo, datos } = propuestaCreateSchema.parse(body)

  const propuesta = await prisma.propuesta.create({
    data: {
      tipo,
      datos,
      creadorId: user.id,
    },
  })

  return NextResponse.json(propuesta, { status: 201 })
})
