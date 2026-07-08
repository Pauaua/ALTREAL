import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'
import { requireRole, permisos, withErrorHandling } from '@/lib/authorization'

type Ctx = { params: { id: string } }

const TIPOS_PERMITIDOS = ['CARTA_GANTT', 'PRESENTACION', 'IMAGEN_REFERENCIAL', 'OTRO'] as const

const MIME_PERMITIDOS: Record<string, true> = {
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
  'application/pdf': true,
  'image/jpeg': true,
}

const TAMANO_MAXIMO = 20 * 1024 * 1024 // 20 MB

export const POST = withErrorHandling(async (req: Request, { params }: Ctx) => {
  await requireRole(...permisos.proyectos.editar)

  const proyecto = await prisma.proyecto.findUnique({ where: { id: params.id } })
  if (!proyecto) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file')
  const tipo = formData.get('tipo')?.toString() ?? 'OTRO'

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Falta el archivo' }, { status: 400 })
  }
  if (!TIPOS_PERMITIDOS.includes(tipo as any)) {
    return NextResponse.json({ error: 'Tipo de adjunto inválido' }, { status: 400 })
  }
  if (!MIME_PERMITIDOS[file.type]) {
    return NextResponse.json(
      { error: 'Formato no permitido. Solo se aceptan Word, PDF y JPG/JPEG' },
      { status: 400 }
    )
  }
  if (file.size > TAMANO_MAXIMO) {
    return NextResponse.json({ error: 'El archivo supera el tamaño máximo de 20MB' }, { status: 400 })
  }

  const blob = await put(`proyectos/${params.id}/${Date.now()}-${file.name}`, file, {
    access: 'public',
  })

  const adjunto = await prisma.adjunto.create({
    data: {
      proyectoId: params.id,
      tipo: tipo as any,
      nombre: file.name,
      url: blob.url,
      mimeType: file.type,
      tamano: file.size,
    },
  })

  return NextResponse.json(adjunto, { status: 201 })
})

export const GET = withErrorHandling(async (_req: Request, { params }: Ctx) => {
  const adjuntos = await prisma.adjunto.findMany({
    where: { proyectoId: params.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(adjuntos)
})
