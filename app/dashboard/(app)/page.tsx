'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { AVATAR_ACTUALIZADO_EVENT } from '@/components/dashboard/Sidebar'
import PlantaTorre from '@/components/dashboard/PlantaTorre'

function saludoDelDia(): string {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

type Perfil = {
  id: string
  nombre: string
  correo: string
  avatarUrl: string | null
  telefono: string | null
  comunaResidencia: string | null
  rol: string
  proyectos: { proyecto: { id: string; nombre: string; activo: boolean } }[]
}

export default function InicioPage() {
  const { data: session } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [comunaResidencia, setComunaResidencia] = useState('')
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [subiendoFoto, setSubiendoFoto] = useState(false)

  function cargarPerfil() {
    return fetch('/api/usuarios/me')
      .then((r) => r.json())
      .then((data: Perfil) => {
        setPerfil(data)
        setNombre(data.nombre)
        setTelefono(data.telefono ?? '')
        setComunaResidencia(data.comunaResidencia ?? '')
      })
  }

  useEffect(() => {
    cargarPerfil()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMensaje(null)
    setGuardando(true)

    const res = await fetch('/api/usuarios/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        telefono,
        comunaResidencia,
        ...(passwordNueva ? { passwordActual, passwordNueva } : {}),
      }),
    })

    const data = await res.json()
    setGuardando(false)

    if (!res.ok) {
      setMensaje({ tipo: 'error', texto: data.error ?? 'No se pudo guardar' })
      return
    }

    setMensaje({ tipo: 'ok', texto: 'Datos actualizados correctamente' })
    setPasswordActual('')
    setPasswordNueva('')
  }

  async function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSubiendoFoto(true)
    setMensaje(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('carpeta', 'avatares')

    const resUpload = await fetch('/api/upload/imagen', { method: 'POST', body: formData })
    const dataUpload = await resUpload.json()

    if (!resUpload.ok) {
      setSubiendoFoto(false)
      setMensaje({ tipo: 'error', texto: dataUpload.error ?? 'No se pudo subir la imagen' })
      return
    }

    const resPatch = await fetch('/api/usuarios/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarUrl: dataUpload.url }),
    })

    setSubiendoFoto(false)

    if (!resPatch.ok) {
      setMensaje({ tipo: 'error', texto: 'No se pudo guardar la foto de perfil' })
      return
    }

    await cargarPerfil()
    window.dispatchEvent(new Event(AVATAR_ACTUALIZADO_EVENT))
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden -mx-6 sm:-mx-10 -mt-8 mb-8 bg-gradient-to-r from-green-dark via-green-dark to-green-mid text-white px-6 sm:px-10 py-10 flex items-center justify-between gap-6">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 animate-blob" />
        <div className="absolute -bottom-16 right-24 w-56 h-56 rounded-full bg-white/5 animate-blob" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">
            {saludoDelDia()} <span className="animate-balancear inline-block">☀️</span>
          </p>
          <h1 className="font-display text-3xl font-semibold flex items-center gap-2 flex-wrap">
            Bienvenido(a), {session?.user?.nombre ?? '...'} <span className="animate-hoja inline-block">🌿</span>
          </h1>
          <p className="text-white/80 mt-1">Panel de gestión de Asamblea Las Torres.</p>
        </div>

        <div className="relative z-10 hidden sm:block h-28 shrink-0">
          <PlantaTorre />
        </div>
      </div>

      {perfil && perfil.proyectos.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold mb-2">🌳 Tus proyectos asignados</h2>
          <ul className="text-sm text-zinc-600 space-y-1">
            {perfil.proyectos.map((p) => (
              <li key={p.proyecto.id}>
                {p.proyecto.nombre}{' '}
                {!p.proyecto.activo && <span className="text-xs text-zinc-400">(inactivo)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card p-6 max-w-lg flex items-center gap-5">
        {perfil?.avatarUrl ? (
          <img
            src={perfil.avatarUrl}
            alt={perfil.nombre}
            className="w-20 h-20 rounded-full object-cover border border-black/10"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-green-dark/10 text-green-dark font-semibold flex items-center justify-center text-xl">
            {(perfil?.nombre ?? '')
              .split(' ')
              .map((p) => p[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-medium mb-1">📸 Foto de perfil</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={subirFoto}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={subiendoFoto}
            className="btn-outline text-sm py-2 px-4 disabled:opacity-60"
          >
            {subiendoFoto ? 'Subiendo...' : 'Cambiar foto'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 max-w-lg space-y-4">
        <h2 className="font-semibold">🪪 Mis datos</h2>

        {mensaje && (
          <p
            className={`text-sm rounded-lg px-3 py-2 ${
              mensaje.tipo === 'ok'
                ? 'bg-green-50 text-green-dark border border-green-dark/20'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {mensaje.texto}
          </p>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium">Correo</label>
          <input className="input-field opacity-60" value={perfil?.correo ?? ''} disabled />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Nombre</label>
          <input className="input-field" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Teléfono</label>
          <input className="input-field" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Comuna de residencia</label>
          <input
            className="input-field"
            value={comunaResidencia}
            onChange={(e) => setComunaResidencia(e.target.value)}
          />
        </div>

        <hr className="border-black/10" />

        <p className="text-sm font-medium">Cambiar contraseña (opcional)</p>

        <div className="space-y-1">
          <label className="text-sm font-medium">Contraseña actual</label>
          <input
            type="password"
            className="input-field"
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Nueva contraseña</label>
          <input
            type="password"
            className="input-field"
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
          />
        </div>

        <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-60">
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
