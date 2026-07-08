'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/dashboard/DataTable'
import Modal from '@/components/dashboard/Modal'

type Rol = 'ADMIN' | 'ALTEA' | 'ALT'

type Propuesta = {
  id: string
  tipo: 'USUARIO' | 'PROYECTO' | 'PUBLICACION'
  datos: Record<string, any>
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'
  comentario: string | null
  creador: { id: string; nombre: string; rol: Rol }
  revisor: { id: string; nombre: string; rol: Rol } | null
  createdAt: string
}

type ProyectoLite = { id: string; nombre: string; activo: boolean }

const ETIQUETAS_TIPO: Record<Propuesta['tipo'], string> = {
  USUARIO: 'Usuario nuevo',
  PROYECTO: 'Proyecto',
  PUBLICACION: 'Blog / Noticia',
}

const EMOJI_TIPO: Record<Propuesta['tipo'], string> = {
  USUARIO: '👤',
  PROYECTO: '🌳',
  PUBLICACION: '📰',
}

const EMOJI_ESTADO: Record<Propuesta['estado'], string> = {
  PENDIENTE: '⏳',
  APROBADA: '✅',
  RECHAZADA: '❌',
}

const USUARIO_VACIO = { nombre: '', correo: '', telefono: '', comunaResidencia: '', rol: 'ALT' as Rol }
const PROYECTO_VACIO = {
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaTermino: '',
  insumosNecesarios: '',
  cantidadPersonasNecesarias: 1,
  organizacionesInvitadas: '',
}
const PUBLICACION_VACIO = { titulo: '', contenido: '', resumen: '', tipo: 'BLOG' as 'BLOG' | 'NOTICIA' }

