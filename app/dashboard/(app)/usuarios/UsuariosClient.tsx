'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/dashboard/DataTable'
import Modal from '@/components/dashboard/Modal'

type Usuario = {
  id: string
  nombre: string
  correo: string
  telefono: string | null
  comunaResidencia: string | null
  fechaIngreso: string | null
  fechaRegistro: string
  activo: boolean
  rol: 'ADMIN' | 'ALTEA' | 'ALT'
}

const FORM_VACIO = {
  nombre: '',
  correo: '',
  password: '',
  telefono: '',
  comunaResidencia: '',
  fechaIngreso: '',
  rol: 'ALT' as Usuario['rol'],
  activo: true,
}

const EMOJI_ROL: Record<Usuario['rol'], string> = {
  ADMIN: '👑',
  ALTEA: '🌟',
  ALT: '🌱',
}

export default function UsuariosClient() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Usuario | null>(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  async function cargar() {
    setCargando(true)
    const res = await fetch('/api/usuarios')
    setUsuarios(await res.json())
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  function abrirCrear() {
    setEditando(null)
    setForm(FORM_VACIO)
    setError(null)
    setModalAbierto(true)
  }

  function abrirEditar(u: Usuario) {
    setEditando(u)
    setForm({
      nombre: u.nombre,
      correo: u.correo,
      password: '',
      telefono: u.telefono ?? '',
      comunaResidencia: u.comunaResidencia ?? '',
      fechaIngreso: u.fechaIngreso ? u.fechaIngreso.slice(0, 10) : '',
      rol: u.rol,
      activo: u.activo,
    })
    setError(null)
    setModalAbierto(true)
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError(null)

    const payload: Record<string, unknown> = {
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono || null,
      comunaResidencia: form.comunaResidencia || null,
      fechaIngreso: form.fechaIngreso || null,
      rol: form.rol,
      activo: form.activo,
    }
    if (form.password) payload.password = form.password
    if (!editando) payload.password = form.password

    const res = await fetch(editando ? `/api/usuarios/${editando.id}` : '/api/usuarios', {
      method: editando ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setGuardando(false)

    if (!res.ok) {
      setError(data.error ?? 'No se pudo guardar el usuario')
      return
    }

    setModalAbierto(false)
    cargar()
  }

  async function eliminar(u: Usuario) {
    if (!confirm(`¿Eliminar a ${u.nombre}? Esta acción no se puede deshacer.`)) return
    await fetch(`/api/usuarios/${u.id}`, { method: 'DELETE' })
    cargar()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
            Usuarios <span className="animate-balancear inline-block">👥</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Gestiona las cuentas de la organización</p>
        </div>
        <button onClick={abrirCrear} className="btn-primary">
          + Crear usuario
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-zinc-500">Cargando... 🌱</p>
      ) : (
        <DataTable<Usuario>
          filas={usuarios}
          vacio="No hay usuarios registrados todavía 🌾"
          columnas={[
            { header: 'Nombre', render: (u) => u.nombre },
            { header: 'Correo', render: (u) => u.correo },
            {
              header: 'Rol',
              render: (u) => (
                <span className="inline-flex items-center gap-1">
                  {EMOJI_ROL[u.rol]} {u.rol}
                </span>
              ),
            },
            { header: 'Comuna', render: (u) => u.comunaResidencia ?? '—' },
            {
              header: 'Estado',
              render: (u) => (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    u.activo ? 'bg-green-dark/10 text-green-dark' : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {u.activo ? '🌿 Activo' : '🍂 Inactivo'}
                </span>
              ),
            },
          ]}
          acciones={(u) => (
            <div className="flex gap-3 justify-end">
              <button onClick={() => abrirEditar(u)} className="text-sm font-medium text-green-dark hover:underline">
                Editar
              </button>
              <button onClick={() => eliminar(u)} className="text-sm font-medium text-red-600 hover:underline">
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {modalAbierto && (
        <Modal titulo={editando ? '✏️ Editar usuario' : '🌱 Crear usuario'} onClose={() => setModalAbierto(false)}>
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
              <label className="text-sm font-medium">Correo *</label>
              <input
                required
                type="email"
                className="input-field"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                {editando ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
              </label>
              <input
                required={!editando}
                type="password"
                minLength={8}
                className="input-field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Teléfono</label>
                <input
                  className="input-field"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Comuna residencia</label>
                <input
                  className="input-field"
                  value={form.comunaResidencia}
                  onChange={(e) => setForm({ ...form, comunaResidencia: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha de ingreso</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.fechaIngreso}
                  onChange={(e) => setForm({ ...form, fechaIngreso: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Rol</label>
                <select
                  className="input-field"
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value as Usuario['rol'] })}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="ALTEA">ALTEA</option>
                  <option value="ALT">ALT</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              />
              Usuario activo
            </label>

            <button type="submit" disabled={guardando} className="btn-primary w-full text-center disabled:opacity-60">
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
