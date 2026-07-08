'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/dashboard/DataTable'
import Modal from '@/components/dashboard/Modal'

type Proyecto = {
  id: string
  nombre: string
  descripcion: string
  fechaInicio: string
  fechaTermino: string | null
  insumosNecesarios: string
  cantidadPersonasNecesarias: number
  organizacionesInvitadas: string[]
  activo: boolean
  usuarios: { usuario: { id: string; nombre: string; correo: string } }[]
}

type UsuarioLite = { id: string; nombre: string; correo: string }

const FORM_VACIO = {
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaTermino: '',
  insumosNecesarios: '',
  cantidadPersonasNecesarias: 1,
  organizacionesInvitadas: '',
  activo: true,
}

export default function ProyectosClient({ rol, usuarioId }: { rol: 'ADMIN' | 'ALTEA' | 'ALT'; usuarioId: string }) {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<UsuarioLite[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Proyecto | null>(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [asignados, setAsignados] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [mensajeSolicitud, setMensajeSolicitud] = useState<string | null>(null)

  const puedeCrear = rol === 'ADMIN'
  const puedeEditar = rol === 'ADMIN' || rol === 'ALTEA'
  const puedeEliminar = rol === 'ADMIN'
  const soloLectura = rol === 'ALT'

  async function cargar() {
    setCargando(true)
    const res = await fetch('/api/proyectos')
    setProyectos(await res.json())
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    if (puedeEditar) {
      fetch('/api/usuarios')
        .then((r) => r.json())
        .then((data) => setUsuariosDisponibles(data.map((u: any) => ({ id: u.id, nombre: u.nombre, correo: u.correo }))))
    }
  }, [])

  function abrirCrear() {
    setEditando(null)
    setForm(FORM_VACIO)
    setAsignados([])
    setError(null)
    setModalAbierto(true)
  }

  function abrirEditar(p: Proyecto) {
    setEditando(p)
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      fechaInicio: p.fechaInicio.slice(0, 10),
      fechaTermino: p.fechaTermino ? p.fechaTermino.slice(0, 10) : '',
      insumosNecesarios: p.insumosNecesarios,
      cantidadPersonasNecesarias: p.cantidadPersonasNecesarias,
      organizacionesInvitadas: p.organizacionesInvitadas.join(', '),
      activo: p.activo,
    })
    setAsignados(p.usuarios.map((u) => u.usuario.id))
    setError(null)
    setModalAbierto(true)
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError(null)

    const payload: Record<string, unknown> = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      fechaInicio: form.fechaInicio,
      fechaTermino: form.fechaTermino || null,
      insumosNecesarios: form.insumosNecesarios,
      cantidadPersonasNecesarias: Number(form.cantidadPersonasNecesarias),
      organizacionesInvitadas: form.organizacionesInvitadas
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      activo: form.activo,
    }

    let proyectoId = editando?.id

    if (editando) {
      const res = await fetch(`/api/proyectos/${editando.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setGuardando(false)
        setError(data.error ?? 'No se pudo guardar el proyecto')
        return
      }
    } else {
      payload.usuarioIds = asignados
      const res = await fetch('/api/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setGuardando(false)
        setError(data.error ?? 'No se pudo crear el proyecto')
        return
      }
      proyectoId = data.id
    }

    if (editando && proyectoId) {
      const originales = editando.usuarios.map((u) => u.usuario.id)
      const agregar = asignados.filter((id) => !originales.includes(id))
      const quitar = originales.filter((id) => !asignados.includes(id))

      if (agregar.length) {
        await fetch(`/api/proyectos/${proyectoId}/asignar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioIds: agregar }),
        })
      }
      if (quitar.length) {
        await fetch(`/api/proyectos/${proyectoId}/asignar`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioIds: quitar }),
        })
      }
    }

    setGuardando(false)
    setModalAbierto(false)
    cargar()
  }

  async function eliminar(p: Proyecto) {
    if (!confirm(`¿Eliminar el proyecto "${p.nombre}"? Esta acción no se puede deshacer.`)) return
    await fetch(`/api/proyectos/${p.id}`, { method: 'DELETE' })
    cargar()
  }

  async function solicitarIntegrarme(p: Proyecto) {
    setMensajeSolicitud(null)
    const res = await fetch('/api/propuestas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'PROYECTO',
        datos: { accion: 'unirse', proyectoId: p.id, usuarioId },
      }),
    })
    if (res.ok) {
      setMensajeSolicitud(`Solicitud enviada para integrarte a "${p.nombre}".`)
    } else {
      setMensajeSolicitud('No se pudo enviar la solicitud.')
    }
  }

  function toggleAsignado(id: string) {
    setAsignados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const proyectosVisibles = soloLectura ? proyectos.filter((p) => p.activo) : proyectos

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
            Proyectos <span className="animate-balancear inline-block">🌳</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {soloLectura ? 'Proyectos activos de la organización' : 'Gestiona los proyectos de la organización'}
          </p>
        </div>
        {puedeCrear && (
          <button onClick={abrirCrear} className="btn-primary">
            + Crear proyecto
          </button>
        )}
      </div>

      {rol === 'ALTEA' && (
        <p className="text-sm text-zinc-500 bg-black/[0.03] rounded-lg px-4 py-3">
          🌱 Para crear un nuevo proyecto debes enviar una solicitud desde la pestaña{' '}
          <span className="font-medium">Solicitudes</span>.
        </p>
      )}

      {mensajeSolicitud && (
        <p className="text-sm bg-green-dark/10 text-green-dark rounded-lg px-4 py-3">🎉 {mensajeSolicitud}</p>
      )}

      {cargando ? (
        <p className="text-sm text-zinc-500">Cargando... 🌱</p>
      ) : (
        <DataTable<Proyecto>
          filas={proyectosVisibles}
          vacio="No hay proyectos registrados todavía 🌾"
          columnas={[
            { header: 'Nombre', render: (p) => p.nombre },
            { header: 'Inicio', render: (p) => new Date(p.fechaInicio).toLocaleDateString('es-CL') },
            {
              header: 'Término',
              render: (p) => (p.fechaTermino ? new Date(p.fechaTermino).toLocaleDateString('es-CL') : '—'),
            },
            { header: 'Personas necesarias', render: (p) => `👤 ${p.cantidadPersonasNecesarias}` },
            { header: 'Integrantes', render: (p) => `🤝 ${p.usuarios.length}` },
            ...(soloLectura
              ? []
              : [
                  {
                    header: 'Estado',
                    render: (p: Proyecto) => (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.activo ? 'bg-green-dark/10 text-green-dark' : 'bg-zinc-200 text-zinc-500'
                        }`}
                      >
                        {p.activo ? '🌿 Activo' : '🍂 Inactivo'}
                      </span>
                    ),
                  },
                ]),
          ]}
          acciones={(p) => (
            <div className="flex gap-3 justify-end">
              {puedeEditar && (
                <button onClick={() => abrirEditar(p)} className="text-sm font-medium text-green-dark hover:underline">
                  Editar
                </button>
              )}
              {puedeEliminar && (
                <button onClick={() => eliminar(p)} className="text-sm font-medium text-red-600 hover:underline">
                  Eliminar
                </button>
              )}
              {soloLectura &&
                (p.usuarios.some((u) => u.usuario.id === usuarioId) ? (
                  <span className="text-xs text-zinc-400">✅ Ya eres integrante</span>
                ) : (
                  <button
                    onClick={() => solicitarIntegrarme(p)}
                    className="text-sm font-medium text-green-dark hover:underline"
                  >
                    🙋 Solicitar integrarme
                  </button>
                ))}
            </div>
          )}
        />
      )}

      {modalAbierto && (
        <Modal titulo={editando ? '✏️ Editar proyecto' : '🌱 Crear proyecto'} onClose={() => setModalAbierto(false)}>
          <form onSubmit={guardar} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre *</label>
              <input
                required
                className="input-field"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Descripción *</label>
              <textarea
                required
                rows={3}
                className="input-field"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha inicio *</label>
                <input
                  required
                  type="date"
                  className="input-field"
                  value={form.fechaInicio}
                  onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha término</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.fechaTermino}
                  onChange={(e) => setForm({ ...form, fechaTermino: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Insumos necesarios *</label>
              <textarea
                required
                rows={2}
                className="input-field"
                value={form.insumosNecesarios}
                onChange={(e) => setForm({ ...form, insumosNecesarios: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Personas necesarias *</label>
                <input
                  required
                  type="number"
                  min={1}
                  className="input-field"
                  value={form.cantidadPersonasNecesarias}
                  onChange={(e) => setForm({ ...form, cantidadPersonasNecesarias: Number(e.target.value) })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium mt-6">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                />
                Proyecto activo
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Organizaciones invitadas (separadas por coma)</label>
              <input
                className="input-field"
                value={form.organizacionesInvitadas}
                onChange={(e) => setForm({ ...form, organizacionesInvitadas: e.target.value })}
              />
            </div>

            {usuariosDisponibles.length > 0 && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Usuarios asignados</label>
                <div className="max-h-40 overflow-y-auto border border-black/10 rounded-lg p-2 space-y-1">
                  {usuariosDisponibles.map((u) => (
                    <label key={u.id} className="flex items-center gap-2 text-sm px-1 py-0.5">
                      <input
                        type="checkbox"
                        checked={asignados.includes(u.id)}
                        onChange={() => toggleAsignado(u.id)}
                      />
                      {u.nombre} <span className="text-zinc-400">({u.correo})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={guardando} className="btn-primary w-full text-center disabled:opacity-60">
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