export default function SolicitudesClient({ rol, usuarioId }: { rol: Rol; usuarioId: string }) {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([])
  const [proyectos, setProyectos] = useState<ProyectoLite[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState<null | 'USUARIO' | 'PROYECTO' | 'PUBLICACION'>(null)
  const [formUsuario, setFormUsuario] = useState(USUARIO_VACIO)
  const [formProyecto, setFormProyecto] = useState(PROYECTO_VACIO)
  const [formPublicacion, setFormPublicacion] = useState(PUBLICACION_VACIO)
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const puedeProponerUsuarioProyecto = rol === 'ALTEA' || rol === 'ALT'
  const puedeProponerPublicacion = rol === 'ALT'

  async function cargar() {
    setCargando(true)
    const res = await fetch('/api/propuestas')
    setPropuestas(await res.json())
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    fetch('/api/proyectos')
      .then((r) => r.json())
      .then((data) => setProyectos(data.map((p: any) => ({ id: p.id, nombre: p.nombre, activo: p.activo }))))
  }, [])

  function puedeRevisar(p: Propuesta): boolean {
    if (p.estado !== 'PENDIENTE') return false
    if (p.tipo === 'USUARIO') return rol === 'ADMIN'
    if (p.tipo === 'PUBLICACION') return rol === 'ADMIN' || rol === 'ALTEA'
    if (p.tipo === 'PROYECTO') {
      if (p.datos?.accion === 'unirse') return rol === 'ADMIN' || rol === 'ALTEA'
      return rol === 'ADMIN'
    }
    return false
  }

  async function revisar(p: Propuesta, accion: 'aprobar' | 'rechazar') {
    const res = await fetch(`/api/propuestas/${p.id}/${accion}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error ?? 'No se pudo procesar la solicitud')
      return
    }
    if (accion === 'aprobar' && data.passwordTemporal) {
      alert(
        `Usuario creado. Comparte esta contraseña temporal con la persona: ${data.passwordTemporal}\n(debe cambiarla luego desde su perfil)`
      )
    }
    cargar()
  }

  async function crearSolicitud(tipo: Propuesta['tipo'], datos: Record<string, any>) {
    setEnviando(true)
    setError(null)
    const res = await fetch('/api/propuestas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, datos }),
    })
    const data = await res.json()
    setEnviando(false)
    if (!res.ok) {
      setError(data.error ?? 'No se pudo enviar la solicitud')
      return
    }
    setModalAbierto(null)
    cargar()
  }

  function enviarUsuario(e: React.FormEvent) {
    e.preventDefault()
    crearSolicitud('USUARIO', formUsuario)
    setFormUsuario(USUARIO_VACIO)
  }

  function enviarProyecto(e: React.FormEvent) {
    e.preventDefault()
    crearSolicitud('PROYECTO', {
      ...formProyecto,
      cantidadPersonasNecesarias: Number(formProyecto.cantidadPersonasNecesarias),
      organizacionesInvitadas: formProyecto.organizacionesInvitadas
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    setFormProyecto(PROYECTO_VACIO)
  }

  function enviarPublicacion(e: React.FormEvent) {
    e.preventDefault()
    crearSolicitud('PUBLICACION', formPublicacion)
    setFormPublicacion(PUBLICACION_VACIO)
  }

  const propuestasVisibles = rol === 'ALT' ? propuestas.filter((p) => p.creador.id === usuarioId) : propuestas

  function resumenDatos(p: Propuesta): string {
    if (p.tipo === 'USUARIO') return `${p.datos.nombre} · ${p.datos.correo}`
    if (p.tipo === 'PUBLICACION') return p.datos.titulo
    if (p.datos?.accion === 'unirse') {
      const proyecto = proyectos.find((pr) => pr.id === p.datos.proyectoId)
      return `Integrarse a "${proyecto?.nombre ?? p.datos.proyectoId}"`
    }
    return p.datos.nombre
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
            Solicitudes <span className="animate-balancear inline-block">📨</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {rol === 'ADMIN' && 'Revisa y autoriza las propuestas de la organización'}
            {rol === 'ALTEA' && 'Propón usuarios/proyectos y aprueba solicitudes de blog o noticias'}
            {rol === 'ALT' && 'Envía propuestas y revisa el estado de las tuyas'}
          </p>
        </div>

        {(puedeProponerUsuarioProyecto || puedeProponerPublicacion) && (
          <div className="flex gap-2 flex-wrap">
            {puedeProponerUsuarioProyecto && (
              <button onClick={() => setModalAbierto('USUARIO')} className="btn-outline text-sm py-2 px-4">
                + 👤 Proponer usuario
              </button>
            )}
            {puedeProponerUsuarioProyecto && (
              <button onClick={() => setModalAbierto('PROYECTO')} className="btn-outline text-sm py-2 px-4">
                + 🌳 Proponer proyecto
              </button>
            )}
            {puedeProponerPublicacion && (
              <button onClick={() => setModalAbierto('PUBLICACION')} className="btn-primary text-sm py-2 px-4">
                + 📰 Proponer blog/noticia
              </button>
            )}
          </div>
        )}
      </div>

      {cargando ? (
        <p className="text-sm text-zinc-500">Cargando... 🌱</p>
      ) : (
        <DataTable<Propuesta>
          filas={propuestasVisibles}
          vacio="No hay solicitudes por ahora 🌾"
          columnas={[
            { header: 'Tipo', render: (p) => `${EMOJI_TIPO[p.tipo]} ${ETIQUETAS_TIPO[p.tipo]}` },
            { header: 'Detalle', render: (p) => resumenDatos(p) },
            { header: 'Solicitado por', render: (p) => `${p.creador.nombre} (${p.creador.rol})` },
            {
              header: 'Estado',
              render: (p) => (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.estado === 'PENDIENTE'
                      ? 'bg-amber-100 text-amber-700'
                      : p.estado === 'APROBADA'
                      ? 'bg-green-dark/10 text-green-dark'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {EMOJI_ESTADO[p.estado]} {p.estado}
                </span>
              ),
            },
            { header: 'Fecha', render: (p) => new Date(p.createdAt).toLocaleDateString('es-CL') },
          ]}
          acciones={(p) =>
            puedeRevisar(p) ? (
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => revisar(p, 'aprobar')}
                  className="text-sm font-medium text-green-dark hover:underline"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => revisar(p, 'rechazar')}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Rechazar
                </button>
              </div>
            ) : null
          }
        />
      )}

      {modalAbierto === 'USUARIO' && (
        <Modal titulo="👤 Proponer nuevo usuario" onClose={() => setModalAbierto(null)}>
          <form onSubmit={enviarUsuario} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre *</label>
              <input
                required
                className="input-field"
                value={formUsuario.nombre}
                onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Correo *</label>
              <input
                required
                type="email"
                className="input-field"
                value={formUsuario.correo}
                onChange={(e) => setFormUsuario({ ...formUsuario, correo: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Teléfono</label>
                <input
                  className="input-field"
                  value={formUsuario.telefono}
                  onChange={(e) => setFormUsuario({ ...formUsuario, telefono: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Comuna</label>
                <input
                  className="input-field"
                  value={formUsuario.comunaResidencia}
                  onChange={(e) => setFormUsuario({ ...formUsuario, comunaResidencia: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Rol sugerido</label>
              <select
                className="input-field"
                value={formUsuario.rol}
                onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value as Rol })}
              >
                <option value="ALT">ALT</option>
                <option value="ALTEA">ALTEA</option>
              </select>
            </div>
            <button type="submit" disabled={enviando} className="btn-primary w-full text-center disabled:opacity-60">
              {enviando ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        </Modal>
      )}

      {modalAbierto === 'PROYECTO' && (
        <Modal titulo="🌳 Proponer nuevo proyecto" onClose={() => setModalAbierto(null)}>
          <form onSubmit={enviarProyecto} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre *</label>
              <input
                required
                className="input-field"
                value={formProyecto.nombre}
                onChange={(e) => setFormProyecto({ ...formProyecto, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Descripción *</label>
              <textarea
                required
                rows={3}
                className="input-field"
                value={formProyecto.descripcion}
                onChange={(e) => setFormProyecto({ ...formProyecto, descripcion: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha inicio *</label>
                <input
                  required
                  type="date"
                  className="input-field"
                  value={formProyecto.fechaInicio}
                  onChange={(e) => setFormProyecto({ ...formProyecto, fechaInicio: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha término</label>
                <input
                  type="date"
                  className="input-field"
                  value={formProyecto.fechaTermino}
                  onChange={(e) => setFormProyecto({ ...formProyecto, fechaTermino: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Insumos necesarios *</label>
              <textarea
                required
                rows={2}
                className="input-field"
                value={formProyecto.insumosNecesarios}
                onChange={(e) => setFormProyecto({ ...formProyecto, insumosNecesarios: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Personas necesarias *</label>
              <input
                required
                type="number"
                min={1}
                className="input-field"
                value={formProyecto.cantidadPersonasNecesarias}
                onChange={(e) =>
                  setFormProyecto({ ...formProyecto, cantidadPersonasNecesarias: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Organizaciones invitadas (separadas por coma)</label>
              <input
                className="input-field"
                value={formProyecto.organizacionesInvitadas}
                onChange={(e) => setFormProyecto({ ...formProyecto, organizacionesInvitadas: e.target.value })}
              />
            </div>
            <button type="submit" disabled={enviando} className="btn-primary w-full text-center disabled:opacity-60">
              {enviando ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        </Modal>
      )}

      {modalAbierto === 'PUBLICACION' && (
        <Modal titulo="📰 Proponer blog o noticia" onClose={() => setModalAbierto(null)}>
          <form onSubmit={enviarPublicacion} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo</label>
              <select
                className="input-field"
                value={formPublicacion.tipo}
                onChange={(e) => setFormPublicacion({ ...formPublicacion, tipo: e.target.value as 'BLOG' | 'NOTICIA' })}
              >
                <option value="BLOG">Blog</option>
                <option value="NOTICIA">Noticia</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Título *</label>
              <input
                required
                className="input-field"
                value={formPublicacion.titulo}
                onChange={(e) => setFormPublicacion({ ...formPublicacion, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Resumen</label>
              <input
                className="input-field"
                value={formPublicacion.resumen}
                onChange={(e) => setFormPublicacion({ ...formPublicacion, resumen: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Contenido *</label>
              <textarea
                required
                rows={5}
                className="input-field"
                value={formPublicacion.contenido}
                onChange={(e) => setFormPublicacion({ ...formPublicacion, contenido: e.target.value })}
              />
            </div>
            <button type="submit" disabled={enviando} className="btn-primary w-full text-center disabled:opacity-60">
              {enviando ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
