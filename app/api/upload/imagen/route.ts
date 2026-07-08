import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireSession, requireRole, permisos, withErrorHandling, AuthError } from '@/lib/authorization'

const MIME_PERMITIDOS: Record<string, true> = {
  'image/jpeg': true,
  'image/png': true,
  'image/webp': true,
  'image/gif': true,
}

const TAMANO_MAXIMO = 5 * 1024 * 1024 // 5 MB

export const POST = withErrorHandling(async (req: Request) => {
  const user = await requireSession()

  const formData = await req.formData()
  const file = formData.get('file')
  const carpeta = formData.get('carpeta')?.toString() ?? 'avatares'

  if (!['avatares', 'publicaciones'].includes(carpeta)) {
    return NextResponse.json({ error: 'Carpeta inválida' }, { status: 400 })
  }
  if (carpeta === 'publicaciones') {
    await requireRole(...permisos.publicaciones.crear)
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Falta el archivo' }, { status: 400 })
  }
  if (!MIME_PERMITIDOS[file.type]) {
    return NextResponse.json(
      { error: 'Formato no permitido. Solo se aceptan JPG, PNG, WEBP o GIF' },
      { status: 400 }
    )
  }
  if (file.size > TAMANO_MAXIMO) {
    return NextResponse.json({ error: 'La imagen supera el tamaño máximo de 5MB' }, { status: 400 })
  }

  const blob = await put(`${carpeta}/${user.id}-${Date.now()}-${file.name}`, file, {
    access: 'public',
  })

  return NextResponse.json({ url: blob.url })
})
