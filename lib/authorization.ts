import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import type { Rol } from '@prisma/client'

export type SesionUsuario = {
  id: string
  nombre: string
  correo: string
  rol: Rol
}

export class AuthError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/** Devuelve la sesión actual o lanza AuthError(401) si no hay sesión. */
export async function requireSession(): Promise<SesionUsuario> {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    throw new AuthError('No autenticado', 401)
  }
  return session.user
}

/** Exige sesión y que el rol esté dentro de los permitidos, o lanza AuthError(403). */
export async function requireRole(...roles: Rol[]): Promise<SesionUsuario> {
  const user = await requireSession()
  if (!roles.includes(user.rol)) {
    throw new AuthError('No tienes permisos para esta acción', 403)
  }
  return user
}

/** Envuelve un handler de API traduciendo AuthError a una respuesta JSON. */
export function withErrorHandling(
  handler: (req: Request, ctx: any) => Promise<Response>
) {
  return async (req: Request, ctx: any) => {
    try {
      return await handler(req, ctx)
    } catch (err) {
      if (err instanceof AuthError) {
        return NextResponse.json({ error: err.message }, { status: err.status })
      }
      console.error(err)
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
  }
}

// ---------------------------------------------------------------------------
// Matriz de permisos
// ---------------------------------------------------------------------------

export const permisos = {
  // Usuarios: solo ADMIN crea/edita/elimina directamente.
  usuarios: {
    crear: ['ADMIN'] as Rol[],
    editar: ['ADMIN'] as Rol[],
    eliminar: ['ADMIN'] as Rol[],
    proponer: ['ADMIN', 'ALTEA', 'ALT'] as Rol[],
  },
  // Proyectos: ADMIN crea/elimina; ADMIN y ALTEA editan/asignan usuarios.
  // Crear un proyecto nuevo siendo ALTEA/ALT requiere Propuesta.
  proyectos: {
    crear: ['ADMIN'] as Rol[],
    editar: ['ADMIN', 'ALTEA'] as Rol[],
    asignar: ['ADMIN', 'ALTEA'] as Rol[],
    eliminar: ['ADMIN'] as Rol[],
    proponer: ['ADMIN', 'ALTEA', 'ALT'] as Rol[],
  },
  // Publicaciones (blog/noticias): ADMIN y ALTEA crean/editan directo; ALT propone.
  publicaciones: {
    crear: ['ADMIN', 'ALTEA'] as Rol[],
    editar: ['ADMIN', 'ALTEA'] as Rol[],
    eliminar: ['ADMIN', 'ALTEA'] as Rol[],
    proponer: ['ADMIN', 'ALTEA', 'ALT'] as Rol[],
  },
  // Propuestas: quién puede revisar (aprobar/rechazar) según el tipo de propuesta.
  propuestas: {
    revisarUsuario: ['ADMIN'] as Rol[],
    revisarProyecto: ['ADMIN'] as Rol[],
    revisarPublicacion: ['ADMIN', 'ALTEA'] as Rol[],
  },
  // Calendario: ADMIN y ALTEA crean/editan/eliminan eventos; ALT solo visualiza.
  eventos: {
    crear: ['ADMIN', 'ALTEA'] as Rol[],
    editar: ['ADMIN', 'ALTEA'] as Rol[],
    eliminar: ['ADMIN', 'ALTEA'] as Rol[],
  },
}

export function revisoresPara(tipo: 'USUARIO' | 'PROYECTO' | 'PUBLICACION', datos?: any): Rol[] {
  if (tipo === 'USUARIO') return permisos.propuestas.revisarUsuario
  // Solicitar integrarse a un proyecto existente lo puede autorizar ADMIN o ALTEA,
  // igual que la asignación directa de usuarios a proyectos.
  if (tipo === 'PROYECTO') {
    if (datos?.accion === 'unirse') return permisos.proyectos.asignar
    return permisos.propuestas.revisarProyecto
  }
  return permisos.propuestas.revisarPublicacion
}
