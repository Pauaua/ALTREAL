import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { prisma } from '@/lib/prisma'
import { requireRole, permisos, withErrorHandling } from '@/lib/authorization'

type Ctx = { params: { id: string } }

export const DELETE = withErrorHandling(async (_req: Request, { params }: Ctx) => {
  await requireRole(...permisos.proyectos.editar)

  const adjunto = await prisma.adjunto.findUnique({ where: { id: params.id } })
  if (!adjunto) return NextResponse.json({ error: 'Adjunto no encontrado' }, { status: 404 })

  await del(adjunto.url)
  await prisma.adjunto.delete({ where: { id: params.id } })

  return NextResponse.json({ ok: true })
})
