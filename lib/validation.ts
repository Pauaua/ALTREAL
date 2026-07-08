import { z } from 'zod'

export const usuarioCreateSchema = z.object({
  nombre: z.string().min(1),
  correo: z.string().email(),
  password: z.string().min(8),
  telefono: z.string().optional().nullable(),
  comunaResidencia: z.string().optional().nullable(),
  fechaIngreso: z.coerce.date().optional().nullable(),
  activo: z.boolean().optional(),
  rol: z.enum(['ADMIN', 'ALTEA', 'ALT']).optional(),
  proyectoIds: z.array(z.string()).optional(),
  avatarUrl: z.string().url().optional().nullable(),
})

export const usuarioUpdateSchema = usuarioCreateSchema.partial().extend({
  password: z.string().min(8).optional(),
})

export const proyectoCreateSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().min(1),
  fechaInicio: z.coerce.date(),
  fechaTermino: z.coerce.date().optional().nullable(),
  insumosNecesarios: z.string().min(1),
  cantidadPersonasNecesarias: z.coerce.number().int().positive(),
  organizacionesInvitadas: z.array(z.string()).optional(),
  activo: z.boolean().optional(),
  usuarioIds: z.array(z.string()).optional(),
})

export const proyectoUpdateSchema = proyectoCreateSchema.partial()

export const asignarUsuariosSchema = z.object({
  usuarioIds: z.array(z.string()).min(1),
})

export const publicacionCreateSchema = z.object({
  titulo: z.string().min(1),
  contenido: z.string().min(1),
  resumen: z.string().optional().nullable(),
  imagenUrl: z.string().url().optional().nullable(),
  tipo: z.enum(['BLOG', 'NOTICIA']).optional(),
  estado: z.enum(['BORRADOR', 'PUBLICADA']).optional(),
})

export const publicacionUpdateSchema = publicacionCreateSchema.partial()

export const propuestaCreateSchema = z.object({
  tipo: z.enum(['USUARIO', 'PROYECTO', 'PUBLICACION']),
  datos: z.record(z.string(), z.any()),
})

export const propuestaRevisarSchema = z.object({
  comentario: z.string().optional(),
})

// Datos de una propuesta de tipo PROYECTO cuando lo que se solicita es
// integrarse a un proyecto ya existente (no crear uno nuevo).
export const proyectoUnirseSchema = z.object({
  accion: z.literal('unirse'),
  proyectoId: z.string(),
  usuarioId: z.string(),
})

export const eventoCreateSchema = z.object({
  titulo: z.string().min(1),
  descripcion: z.string().optional().nullable(),
  fecha: z.coerce.date(),
  tipo: z.enum(['EVENTO', 'INICIO_PROYECTO', 'TERMINO_PROYECTO', 'CUMPLEANOS', 'OTRO']).optional(),
})

export const eventoUpdateSchema = eventoCreateSchema.partial()

export const usuarioMeUpdateSchema = z.object({
  nombre: z.string().min(1).optional(),
  telefono: z.string().optional().nullable(),
  comunaResidencia: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  tallaPolera: z.string().optional().nullable(),
  tallaPantalon: z.string().optional().nullable(),
  alturaCm: z.coerce.number().int().positive().optional().nullable(),
  pesoKg: z.coerce.number().positive().optional().nullable(),
  passwordActual: z.string().optional(),
  passwordNueva: z.string().min(8).optional(),
})
